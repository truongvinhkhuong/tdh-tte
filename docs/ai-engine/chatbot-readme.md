# TTE Chatbot — Tài liệu kỹ thuật đầy đủ

> Chatbot hỏi-đáp kỹ thuật cho **Toàn Thắng Engineering (TTE)** — hỗ trợ khách hàng tra cứu thông tin thiết bị công nghiệp Dầu khí, Năng lượng và Hóa chất bằng công nghệ **RAG (Retrieval-Augmented Generation)**.

---

## Mục lục

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc tổng thể](#2-kiến-trúc-tổng-thể)
3. [Frontend Layer — Next.js](#3-frontend-layer--nextjs)
4. [Backend Layer — NestJS](#4-backend-layer--nestjs)
5. [AI Engine Layer — FastAPI](#5-ai-engine-layer--fastapi)
6. [Storage Layer](#6-storage-layer)
7. [Luồng xử lý dữ liệu](#7-luồng-xử-lý-dữ-liệu)
8. [Các tầng tối ưu hóa](#8-các-tầng-tối-ưu-hóa)
9. [Bảo mật](#9-bảo-mật)
10. [API Reference](#10-api-reference)
11. [Cấu hình môi trường](#11-cấu-hình-môi-trường)
12. [Hướng dẫn triển khai](#12-hướng-dẫn-triển-khai)
13. [Giám sát & Vận hành](#13-giám-sát--vận-hành)
14. [Quản lý tài liệu (Knowledge Base)](#14-quản-lý-tài-liệu-knowledge-base)
15. [Lộ trình cải tiến](#15-lộ-trình-cải-tiến)

---

## 1. Tổng quan hệ thống

### Mục tiêu

TTE Chatbot được xây dựng để:

- Trả lời câu hỏi của khách hàng về thiết bị công nghiệp (van điều khiển, bơm, thiết bị đo lường)
- Cung cấp thông tin kỹ thuật chính xác từ tài liệu nội bộ (datasheet, catalog, manual)
- Hỗ trợ song ngữ **Tiếng Việt và Tiếng Anh**
- Giảm tải cho đội ngũ tư vấn kỹ thuật

### Công nghệ cốt lõi


| Thành phần   | Công nghệ                   | Mô tả                                   |
| ------------ | --------------------------- | --------------------------------------- |
| Frontend     | Next.js 15 (TypeScript)     | Giao diện người dùng                    |
| Backend      | NestJS (TypeScript)         | API Gateway, bảo mật, caching           |
| AI Engine    | FastAPI (Python 3.11)       | Xử lý RAG, gọi LLM                      |
| LLM chính    | DeepSeek (deepseek-chat)    | Sinh câu trả lời                        |
| LLM dự phòng | OpenAI (gpt-4o-mini)        | Fallback khi DeepSeek lỗi               |
| Embedding    | Voyage AI (voyage-3.5-lite) | Vector hóa câu hỏi & tài liệu           |
| Vector Store | Qdrant Cloud                | Lưu trữ và tìm kiếm vector              |
| PDF Parser   | LlamaParse                  | Phân tích tài liệu kỹ thuật             |
| Cache        | Redis                       | Session, response cache, semantic cache |


### Số liệu hiệu quả (ước tính ở 10,000 queries/ngày)


| Chỉ số                 | Trước tối ưu | Sau tối ưu | Cải thiện |
| ---------------------- | ------------ | ---------- | --------- |
| LLM calls/ngày         | 10,000       | ~4,500     | **-55%**  |
| Chi phí LLM/tháng      | ~$400        | ~$140      | **-65%**  |
| Thời gian phản hồi P50 | ~3,000ms     | ~800ms     | **-73%**  |
| Thời gian phản hồi P95 | ~8,000ms     | ~2,500ms   | **-69%**  |


---

## 2. Kiến trúc tổng thể

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js)                              │
│  ┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────┐      │
│  │   ChatWidget    │───▶│   TechnicalChat     │───▶│   localStorage   │      │
│  │  (Floating UI)  │    │  (Messages, Input)  │    │ (Session, Msgs)  │      │
│  └─────────────────┘    └──────────┬──────────┘    └──────────────────┘      │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │ POST /api/rag/chat
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                             BACKEND (NestJS)                                 │
│  ┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────┐      │
│  │ ThrottlerGuard  │───▶│ PromptInjection     │───▶│  RAGController   │      │
│  │ (Rate Limiting) │    │     Guard           │    │                  │      │
│  └─────────────────┘    └─────────────────────┘    └────────┬─────────┘      │
│                                                             │                │
│  ┌─────────────────┐    ┌─────────────────────┐             │                │
│  │ SessionService  │◀───│   CacheService      │◀────────────┘                │
│  │    (Redis)      │    │     (Redis)         │                              │
│  └────────┬────────┘    └──────────┬──────────┘                              │
└───────────┼─────────────────────────┼────────────────────────────────────────┘
            │                         │ HTTP (if cache miss)
            ▼                         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            AI ENGINE (FastAPI)                               │
│  ┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────┐      │
│  │  /api/chat      │───▶│    RAGEngine        │───▶│  DeepSeek LLM    │      │
│  │   (Routes)      │    │   (Singleton)       │    │  (Chat Model)    │      │
│  └─────────────────┘    └──────────┬──────────┘    └──────────────────┘      │
│                                    │               ┌──────────────────┐      │
│         ┌──────────────────────────┼──────────────▶│ OpenAI Fallback  │      │
│         │                ┌─────────▼──────────┐    │  (gpt-4o-mini)   │      │
│         │                │  FAQ Pre-filter    │    └──────────────────┘      │
│         │                │  (7 câu hỏi phổ   │                              │
│         │                │   biến, skip LLM)  │                              │
│         │                └─────────┬──────────┘                              │
│         │                          │                                          │
│         │                ┌─────────▼──────────┐                              │
│         │                │  Semantic Cache    │                              │
│         │                │  (cosine ≥ 0.96)   │                              │
│         │                └─────────┬──────────┘                              │
│         │                          │                                          │
│         │                ┌─────────▼──────────┐                              │
│         │                │  Smart Model Router │                              │
│         │                │  (Simple/Med/Cplx) │                              │
│         │                └─────────┬──────────┘                              │
│         │                          │                                          │
│         │                ┌─────────▼──────────┐                              │
│         │                │ Voyage AI Embeddings│                              │
│         │                │  (voyage-3.5-lite)  │                              │
│         │                └─────────┬──────────┘                              │
└─────────┼────────────────────────────────────────────────────────────────────┘
          │                          │
          ▼                          ▼
┌─────────────────────┐  ┌───────────────────────────────┐
│         Redis        │  │        Qdrant Cloud            │
│  • Session (30min)  │  │  • Vector embeddings           │
│  • Response (24h)   │  │  • Document chunks             │
│  • Semantic (30d)   │  │  • Collection: tte_knowledge_  │
└─────────────────────┘  │                     base       │
                         └───────────────────────────────┘
```

### Sơ đồ dịch vụ Docker


| Service         | Port | Image         |
| --------------- | ---- | ------------- |
| `tte_web`       | 4000 | Next.js 15    |
| `tte_cms`       | 4001 | Payload CMS   |
| `tte_backend`   | 4002 | NestJS        |
| `tte_ai_engine` | 4003 | FastAPI       |
| `tte_postgres`  | 5434 | PostgreSQL 16 |
| `tte_redis`     | 6381 | Redis 7       |


---

## 3. Frontend Layer — Next.js

### Files

| File | Vai trò |
| --- | --- |
| `apps/web/components/chat/chat-widget.tsx` | Floating button, cửa sổ chat, fullscreen toggle |
| `apps/web/components/chat/technical-chat.tsx` | Chat UI, streaming với Vercel AI SDK `useChat` |
| `apps/web/app/api/rag/chat/route.ts` | Next.js proxy route (non-streaming fallback) |
| `apps/web/app/api/rag/chat/stream/route.ts` | Next.js streaming route (SSE → text stream transform) |

### ChatWidget

Component ngoài cùng — render nút chat nổi góc phải màn hình. Kiểm soát việc mở/đóng cửa sổ chat và chuyển sang chế độ fullscreen.

**Trạng thái quản lý:**

```typescript
const [isOpen, setIsOpen]           = useState(false);   // Cửa sổ chat mở/đóng
const [isFullscreen, setIsFullscreen] = useState(false); // Chế độ toàn màn hình
```

### TechnicalChat

Component chính — sử dụng **Vercel AI SDK v6** (`useChat` hook) cho streaming UI.

**Packages:** `ai`, `@ai-sdk/react` (MIT license, miễn phí, không cần Vercel hosting)

**Streaming Architecture:**

```typescript
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';

const { messages, sendMessage, stop, status, setMessages } = useChat({
    transport: new TextStreamChatTransport({ api: '/api/rag/chat/stream' }),
});

// status: 'ready' | 'submitted' | 'streaming' | 'error'
// sendMessage({ text: question }) — gửi câu hỏi
// stop() — dừng streaming giữa chừng
```

**Session management:**

- `sessionId` được generate và lưu trong `localStorage` với key `tte_chat_session_id`
- UUID v4, tồn tại vĩnh viễn trên browser (không xóa theo tab)

**Message persistence:**

- Tối đa **20 tin nhắn** lưu trong `localStorage` với key `tte_chat_messages`
- Messages dùng AI SDK v6 `UIMessage` format (parts array thay vì content string)
- Giữ nguyên khi reload trang

**Rendering:**

- `ReactMarkdown` + `remark-gfm` render markdown real-time khi streaming
- Text hiển thị từng token (giống ChatGPT)
- Auto-scroll xuống tin nhắn mới nhất
- Stop button (đỏ) hiện khi đang streaming

---

## 4. Backend Layer — NestJS

### Files


| File                                                        | Vai trò                         |
| ----------------------------------------------------------- | ------------------------------- |
| `apps/backend/src/rag/rag.controller.ts`                    | API endpoints, input validation |
| `apps/backend/src/rag/rag.service.ts`                       | HTTP proxy đến AI Engine        |
| `apps/backend/src/rag/chatbot-session.service.ts`           | Quản lý session Redis           |
| `apps/backend/src/rag/chatbot-cache.service.ts`             | Response caching Redis          |
| `apps/backend/src/rag/rag.module.ts`                        | NestJS module definition        |
| `apps/backend/src/common/guards/chatbot-throttler.guard.ts` | Rate limiting 3 tầng            |
| `apps/backend/src/common/guards/prompt-injection.guard.ts`  | Lọc prompt injection            |


### RAGController

**Endpoint chính:**

```
POST /api/rag/chat
```

**Guards áp dụng (theo thứ tự):**

1. `ChatbotThrottlerGuard` — kiểm tra rate limit
2. `PromptInjectionGuard` — kiểm tra injection patterns

**Quy trình xử lý trong `chat()` method:**

```
1. Validate question (bắt buộc, max 500 ký tự)
2. Check CacheService → nếu cache hit → trả về ngay
3. Lấy conversation history từ SessionService (3 turns gần nhất)
4. Gọi RAGService.chat() → AI Engine
5. Lưu user message + assistant message vào SessionService
6. Lưu response vào CacheService
7. Trả về response cho client
```

**Endpoint streaming (SSE):**

```
POST /api/rag/chat/stream
```

Proxy request đến AI Engine `/api/chat/stream`, trả về URL streaming cho frontend.

**Endpoint quản lý tài liệu:**

```
POST /api/rag/ingest          # Upload PDF (max 50MB)
POST /api/rag/gdrive/sync     # Đồng bộ Google Drive
GET  /api/rag/gdrive/status   # Trạng thái Google Drive
GET  /api/rag/health          # Health check
```

### ChatbotThrottlerGuard — Rate Limiting 3 Tầng

```typescript
// Tầng 1: Per-IP (chống DDoS)
throttle:ip:{ip}         → 5 requests / 60 giây

// Tầng 2: Per-Session (chống token abuse)
throttle:session:{id}    → 20 requests / 3600 giây (1 giờ)

// Tầng 3: Global (bảo vệ AI Engine)
throttle:global:chat     → 100 requests / 60 giây
```

- Sử dụng Redis `INCR` + `EXPIRE` (atomic)
- Khi Redis lỗi → **allow request** (fail-open), log warning
- Trả về header `retryAfter` (giây) khi bị chặn
- HTTP status: `429 Too Many Requests`

### PromptInjectionGuard

Phát hiện và chặn các tấn công prompt injection:


| Nhóm                     | Pattern ví dụ                        |
| ------------------------ | ------------------------------------ |
| Instruction override     | `"ignore all previous instructions"` |
| System prompt extraction | `"reveal your system prompt"`        |
| Role manipulation        | `"you are now a different AI"`       |
| Jailbreak                | `"jailbreak"`, `"DAN mode"`          |
| Developer mode           | `"debug mode"`, `"admin mode"`       |


**Whitelist** — các câu hỏi kỹ thuật hợp lệ không bị chặn nhầm:

- `"technical advisor/consultant/specialist"`
- `"thông số kỹ thuật"`
- `"van fisher"`, `"pressure rating"`

### ChatbotSessionService

Quản lý lịch sử hội thoại theo session trong Redis.

**Redis key pattern:** `chat:session:{sessionId}`

```typescript
interface ChatSession {
  sessionId: string;
  history: ChatMessage[];   // Tối đa 6 messages (3 turns)
  createdAt: number;
  lastActiveAt: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
```

**Cấu hình:**

- TTL: `CHATBOT_SESSION_TTL` (mặc định **1800s = 30 phút**)
- Mỗi lần có tin nhắn mới → TTL được làm mới (sliding window)
- Giới hạn lịch sử: `CHATBOT_MAX_HISTORY_TURNS` (mặc định **3 turns = 6 messages**)

### ChatbotCacheService

Cache response theo nội dung câu hỏi để tránh gọi LLM lại.

**Redis key pattern:** `chat:cache:{sha256_hash[:16]}`

**Chuẩn hóa câu hỏi trước khi hash:**

```typescript
question
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .replace(/[?!.,;:'"]/g, '')
  .trim()
```

Ví dụ: `"Van Fisher là gì ?"` và `"van fisher là gì"` → cùng cache key.

**Cấu hình:**

- TTL: `CHATBOT_CACHE_TTL` (mặc định **86400s = 24 giờ**)
- Enable/disable: `CHATBOT_CACHE_ENABLED` (mặc định `true`)

### RAGService

HTTP client gọi sang AI Engine với timeout 2 phút.

```typescript
// Gọi AI Engine
POST http://ai-engine:4003/api/chat
{
  question: string,
  language: 'vi' | 'en',
  conversation_id?: string
}

// Response
{
  answer: string,
  citations: Citation[],
  confidence: number,
  sources_count: number
}
```

---

## 5. AI Engine Layer — FastAPI

### Files


| File                                                  | Vai trò                                                  |
| ----------------------------------------------------- | -------------------------------------------------------- |
| `apps/ai-engine/src/main.py`                          | FastAPI app, CORS, lifespan hooks                        |
| `apps/ai-engine/src/api/routes.py`                    | Tất cả API endpoints + MetadataExtractor integration     |
| `apps/ai-engine/src/api/models.py`                    | Pydantic models request/response                         |
| `apps/ai-engine/src/core/rag_engine.py`               | Xử lý RAG chính (hybrid search + reranking + true LLM streaming)              |
| `apps/ai-engine/src/core/faq_filter.py`               | FAQ pre-filter                                           |
| `apps/ai-engine/src/core/semantic_cache.py`           | Semantic caching                                         |
| `apps/ai-engine/src/core/model_router.py`             | Smart model routing                                      |
| `apps/ai-engine/src/core/redis_client.py`             | Async Redis client                                       |
| `apps/ai-engine/src/ingestion/pdf_processor.py`       | Xử lý PDF với LlamaParse + contextual enrichment         |
| `apps/ai-engine/src/ingestion/contextual_enricher.py` | Contextual Retrieval — sinh context cho chunks           |
| `apps/ai-engine/src/ingestion/gdrive_sync.py`         | Đồng bộ Google Drive                                     |
| `apps/ai-engine/src/ingestion/metadata_extractor.py`  | Trích xuất metadata kỹ thuật (brand, product_type, etc.) |
| `apps/ai-engine/src/retrieval/keyword_retriever.py`   | Qdrant keyword search + RRF fusion                       |
| `apps/ai-engine/src/retrieval/auto_retriever.py`      | Auto-retriever với metadata filtering                    |


### Startup Sequence

Khi khởi động (`lifespan` hook trong `main.py`):

```
1. Kết nối Redis (async)
2. Load Semantic Cache từ Redis → in-memory
3. RAGEngine singleton được khởi tạo lần đầu khi có request đến
```

### RAGEngine

**Singleton Pattern:** Chỉ khởi tạo một lần duy nhất trong `routes.py`, tránh re-init mỗi request (tiết kiệm ~500ms/request).

#### Khởi tạo (`__init__`)

```python
def __init__(self, settings: Settings):
    self._setup_llm()          # Cấu hình DeepSeek + Voyage AI embedding
    self._setup_vector_store() # Kết nối Qdrant Cloud
```

#### Setup LLM

```python
# Primary LLM: DeepSeek via OpenAI-compatible API
LlamaSettings.llm = OpenAILike(
    model="deepseek-chat",
    api_base="https://api.deepseek.com/v1",
    temperature=0.1,
    max_tokens=4096,
    context_window=32000,  # DeepSeek hỗ trợ 64k, dùng 32k để an toàn
)

# Embedding: Voyage AI (rẻ hơn OpenAI 60%)
LlamaSettings.embed_model = VoyageEmbedding(
    model_name="voyage-3.5-lite",
    voyage_api_key=settings.voyageai_api_key,
)
```

#### Setup Vector Store

```python
# Kết nối Qdrant Cloud với cả sync và async client
self.vector_store = QdrantVectorStore(
    client=qdrant_client,           # Sync (quản lý collection)
    aclient=async_qdrant_client,    # Async (query operations)
    collection_name="tte_knowledge_base",
)

# Tạo index từ vector store hiện có
self.index = VectorStoreIndex.from_vector_store(vector_store)
```

#### Query Processing Pipeline

Phương thức `query()` thực hiện qua 8 bước:

```
Câu hỏi đến
    │
    ▼ Bước 1: FAQ Pre-filter
    ├── HIT  → Trả về ngay (0ms LLM call)
    │
    ▼ Bước 2: Semantic Cache
    ├── HIT  → Trả về ngay (0ms LLM call)
    │
    ▼ Bước 3: Smart Model Router
    │          → Xác định độ phức tạp → max_tokens
    │
    ▼ Bước 4: Vector Search (Qdrant)
    │          → Voyage AI embed câu hỏi → cosine search (top_k=15)
    │          → Similarity filter ≥ 0.3 (trên cosine scores)
    │
    ▼ Bước 5: Hybrid Search (Keyword + RRF Fusion)
    │          → Qdrant full-text search cho keyword matching
    │          → Reciprocal Rank Fusion merge vector + keyword results
    │
    ▼ Bước 6: Cross-Encoder Reranking
    │          → ms-marco-MiniLM-L-6-v2 rerank → top_n=3
    │          → Restore cosine scores gốc cho confidence calculation
    │
    ▼ Bước 7: Generation (LLM)
    │          → Build prompt (dùng original_text, không có context prefix)
    │          → Gọi DeepSeek
    │          ├── LỖI → fallback sang OpenAI gpt-4o-mini
    │
    ▼ Bước 8: Post-processing
    │          → Tính confidence score (weighted average cosine scores)
    │          ├── confidence < 20% hoặc 0 sources → fallback response
    │          → Extract citations (dùng original_text cho preview)
    │          → Lưu vào Semantic Cache
    │
    ▼ Trả về response
```

#### Retrieval Configuration

```python
# Bước 4: Vector Search
retriever = VectorIndexRetriever(
    index=self.index,
    similarity_top_k=15,   # Wider recall cho reranking
)
similarity_filter = SimilarityPostprocessor(
    similarity_cutoff=0.3,   # Áp dụng TRƯỚC fusion (trên cosine scores 0-1)
)

# Bước 5: Keyword Search + Fusion
keyword_retriever = QdrantKeywordRetriever(client, collection)
fused_nodes = fuse_results(vector_nodes, keyword_nodes, vector_weight=0.7)

# Bước 6: Reranking
reranker = SentenceTransformerRerank(
    model="cross-encoder/ms-marco-MiniLM-L-6-v2",
    top_n=3,   # Giữ 3 chunks tốt nhất
)
```

**Lưu ý quan trọng:** Similarity filter được áp dụng TRƯỚC fusion vì cosine scores (0-1) và RRF scores (~0.01) có scale khác nhau. Cosine scores gốc được restore sau reranking để `_calculate_confidence()` tính đúng.

#### Prompt

**Tiếng Việt:**

```
Bạn là Chuyên gia Tư vấn Kỹ thuật của TTE.
TUYỆT ĐỐI KHÔNG dùng: "Dựa trên thông tin...", "Theo tài liệu..."
Xưng hô: xưng "TTE"/"chúng tôi", gọi người hỏi là "bạn"/"quý khách"
Format: Markdown table cho thông số, in đậm điểm chính, giữ đơn vị PSI/bar/mm
```

**Tiếng Anh:**

```
You are a Technical Consultant for TTE.
DO NOT use phrases like "Based on the provided text..."
Persona: Refer to "TTE"/"we", address user as "you"
Format: Markdown tables for specs, bold key points, keep PSI/bar/mm units
```

#### Confidence Score

Tính dựa trên weighted average của relevance scores các source nodes:

```python
weights = [1.0 / (i + 1) for i in range(len(scores))]  # Ưu tiên top results
avg_score = weighted_sum / weight_total
confidence = min(avg_score * 100, 95.0)   # Cap ở 95%
```

- `confidence < 20%` → trả về fallback response với thông tin liên hệ TTE
- `sources_count == 0` → trả về fallback response

#### Fallback Response (tiếng Việt)

```
Xin lỗi, tôi chưa tìm thấy thông tin này trong tài liệu kỹ thuật hiện có.
Để được hỗ trợ nhanh nhất, vui lòng liên hệ:

📞 Điện thoại: (84-254) 3522219
📧 Email: tts@toanthang.vn

Đội ngũ kỹ thuật TTE sẽ phản hồi trong thời gian sớm nhất!
```

---

## 6. Storage Layer

### Redis

Redis phục vụ 3 mục đích độc lập:


| Purpose         | Key Pattern                | TTL     | Owner           |
| --------------- | -------------------------- | ------- | --------------- |
| Rate limiting   | `throttle:ip:{ip}`         | 60s     | Backend Guard   |
| Rate limiting   | `throttle:session:{id}`    | 3600s   | Backend Guard   |
| Rate limiting   | `throttle:global:chat`     | 60s     | Backend Guard   |
| Session history | `chat:session:{sessionId}` | 1800s   | Session Service |
| Response cache  | `chat:cache:{hash}`        | 86400s  | Cache Service   |
| Semantic cache  | `semantic:cache:{md5}`     | 30 ngày | AI Engine       |


### Qdrant Cloud

Vector database lưu trữ toàn bộ kiến thức kỹ thuật.

**Collection:** `tte_knowledge_base`

**Cấu hình vector:**

```python
vectors_config = models.VectorParams(
    size=1024,                    # Voyage AI voyage-3.5-lite dimensions
    distance=models.Distance.COSINE,
)
```

**Metadata fields mỗi chunk:**


| Field            | Kiểu   | Mô tả                                                       |
| ---------------- | ------ | ----------------------------------------------------------- |
| `file_name`      | string | Tên file PDF gốc                                            |
| `file_path`      | string | Đường dẫn file                                              |
| `page_number`    | int    | Số trang                                                    |
| `total_pages`    | int    | Tổng số trang                                               |
| `doc_type`       | string | Loại tài liệu (xem bên dưới)                                |
| `original_text`  | string | Text gốc trước contextual enrichment (cho citation display) |
| `has_context`    | bool   | Chunk đã được enriched hay chưa                             |
| `brand`          | string | Brand name (Fisher, Bettis, etc.) — từ MetadataExtractor    |
| `product_type`   | string | Loại sản phẩm (Control Valve, Actuator, etc.)               |
| `pressure_class` | list   | Pressure classes (CL150, CL300, etc.)                       |


**Document types được nhận diện tự động:**


| `doc_type`    | Keywords trong filename               |
| ------------- | ------------------------------------- |
| `datasheet`   | datasheet, data sheet, spec           |
| `manual`      | manual, guide, instruction, operation |
| `catalog`     | catalog, catalogue, brochure          |
| `standard`    | iso, astm, api, asme, ansi, din       |
| `certificate` | certificate, cert, approval           |
| `drawing`     | drawing, dwg, diagram                 |
| `general`     | (mặc định)                            |


---

## 7. Luồng xử lý dữ liệu

### 7.1 Chat Request Flow (đầy đủ)

```
[1] Người dùng gõ câu hỏi trong TechnicalChat
     ↓
[2] Frontend POST /api/rag/chat
    Body: { question, language, sessionId, conversationId? }
     ↓
[3] NestJS: ChatbotThrottlerGuard
    → Check throttle:ip:{ip} (Redis INCR)
    → Check throttle:session:{id} (Redis INCR)
    → Check throttle:global:chat (Redis INCR)
    → Nếu vượt → HTTP 429, retryAfter
     ↓
[4] NestJS: PromptInjectionGuard
    → Scan 15+ injection patterns
    → Check whitelist
    → Nếu phát hiện injection → HTTP 400
     ↓
[5] NestJS: RAGController.chat()
    → Validate question length (max 500)
     ↓
[6] ChatbotCacheService.getCachedResponse()
    → Normalize question → SHA256 hash
    → Redis GET chat:cache:{hash}
    → HIT: trả về cached response → DONE
     ↓
[7] ChatbotSessionService.getRecentHistory()
    → Redis GET chat:session:{sessionId}
    → Lấy 3 turns gần nhất
     ↓
[8] RAGService.chat() → HTTP POST ai-engine:4003/api/chat
    → Timeout: 2 phút
     ↓
[9] AI Engine: FAQPreFilter.check()
    → Normalize Vietnamese text (bỏ dấu, lowercase)
    → Exact match trong FAQ database
    → Keyword pattern matching (2+ keywords hoặc 1 keyword + ngắn)
    → HIT: trả về static response → bỏ qua bước 10-15
     ↓
[10] AI Engine: SemanticCache.get()
    → Generate embedding của câu hỏi (Voyage AI)
    → Exact hash match (fast path)
    → Cosine similarity scan toàn bộ cache (≥ 0.96 → HIT)
    → HIT: trả về cached response → bỏ qua bước 11-15
     ↓
[11] AI Engine: SmartModelRouter.route()
    → Đếm technical keywords
    → Kiểm tra word count
    → Phân loại: SIMPLE (512 tokens) / MEDIUM (1024) / COMPLEX (2048)
     ↓
[12] AI Engine: Retrieval — Vector Search (Qdrant)
    → Voyage AI embed câu hỏi
    → Qdrant cosine search (top_k=15)
    → Similarity filter ≥ 0.3 (trên cosine scores)
    → Lưu cosine scores gốc
     ↓
[12b] AI Engine: Retrieval — Keyword Search + RRF Fusion
    → Qdrant full-text search (keyword matching)
    → Reciprocal Rank Fusion merge vector + keyword results
     ↓
[12c] AI Engine: Retrieval — Cross-Encoder Reranking
    → ms-marco-MiniLM-L-6-v2 rerank → top_n=3
    → Restore cosine scores gốc (cho confidence calculation)
     ↓
[13] AI Engine: Generation (DeepSeek)
    → Build system prompt (VI/EN)
    → Insert retrieved context (dùng original_text, không có context prefix)
    → Gọi DeepSeek API
    → LỖI → fallback sang OpenAI gpt-4o-mini
     ↓
[14] AI Engine: Post-processing
    → Tính confidence score (weighted average cosine scores)
    → confidence < 20% → fallback response
    → Extract citations từ source nodes (dùng original_text cho preview)
    → SemanticCache.set() (fire-and-forget)
     ↓
[15] Trả về về NestJS Backend
     ↓
[16] NestJS: Lưu messages vào SessionService
    → Redis SETEX chat:session:{id} 1800
     ↓
[17] NestJS: Lưu response vào CacheService
    → Redis SETEX chat:cache:{hash} 86400
     ↓
[18] Response trả về Frontend
    → { success, data: { answer, citations, confidence, cached } }
     ↓
[19] TechnicalChat render response với ReactMarkdown
    → Lưu vào localStorage (max 20 messages)
    → Auto-scroll
```

### 7.2 Streaming Chat Flow (True LLM Streaming)

```
[1] Frontend useChat (Vercel AI SDK) → POST /api/rag/chat/stream (Next.js Route)
     ↓
[2] Next.js Route Handler:
    → Forward request tới AI Engine /api/chat/stream
    → Transform SSE → plain text stream (TextStreamChatTransport format)
     ↓
[3] AI Engine: RAGEngine.stream_query()
    → Bước 1: FAQ check → HIT: trả về ngay (1 token event)
    → Bước 2: Semantic cache → HIT: trả về ngay (1 token event)
    → Bước 3: Smart model routing
    → Bước 4: Retrieval (vector + keyword + reranker)
    → Bước 5: LLM streaming — llm.astream_complete(prompt)
       → Mỗi token từ DeepSeek được yield ngay lập tức
       → Frontend nhận và render real-time (giống ChatGPT)
    → Bước 6: Done event với citations, confidence
     ↓
[4] Frontend TextStreamChatTransport parse text stream
    → useChat hook cập nhật message.parts real-time
    → ReactMarkdown re-render mỗi khi có token mới
```

**SSE Event format (AI Engine → Next.js):**

```
data: {"type": "chunk", "data": "Van"}
data: {"type": "chunk", "data": " Fisher"}
data: {"type": "chunk", "data": " HP"}
...
data: {"type": "done", "data": {"confidence": 87.5, "sources_count": 3, "citations": [...]}}
```

**Text stream format (Next.js → Frontend):**
```
Van Fisher HP có thông số áp suất...
```
(Plain text, TextStreamChatTransport tự chuyển thành UIMessage parts)

**Nginx headers cần thiết:**

```nginx
X-Accel-Buffering: no    # Tắt nginx buffering
Cache-Control: no-cache
Connection: keep-alive
```

**Frontend stack:** Vercel AI SDK v6 (`ai` + `@ai-sdk/react`)
- `useChat` hook: quản lý messages, streaming status, stop/abort
- `TextStreamChatTransport`: parse plain text stream từ Next.js route
- `sendMessage({ text })`: gửi câu hỏi
- `status`: 'ready' | 'submitted' | 'streaming' | 'error'
- `stop()`: dừng streaming giữa chừng

### 7.3 Document Ingestion Flow (PDF Upload)

```
[1] Admin POST /api/rag/ingest (multipart/form-data, max 50MB)
     ↓
[2] NestJS: Validate MIME type (chỉ application/pdf)
     ↓
[3] RAGService.ingestDocument() → AI Engine POST /api/ingest
     ↓
[4] AI Engine: PDFProcessor.process_bytes()
    → Lưu tạm vào tempfile
    → LlamaParse.aload_data() → Markdown (bảo toàn bảng kỹ thuật)
    → Detect doc_type từ filename
    → Gán metadata (file_name, page_number, total_pages, doc_type)
     ↓
[5] Chọn parser phù hợp:
    → Content có Markdown (|, ##, **) → MarkdownNodeParser
    → Content thuần text → SentenceSplitter (chunk_size=1024, overlap=200)
     ↓
[6] Contextual Enrichment (Anthropic's Contextual Retrieval):
    → Nối toàn bộ document text (all pages)
    → Với mỗi chunk: LLM sinh 1-2 câu context mô tả ngữ cảnh
    → Lưu original_text trong metadata
    → Prepend "[Context: ...]" vào chunk text trước embedding
    → Batch processing (5 chunks concurrent)
     ↓
[7] MetadataExtractor.enrich_nodes():
    → LLM trích xuất metadata kỹ thuật từ mỗi chunk
    → brand, product_type, pressure_class, size_range, v.v.
     ↓
[8] RAGEngine.add_documents(nodes)
    → Voyage AI embed toàn bộ nodes (bao gồm context prefix)
    → Lưu vào Qdrant collection
     ↓
[9] Response: { success, document_id, filename, chunks_created, doc_type }
```

### 7.4 Google Drive Sync Flow

```
[1] POST /api/rag/gdrive/sync { force_full_sync: bool }
     ↓
[2] GoogleDriveSync.list_files()
    → Service Account authentication
    → Query: mimeType=PDF và folder_id và trashed=false
     ↓
[3] Với mỗi file:
    → download_file() → bytes
    → PDFProcessor.process_bytes()
    → RAGEngine.add_documents()
     ↓
[4] Response: { files_found, files_processed, files_failed, total_chunks }
```

---

## 8. Các tầng tối ưu hóa

### 8.1 FAQ Pre-filter

**Mục tiêu:** Tiết kiệm ~50% LLM calls cho các câu hỏi phổ biến.

**Cơ chế hoạt động:**

Bước 1 — Normalize text (xử lý tiếng Việt):

```python
"TTE là gì?" → "tte la gi"   # Bỏ dấu, lowercase, bỏ dấu câu
```

Bước 2 — Exact match trong FAQ keys:

```python
FAQ_DATABASE = {
    "tte la gi": { "vi": "...", "en": "..." },
    "so dien thoai": { "vi": "...", "en": "..." },
    "email lien he": { ... },
    "dia chi": { ... },
    "san pham tte": { ... },
    "fisher la gi": { ... },
    "gio lam viec": { ... },
}
```

Bước 3 — Keyword pattern matching:

```python
KEYWORD_PATTERNS = {
    "so dien thoai": ["dien thoai", "phone", "goi", "hotline", "sdt"],
    ...
}
# Match nếu: 2+ keywords khớp
#         HOẶC: 1 keyword khớp + câu hỏi ≤ 5 từ
```

**Hiệu quả:** Response trả về ngay lập tức, không tốn chi phí LLM.

### 8.2 Semantic Cache

**Mục tiêu:** Tăng cache hit rate ~30% nhờ so sánh ngữ nghĩa thay vì exact match.

**Cơ chế:**

```
Câu hỏi mới: "Van Fisher DVC6000 áp suất tối đa?"
Cache có:    "Áp suất làm việc tối đa của Fisher DVC6000 là bao nhiêu?"

Cosine similarity = 0.94 ≥ 0.96 → CACHE HIT
```

**Cấu trúc lưu trữ:**

```python
@dataclass
class CacheEntry:
    question: str           # Câu hỏi gốc
    question_embedding: list[float]  # Vector (1024 chiều)
    response: dict          # Response đầy đủ
    language: str           # 'vi' hoặc 'en'
    hit_count: int = 0      # Dùng cho LRU eviction
```

**Persistence:** Lưu vào Redis với key `semantic:cache:{md5}`, TTL 30 ngày. Khi khởi động lại → load lại vào memory.

**Eviction:** LRU (Least Recently Used) — xóa entry có `hit_count` thấp nhất khi vượt 1,000 entries.

### 8.3 Smart Model Router

**Mục tiêu:** Giảm 40% chi phí LLM bằng cách phân bổ `max_tokens` hợp lý.

**Phân loại độ phức tạp:**


| Loại    | Điều kiện                           | `max_tokens` |
| ------- | ----------------------------------- | ------------ |
| SIMPLE  | ≤ 8 từ, không có technical keywords | 512          |
| MEDIUM  | Câu hỏi thông thường                | 1024         |
| COMPLEX | ≥ 2 technical keywords HOẶC > 30 từ | 2048         |


**Technical keywords:**

- Thông số: `áp suất`, `pressure`, `nhiệt độ`, `temperature`, `đường kính`, `kích thước`, `cv value`, `torque`, `vật liệu`
- Tiêu chuẩn: `api`, `asme`, `ansi`, `en`, `jis`
- Phân tích: `so sánh`, `compare`, `tại sao`, `why`, `giải thích`
- Sự cố: `lỗi`, `error`, `sự cố`, `không hoạt động`, `bảo trì`

**Simple patterns (regex):**

```python
r"^\w+\s+là\s+gì\??$"    # "X là gì?"
r"^what\s+is\s+\w+\??$"  # "What is X?"
r"^có\s+bao\s+nhiêu"     # "Có bao nhiêu..."
r"^how\s+many"            # "How many..."
```

### 8.4 LLM Fallback Chain

```
DeepSeek API (deepseek-chat)
        │ FAIL
        ▼
OpenAI API (gpt-4o-mini)
        │ FAIL
        ▼
Programmatic Fallback (thông tin liên hệ)
```

### 8.5 Connection Pooling & Singleton

- **RAGEngine:** Singleton — khởi tạo 1 lần, dùng lại mọi request (tránh 500ms overhead)
- **Qdrant:** Duy trì cả sync client (quản lý collection) và async client (query)
- **Redis:** Async connection pool

---

## 9. Bảo mật

### 9.1 Rate Limiting

3 tầng độc lập, tất cả lưu trong Redis:

```
IP:      5 req/phút    → Chống DDoS cơ bản
Session: 20 req/giờ   → Chống API key abuse  
Global:  100 req/phút → Bảo vệ AI Engine
```

### 9.2 Input Validation


| Kiểm tra           | Giá trị               |
| ------------------ | --------------------- |
| Question length    | Max 500 ký tự         |
| Question required  | Không được rỗng       |
| File type (ingest) | Chỉ `application/pdf` |
| File size (ingest) | Max 50MB              |


### 9.3 Prompt Injection Detection

15+ regex patterns phát hiện:

- Instruction override attacks
- System prompt extraction
- Role manipulation
- Jailbreak attempts (DAN mode, developer mode)

Có whitelist cho các câu hỏi kỹ thuật hợp lệ.

### 9.4 CORS

```typescript
// Backend cấu hình CORS
FRONTEND_URL: https://toanthang.vn
```

AI Engine cấu hình CORS trong `settings.cors_origins`.

### 9.5 Session Isolation

- Session ID là UUID v4 do client generate
- Mỗi session hoàn toàn tách biệt trong Redis
- TTL 30 phút → auto-expire không để lộ data lâu dài

---

## 10. API Reference

### POST `/api/rag/chat`

**Request:**

```json
{
  "question": "Van Fisher DVC6000 có áp suất làm việc tối đa là bao nhiêu?",
  "language": "vi",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "conversationId": "optional-uuid"
}
```

**Response (thành công):**

```json
{
  "success": true,
  "cached": false,
  "data": {
    "answer": "Van Fisher DVC6000 có áp suất làm việc tối đa **150 PSI**...",
    "citations": [
      {
        "source": "Fisher_DVC6000_Datasheet.pdf",
        "page": "3",
        "doc_type": "datasheet",
        "content_preview": "Operating pressure range: 3-150 PSI...",
        "relevance_score": 0.891
      }
    ],
    "confidence": 87.5,
    "sourcesCount": 3,
    "conversationId": "uuid"
  }
}
```

**Response (lỗi rate limit):**

```json
{
  "success": false,
  "error": "Too many requests",
  "message": "Rate limit exceeded (IP). Please try again later.",
  "retryAfter": 45
}
```

**Response (fallback — không tìm thấy thông tin):**

```json
{
  "success": true,
  "data": {
    "answer": "Xin lỗi, tôi chưa tìm thấy thông tin này...\n📞 (84-254) 3522219",
    "citations": [],
    "confidence": 0.0,
    "is_fallback": true
  }
}
```

**Response (FAQ — tức thì):**

```json
{
  "success": true,
  "data": {
    "answer": "**TTE (Toàn Thắng Engineering)** là công ty...",
    "citations": [],
    "confidence": 100.0,
    "is_faq": true
  }
}
```

### POST `/api/rag/chat/stream`

**Tương tự `/api/rag/chat`** nhưng trả về SSE stream.

### POST `/api/rag/ingest`

**Content-Type:** `multipart/form-data`  
**Field:** `file` (PDF, max 50MB)

```json
{
  "success": true,
  "data": {
    "documentId": "uuid",
    "filename": "Fisher_DVC6000_Datasheet.pdf",
    "chunksCreated": 47,
    "docType": "datasheet",
    "message": "Successfully ingested 'Fisher_DVC6000_Datasheet.pdf' with 47 chunks"
  }
}
```

### POST `/api/rag/gdrive/sync`

```json
// Request
{ "forceFullSync": false }

// Response
{
  "success": true,
  "data": {
    "filesFound": 12,
    "filesProcessed": 10,
    "filesFailed": 2,
    "totalChunks": 483,
    "message": "Synced 10/12 files, created 483 chunks"
  }
}
```

### GET `/api/rag/health`

```json
{
  "service": "rag",
  "aiEngine": {
    "status": "healthy",
    "qdrantConnected": true,
    "collection": "tte_knowledge_base",
    "vectorsCount": 15420,
    "llmModel": "deepseek-chat",
    "gdriveConfigured": true
  },
  "cache": {
    "keyCount": 234
  }
}
```

---

## 11. Cấu hình môi trường

### AI Engine (`.env`)

```bash
# ==================================
# LLM API Keys (Bắt buộc)
# ==================================
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx         # Dùng cho fallback
LLAMA_CLOUD_API_KEY=llx-xxxxxxxxxxxxxxxx   # Dùng cho LlamaParse
VOYAGEAI_API_KEY=pa-xxxxxxxxxxxxxxxx       # Embedding model

# ==================================
# Vector Store (Bắt buộc)
# ==================================
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key
QDRANT_COLLECTION=tte_knowledge_base

# ==================================
# Redis (Tùy chọn, có là hoạt động tốt hơn)
# ==================================
REDIS_HOST=redis          # hostname trong docker network
REDIS_PORT=6379
REDIS_PASSWORD=your-password
REDIS_DB=0

# ==================================
# Google Drive (Tùy chọn)
# ==================================
GOOGLE_DRIVE_FOLDER_ID=1BxxxxxxxxxxxxxxxxxxxxxxxxxGFold
GOOGLE_CREDENTIALS_PATH=credentials/service-account.json

# ==================================
# RAG Configuration
# ==================================
LLM_MODEL=deepseek-chat
LLM_TEMPERATURE=0.1           # Thấp → output ổn định, ít sáng tạo
LLM_MAX_TOKENS=4096
EMBEDDING_PROVIDER=voyageai   # 'voyageai' hoặc 'openai'
EMBEDDING_MODEL=voyage-3.5-lite
RETRIEVAL_TOP_K=15            # Số chunks lấy từ Qdrant (wider recall cho reranking)
CHUNK_SIZE=1024               # Kích thước mỗi chunk (tokens)
CHUNK_OVERLAP=200             # Overlap giữa các chunks

# ==================================
# Contextual Enrichment (Anthropic's Contextual Retrieval)
# ==================================
CONTEXTUAL_ENRICHMENT_ENABLED=true      # Sinh context cho mỗi chunk khi ingest
CONTEXTUAL_ENRICHMENT_MAX_DOC_LENGTH=6000  # Chars document overview gửi LLM
CONTEXTUAL_ENRICHMENT_BATCH_SIZE=5      # Chunks xử lý song song mỗi batch

# ==================================
# Reranking (Cross-Encoder)
# ==================================
RERANK_ENABLED=true
RERANK_MODEL=cross-encoder/ms-marco-MiniLM-L-6-v2  # Local, ~80MB, miễn phí
RERANK_TOP_N=3                # Số chunks giữ lại sau reranking

# ==================================
# Hybrid Search (Vector + Keyword)
# ==================================
HYBRID_SEARCH_ENABLED=true
HYBRID_VECTOR_WEIGHT=0.7     # 70% vector, 30% keyword trong RRF scoring

# ==================================
# Misc
# ==================================
DEBUG=false
LOG_LEVEL=INFO
```

### Backend NestJS

```bash
# Chatbot Rate Limiting
CHATBOT_RATE_LIMIT_IP=5          # Requests/phút per IP
CHATBOT_RATE_LIMIT_SESSION=20    # Requests/giờ per session
CHATBOT_RATE_LIMIT_GLOBAL=100    # Requests/phút toàn cục

# Chatbot Session
CHATBOT_SESSION_TTL=1800         # Giây (30 phút)
CHATBOT_MAX_HISTORY_TURNS=3      # Số lượng turns lưu context

# Chatbot Cache
CHATBOT_CACHE_TTL=86400          # Giây (24 giờ)
CHATBOT_CACHE_ENABLED=true
CHATBOT_MAX_QUESTION_LENGTH=500  # Ký tự

# AI Engine URL
AI_ENGINE_URL=http://ai-engine:4003

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

---

## 12. Triển khai

### 12.1 Development (Local)

```bash
# 1. Cài đặt dependencies
cd apps/ai-engine
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"

# 2. Copy và cấu hình .env
cp .env.example .env
# Điền vào DEEPSEEK_API_KEY, VOYAGEAI_API_KEY, QDRANT_URL, QDRANT_API_KEY

# 3. Chạy AI Engine
uvicorn src.main:app --host 0.0.0.0 --port 4003 --reload

# 4. Chạy Backend (terminal khác)
cd apps/backend
npm install
npm run start:dev

# 5. Chạy Frontend (terminal khác)
cd apps/web
npm install
npm run dev
```

### 12.2 Production (Docker Compose)

```bash
# 1. Copy env file
cp .env.example .env.local
# Chỉnh sửa tất cả secrets

# 2. Tạo thư mục credentials (nếu dùng Google Drive)
mkdir -p credentials
cp /path/to/service-account.json credentials/

# 3. Deploy
docker compose -f docker-compose.prod.yml up -d

# 4. Kiểm tra logs
docker logs tte_ai_engine -f
docker logs tte_backend -f

# 5. Health check
curl http://localhost:4003/health
curl http://localhost:4002/api/rag/health
```

### 12.3 Ingest tài liệu lần đầu

```bash
# Option A: Upload trực tiếp qua API
curl -X POST http://localhost:4002/api/rag/ingest \
  -F "file=@/path/to/fisher_datasheet.pdf"

# Option B: Google Drive sync (nếu đã cấu hình)
curl -X POST http://localhost:4002/api/rag/gdrive/sync \
  -H "Content-Type: application/json" \
  -d '{"forceFullSync": true}'

# Kiểm tra số vectors đã ingest
curl http://localhost:4002/api/rag/health | jq '.aiEngine.vectorsCount'
```

### 12.4 Dockerfile — AI Engine

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY pyproject.toml .
RUN pip install -e .

COPY . .

EXPOSE 4003
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "4003"]
```

---

## 13. Giám sát & Vận hành

### Health Endpoints


| Endpoint                        | Mô tả                         |
| ------------------------------- | ----------------------------- |
| `GET /health` (AI Engine)       | Status: ok hoặc error         |
| `GET /api/health` (AI Engine)   | Qdrant, vectors count, models |
| `GET /api/rag/health` (Backend) | Full system + cache stats     |


### Log Levels

AI Engine sử dụng Python `logging` với format:

```
2026-02-26 08:30:00 - src.core.rag_engine - INFO - FAQ match found: 'so dien thoai' - skipping LLM
2026-02-26 08:30:01 - src.core.rag_engine - INFO - Semantic cache HIT - skipping LLM
2026-02-26 08:30:05 - src.core.rag_engine - INFO - Query routed: complexity=complex, max_tokens=2048
2026-02-26 08:30:06 - src.core.rag_engine - INFO - Retrieved 12 nodes. Top score: 0.891
```

### Redis Keys Monitoring

```bash
# Xem tất cả cache entries
redis-cli -h localhost -p 6381 KEYS "chat:cache:*" | wc -l

# Xem semantic cache
redis-cli KEYS "semantic:cache:*" | wc -l

# Xem active sessions
redis-cli KEYS "chat:session:*" | wc -l

# Flush cache khi cần (không xóa sessions)
redis-cli KEYS "chat:cache:*" | xargs redis-cli DEL
```

### Metrics quan trọng cần theo dõi


| Metric                  | Target | Cách đo                                |
| ----------------------- | ------ | -------------------------------------- |
| FAQ hit rate            | > 30%  | Log `FAQ match found` / total requests |
| Semantic cache hit rate | > 20%  | Log `cache HIT` / total requests       |
| Response time P95       | < 3s   | APM / nginx logs                       |
| LLM fallback rate       | < 5%   | Log `Fallback LLM (OpenAI) succeeded`  |
| Low confidence rate     | < 15%  | Log `Low confidence` / total requests  |
| Rate limit hits         | < 1%   | HTTP 429 count                         |


---

## 14. Quản lý tài liệu (Knowledge Base)

### Quy trình thêm tài liệu mới

**Manual upload:**

1. Truy cập API endpoint hoặc tạo admin UI
2. `POST /api/rag/ingest` với file PDF
3. Kiểm tra response `chunksCreated`
4. Test câu hỏi liên quan

**Google Drive (tự động):**

1. Đặt file PDF vào Google Drive folder đã cấu hình
2. Trigger `POST /api/rag/gdrive/sync`
3. Hoặc setup cron job tự động sync

### Best Practices khi chuẩn bị tài liệu

1. **Tên file rõ ràng** → Hệ thống tự detect doc_type
  - ✅ `Fisher_DVC6000_Datasheet.pdf`
  - ✅ `FlowserveAPI610_Manual.pdf`
  - ❌ `document1.pdf`
2. **PDF text-based** → Không phải scan (ảnh)
  - LlamaParse handle được PDF phức tạp nhưng scan sẽ giảm chất lượng
3. **Bảng kỹ thuật** → LlamaParse giữ nguyên cấu trúc bảng qua Markdown
4. **Tài liệu tiếng Anh** → RAGEngine cấu hình bilingual, câu trả lời Tiếng Việt dựa trên source tiếng Anh là OK

### FAQ Database — Mở rộng

Sau 2-4 tuần production, phân tích logs để tìm câu hỏi phổ biến:

```bash
# Lọc câu hỏi không match FAQ từ logs
grep "No FAQ match for" apps/ai-engine/logs/app.log | \
  awk -F"'" '{print $2}' | \
  sort | uniq -c | sort -rn | head -20
```

Thêm vào `apps/ai-engine/src/core/faq_filter.py`:

```python
FAQ_DATABASE["ten_key_moi"] = {
    "vi": "Câu trả lời tiếng Việt...",
    "en": "English answer...",
}
KEYWORD_PATTERNS["ten_key_moi"] = ["keyword1", "keyword2", "keyword3"]
```

---

## 15. Lộ trình cải tiến

### Đã hoàn thành (Q1 2026)

- **Contextual Retrieval** — Anthropic's technique: LLM sinh ngữ cảnh cho mỗi chunk trước khi embedding (~49% giảm lỗi retrieval)
- **Cross-Encoder Reranking** — ms-marco-MiniLM-L-6-v2 local reranker (thêm ~18% giảm lỗi)
- **BM25 Hybrid Search** — Qdrant keyword search + RRF fusion (cải thiện exact match cho model numbers)
- **MetadataExtractor Integration** — Tự động extract metadata kỹ thuật khi ingest (brand, product_type, pressure_class...)
- **True LLM Streaming** — `astream_complete()` token-by-token streaming từ DeepSeek, first token ~500ms
- **Streaming UI (Vercel AI SDK v6)** — `useChat` hook + `TextStreamChatTransport`, text hiện từng token real-time, Stop button

### Ngắn hạn (Q2 2026)

- **Mở rộng FAQ** — Phân tích logs sau 4 tuần, tăng từ 7 lên 30-50 entries
- **Admin UI** — Giao diện quản lý tài liệu, xem analytics (FAQ hit rate, cache hit rate)
- **Smart Suggestions** — Gợi ý 3 câu hỏi liên quan sau mỗi câu trả lời
- **Reference Cards** — Chuyển citations thành UI cards có thể click (xem preview PDF)

### Trung hạn (Q3 2026)

- **Context Window mở rộng** — Tăng từ 3 lên 5 conversation turns
- **Domain-specific Reranker** — Fine-tune cross-encoder trên dữ liệu Oil & Gas

### Dài hạn (Q4 2026+)

- **Multi-modal** — Hỗ trợ câu hỏi kèm ảnh (sơ đồ kỹ thuật)
- **Fine-tuning** — Fine-tune embedding model trên domain Oil & Gas
- **Conversation Memory** — Long-ter
- m memory cho returning customers
- **Analytics Dashboard** — Dashboard thống kê câu hỏi thường gặp, satisfaction rate

---

## Phụ lục — Cấu trúc thư mục

```
apps/ai-engine/
├── src/
│   ├── api/
│   │   ├── models.py          # Pydantic request/response models
│   │   └── routes.py          # FastAPI endpoints + MetadataExtractor integration
│   ├── core/
│   │   ├── faq_filter.py      # FAQ pre-filter (7 entries)
│   │   ├── model_router.py    # Smart model routing
│   │   ├── rag_engine.py      # Core RAG engine (hybrid search + reranking + true LLM streaming)
│   │   ├── redis_client.py    # Async Redis wrapper
│   │   └── semantic_cache.py  # Embedding-based cache
│   ├── ingestion/
│   │   ├── contextual_enricher.py  # Contextual Retrieval (Anthropic's technique)
│   │   ├── gdrive_sync.py     # Google Drive integration
│   │   ├── metadata_extractor.py   # LLM-extracted metadata (brand, product_type, etc.)
│   │   └── pdf_processor.py   # LlamaParse PDF processing + contextual enrichment
│   ├── retrieval/
│   │   ├── auto_retriever.py  # Auto-retriever with metadata filtering
│   │   └── keyword_retriever.py    # Qdrant keyword search + RRF fusion
│   ├── config/                # Settings (pydantic-settings)
│   └── main.py                # FastAPI app entry point
├── .env.example
├── Dockerfile
└── pyproject.toml

apps/backend/src/
├── rag/
│   ├── chatbot-cache.service.ts    # Redis response cache
│   ├── chatbot-session.service.ts  # Redis session management
│   ├── rag.controller.ts           # API endpoints (382 LOC)
│   ├── rag.module.ts
│   └── rag.service.ts              # HTTP proxy to AI Engine
├── common/
│   └── guards/
│       ├── chatbot-throttler.guard.ts   # Rate limiting (3-tier)
│       └── prompt-injection.guard.ts   # Security filtering

apps/web/components/chat/
├── chat-widget.tsx     # Floating UI container
└── technical-chat.tsx  # Chat UI + localStorage
```

---

