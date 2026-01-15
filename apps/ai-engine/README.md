# TTE AI Engine

RAG-powered AI Engine for technical consulting in Oil & Gas, Energy, and Chemical industries.

## Features

- 🔍 **Advanced RAG Pipeline** with LlamaIndex
- 📄 **PDF Processing** with LlamaParse (table-aware)
- 🔗 **Vector Search** with Qdrant Cloud
- 🌐 **Bilingual Support** (EN/VI)
- 📁 **Google Drive Integration** for knowledge base sync
- ⚡ **FastAPI** for high-performance API

## Quick Start

### Development

```bash
# Install dependencies
pip install -e ".[dev]"

# Run development server
uvicorn src.main:app --reload --port 4003
```

### Docker

```bash
# Build
docker build -t tte-ai-engine .

# Run
docker run -p 4003:4003 --env-file .env tte-ai-engine
```

## Environment Variables

```env
# Required
DEEPSEEK_API_KEY=sk-...
OPENAI_API_KEY=sk-...
LLAMA_CLOUD_API_KEY=llx-...
QDRANT_URL=https://xxx.qdrant.io
QDRANT_API_KEY=...

# Optional
GOOGLE_DRIVE_FOLDER_ID=...
REDIS_HOST=localhost
REDIS_PORT=6379
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/chat` | POST | Chat with knowledge base |
| `/api/ingest` | POST | Ingest PDF document |
| `/api/gdrive/sync` | POST | Sync from Google Drive |

## Architecture

```
src/
├── api/           # FastAPI routes
├── config/        # Settings & configuration
├── core/          # RAG engine & LLM
├── ingestion/     # PDF processing & data pipeline
├── retrieval/     # Vector search & reranking
└── main.py        # Application entry point
```
