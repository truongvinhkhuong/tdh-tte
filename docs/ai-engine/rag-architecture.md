# RAG Architecture — TTE AI Engine

Tài liệu phân tích chi tiết kiến trúc RAG (Retrieval-Augmented Generation) của chatbot TTE, tập trung vào pipeline xử lý, các cải tiến đã triển khai, và cách các thành phần tương tác với nhau.

---

## Tổng quan hệ thống

```mermaid
graph TB
    User["Người dùng"]

    subgraph Frontend["FRONTEND — Next.js 16"]
        CW["ChatWidget — Floating UI"]
        TC["TechnicalChat — useChat hook"]
        SDK["Vercel AI SDK v6\nTextStreamChatTransport"]
        LS["localStorage\nsession_id, messages x20"]
        SS["useSmartSuggestions\n→ SuggestionChips"]
        CW --> TC --> SDK
        TC --> LS
        TC --> SS
    end

    subgraph Backend["BACKEND — NestJS 10"]
        TG["ThrottlerGuard\nIP: 5/min · Session: 20/hr · Global: 100/min"]
        PIG["PromptInjection Guard"]
        RC["RAGController"]
        SVC["SessionService + CacheService\nRedis"]
        TG --> PIG --> RC --> SVC
    end

    subgraph AIEngine["AI ENGINE — FastAPI"]
        Routes["/api/chat\n/api/chat/stream\n/api/chat/suggestions"]
        RAG["RAGEngine — Singleton"]
        Pipeline["FAQ Filter → Semantic Cache → Model Router\n↓\nVector Search + Keyword Search → RRF Fusion\n↓\nCross-Encoder Reranker\n↓\nDeepSeek LLM Stream → OpenAI Fallback"]
        Routes --> RAG --> Pipeline
    end

    subgraph Storage["STORAGE LAYER"]
        Redis["Redis\nsemantic:cache:* — 30d\nsuggestions:* — 24h\nchat:session:* — 30min\nchat:cache:* — 24h"]
        Qdrant["Qdrant Cloud\nVector Embeddings — 1024d, Cosine\nText Payload Index — Keyword\nMetadata Payload — brand, type..."]
    end

    User --> Frontend
    Frontend -->|"POST /api/rag/chat/stream SSE\nPOST /api/rag/chat/suggestions"| Backend
    Backend -->|"HTTP — cache miss"| AIEngine
    AIEngine --> Storage
    Backend --> Redis

    style Frontend fill:#dbeafe,stroke:#2563eb
    style Backend fill:#fef3c7,stroke:#d97706
    style AIEngine fill:#d1fae5,stroke:#059669
    style Storage fill:#f3e8ff,stroke:#7c3aed
```



---

## RAG Pipeline chi tiết

Toàn bộ pipeline được chia thành **2 giai đoạn chính**: **Ingestion** (nạp tài liệu) và **Query** (truy vấn). Mỗi giai đoạn có nhiều bước tối ưu hóa.

---

### 1. Ingestion Pipeline — Từ PDF đến Vector

```mermaid
graph LR
    subgraph Input["Nguồn tài liệu"]
        PDF["PDF Upload\nPOST /api/ingest"]
        GDrive["Google Drive\nAuto-sync"]
    end

    Parse["LlamaParse\nAI Parse → Markdown\nGiữ bảng, heading, format"]

    Chunk["Chunking\n1024 tokens, overlap 200"]

    Meta["MetadataExtractor\nLLM extract: brand,\nproduct_type, pressure_class..."]

    Enrich["Contextual Enrichment\nLLM sinh context/chunk\nBatch: 5 concurrent"]

    Embed["Embedding\nVoyage AI voyage-3.5-lite\n1024 dimensions"]

    Store[("Qdrant Cloud\nVector Store")]

    PDF --> Parse
    GDrive --> Parse
    Parse --> Chunk
    Chunk --> Meta
    Meta --> Enrich
    Enrich --> Embed
    Embed --> Store

    style Input fill:#fef3c7,stroke:#d97706
    style Store fill:#f3e8ff,stroke:#7c3aed
```



#### 1.1 PDF Parsing — LlamaParse

```mermaid
graph TD
    PDF["Fisher_HP_Datasheet.pdf\nKỹ thuật, bảng biểu phức tạp"]
    LP["LlamaParse — AI\n\nSystem Prompt:\nTechnical document for industrial equipment\nPRESERVE ALL TABLES"]
    Out["Markdown Output\nBảng, heading, format nguyên vẹn\nĐơn vị: PSI, bar, mm\nCertifications: API, ISO"]

    PDF --> LP --> Out

    style LP fill:#d1fae5,stroke:#059669
```



#### 1.2 Chunking — Chia nhỏ tài liệu

```mermaid
graph TD
    Doc["Markdown Document — vd: 50 trang"]
    Check{"Có bảng/heading?"}
    MDP["MarkdownNodeParser\nChia theo cấu trúc"]
    SS["SentenceSplitter\nChia theo câu"]
    Chunks["Chunks — 1024 tokens, overlap 200\n\nChunk 1: Fisher HP Series có áp suất...\nChunk 2: Bảng thông số Cv values...\n..."]

    Doc --> Check
    Check -->|YES| MDP
    Check -->|NO| SS
    MDP --> Chunks
    SS --> Chunks

    style Check fill:#fef3c7,stroke:#d97706
```



#### 1.3 Contextual Enrichment — Giàu hóa ngữ cảnh

Đây là kỹ thuật **Contextual Retrieval** từ Anthropic — giải quyết vấn đề chunk mất ngữ cảnh.

```mermaid
graph TD
    subgraph Problem["VẤN ĐỀ: Chunk mất ngữ cảnh"]
        Raw["Chunk gốc:\nÁp suất làm việc tối đa: 4150 PSI\nNhiệt độ: -46°C đến 593°C\nVật liệu body: WCB, CF8M, CF3M"]
        Issue["Embedding KHÔNG biết đây là\nthông số của sản phẩm nào!\n→ Hỏi Fisher HP pressure rating → có thể miss"]
        Raw --> Issue
    end

    subgraph Solution["GIẢI PHÁP: Contextual Enrichment"]
        FullDoc["Full Document\n6000 chars đầu"]
        ChunkIn["Chunk gốc"]
        LLM["DeepSeek LLM\nT=0.0, max_tokens=256"]
        Enriched["Chunk sau enrich:\n\nCONTEXT: This chunk is from Fisher HP\nSeries control valve datasheet, section:\nTechnical Specifications. Product: Fisher\nHP globe valve for high-pressure applications.\n\nÁp suất làm việc tối đa: 4150 PSI\nNhiệt độ: -46°C đến 593°C\nVật liệu body: WCB, CF8M, CF3M"]
        Result["Embedding BIẾT đây là Fisher HP\n→ Tìm chính xác khi hỏi Fisher HP pressure\nKẾT QUẢ: giảm ~49% lỗi retrieval"]

        FullDoc --> LLM
        ChunkIn --> LLM
        LLM --> Enriched --> Result
    end

    Problem -.->|"Giải quyết bằng"| Solution

    style Problem fill:#fee2e2,stroke:#dc2626
    style Solution fill:#d1fae5,stroke:#059669
```



**Lưu ý kỹ thuật:**

- `original_text` được lưu riêng trong metadata → hiển thị citation KHÔNG có phần `[Context: ...]`
- Batch processing: 5 chunks xử lý đồng thời (`asyncio.gather`)
- Nếu LLM fail cho chunk nào → dùng chunk gốc (graceful degradation)

#### 1.4 Metadata Extraction — Trích xuất metadata có cấu trúc

```mermaid
graph LR
    Chunk["Chunk text"]
    ME["MetadataExtractor\nDeepSeek LLM — T=0.0"]
    JSON["Structured JSON\n\nbrand: Fisher\nproduct_series: HP Series\nproduct_type: Control Valve\npressure_class: CL2500\nsize_range: 1 inch - 24 inch\nconnection_type: Flanged\nbody_material: WCB, CF8M\ntemperature_range: -46°C to 593°C\napplication: Oil and Gas, Refining\ncertification: API 6D, API 607"]
    Store[("Qdrant\nMetadata payload\n→ Filtered search")]

    Chunk --> ME --> JSON --> Store

    style ME fill:#d1fae5,stroke:#059669
    style Store fill:#f3e8ff,stroke:#7c3aed
```



---

### 2. Query Pipeline — 7 Phase tối ưu hóa

```mermaid
graph TD
    Q["Câu hỏi: Van Fisher HP có thông số áp suất bao nhiêu?"]

    subgraph P1["PHASE 1: FAQ Pre-Filter — ~50% LLM calls skip"]
        FAQ_N["normalize → van fisher hp..."]
        FAQ_DB["FAQ Database ~50 entries\nTTE là gì? · Liên hệ? · Giờ làm việc?"]
        FAQ_Check{"Match?"}
        FAQ_Hit["Return static response\nconfidence=100%, skip pipeline"]
        FAQ_N --> FAQ_DB --> FAQ_Check
        FAQ_Check -->|"YES"| FAQ_Hit
    end

    subgraph P2["PHASE 2: Semantic Cache — +30% cache hit"]
        SC_Embed["Embed câu hỏi → vector 1024-dim"]
        SC_Compare["Cosine similarity vs cache:\nFisher HP pressure? → 0.97 HIT\nVan an toàn Fisher? → 0.89 MISS\nBettis actuator spec? → 0.42 MISS"]
        SC_Check{"sim ≥ 0.96?"}
        SC_Hit["Return cached response"]
        SC_Note["Tại sao 0.96 thay vì 0.92?\nvan điều khiển vs van an toàn ≈ 0.93-0.95\n→ 0.92 gây false positive"]
        SC_Embed --> SC_Compare --> SC_Check
        SC_Check -->|"HIT"| SC_Hit
        SC_Note ~~~ SC_Check
    end

    subgraph P3["PHASE 3: Smart Model Routing — ~40% giảm chi phí LLM"]
        MR_Classify["Phân loại độ phức tạp"]
        MR_Simple["SIMPLE — 512 tokens\nFisher GX là gì?\n≤8 words"]
        MR_Medium["MEDIUM — 1024 tokens\nVan HP áp suất bao nhiêu?\n1 keyword"]
        MR_Complex["COMPLEX — 2048 tokens\nSo sánh Fisher GX và DVC6200...\n≥2 keywords + >30 words"]
        MR_Classify --> MR_Simple
        MR_Classify --> MR_Medium
        MR_Classify --> MR_Complex
    end

    subgraph P4["PHASE 4: Hybrid Retrieval"]
        QE["Query Embedding — Voyage AI"]
        VS["VECTOR SEARCH\nQdrant ANN, top_k=15"]
        KS["KEYWORD SEARCH\nQdrant Full-text, top_k=15"]
        SF["Similarity Filter ≥0.3"]
        SW["Stop-word removal — EN+VI"]
        RRF["Reciprocal Rank Fusion\nscore = 0.7/k+rank_v + 0.3/k+rank_k\n70% vector · 30% keyword\nDeduplicate by node_id"]

        QE --> VS --> SF --> RRF
        QE --> KS --> SW --> RRF
    end

    subgraph P5["PHASE 5: Cross-Encoder Reranking — thêm ~18% giảm lỗi"]
        RE_In["15 candidates từ hybrid retrieval"]
        RE_Model["ms-marco-MiniLM-L-6-v2\nCross-Encoder: encode query + doc CÙNG LÚC\nChạy LOCAL, ~80MB, $0 cost"]
        RE_Out["Top 3 documents chính xác nhất\nRestore original cosine scores"]
        RE_In --> RE_Model --> RE_Out
    end

    subgraph P6["PHASE 6: LLM Generation + Streaming"]
        CC{"confidence ≥ 20%\nAND sources > 0?"}
        FB["Fallback: Xin lỗi, tôi chưa tìm thấy..."]
        CTX["Context Building\noriginal_text — không Context prefix\nJoin 3 chunks"]
        DS["DeepSeek LLM — primary\nT=0.1, max_tokens routed\nastream_complete → token-by-token\nFirst token: ~500ms"]
        OAI["OpenAI gpt-4o-mini — fallback\nT=0.1"]
        STATIC["Static fallback message + contact info"]
        CC -->|"NO"| FB
        CC -->|"YES"| CTX --> DS
        DS -->|"fail"| OAI
        OAI -->|"fail"| STATIC
    end

    subgraph P7["PHASE 7: Post-Processing + Caching"]
        CIT["Extract Citations\nsource, page, doc_type, preview, score\nDeduplicate by file_name + page"]
        CONF["Calculate Confidence\nWeighted avg cosine scores\nWeight = 1/rank+1, cap 95%"]
        CACHE["Cache to Semantic Cache — 30d\nCache to NestJS layer — 24h"]
        RETURN["Return:\nanswer, citations, confidence, sources_count"]
        CIT --> CONF --> CACHE --> RETURN
    end

    Q --> P1
    FAQ_Check -->|"MISS"| P2
    SC_Check -->|"MISS"| P3
    P3 --> P4
    RRF --> P5
    RE_Out --> P6
    DS --> P7
    OAI --> P7

    style P1 fill:#dbeafe,stroke:#2563eb
    style P2 fill:#fef3c7,stroke:#d97706
    style P3 fill:#d1fae5,stroke:#059669
    style P4 fill:#e0e7ff,stroke:#4f46e5
    style P5 fill:#fce7f3,stroke:#db2777
    style P6 fill:#fff7ed,stroke:#ea580c
    style P7 fill:#f3e8ff,stroke:#7c3aed
```



**Tại sao Hybrid Search (Phase 4)?**

- **Vector search**: tốt cho câu hỏi ngữ nghĩa ("van chịu áp lực cao" → Fisher HP)
- **Keyword search**: tốt cho exact match ("DVC6200" → đúng model number)
- **RRF Fusion**: kết hợp ưu điểm của cả hai

**Bi-encoder vs Cross-encoder (Phase 5):**

- Bi-encoder: `encode(query)` · `encode(doc)` → nhanh nhưng kém chính xác
- Cross-encoder: `encode(query + doc cùng lúc)` → chậm hơn nhưng chính xác hơn nhiều

---

### 3. Smart Suggestions Pipeline — Gợi ý follow-up

```mermaid
graph TD
    Trigger["Frontend detect status = ready\nStream xong"]
    Req["POST /api/chat/suggestions\nbody: question, answer, language"]

    FB_Check{"answer chứa\nXin lỗi, tôi chưa tìm thấy\nhoặc I apologize?"}
    FB_Return["return empty list\nKhông gợi ý cho fallback"]

    Cache_Check{"Redis cache\nsuggestions:md5 of q+lang"}
    Cache_Hit["return cached suggestions"]

    LLM["DeepSeek LLM\nT=0.7 creative, max_tokens=200\n\nPrompt few-shot:\nGợi ý 3 câu hỏi tiếp theo:\n1 câu đi sâu hơn\n1 câu so sánh/mở rộng\n1 câu ứng dụng thực tế"]

    Validate["Validation\nMax 3 items · Mỗi câu dưới 80 ký tự\nKhông trùng câu hỏi gốc\nJSON parse + regex fallback"]

    Save["Cache to Redis — 24h TTL"]

    Result["Return 3 suggestions:\nFisher HP phù hợp ứng dụng nào?\nSo sánh Fisher HP với DVC6200?\nCách bảo trì van Fisher HP?"]

    Chips["SuggestionChips\n3 nút bấm, fade-in animation\nClick → gửi câu hỏi mới"]

    Trigger --> Req --> FB_Check
    FB_Check -->|"YES"| FB_Return
    FB_Check -->|"NO"| Cache_Check
    Cache_Check -->|"HIT"| Cache_Hit
    Cache_Check -->|"MISS"| LLM --> Validate --> Save --> Result --> Chips
    Cache_Hit --> Chips

    style Trigger fill:#dbeafe,stroke:#2563eb
    style LLM fill:#d1fae5,stroke:#059669
    style Chips fill:#fef3c7,stroke:#d97706
```



> **Error handling**: NEVER throws → return `[]` → UI ẩn suggestions
> **Chi phí**: ~$0.00004/call

---

## Singleton Pattern — Module Registry

Tất cả core module dùng Singleton pattern để tránh re-initialization.

```mermaid
graph LR
    subgraph Registry["MODULE REGISTRY — Singletons — tiết kiệm ~500ms/request"]

        F1["get_rag_engine()"]
        M1["RAGEngine\nQdrant clients · VectorStoreIndex\nReranker lazy · KeywordRetriever lazy"]

        F2["get_faq_filter()"]
        M2["FAQPreFilter\n~50 FAQ entries bilingual\nVietnamese normalization"]

        F3["get_semantic_cache()"]
        M3["SemanticCache\nIn-memory + Redis backup\n1000 max entries LRU · Cosine ≥ 0.96"]

        F4["get_model_router()"]
        M4["SmartModelRouter\nComplexity classification\nToken limit routing"]

        F5["get_suggestion_generator()"]
        M5["SuggestionGenerator\nDeepSeek T=0.7\nRedis cache 24h"]

        F6["get_redis_client()"]
        M6["RedisClient\nAsync aioredis\nAuto-reconnect"]

        F1 --> M1
        F2 --> M2
        F3 --> M3
        F4 --> M4
        F5 --> M5
        F6 --> M6
    end

    style Registry fill:#f8fafc,stroke:#64748b
```



---

## External Services & Dependencies

```mermaid
graph TD
    AI["AI ENGINE\nFastAPI"]

    DS["DeepSeek API\nChat LLM · Enrichment\nSuggestion · Metadata\nFallback: OpenAI gpt-4o-mini"]

    VA["Voyage AI API\nEmbedding 1024 dims\nvoyage-3.5-lite\nFallback: OpenAI embed-3-small"]

    RD["Redis\nCache — semantic 30d, suggestion 24h\nSession 30min · Response 24h"]

    QD["Qdrant Cloud\nVector Store ANN\nBM25 Full-text Index"]

    LC["LlamaCloud\nPDF Parse — LlamaParse\nTables · 1000 pages/day free"]

    GD["Google Drive API\nService Account\nAuto-sync PDFs\nIncremental by modified_time"]

    AI --> DS
    AI --> VA
    AI --> RD
    AI --> QD
    AI --> LC
    AI -.->|"Optional"| GD

    style AI fill:#d1fae5,stroke:#059669
    style DS fill:#dbeafe,stroke:#2563eb
    style VA fill:#dbeafe,stroke:#2563eb
    style RD fill:#fee2e2,stroke:#dc2626
    style QD fill:#f3e8ff,stroke:#7c3aed
    style LC fill:#fef3c7,stroke:#d97706
    style GD fill:#f1f5f9,stroke:#94a3b8
```



---

## Tổng kết: Pipeline tối ưu hóa chi phí

```mermaid
graph LR
    subgraph Before["Không tối ưu"]
        B["~$400/tháng\n10,000 queries/ngày"]
    end

    subgraph Layers["6 tầng tối ưu hóa"]
        L1["Layer 1: FAQ Filter\n-50% LLM calls\n5,000 queries skip"]
        L2["Layer 2: Semantic Cache\n+30% cache hit\n1,500 queries cached"]
        L3["Layer 3: Model Routing\n-40% tokens output\nSIMPLE 40% · MEDIUM 45% · COMPLEX 15%"]
        L4["Layer 4: Voyage AI Embedding\n-60% embedding cost"]
        L5["Layer 5: Local Reranker\n$0 cost\nChạy local, 80MB RAM"]
        L6["Layer 6: Smart Suggestions\n~$0.00004/call"]
        L1 --> L2 --> L3 --> L4 --> L5 --> L6
    end

    subgraph After["Sau tối ưu"]
        A["~$140/tháng\nTiết kiệm ~65%"]
    end

    Before --> Layers --> After

    style Before fill:#fee2e2,stroke:#dc2626
    style After fill:#d1fae5,stroke:#059669
    style Layers fill:#f8fafc,stroke:#64748b
```



---

## Retrieval Quality — Các cải tiến đã triển khai

```mermaid
graph TD
    BL["Baseline\nVector search only\n100% retrieval errors"]

    CE["+ Contextual Enrichment — Phase 1\nGIẢM 49% lỗi\nChunk biết thuộc tài liệu nào, sản phẩm nào"]

    RR["+ Cross-Encoder Reranking — Phase 2\nTHÊM 18% giảm lỗi\nTop 15 → Top 3 chính xác nhất"]

    HS["+ Hybrid Search / BM25 — Phase 3\nCẢI THIỆN exact match\nModel numbers: DVC6200, MR95 tìm chính xác"]

    SC["+ Semantic Cache Tuning\n0.92 → 0.96\nvan điều khiển ≠ van an toàn\nGiảm false positive cache hits"]

    TOTAL["Tổng cải thiện retrieval\n~67% giảm lỗi so với baseline"]

    BL --> CE --> RR --> HS --> SC --> TOTAL

    style BL fill:#fee2e2,stroke:#dc2626
    style CE fill:#d1fae5,stroke:#059669
    style RR fill:#d1fae5,stroke:#059669
    style HS fill:#d1fae5,stroke:#059669
    style SC fill:#fef3c7,stroke:#d97706
    style TOTAL fill:#dbeafe,stroke:#2563eb
```



---

## Data Model — Qdrant Vector Entry

```mermaid
graph TD
    subgraph Point["QDRANT POINT STRUCTURE"]
        ID["id: uuid-v4"]
        VEC["vector: 0.0123, -0.0456, ..., 0.0789\n1024 dimensions"]

        subgraph Payload["payload"]
            NC["_node_content — searchable\nContext: Fisher HP Series... Áp suất tối đa: 4150 PSI..."]
            OT["original_text — display\nÁp suất làm việc tối đa: 4150 PSI..."]

            subgraph DocMeta["Document Metadata"]
                FN["file_name: Fisher_HP_Datasheet.pdf"]
                PL["page_label: 3"]
                DT["doc_type: datasheet"]
            end

            subgraph ExtMeta["Extracted Metadata — LLM"]
                BR["brand: Fisher"]
                PS["product_series: HP Series"]
                PT["product_type: Control Valve"]
                PC["pressure_class: CL2500"]
                SR["size_range: 1 inch - 24 inch"]
                CTN["connection_type: Flanged"]
                BM["body_material: WCB, CF8M"]
                TR["temperature_range: -46°C to 593°C"]
                AP["application: Oil and Gas, Refining"]
                CERT["certification: API 6D, API 607"]
            end
        end

        subgraph Indexes["Indexes"]
            VI["Vector index — HNSW, Cosine distance"]
            TI["Text payload index — _node_content, word tokenizer"]
        end
    end

    style Point fill:#f8fafc,stroke:#64748b
    style Payload fill:#f3e8ff,stroke:#7c3aed
    style DocMeta fill:#dbeafe,stroke:#2563eb
    style ExtMeta fill:#d1fae5,stroke:#059669
    style Indexes fill:#fef3c7,stroke:#d97706
```



---

## Streaming Architecture — Token-by-token

```mermaid
sequenceDiagram
    participant FE as Frontend — useChat
    participant BE as NestJS — Proxy
    participant AI as AI Engine — FastAPI

    FE->>BE: POST /api/rag/chat/stream
    BE->>AI: POST /api/chat/stream

    Note over AI: Retrieval Phase 1-5\n~200-500ms

    Note over AI: astream_complete()

    AI-->>BE: SSE chunk: Van
    BE-->>FE: SSE chunk: Van
    Note over FE: render Van

    AI-->>BE: SSE chunk: Fisher
    BE-->>FE: SSE chunk: Fisher
    Note over FE: render Van Fisher

    AI-->>BE: SSE chunk: HP...
    BE-->>FE: SSE chunk: HP...
    Note over FE: render Van Fisher HP...

    AI-->>BE: SSE done + metadata
    BE-->>FE: SSE done — confidence, citations

    Note over FE: status = ready

    FE->>BE: POST /api/rag/chat/suggestions
    BE->>AI: POST /api/chat/suggestions
    Note over AI: Generate 3 questions
    AI-->>BE: suggestions list
    BE-->>FE: suggestions list

    Note over FE: Render SuggestionChips
```



> **Headers**: `X-Accel-Buffering: no` (disable Nginx buffering)
> **Format**: `data: {"type":"chunk|done|error","data":"..."}\n\n`

---

## Fallback Chain — Đảm bảo 99.9% uptime

```mermaid
graph TD
    Q["Query"]
    DS["DeepSeek LLM\nPrimary, cost-effective"]
    OAI["OpenAI gpt-4o-mini\nFallback"]
    STATIC["Static Fallback Message\n\nVI: Xin lỗi, tôi chưa tìm thấy thông tin này\ntrong tài liệu kỹ thuật. Vui lòng liên hệ TTE\nđể được tư vấn trực tiếp.\n\nEN: I apologize, I could not find this information\nin the technical documentation. Please contact\nTTE for direct assistance.\n\nconfidence: 0%, is_fallback: true"]
    OK1["Return answer"]
    OK2["Return answer"]
    PROG["Programmatic Fallback\nconfidence under 20% OR sources = 0\n→ Không để LLM tự đoán khi context không đủ"]

    Q --> DS
    DS -->|"success"| OK1
    DS -->|"fail — API error, timeout, rate limit"| OAI
    OAI -->|"success"| OK2
    OAI -->|"fail"| STATIC
    Q -.-> PROG -.-> STATIC

    style DS fill:#d1fae5,stroke:#059669
    style OAI fill:#fef3c7,stroke:#d97706
    style STATIC fill:#fee2e2,stroke:#dc2626
    style PROG fill:#f1f5f9,stroke:#94a3b8
```



---

## File Map — Source Code Reference

```
apps/ai-engine/
├── src/
│   ├── main.py                              # FastAPI app, CORS, lifespan
│   ├── config/
│   │   └── settings.py                      # Pydantic Settings (tất cả config)
│   ├── api/
│   │   ├── routes.py                        # /chat, /stream, /suggestions, /ingest
│   │   └── models.py                        # Request/Response schemas
│   ├── core/
│   │   ├── rag_engine.py                    # ★ Core RAG pipeline (query + stream)
│   │   ├── faq_filter.py                    # Phase 1: FAQ pre-filter
│   │   ├── semantic_cache.py                # Phase 2: Embedding-based cache
│   │   ├── model_router.py                  # Phase 3: Complexity routing
│   │   ├── suggestion_generator.py          # Smart follow-up suggestions
│   │   └── redis_client.py                  # Async Redis client (singleton)
│   ├── ingestion/
│   │   ├── pdf_processor.py                 # LlamaParse + chunking pipeline
│   │   ├── contextual_enricher.py           # Contextual Retrieval (LLM enrich)
│   │   ├── metadata_extractor.py            # LLM-extracted structured metadata
│   │   └── gdrive_sync.py                   # Google Drive auto-sync
│   └── retrieval/
│       ├── keyword_retriever.py             # Qdrant full-text + RRF fusion
│       └── auto_retriever.py                # LLM-powered metadata filtering
```

