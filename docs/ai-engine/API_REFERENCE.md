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
