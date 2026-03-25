# TTE Chatbot — Mermaid Diagrams

> Trực quan hóa kiến trúc và luồng xử lý của hệ thống chatbot TTE.

---

## Muc luc

1. [Kien truc he thong tong the](#1-kien-truc-he-thong-tong-the)
2. [Luong xu ly Chat Request](#2-luong-xu-ly-chat-request)
3. [RAG Query Processing Pipeline](#3-rag-query-processing-pipeline)
4. [FAQ Pre-filter Logic](#4-faq-pre-filter-logic)
5. [Semantic Cache](#5-semantic-cache)
6. [Smart Model Router](#6-smart-model-router)
7. [LLM Fallback Chain](#7-llm-fallback-chain)
8. [Security Guards Flow](#8-security-guards-flow)
9. [Session va Cache Management](#9-session-va-cache-management)
10. [Document Ingestion Flow](#10-document-ingestion-flow)
11. [Google Drive Sync Flow](#11-google-drive-sync-flow)
12. [Startup Sequence](#12-startup-sequence)
13. [Deployment Topology](#13-deployment-topology)
14. [Component Dependencies](#14-component-dependencies)
15. [Redis Key Lifecycle](#15-redis-key-lifecycle)

---

## 1. Kien truc he thong tong the

```mermaid
graph TB
    subgraph CLIENT["Client (Browser)"]
        CW[ChatWidget\nFloating Button]
        TC[TechnicalChat\nMessages and Input]
        LS[localStorage\nSession + Messages]
        CW --> TC
        TC <--> LS
    end

    subgraph BACKEND["Backend - NestJS :4002"]
        TG[ChatbotThrottlerGuard\nRate Limiting 3-tier]
        PIG[PromptInjectionGuard\n15+ patterns]
        RC[RAGController\nPOST /api/rag/chat]
        SS[ChatbotSessionService\nRedis Session]
        CS[ChatbotCacheService\nRedis Cache]
        RS[RAGService\nHTTP Proxy]

        TG --> PIG --> RC
        RC --> CS
        RC --> SS
        RC --> RS
    end

    subgraph AI_ENGINE["AI Engine - FastAPI :4003"]
        FAQ[FAQPreFilter\n7 static entries]
        SC[SemanticCache\ncosine >= 0.96]
        MR[SmartModelRouter\nSimple/Medium/Complex]
        RE[RAGEngine\nSingleton]
        LLM_DS[DeepSeek LLM\ndeepseek-chat]
        LLM_OAI[OpenAI Fallback\ngpt-4o-mini]
        EMB[Voyage AI Embeddings\nvoyage-3.5-lite]

        RE --> FAQ
        RE --> SC
        RE --> MR
        RE --> EMB
        RE --> LLM_DS
        LLM_DS -- "fail" --> LLM_OAI
    end

    subgraph STORAGE["Storage Layer"]
        REDIS[(Redis :6381\nSession - Cache - RateLimit)]
        QDRANT[(Qdrant Cloud\n421+ vectors)]
    end

    TC -- "POST /api/rag/chat" --> TG
    RS -- "HTTP :4003/api/chat" --> RE
    SS <--> REDIS
    CS <--> REDIS
    TG <--> REDIS
    EMB --> QDRANT
    SC <--> REDIS
```

---

## 2. Luong xu ly Chat Request

```mermaid
sequenceDiagram
    actor User
    participant FE as TechnicalChat (Next.js)
    participant BK as NestJS Backend :4002
    participant RD as Redis
    participant AI as FastAPI AI Engine :4003
    participant QD as Qdrant Cloud
    participant DS as DeepSeek API
    participant OAI as OpenAI API

    User->>FE: Nhap cau hoi
    FE->>FE: Doc sessionId tu localStorage
    FE->>BK: POST /api/rag/chat {question, language, sessionId}

    Note over BK: Security Layer
    BK->>RD: INCR throttle:ip:{ip}
    RD-->>BK: count <= 5/min OK
    BK->>RD: INCR throttle:session:{id}
    RD-->>BK: count <= 20/hr OK
    BK->>RD: INCR throttle:global:chat
    RD-->>BK: count <= 100/min OK
    BK->>BK: PromptInjectionGuard scan

    Note over BK: Check Backend Cache
    BK->>RD: GET chat:cache:{sha256}
    alt Cache HIT
        RD-->>BK: cached response
        BK-->>FE: success, data, cached: true
    else Cache MISS
        BK->>RD: GET chat:session:{id}
        RD-->>BK: conversation history (3 turns)

        Note over AI: AI Engine Processing
        BK->>AI: POST /api/chat {question, language}

        AI->>AI: FAQPreFilter.check()
        alt FAQ HIT
            AI-->>BK: answer, confidence:100, is_faq:true
        else FAQ MISS
            AI->>AI: SemanticCache.get()
            AI->>DS: embed(question) via Voyage AI
            DS-->>AI: embedding vector
            alt Semantic Cache HIT (cosine >= 0.96)
                AI-->>BK: answer, from_cache:true
            else Cache MISS
                AI->>AI: SmartModelRouter.route()
                Note right of AI: SIMPLE -> 512tk\nMEDIUM -> 1024tk\nCOMPLEX -> 2048tk
                AI->>QD: similarity_search(embedding, top_k=15)
                QD-->>AI: source nodes (similarity >= 0.3)
                AI->>AI: Build prompt + context
                AI->>DS: acomplete(prompt, max_tokens)
                alt DeepSeek OK
                    DS-->>AI: generated answer
                else DeepSeek FAIL
                    AI->>OAI: acomplete(prompt) gpt-4o-mini
                    OAI-->>AI: generated answer
                end
                AI->>AI: Calculate confidence score
                alt confidence < 20% OR 0 sources
                    AI-->>BK: fallback response (hotline, email)
                else OK
                    AI->>AI: SemanticCache.set() fire-and-forget
                    AI-->>BK: answer, citations, confidence
                end
            end
        end

        BK->>RD: SETEX chat:session:{id} 1800s
        BK->>RD: SETEX chat:cache:{hash} 86400s
        BK-->>FE: success, data, cached: false
    end

    FE->>LS: Save message to localStorage
    FE-->>User: Hien thi cau tra loi (ReactMarkdown)
```

---

## 3. RAG Query Processing Pipeline

```mermaid
flowchart TD
    Q([Cau hoi tu user]) --> FAQ

    FAQ{FAQ Pre-filter\n7 common questions}
    FAQ -- "HIT ~30% queries" --> FAQ_R([Static response\n0ms - confidence 100%])
    FAQ -- "MISS" --> SC

    SC{Semantic Cache\ncosine >= 0.96}
    SC -- "HIT ~20% queries" --> SC_R([Cached response\n< 10ms])
    SC -- "MISS" --> MR

    MR{Smart Model Router\nAnalyze complexity}
    MR -- "SIMPLE\n<= 8 words, no tech terms" --> MR_S[max_tokens = 512]
    MR -- "MEDIUM\nstandard question" --> MR_M[max_tokens = 1024]
    MR -- "COMPLEX\n>= 2 tech keywords OR > 30 words" --> MR_C[max_tokens = 2048]
    MR_S & MR_M & MR_C --> RET

    RET[Retrieval\nVoyage AI embed -> Qdrant\ntop_k=15, cutoff=0.3]
    RET --> CONF

    CONF{Sources found?}
    CONF -- "0 sources OR confidence < 20%" --> FB([Fallback response\nHotline + Email])
    CONF -- "sources found" --> GEN

    GEN[Generation\nBuild prompt + context\nCall LLM]
    GEN --> LLM

    LLM{DeepSeek API}
    LLM -- "Success" --> POST
    LLM -- "Fail" --> OAI

    OAI[OpenAI gpt-4o-mini\nFallback LLM]
    OAI --> POST

    POST[Post-processing\nExtract citations\nCalculate confidence\nSave to SemanticCache]
    POST --> RES([Response\nanswer + citations + confidence])
```

---

## 4. FAQ Pre-filter Logic

```mermaid
flowchart TD
    INPUT([question: string]) --> NORM

    NORM[normalize_text\nlowercase - bo dau tieng Viet\nbo dau cau - chuan hoa spaces]

    NORM --> EXACT

    EXACT{Exact match\ntrong FAQ_DATABASE keys}
    EXACT -- "found" --> HIT

    EXACT -- "not found" --> KW

    KW[Keyword Pattern Matching\nDuyet KEYWORD_PATTERNS]

    KW --> KW_CHECK{Patterns matched?}
    KW_CHECK -- ">= 2 keywords khop" --> HIT
    KW_CHECK -- "1 keyword khop\n+ cau <= 5 tu" --> HIT
    KW_CHECK -- "no match" --> MISS

    HIT([FAQMatch\nquestion_key\nconfidence = 100.0]) --> RESP

    RESP[get_response\nlanguage == vi -> response_vi\nlanguage == en -> response_en\nreturn answer, citations empty, is_faq true]

    MISS([None\ntep tuc Semantic Cache])

    subgraph FAQ_DB["FAQ Database - 7 entries"]
        F1["tte la gi -> Gioi thieu cong ty"]
        F2["so dien thoai -> 84-254-3522219"]
        F3["email lien he -> tts@toanthang.vn"]
        F4["dia chi -> 68 Ngo Quyen, Vung Tau"]
        F5["san pham tte -> Bang danh muc"]
        F6["fisher la gi -> Fisher / Emerson"]
        F7["gio lam viec -> T2-T6: 8-17h"]
    end
```

---

## 5. Semantic Cache

```mermaid
flowchart TD
    Q([question + language]) --> EMB_CHECK

    EMB_CHECK{embed_model\ninitialized?}
    EMB_CHECK -- "No" --> SKIP([return None])
    EMB_CHECK -- "Yes" --> HASH

    HASH[generate_key\nMD5 lowercase + language first 12 chars]

    HASH --> EXACT

    EXACT{Exact hash match\nin self.cache dict}
    EXACT -- "HIT" --> INC1[hit_count += 1]
    INC1 --> RET_R([Return cached response < 1ms])

    EXACT -- "MISS" --> EMB

    EMB[get_text_embedding\nnumpy array 1024 dims]

    EMB --> SCAN

    SCAN[Scan all cached embeddings\ncosine_similarity for each entry]

    SCAN --> SIM{Max similarity\n>= 0.96?}

    SIM -- "YES" --> INC2[hit_count += 1\nlog SIMILAR HIT]
    INC2 --> RET_S([Return similar response])

    SIM -- "NO" --> NONE([return None])

    subgraph SET["Cache SET - khi co response moi"]
        direction LR
        S1[Evict neu > 1000 entries\nLRU by hit_count]
        S2[embed question -> vector]
        S3[CacheEntry question, embedding, response]
        S4[Save to self.cache + self.embeddings]
        S5[asyncio.create_task -> Redis SETEX 30 days]
        S1 --> S2 --> S3 --> S4 --> S5
    end

    subgraph STARTUP["Startup - load_from_redis"]
        direction LR
        R1[KEYS semantic:cache:*]
        R2[Parse JSON -> CacheEntry]
        R3[Rebuild numpy embeddings in memory]
        R1 --> R2 --> R3
    end
```

---

## 6. Smart Model Router

```mermaid
flowchart TD
    Q([question: string]) --> PREP

    PREP[Preprocess\nquestion_lower = lower strip\nword_count = len split]

    PREP --> C1

    C1{>= 2 technical keywords\nOR word_count > 30?}

    C1 -- "YES" --> COMPLEX

    C1 -- "NO" --> C2

    C2{Matches simple\nregex pattern?}

    C2 -- "YES - X la gi? / What is X?" --> SIMPLE

    C2 -- "NO" --> C3

    C3{word_count <= 8\nAND 0 tech keywords?}

    C3 -- "YES" --> SIMPLE
    C3 -- "NO" --> MEDIUM

    COMPLEX([COMPLEX\nmodel: deepseek-chat\nmax_tokens: 2048\n\nVi du: So sanh ap suat\nFisher vs Emerson?])

    MEDIUM([MEDIUM\nmodel: deepseek-chat\nmax_tokens: 1024\n\nVi du: Van buom hoat\ndong nhu the nao?])

    SIMPLE([SIMPLE\nmodel: deepseek-chat\nmax_tokens: 512\n\nVi du: Fisher la gi?\nCo bao nhieu loai van?])

    subgraph KW["Technical Keywords - 35 terms"]
        direction LR
        K1["ap suat - pressure\nnhiet do - temperature"]
        K2["cv value - torque\nvat lieu - material"]
        K3["api - asme - ansi - jis - din"]
        K4["so sanh - compare - tai sao - loi"]
        K5["sua chua - bao tri - maintenance"]
    end
```

---

## 7. LLM Fallback Chain

```mermaid
flowchart TD
    PROMPT([Built Prompt\n+ retrieved context]) --> DS_CALL

    DS_CALL[DeepSeek API\nmodel: deepseek-chat\napi_base: api.deepseek.com/v1\ntemperature: 0.1]

    DS_CALL --> DS_OK{Response OK?}

    DS_OK -- "Success" --> RESP_DS([RAGResponse\ntext, source_nodes])

    DS_OK -- "Exception" --> LOG_WARN

    LOG_WARN[log WARNING: Primary LLM failed\nlog full traceback]

    LOG_WARN --> OAI_CALL

    OAI_CALL[OpenAI API Fallback\nmodel: gpt-4o-mini\nSimple completion without RAG context]

    OAI_CALL --> OAI_OK{Response OK?}

    OAI_OK -- "Success" --> LOG_INFO
    LOG_INFO[log INFO: Fallback LLM succeeded]
    LOG_INFO --> RESP_OAI([MockResponse\ntext, source_nodes empty])

    OAI_OK -- "Exception" --> LOG_ERR

    LOG_ERR[log ERROR: Fallback LLM also failed]

    LOG_ERR --> PROG_FB

    PROG_FB([Programmatic Fallback\nXin loi, toi chua tim thay...\nDien thoai: 84-254-3522219\nEmail: tts@toanthang.vn\nconfidence: 0.0\nis_fallback: true])

    subgraph CONF["Confidence Check - sau LLM"]
        direction LR
        CK{confidence < 20%\nOR sources_count == 0?}
        CK -- "YES" --> PROG_FB2[Programmatic Fallback]
        CK -- "NO" --> OK[Return answer + citations]
    end

    RESP_DS & RESP_OAI --> CONF
```

---

## 8. Security Guards Flow

```mermaid
flowchart TD
    REQ([Incoming Request\nPOST /api/rag/chat]) --> G1

    subgraph G1_BOX["Guard 1: ChatbotThrottlerGuard"]
        G1[Extract identifiers\nip = X-Forwarded-For or req.ip\nsessionId = body.sessionId or anonymous]

        G1 --> IP_CHK

        IP_CHK[Redis INCR throttle:ip:{ip}\nEXPIRE 60s on first hit]
        IP_CHK --> IP_LIMIT{count > 5/min?}
        IP_LIMIT -- "YES" --> R429_IP([HTTP 429 Too Many Requests IP\nretryAfter: TTL remaining])
        IP_LIMIT -- "NO" --> SESS_CHK

        SESS_CHK[Redis INCR throttle:session:{id}\nEXPIRE 3600s on first hit]
        SESS_CHK --> SESS_LIMIT{count > 20/hr?}
        SESS_LIMIT -- "YES" --> R429_S([HTTP 429 Rate limit Session])
        SESS_LIMIT -- "NO" --> GLOB_CHK

        GLOB_CHK[Redis INCR throttle:global:chat\nEXPIRE 60s on first hit]
        GLOB_CHK --> GLOB_LIMIT{count > 100/min?}
        GLOB_LIMIT -- "YES" --> R429_G([HTTP 429 Rate limit Global])
        GLOB_LIMIT -- "NO" --> G1_PASS([Pass])
    end

    G1_PASS --> G2_BOX

    subgraph G2_BOX["Guard 2: PromptInjectionGuard"]
        G2[question = request.body.question]
        G2 --> WL_CHK

        WL_CHK{Whitelist match?\ntechnical terms}
        WL_CHK -- "YES" --> G2_PASS([Pass])
        WL_CHK -- "NO" --> INJ_CHK

        INJ_CHK[Scan 15+ regex patterns\nignore previous instructions\nreveal system prompt\nyou are now...\njailbreak / DAN mode\ndeveloper mode]

        INJ_CHK --> INJ_FOUND{Pattern matched?}
        INJ_FOUND -- "YES" --> R400([HTTP 400 Bad Request\nInvalid input\nlog WARN: blocked])
        INJ_FOUND -- "NO" --> G2_PASS
    end

    G2_PASS --> CTRL

    subgraph CTRL["RAGController Validation"]
        V1{question\nempty?}
        V1 -- "YES" --> R400_E([HTTP 400\nQuestion required])
        V1 -- "NO" --> V2
        V2{length >\n500 chars?}
        V2 -- "YES" --> R400_L([HTTP 400\nQuestion too long])
        V2 -- "NO" --> PROCEED([Proceed to\nbusiness logic])
    end
```

---

## 9. Session va Cache Management

```mermaid
flowchart TD
    subgraph SESSION["ChatbotSessionService"]
        direction TB
        SQ([saveMessage called]) --> SG

        SG[GET chat:session:{id}\nParse JSON -> ChatSession]

        SG --> SE{Session\nexists?}
        SE -- "NO" --> SC_NEW[Create new session\nsessionId - history empty - createdAt - lastActiveAt]
        SE -- "YES" --> SC_EXIST[Use existing session]

        SC_NEW & SC_EXIST --> SADD[history.push message]

        SADD --> TRIM{history.length > maxTurns x 2\n6 messages?}
        TRIM -- "YES" --> SLICE[history = history.slice minus 6]
        TRIM -- "NO" --> SAVE

        SLICE --> SAVE

        SAVE[SETEX chat:session:{id}\nTTL: 1800s 30 min\nJSON.stringify session]

        SAVE --> DONE([Saved])
    end

    subgraph CACHE["ChatbotCacheService"]
        direction TB
        CQ([getCachedResponse called]) --> ENABLED

        ENABLED{CHATBOT_CACHE\n_ENABLED?}
        ENABLED -- "false" --> CNULL([return null])
        ENABLED -- "true" --> CNORM

        CNORM[normalizeQuestion\nlowercase - trim spaces - strip punctuation]

        CNORM --> CHASH[SHA256 normalized:language\nTake first 16 chars]

        CHASH --> CGET[GET chat:cache:{hash}]
        CGET --> CCHECK{Found?}
        CCHECK -- "YES" --> CPARSE([JSON.parse -> ChatResponse])
        CCHECK -- "NO" --> CNONE([return null])
    end

    subgraph REDIS_KEYS["Redis Key Patterns"]
        direction LR
        K1[throttle:ip:{ip}\nTTL: 60s]
        K2[throttle:session:{sid}\nTTL: 3600s]
        K3[throttle:global:chat\nTTL: 60s]
        K4[chat:session:{uuid}\nTTL: 1800s sliding]
        K5[chat:cache:{hash16}\nTTL: 86400s]
        K6[semantic:cache:{md5}\nTTL: 30 days]
    end
```

---

## 10. Document Ingestion Flow

```mermaid
flowchart TD
    UPLOAD([POST /api/rag/ingest\nmultipart/form-data]) --> MIME

    MIME{MIME type\n== application/pdf?}
    MIME -- "NO" --> E400_M([HTTP 400\nOnly PDF allowed])
    MIME -- "YES" --> SIZE

    SIZE{fileSize\n<= 50MB?}
    SIZE -- "NO" --> E400_S([HTTP 400\nFile too large])
    SIZE -- "YES" --> READ

    READ[Read file.buffer\nPass to RAGService -> AI Engine\nPOST /api/ingest form-data]

    READ --> TEMP[Save to tempfile\n/tmp/xxx.pdf]

    TEMP --> PARSE

    subgraph LLAMAPARSE["LlamaParse Processing"]
        PARSE[LlamaParse.aload_data\nresult_type: markdown\nPreserve tables, headers, lists]

        PARSE --> META[Enrich metadata\nfile_name, page_number\ntotal_pages, doc_type]

        META --> DTYPE[detect_doc_type from filename\ndatasheet / manual / catalog\nstandard / certificate / drawing / general]

        DTYPE --> DETECT_MD

        DETECT_MD{Is Markdown content?\nhas pipe, ##, ** ?}
        DETECT_MD -- "YES" --> MNP[MarkdownNodeParser\nStructure-aware splitting]
        DETECT_MD -- "NO" --> SSP[SentenceSplitter\nchunk_size=1024\nchunk_overlap=200]

        MNP & SSP --> NODES[List of TextNode\nwith metadata]
    end

    NODES --> CLEANUP[Delete tempfile]

    CLEANUP --> EMBED[RAGEngine.add_documents nodes\nVoyage AI embed each node\nQdrant upsert]

    EMBED --> RESP([Response\ndocument_id, filename\nchunks_created, doc_type])
```

---

## 11. Google Drive Sync Flow

```mermaid
flowchart TD
    TRIGGER([POST /api/rag/gdrive/sync\nforce_full_sync: bool]) --> CHECK_CFG

    CHECK_CFG{Google Drive configured?\nfolder_id + credentials}
    CHECK_CFG -- "NO" --> E400([HTTP 400\nNot configured])
    CHECK_CFG -- "YES" --> AUTH

    AUTH[Service Account Auth\nservice-account.json\nSCOPE: drive.readonly]

    AUTH --> LIST

    LIST[Drive API: files.list\nmimeType = application/pdf\nfolder_id in parents\ntrashed = false\norderBy: modifiedTime desc]

    LIST --> FILES[List of FileInfo\nid, name, modified_time, size]

    FILES --> LOOP

    LOOP[For each file]

    LOOP --> DOWNLOAD[files.get_media file_id\nMediaIoBaseDownload -> bytes]

    DOWNLOAD --> PROC[PDFProcessor.process_bytes\n-> List of TextNode]

    PROC --> INGEST[RAGEngine.add_documents nodes\nEmbed + Qdrant upsert]

    INGEST --> STATUS{Success?}
    STATUS -- "OK" --> CNT_OK[files_processed += 1\ntotal_chunks += len nodes\nstatus = completed]
    STATUS -- "FAIL" --> CNT_FAIL[files_failed += 1\nstatus = failed: error\nlog ERROR]

    CNT_OK & CNT_FAIL --> NEXT_FILE{More files?}
    NEXT_FILE -- "YES" --> LOOP
    NEXT_FILE -- "NO" --> RESP

    RESP([SyncResponse\nfiles_found, files_processed\nfiles_failed, total_chunks, message])
```

---

## 12. Startup Sequence

```mermaid
sequenceDiagram
    participant UV as Uvicorn
    participant APP as FastAPI App
    participant RD as Redis
    participant SC as SemanticCache
    participant LOG as Logger

    UV->>APP: Start server process
    APP->>LOG: TTE AI Engine starting...

    APP->>RD: connect() async
    RD-->>APP: PONG OK
    APP->>LOG: Connected to Redis

    APP->>SC: get_semantic_cache() singleton
    SC->>RD: KEYS semantic:cache:*
    alt Cache entries found
        RD-->>SC: List of keys
        SC->>RD: GET each key
        RD-->>SC: JSON data
        SC->>SC: Parse -> CacheEntry
        SC->>SC: np.array embedding
        SC-->>APP: Loaded N entries
        APP->>LOG: Loaded N semantic cache entries from Redis
    else No cache
        RD-->>SC: empty
        APP->>LOG: No semantic cache found in Redis
    end

    APP->>LOG: Config summary - model, collection, gdrive
    APP->>LOG: Application startup complete
    UV-->>APP: Ready to serve requests

    Note over APP: RAGEngine singleton initialized LAZILY on first /api/chat request
```

---

## 13. Deployment Topology

```mermaid
graph TB
    subgraph INTERNET["Internet"]
        CLIENT[Browser / Client]
    end

    subgraph SERVER["Production Server VPS"]
        subgraph NGINX["Nginx Reverse Proxy"]
            NG_MAIN["toanthang.vn -> :4000"]
            NG_CMS["cms.toanthang.vn -> :4001"]
        end

        subgraph DOCKER["Docker Network: tte_network"]
            WEB["tte_web\nNext.js :4000\nMemory: 512MB"]
            CMS["tte_cms\nPayload :4001\nMemory: 1GB"]
            BK["tte_backend\nNestJS :4002\nMemory: 512MB"]
            AI["tte_ai_engine\nFastAPI :4003\nMemory: 1GB"]
            PG["tte_postgres\nPostgreSQL :5434\nMemory: 1GB"]
            RD["tte_redis\nRedis :6381\nMemory: 256MB"]
        end

        subgraph CLOUD["Cloud Services"]
            QD_C["Qdrant Cloud\n421+ vectors"]
            DS_C["DeepSeek API"]
            OAI_C["OpenAI API"]
            VOY_C["Voyage AI"]
            GD_C["Google Drive API"]
        end
    end

    CLIENT --> NG_MAIN --> WEB
    CLIENT --> NG_CMS --> CMS
    WEB -- "API calls" --> BK
    BK -- "http://ai-engine:4003" --> AI
    BK --> RD
    BK --> PG
    CMS --> PG
    AI --> QD_C
    AI --> DS_C
    AI --> OAI_C
    AI --> VOY_C
    AI --> GD_C
    AI --> RD

    subgraph VOLUMES["Docker Volumes"]
        PG_V[postgres_data]
        RD_V[redis_data]
        CRED_V["./credentials/ read-only\nservice-account.json"]
    end

    PG --- PG_V
    RD --- RD_V
    AI --- CRED_V
```

---

## 14. Component Dependencies

```mermaid
graph LR
    subgraph FE["Frontend"]
        CW[ChatWidget]
        TC[TechnicalChat]
        CW --> TC
    end

    subgraph BK["NestJS Backend"]
        CTG[ChatbotThrottlerGuard]
        PIG[PromptInjectionGuard]
        RC[RAGController]
        RS[RAGService]
        CSS[ChatbotSessionService]
        CCS[ChatbotCacheService]
        RM[RAGModule]

        RM -.-> RC & RS & CSS & CCS
        CTG & PIG --> RC
        RC --> RS & CSS & CCS
    end

    subgraph AI["FastAPI AI Engine"]
        RT[routes.py]
        RE[RAGEngine]
        FF[FAQPreFilter]
        SC[SemanticCache]
        MR[SmartModelRouter]
        PP[PDFProcessor]
        GD[GoogleDriveSync]
        RC2[RedisClient]

        RT --> RE & PP & GD
        RE --> FF & SC & MR
        SC --> RC2
    end

    subgraph EXT["External Services"]
        REDIS[(Redis)]
        QDRANT[(Qdrant)]
        DEEPSEEK((DeepSeek))
        OPENAI((OpenAI))
        VOYAGE((Voyage AI))
        LLAMA((LlamaParse))
        GDRIVE((Google Drive))
    end

    TC -- "REST" --> RC
    RS -- "HTTP" --> RT
    CTG & CSS & CCS --> REDIS
    RE --> QDRANT
    RE --> DEEPSEEK
    RE --> OPENAI
    RE --> VOYAGE
    PP --> LLAMA
    GD --> GDRIVE
    RC2 --> REDIS
```

---

## 15. Redis Key Lifecycle

```mermaid
stateDiagram-v2
    [*] --> IP_COUNTER : First request from IP

    state "Rate Limiting Keys" as RL {
        IP_COUNTER : throttle:ip:{ip}\ncount=1, TTL=60s
        IP_COUNTER --> IP_COUNTING : INCR on each request
        IP_COUNTING : count 2 to 5
        IP_COUNTING --> IP_LIMIT : count > 5
        IP_LIMIT : HTTP 429 Too Many Requests
        IP_COUNTING --> IP_EXPIRE : TTL expires 60s
        IP_EXPIRE : KEY DELETED
        IP_EXPIRE --> [*]
    }

    state "Session Keys" as SK {
        [*] --> SESSION_NEW : First message
        SESSION_NEW : chat:session:{uuid}\nhistory empty, TTL=1800s
        SESSION_NEW --> SESSION_ACTIVE : saveMessage called
        SESSION_ACTIVE : history grows\nTTL refreshed on each message
        SESSION_ACTIVE --> SESSION_TRIM : more than 6 messages
        SESSION_TRIM : Keep last 6 messages (3 turns)
        SESSION_TRIM --> SESSION_ACTIVE
        SESSION_ACTIVE --> SESSION_EXPIRE : 30min inactivity
        SESSION_EXPIRE : KEY DELETED
        SESSION_EXPIRE --> [*]
    }

    state "Cache Keys" as CK {
        [*] --> CACHE_MISS : New question
        CACHE_MISS : No chat:cache:{hash}
        CACHE_MISS --> CACHE_WRITE : After LLM response
        CACHE_WRITE : chat:cache:{hash16}\nTTL=86400s (24h)
        CACHE_WRITE --> CACHE_HIT : Same question asked again
        CACHE_HIT : Instant response
        CACHE_HIT --> CACHE_EXPIRE : After 24h
        CACHE_EXPIRE : KEY DELETED
        CACHE_EXPIRE --> [*]
    }

    state "Semantic Cache Keys" as SC {
        [*] --> SC_LOAD : App startup
        SC_LOAD : Load from Redis into memory
        SC_LOAD --> SC_ACTIVE
        SC_ACTIVE : semantic:cache:{md5}\nembedding + response\nTTL=30 days
        SC_ACTIVE --> SC_HIT : cosine similarity >= 0.96
        SC_HIT : Semantic match found
        SC_HIT --> SC_ACTIVE
        SC_ACTIVE --> SC_EVICT : more than 1000 entries
        SC_EVICT : Remove entry with lowest hit_count
        SC_EVICT --> SC_ACTIVE
        SC_ACTIVE --> SC_EXPIRE : After 30 days
        SC_EXPIRE --> [*]
    }
```

---
