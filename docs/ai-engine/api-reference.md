# AI Engine - API Reference

Tài liệu API cho AI Engine service.

---

## Base URL

```
Development: http://localhost:4003
Production:  http://ai-engine:4003 (internal)
```

---

## Endpoints

### Health Check

#### `GET /health`

Simple health check.

**Response:**
```json
{
  "status": "ok",
  "service": "ai-engine"
}
```

#### `GET /api/health`

Detailed health status.

**Response:**
```json
{
  "status": "healthy",
  "service": "ai-engine",
  "version": "0.1.0",
  "qdrant_connected": true,
  "collection": "tte_knowledge_base",
  "vectors_count": 1250,
  "llm_model": "deepseek-chat",
  "embedding_model": "text-embedding-3-small",
  "gdrive_configured": true
}
```

---

### Chat

#### `POST /api/chat`

Query the technical knowledge base.

**Request:**
```json
{
  "question": "Van Fisher HP chịu được áp suất bao nhiêu?",
  "language": "vi",
  "conversation_id": "optional-uuid"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | string | ✅ | User's question (1-2000 chars) |
| `language` | string | ❌ | Response language: `vi` (default) or `en` |
| `conversation_id` | string | ❌ | Optional conversation ID for context |

**Response:**
```json
{
  "answer": "Van điều khiển Fisher HP Series có các thông số...",
  "citations": [
    {
      "source": "Fisher_HP_Datasheet.pdf",
      "page": "3",
      "doc_type": "datasheet",
      "content_preview": "The Fisher HP valve provides...",
      "relevance_score": 0.89
    }
  ],
  "confidence": 87.5,
  "conversation_id": "uuid-here",
  "sources_count": 3
}
```

**Error Responses:**
- `400`: Invalid question (empty or too long)
- `500`: Internal processing error
- `503`: AI Engine unavailable

---

#### `POST /api/chat/stream`

Stream chat responses using Server-Sent Events (SSE) với **true LLM streaming** — tokens được gửi ngay khi LLM sinh ra, không đợi toàn bộ response.

**Request:** Same as `/api/chat`

**Response:** SSE stream with tokens:

```
data: {"type": "chunk", "data": "Van"}
data: {"type": "chunk", "data": " Fisher"}
data: {"type": "chunk", "data": " HP"}
data: {"type": "chunk", "data": " có"}
data: {"type": "chunk", "data": " thông"}
...
data: {"type": "done", "data": {"confidence": 87.5, "sources_count": 3, "citations": [...], "conversation_id": "uuid"}}
```

**Event Types:**
| Type | Description |
|------|-------------|
| `chunk` | Token text từ LLM (1-5 ký tự mỗi chunk, real-time) |
| `done` | Completion metadata: confidence, citations, sources_count, conversation_id |
| `error` | Error message |

**Features:**
- **True token streaming**: Sử dụng `astream_complete()` — tokens từ DeepSeek được forward ngay khi sinh ra
- FAQ/cached responses gửi ngay (one chunk)
- First token xuất hiện trong ~500ms (thay vì đợi 2-3s cho toàn bộ response)
- Done event bao gồm citations array cho frontend hiển thị nguồn trích dẫn

---

### Smart Suggestions

#### `POST /api/chat/suggestions`

Sinh 3 câu hỏi follow-up dựa trên câu hỏi và câu trả lời. Endpoint riêng, gọi async sau khi chat response hoàn tất.

**Request:**
```json
{
  "question": "Van Fisher HP chịu được áp suất bao nhiêu?",
  "answer": "Van điều khiển Fisher HP Series có áp suất làm việc...",
  "language": "vi"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | string | ✅ | Câu hỏi gốc (1-2000 chars) |
| `answer` | string | ✅ | Câu trả lời từ chatbot (1-5000 chars) |
| `language` | string | ❌ | `vi` (default) or `en` |

**Response:**
```json
{
  "suggestions": [
    "Fisher HP phù hợp ứng dụng nào?",
    "So sánh Fisher HP với Fisher GX?",
    "Cách bảo trì van Fisher HP?"
  ]
}
```

**Đặc điểm:**
- **Never fails**: Luôn trả về `{"suggestions": []}` nếu có lỗi, không bao giờ raise exception
- **Redis caching**: Cache by question hash, TTL 24h — cùng câu hỏi không gọi LLM lại
- **Fallback detection**: Tự động detect response "Xin lỗi, tôi chưa tìm thấy..." → return `[]`
- **Latency**: ~300-500ms (DeepSeek với max_tokens=200)
- **Cost**: ~$0.00004/call

---

### Document Ingestion

#### `POST /api/ingest`

Upload and ingest a PDF document.

**Request:**
- Content-Type: `multipart/form-data`
- Body: PDF file (max 50MB)

```bash
curl -X POST http://localhost:4003/api/ingest \
  -F "file=@Fisher_Catalog.pdf"
```

**Response:**
```json
{
  "success": true,
  "document_id": "uuid-here",
  "filename": "Fisher_Catalog.pdf",
  "chunks_created": 45,
  "doc_type": "catalog",
  "message": "Successfully ingested 'Fisher_Catalog.pdf' with 45 chunks"
}
```

**Error Responses:**
- `400`: Invalid file type (not PDF) or empty file
- `500`: Processing error

---

### Google Drive Sync

#### `POST /api/gdrive/sync`

Sync documents from configured Google Drive folder.

**Request:**
```json
{
  "force_full_sync": false
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `force_full_sync` | boolean | false | Ignore timestamps, sync all files |

**Response:**
```json
{
  "success": true,
  "files_found": 10,
  "files_processed": 8,
  "files_failed": 2,
  "total_chunks": 350,
  "files": [
    {
      "id": "drive-file-id",
      "name": "Valve_Catalog.pdf",
      "status": "completed",
      "chunks_created": 45
    }
  ],
  "message": "Synced 8/10 files, created 350 chunks"
}
```

#### `GET /api/gdrive/status`

Check Google Drive configuration.

**Response:**
```json
{
  "configured": true,
  "folder_id": "1abc..."
}
```

---

## NestJS Gateway Endpoints

Các endpoint này được expose qua NestJS Backend (port 4002):

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rag/chat` | POST | Chat with knowledge base |
| `/api/rag/chat/stream` | POST | Stream chat responses (SSE) |
| `/api/rag/chat/suggestions` | POST | Generate follow-up suggestions |
| `/api/rag/ingest` | POST | Upload PDF document |
| `/api/rag/gdrive/sync` | POST | Trigger GDrive sync |
| `/api/rag/gdrive/status` | GET | GDrive config status |
| `/api/rag/health` | GET | RAG service health |

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "detail": "Error message here"
}
```

HTTP Status Codes:
- `200`: Success
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Internal Server Error
- `503`: Service Unavailable
