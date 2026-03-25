# AI Engine - Deployment Guide

Hướng dẫn triển khai AI Engine cho production.

---

## Yêu cầu hệ thống

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Python** | 3.11 | 3.11+ |
| **RAM** | 1GB | 2GB (reranker model ~80MB in memory) |
| **Storage** | 1GB | 5GB |
| **Docker** | 24.0+ | Latest |

---

## 1. Thiết lập External Services

### 1.1 Qdrant Cloud

1. Truy cập [cloud.qdrant.io](https://cloud.qdrant.io)
2. Đăng ký tài khoản (Free tier: 1GB storage)
3. Tạo Cluster mới:
   - Name: `tte-knowledge-base`
   - Region: Chọn gần nhất (Singapore/Tokyo)
4. Copy thông tin:
   - **URL**: `https://xxx-xxx.aws.cloud.qdrant.io:6333`
   - **API Key**: Từ "API Keys" tab

### 1.2 LlamaParse (LlamaCloud)

1. Truy cập [cloud.llamaindex.ai](https://cloud.llamaindex.ai)
2. Đăng ký tài khoản (Free: 1000 pages/day)
3. Vào "API Keys" → Create new key
4. Copy **LLAMA_CLOUD_API_KEY**

### 1.3 DeepSeek API

1. Truy cập [platform.deepseek.com](https://platform.deepseek.com)
2. Đăng ký và thêm credits
3. Vào "API Keys" → Create
4. Copy **DEEPSEEK_API_KEY**

### 1.4 Google Drive (Optional)

1. Tạo Project trên [Google Cloud Console](https://console.cloud.google.com)
2. Enable "Google Drive API"
3. Tạo Service Account:
   - IAM & Admin → Service Accounts → Create
   - Download JSON credentials
4. Share folder với Service Account email
5. Copy Folder ID từ URL

---

## 2. Environment Configuration

### 2.1 Copy template

```bash
cd apps/ai-engine
cp .env.example .env
```

### 2.2 Điền các giá trị

```env
# Required
DEEPSEEK_API_KEY=sk-xxx
OPENAI_API_KEY=sk-xxx
LLAMA_CLOUD_API_KEY=llx-xxx
VOYAGEAI_API_KEY=pa-xxx

# Qdrant Cloud
QDRANT_URL=https://xxx.aws.cloud.qdrant.io:6333
QDRANT_API_KEY=xxx
QDRANT_COLLECTION=tte_knowledge_base

# Retrieval Enhancements (tất cả có default, chỉ cần set nếu muốn thay đổi)
CONTEXTUAL_ENRICHMENT_ENABLED=true   # Contextual Retrieval cho chunks
RERANK_ENABLED=true                   # Cross-encoder reranking
HYBRID_SEARCH_ENABLED=true            # Vector + keyword search fusion

# Optional: Google Drive
GOOGLE_DRIVE_FOLDER_ID=1abc...xyz
```

### 2.3 Google Credentials (nếu sử dụng GDrive)

```bash
# Tạo thư mục credentials
mkdir -p credentials

# Copy file JSON credentials
cp /path/to/service-account.json credentials/service-account.json
```

---

## 3. Deployment Options

### Option A: Docker (Recommended)

```bash
# Build image
docker build -t tte-ai-engine -f apps/ai-engine/Dockerfile .

# Run container
docker run -d \
  --name ai-engine \
  -p 4003:4003 \
  --env-file apps/ai-engine/.env \
  -v $(pwd)/credentials:/app/credentials:ro \
  tte-ai-engine
```

### Option B: Docker Compose

```bash
# Start all services
docker compose -f docker-compose.prod.yml up -d ai-engine

# Check logs
docker compose -f docker-compose.prod.yml logs -f ai-engine
```

### Option C: Local Development

```bash
cd apps/ai-engine

# Install dependencies
pip install -e ".[dev]"

# Install reranking dependencies (cross-encoder model ~80MB, downloads on first query)
pip install "llama-index-postprocessor-sbert-rerank>=0.5.0" "sentence-transformers>=3.0.0"

# Run development server
uvicorn src.main:app --reload --port 4003
```

> **Lưu ý:** Lần đầu query sau khởi động, reranker model sẽ tự download (~80MB). Sau đó được cache local.

---

## 4. Verification

### 4.1 Health Check

```bash
# Basic health
curl http://localhost:4003/health
# Expected: {"status":"ok","service":"ai-engine"}

# Detailed health
curl http://localhost:4003/api/health
# Expected: {"status":"healthy","qdrant_connected":true,...}
```

### 4.2 Test Ingestion

```bash
# Upload a test PDF
curl -X POST http://localhost:4003/api/ingest \
  -F "file=@test_datasheet.pdf"
```

### 4.3 Test Chat

```bash
curl -X POST http://localhost:4003/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Liệt kê các loại van trong catalog", "language": "vi"}'
```

---

## 5. Integration với NestJS Backend

Backend tự động connect tới AI Engine qua biến môi trường:

```env
# In .env.production
AI_ENGINE_URL=http://ai-engine:4003
```

Verify integration:
```bash
curl http://localhost:4002/api/rag/health
```

---

## 6. Troubleshooting

### Qdrant Connection Failed

```
Error: Failed to connect to Qdrant
```

**Giải pháp:**
1. Verify QDRANT_URL format (phải có port `:6333`)
2. Check API key
3. Verify cluster status trên Qdrant Cloud UI

### LlamaParse Timeout

```
Error: LlamaParse request timeout
```

**Giải pháp:**
1. PDF quá lớn → Chia nhỏ file
2. Tăng timeout trong config
3. Check quota trên LlamaCloud

### Google Drive 403 Forbidden

```
Error: 403 Forbidden
```

**Giải pháp:**
1. Verify Service Account email có quyền truy cập folder
2. Share folder với email ending `@xxx.iam.gserviceaccount.com`
3. Check folder ID chính xác

---

## 7. Monitoring

### Logs

```bash
# Docker logs
docker logs -f tte_ai_engine

# Tail specific errors
docker logs tte_ai_engine 2>&1 | grep ERROR
```

### Metrics (Future)

- Prometheus endpoint: `/metrics`
- Key metrics:
  - `rag_query_duration_seconds`
  - `rag_queries_total`
  - `ingestion_documents_total`
