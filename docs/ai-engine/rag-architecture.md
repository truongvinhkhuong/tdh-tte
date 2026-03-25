# RAG Architecture — TTE AI Engine

Tài liệu phân tích chi tiết kiến trúc RAG (Retrieval-Augmented Generation) của chatbot TTE, tập trung vào pipeline xử lý, các cải tiến đã triển khai, và cách các thành phần tương tác với nhau.

---

## Tổng quan hệ thống

```mermaid
graph TB
    User(["Người dùng"])

    subgraph Frontend["FRONTEND — Next.js 16"]
        CW["ChatWidget"]
        TC["TechnicalChat"]
        SDK["Vercel AI SDK v6"]
        LS["localStorage"]
        SS["useSmartSuggestions"]
        CW --> TC --> SDK
        TC --> LS
        TC --> SS
    end

    subgraph Backend["BACKEND — NestJS 10"]
        TG["ThrottlerGuard"]
        PIG["PromptInjection Guard"]
        RC["RAGController"]
        SVC["Session + Cache Service"]
        TG --> PIG --> RC --> SVC
    end

    subgraph AIEngine["AI ENGINE — FastAPI"]
        Routes["/api/chat · /stream · /suggestions"]
        RAG["RAGEngine — Singleton"]
        Routes --> RAG
    end

    subgraph Storage["STORAGE LAYER"]
        Redis[("Redis")]
        Qdrant[("Qdrant Cloud")]
    end

    User --> Frontend
    Frontend -->|"SSE stream + suggestions"| Backend
    Backend -->|"HTTP — cache miss"| AIEngine
    AIEngine --> Redis
    AIEngine --> Qdrant
    Backend --> Redis

    style Frontend fill:#dbeafe,stroke:#2563eb
    style Backend fill:#fef3c7,stroke:#d97706
    style AIEngine fill:#d1fae5,stroke:#059669
    style Storage fill:#f3e8ff,stroke:#7c3aed
```

| Layer | Components | Chi tiết |
|-------|-----------|----------|
| **Frontend** | ChatWidget, TechnicalChat, Vercel AI SDK v6 | useChat + TextStreamChatTransport, localStorage (session_id, messages x20), SuggestionChips |
| **Backend** | ThrottlerGuard, PromptInjection Guard, RAGController | Rate limit: IP 5/min, Session 20/hr, Global 100/min |
| **AI Engine** | RAGEngine (Singleton), Routes | /api/chat, /api/chat/stream, /api/chat/suggestions |
| **Storage** | Redis, Qdrant Cloud | semantic:cache 30d, suggestions 24h, session 30min, cache 24h · Vectors 1024d Cosine + Text Index |

---

## RAG Pipeline chi tiết

Toàn bộ pipeline được chia thành **2 giai đoạn chính**: **Ingestion** (nạp tài liệu) và **Query** (truy vấn). Mỗi giai đoạn có nhiều bước tối ưu hóa.

---

### 1. Ingestion Pipeline — Từ PDF đến Vector

```mermaid
graph LR
    PDF["PDF Upload"]
    GDrive["Google Drive"]
    Parse["LlamaParse"]
    Chunk["Chunking"]
    Meta["MetadataExtractor"]
    Enrich["Contextual Enrichment"]
    Embed["Embedding"]
    Store[("Qdrant Cloud")]

    PDF --> Parse
    GDrive --> Parse
    Parse --> Chunk
    Chunk --> Meta
    Meta --> Enrich
    Enrich --> Embed
    Embed --> Store

    style Parse fill:#d1fae5,stroke:#059669
    style Enrich fill:#d1fae5,stroke:#059669
    style Store fill:#f3e8ff,stroke:#7c3aed
```

| Bước | Module | Chi tiết |
|------|--------|----------|
| **PDF Upload** | POST /api/ingest | Upload trực tiếp hoặc Google Drive auto-sync |
| **LlamaParse** | AI Parse → Markdown | Giữ bảng, heading, format nguyên vẹn. Đơn vị: PSI, bar, mm |
| **Chunking** | MarkdownNodeParser / SentenceSplitter | 1024 tokens, overlap 200. Markdown-aware nếu có bảng/heading |
| **MetadataExtractor** | DeepSeek LLM (T=0.0) | Extract: brand, product_type, pressure_class, size_range, certification... |
| **Contextual Enrichment** | DeepSeek LLM (T=0.0, 256 tokens) | Prepend document context vào mỗi chunk. Batch 5 concurrent |
| **Embedding** | Voyage AI voyage-3.5-lite | 1024 dimensions |
| **Qdrant Cloud** | Vector Store | HNSW index + Text payload index cho keyword search |

#### 1.1 Chunking — Chia nhỏ tài liệu

```mermaid
graph TD
    Doc["Markdown Document"]
    Check{"Có bảng/heading?"}
    MDP["MarkdownNodeParser"]
    SS["SentenceSplitter"]
    Chunks["Chunks — 1024 tokens, overlap 200"]

    Doc --> Check
    Check -->|YES| MDP
    Check -->|NO| SS
    MDP --> Chunks
    SS --> Chunks

    style Check fill:#fef3c7,stroke:#d97706
```

#### 1.2 Contextual Enrichment — Giàu hóa ngữ cảnh

Kỹ thuật **Contextual Retrieval** từ Anthropic — giải quyết vấn đề chunk mất ngữ cảnh.

```mermaid
graph TD
    subgraph Problem["VẤN ĐỀ"]
        Raw["Chunk gốc — thiếu ngữ cảnh"]
        Issue["Embedding không biết thuộc sản phẩm nào"]
        Raw --> Issue
    end

    subgraph Solution["GIẢI PHÁP — giảm ~49% lỗi retrieval"]
        FullDoc["Full Document — 6000 chars đầu"]
        ChunkIn["Chunk gốc"]
        LLM["DeepSeek LLM — T=0.0"]
        Enriched["Chunk + Context prefix"]
        FullDoc --> LLM
        ChunkIn --> LLM
        LLM --> Enriched
    end

    Problem -.->|"Giải quyết bằng"| Solution

    style Problem fill:#fee2e2,stroke:#dc2626
    style Solution fill:#d1fae5,stroke:#059669
```

**Trước và sau enrichment:**

| | Trước | Sau |
|---|-------|-----|
| **Chunk** | "Áp suất tối đa: 4150 PSI, Nhiệt độ: -46°C đến 593°C" | "[Context: Fisher HP Series control valve datasheet, Technical Specifications] Áp suất tối đa: 4150 PSI..." |
| **Embedding hiểu** | Thông số kỹ thuật chung chung | Thông số của Fisher HP control valve |
| **Search** | Có thể miss khi hỏi "Fisher HP pressure" | Tìm chính xác |

> **Lưu ý:** `original_text` lưu riêng trong metadata → citation hiển thị KHÔNG có `[Context: ...]`. Nếu LLM fail → dùng chunk gốc (graceful degradation).

---

### 2. Query Pipeline — 7 Phase tối ưu hóa

```mermaid
graph TD
    Q(["Câu hỏi"])

    subgraph P1["PHASE 1 — FAQ Pre-Filter"]
        FAQ_N["Normalize tiếng Việt"]
        FAQ_Check{"FAQ match?"}
        FAQ_Hit["Static response — confidence 100%"]
        FAQ_N --> FAQ_Check
        FAQ_Check -->|"HIT"| FAQ_Hit
    end

    subgraph P2["PHASE 2 — Semantic Cache"]
        SC_Embed["Embed → vector 1024-dim"]
        SC_Check{"Cosine ≥ 0.96?"}
        SC_Hit["Cached response"]
        SC_Embed --> SC_Check
        SC_Check -->|"HIT"| SC_Hit
    end

    subgraph P3["PHASE 3 — Smart Model Routing"]
        MR["Phân loại độ phức tạp"]
        MR_S["SIMPLE — 512 tokens"]
        MR_M["MEDIUM — 1024 tokens"]
        MR_C["COMPLEX — 2048 tokens"]
        MR --> MR_S
        MR --> MR_M
        MR --> MR_C
    end

    subgraph P4["PHASE 4 — Hybrid Retrieval"]
        VS["Vector Search — Qdrant ANN top_k=15"]
        KS["Keyword Search — Qdrant Full-text"]
        SF["Similarity Filter ≥ 0.3"]
        SW["Stop-word removal"]
        RRF["RRF Fusion — 70% vector, 30% keyword"]

        VS --> SF --> RRF
        KS --> SW --> RRF
    end

    subgraph P5["PHASE 5 — Cross-Encoder Reranking"]
        RE_In["15 candidates"]
        RE_Model["ms-marco-MiniLM-L-6-v2 — LOCAL"]
        RE_Out["Top 3 documents"]
        RE_In --> RE_Model --> RE_Out
    end

    subgraph P6["PHASE 6 — LLM Generation"]
        CC{"confidence ≥ 20%?"}
        FB["Fallback message"]
        DS["DeepSeek LLM — stream"]
        OAI["OpenAI gpt-4o-mini"]
        STATIC["Static fallback"]
        CC -->|"NO"| FB
        CC -->|"YES"| DS
        DS -->|"fail"| OAI
        OAI -->|"fail"| STATIC
    end

    subgraph P7["PHASE 7 — Post-Processing"]
        CIT["Extract Citations"]
        CONF["Calculate Confidence"]
        CACHE["Cache — Semantic 30d, NestJS 24h"]
        CIT --> CONF --> CACHE
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

| Phase | Module | Impact | Chi tiết |
|-------|--------|--------|----------|
| **1. FAQ Pre-Filter** | FAQPreFilter | ~50% LLM calls skip | ~50 entries, Vietnamese diacritic normalization, exact + keyword match |
| **2. Semantic Cache** | SemanticCache | +30% cache hit | Cosine ≥ 0.96 (tránh false positive), Redis 30d, LRU 1000 entries |
| **3. Model Routing** | SmartModelRouter | ~40% giảm chi phí LLM | SIMPLE ≤8 words → 512 tokens, COMPLEX ≥2 keywords → 2048 tokens |
| **4. Hybrid Retrieval** | VectorIndexRetriever + QdrantKeywordRetriever | Better recall | RRF Fusion: `score = 0.7/(k+rank_v) + 0.3/(k+rank_k)` |
| **5. Reranking** | ms-marco-MiniLM-L-6-v2 | thêm ~18% giảm lỗi | Cross-encoder LOCAL, ~80MB, $0 cost. 15 → 3 results |
| **6. LLM Generation** | DeepSeek → OpenAI fallback | ~500ms first token | astream_complete() token-by-token, SSE streaming |
| **7. Post-Processing** | Citations + Confidence + Cache | | Weighted avg cosine scores, cap 95%, deduplicate by file+page |

**Tại sao Hybrid Search?**
- **Vector**: tốt cho ngữ nghĩa ("van chịu áp lực cao" → Fisher HP)
- **Keyword**: tốt cho exact match ("DVC6200" → đúng model number)

**Tại sao threshold 0.96?**
- "van điều khiển" vs "van an toàn" ≈ 0.93-0.95 → 0.92 gây false positive cache hit

---

### 3. Smart Suggestions Pipeline — Gợi ý follow-up

```mermaid
graph TD
    Trigger(["Stream xong — status = ready"])
    Req["POST /api/chat/suggestions"]

    FB_Check{"Fallback answer?"}
    FB_Return["return empty list"]

    Cache_Check{"Redis cache hit?"}
    Cache_Hit["return cached suggestions"]

    LLM["DeepSeek LLM — T=0.7, 200 tokens"]
    Validate["Validate: max 3, dưới 80 ký tự"]
    Save["Cache to Redis — 24h"]
    Chips(["SuggestionChips — 3 nút bấm"])

    Trigger --> Req --> FB_Check
    FB_Check -->|"YES"| FB_Return
    FB_Check -->|"NO"| Cache_Check
    Cache_Check -->|"HIT"| Cache_Hit --> Chips
    Cache_Check -->|"MISS"| LLM --> Validate --> Save --> Chips

    style Trigger fill:#dbeafe,stroke:#2563eb
    style LLM fill:#d1fae5,stroke:#059669
    style Chips fill:#fef3c7,stroke:#d97706
```

| Chi tiết | Giá trị |
|----------|---------|
| **Endpoint** | POST /api/chat/suggestions (async, tách biệt chat flow) |
| **Prompt** | Few-shot: 1 câu đi sâu, 1 câu so sánh, 1 câu ứng dụng thực tế |
| **Fallback detection** | Skip nếu answer chứa "Xin lỗi, tôi chưa tìm thấy" / "I apologize" |
| **Error handling** | NEVER throws → return `[]` → UI ẩn suggestions |
| **Chi phí** | ~$0.00004/call |

---

## Singleton Pattern — Module Registry

Tất cả core module dùng Singleton pattern để tránh re-initialization (~500ms/request).

```mermaid
graph LR
    subgraph Registry["MODULE REGISTRY — Singletons"]
        F1["get_rag_engine()"] --> M1["RAGEngine"]
        F2["get_faq_filter()"] --> M2["FAQPreFilter"]
        F3["get_semantic_cache()"] --> M3["SemanticCache"]
        F4["get_model_router()"] --> M4["SmartModelRouter"]
        F5["get_suggestion_generator()"] --> M5["SuggestionGenerator"]
        F6["get_redis_client()"] --> M6["RedisClient"]
    end

    style Registry fill:#f8fafc,stroke:#64748b
```

| Factory | Class | Nội dung |
|---------|-------|----------|
| `get_rag_engine()` | RAGEngine | Qdrant clients, VectorStoreIndex, Reranker (lazy), KeywordRetriever (lazy) |
| `get_faq_filter()` | FAQPreFilter | ~50 FAQ entries bilingual, Vietnamese normalization |
| `get_semantic_cache()` | SemanticCache | In-memory + Redis backup, 1000 max entries LRU, Cosine ≥ 0.96 |
| `get_model_router()` | SmartModelRouter | Complexity classification, Token limit routing |
| `get_suggestion_generator()` | SuggestionGenerator | DeepSeek T=0.7, Redis cache 24h |
| `get_redis_client()` | RedisClient | Async aioredis, Auto-reconnect |

---

## External Services & Dependencies

```mermaid
graph TD
    AI["AI ENGINE — FastAPI"]

    DS["DeepSeek API"]
    VA["Voyage AI API"]
    RD[("Redis")]
    QD[("Qdrant Cloud")]
    LC["LlamaCloud"]
    GD["Google Drive API"]

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

| Service | Mục đích | Fallback |
|---------|---------|----------|
| **DeepSeek API** | Chat LLM, Enrichment, Suggestion, Metadata | OpenAI gpt-4o-mini |
| **Voyage AI API** | Embedding 1024 dims (voyage-3.5-lite) | OpenAI text-embedding-3-small |
| **Redis** | Semantic cache 30d, Suggestion 24h, Session 30min, Response 24h | In-memory only |
| **Qdrant Cloud** | Vector Store (ANN) + BM25 Full-text Index | N/A (required) |
| **LlamaCloud** | PDF Parse via LlamaParse, 1000 pages/day free | N/A |
| **Google Drive API** | Auto-sync PDFs, incremental by modified_time | Optional |

---

## Tổng kết: Pipeline tối ưu hóa chi phí

```mermaid
graph LR
    B["TRƯỚC: ~$400/tháng"]
    L1["FAQ Filter: -50% LLM"]
    L2["Semantic Cache: +30% hit"]
    L3["Model Routing: -40% tokens"]
    L4["Voyage AI: -60% embedding"]
    L5["Local Reranker: $0"]
    L6["Suggestions: $0.00004/call"]
    A["SAU: ~$140/tháng"]

    B --> L1 --> L2 --> L3 --> L4 --> L5 --> L6 --> A

    style B fill:#fee2e2,stroke:#dc2626
    style A fill:#d1fae5,stroke:#059669
```

> **10,000 queries/ngày — tiết kiệm ~65%**: FAQ skip 5,000 → Semantic cache 1,500 → Model routing giảm 40% tokens → Voyage AI embedding 60% rẻ hơn → Reranker chạy local $0 → Suggestions ~$0.00004/call

---

## Retrieval Quality — Các cải tiến đã triển khai

```mermaid
graph TD
    BL["Baseline — 100% retrieval errors"]
    CE["+ Contextual Enrichment: GIẢM 49%"]
    RR["+ Cross-Encoder Reranking: THÊM 18%"]
    HS["+ Hybrid Search BM25: exact match"]
    SC["+ Semantic Cache: 0.92 → 0.96"]
    TOTAL["Tổng: ~67% giảm lỗi"]

    BL --> CE --> RR --> HS --> SC --> TOTAL

    style BL fill:#fee2e2,stroke:#dc2626
    style CE fill:#d1fae5,stroke:#059669
    style RR fill:#d1fae5,stroke:#059669
    style HS fill:#d1fae5,stroke:#059669
    style SC fill:#fef3c7,stroke:#d97706
    style TOTAL fill:#dbeafe,stroke:#2563eb
```

| Cải tiến | Impact | Chi tiết |
|----------|--------|----------|
| **Contextual Enrichment** | -49% lỗi retrieval | Chunk biết thuộc tài liệu nào, sản phẩm nào |
| **Cross-Encoder Reranking** | thêm -18% lỗi | ms-marco-MiniLM-L-6-v2, local, $0. Top 15 → Top 3 |
| **Hybrid Search / BM25** | cải thiện exact match | Model numbers (DVC6200, MR95) tìm được chính xác |
| **Semantic Cache Tuning** | giảm false positive | "van điều khiển" ≠ "van an toàn" (sim ≈ 0.93-0.95) |

---

## Data Model — Qdrant Vector Entry

```mermaid
graph TD
    subgraph Point["QDRANT POINT"]
        ID["id: uuid-v4"]
        VEC["vector: 1024 dimensions"]

        subgraph Payload["Payload"]
            NC["_node_content — searchable"]
            OT["original_text — for display"]

            subgraph DocMeta["Document Metadata"]
                FN["file_name"]
                PL["page_label"]
                DT["doc_type"]
            end

            subgraph ExtMeta["Extracted Metadata"]
                BR["brand · product_series · product_type"]
                PC["pressure_class · size_range · connection_type"]
                BM["body_material · temperature_range"]
                AP["application · certification"]
            end
        end

        subgraph Indexes["Indexes"]
            VI["Vector — HNSW, Cosine"]
            TI["Text — _node_content, word tokenizer"]
        end
    end

    style Point fill:#f8fafc,stroke:#64748b
    style Payload fill:#f3e8ff,stroke:#7c3aed
    style DocMeta fill:#dbeafe,stroke:#2563eb
    style ExtMeta fill:#d1fae5,stroke:#059669
    style Indexes fill:#fef3c7,stroke:#d97706
```

**Ví dụ payload đầy đủ:**

| Field | Value |
|-------|-------|
| `_node_content` | `[Context: Fisher HP Series...] Áp suất tối đa: 4150 PSI...` |
| `original_text` | `Áp suất làm việc tối đa: 4150 PSI...` |
| `file_name` | `Fisher_HP_Datasheet.pdf` |
| `page_label` | `3` |
| `doc_type` | `datasheet` |
| `brand` | `Fisher` |
| `product_type` | `Control Valve` |
| `pressure_class` | `CL2500` |
| `certification` | `API 6D, API 607` |

---

## Streaming Architecture — Token-by-token

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant BE as NestJS
    participant AI as AI Engine

    FE->>BE: POST /api/rag/chat/stream
    BE->>AI: POST /api/chat/stream

    Note over AI: Retrieval Phase 1-5 (~200-500ms)
    Note over AI: astream_complete()

    AI-->>BE: SSE chunk: Van
    BE-->>FE: SSE chunk: Van
    AI-->>BE: SSE chunk: Fisher
    BE-->>FE: SSE chunk: Fisher
    AI-->>BE: SSE chunk: HP...
    BE-->>FE: SSE chunk: HP...
    AI-->>BE: SSE done + metadata
    BE-->>FE: SSE done + confidence + citations

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
    Q(["Query"])
    DS["DeepSeek LLM — primary"]
    OAI["OpenAI gpt-4o-mini — fallback"]
    STATIC["Static fallback message"]
    OK1(["Return answer"])
    OK2(["Return answer"])

    Q --> DS
    DS -->|"success"| OK1
    DS -->|"fail"| OAI
    OAI -->|"success"| OK2
    OAI -->|"fail"| STATIC

    style DS fill:#d1fae5,stroke:#059669
    style OAI fill:#fef3c7,stroke:#d97706
    style STATIC fill:#fee2e2,stroke:#dc2626
```

| Fallback | Trigger | Response |
|----------|---------|----------|
| **DeepSeek → OpenAI** | API error, timeout, rate limit | Chuyển sang gpt-4o-mini |
| **Programmatic** | confidence < 20% OR sources = 0 | Static message + contact info |
| **Static message** | Cả 2 LLM fail | VI: "Xin lỗi, tôi chưa tìm thấy..." / EN: "I apologize..." |

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
