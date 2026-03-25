# AI Engine - Operations Guide

Hướng dẫn vận hành và quản lý AI Engine trong production.

---

## Mục lục

- [Quản lý Knowledge Base](#quản-lý-knowledge-base)
- [Google Drive Workflow](#google-drive-workflow)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Backup & Recovery](#backup--recovery)

---

## Quản lý Knowledge Base

### Thêm tài liệu mới

#### Option 1: Upload trực tiếp (API)

```bash
# Upload single PDF
curl -X POST http://localhost:4003/api/ingest \
  -F "file=@Fisher_Catalog_2024.pdf"

# Response
{
  "success": true,
  "document_id": "uuid",
  "chunks_created": 45
}
```

#### Option 2: Google Drive (Recommended)

1. Upload PDF vào thư mục Google Drive đã cấu hình
2. Trigger sync:
```bash
curl -X POST http://localhost:4003/api/gdrive/sync
```

### Xóa tài liệu

Hiện tại cần xóa trực tiếp trong Qdrant:

```bash
# Connect to Qdrant Cloud UI
# Filter by: payload.file_name = "old_document.pdf"
# Delete matching points
```

> 💡 **Future**: API endpoint `/api/documents/{id}` DELETE

### Kiểm tra documents

```bash
# Health check shows vectors count
curl http://localhost:4003/api/health

# Expected output includes:
{
  "vectors_count": 1250,
  "collection": "tte_knowledge_base"
}
```

---

## Google Drive Workflow

### Cấu trúc thư mục đề xuất

```
📁 TTE Knowledge Base/
├── 📁 Datasheets/
│   ├── Fisher_HP_Datasheet.pdf
│   └── Bettis_Actuator_Spec.pdf
├── 📁 Catalogs/
│   ├── 2024_Product_Catalog.pdf
│   └── Valve_Selection_Guide.pdf
├── 📁 Manuals/
│   └── Installation_Guide.pdf
└── 📁 Standards/
    ├── API_6D_Excerpt.pdf
    └── ISO_15848_Summary.pdf
```

### Sync Schedule

**Recommended**: Chạy sync hàng ngày vào off-peak hours

```bash
# Cron job example (run at 2 AM daily)
0 2 * * * curl -X POST http://ai-engine:4003/api/gdrive/sync
```

### Force Full Sync

Khi cần re-sync tất cả documents (ví dụ: sau khi đổi parsing config):

```bash
curl -X POST http://localhost:4003/api/gdrive/sync \
  -H "Content-Type: application/json" \
  -d '{"force_full_sync": true}'
```

---

## Monitoring & Maintenance

### Health Monitoring

```bash
# Quick check
curl -s http://localhost:4003/health | jq .

# Detailed status
curl -s http://localhost:4003/api/health | jq .
```

### Key Metrics to Monitor

| Metric | Warning | Critical |
|--------|---------|----------|
| Response time `/api/chat` | > 5s | > 15s |
| Qdrant connection | Failed once | 3+ failures |
| Memory usage | > 800MB | > 1GB |

### Log Analysis

```bash
# View recent errors
docker logs tte_ai_engine 2>&1 | grep -i error | tail -20

# Monitor in real-time
docker logs -f tte_ai_engine 2>&1 | grep -E "(ERROR|WARNING|query)"
```

### Common Issues

#### "No relevant documents found"

**Nguyên nhân:**
- Knowledge base chưa có documents
- Query không match với content

**Giải pháp:**
1. Check vectors_count > 0
2. Thử query đơn giản hơn
3. Verify documents đã được ingest

#### "Confidence score thấp"

**Nguyên nhân:**
- Query quá chung chung
- Không có tài liệu liên quan

**Giải pháp:**
1. Yêu cầu user hỏi cụ thể hơn
2. Thêm tài liệu liên quan

---

## Backup & Recovery

### Qdrant Cloud Backup

Qdrant Cloud tự động backup. Để restore:

1. Truy cập Qdrant Cloud Console
2. Chọn Cluster → Backups
3. Select backup point → Restore

### Knowledge Base Rebuild

Nếu cần rebuild từ đầu:

```bash
# 1. Clear collection (trong Qdrant UI)

# 2. Re-sync tất cả documents
curl -X POST http://localhost:4003/api/gdrive/sync \
  -d '{"force_full_sync": true}'
```

### Environment Backup

Lưu giữ:
- `.env` file (mã hóa)
- `credentials/service-account.json`
- List of ingested documents

---

## Performance Tuning

### Retrieval Quality

```env
# Wider recall (mặc định 15, tăng nếu thiếu relevant results)
RETRIEVAL_TOP_K=15

# Reranker giữ lại top N (mặc định 3)
RERANK_TOP_N=3

# Hybrid search weight (0.7 = 70% vector, 30% keyword)
HYBRID_VECTOR_WEIGHT=0.7

# Tắt từng feature nếu cần debug
RERANK_ENABLED=true
HYBRID_SEARCH_ENABLED=true
CONTEXTUAL_ENRICHMENT_ENABLED=true
```

### Response Speed & Streaming

**True LLM streaming** đã được implement — tokens từ DeepSeek được stream trực tiếp tới frontend.

- **First token latency:** ~500ms (thời gian từ gửi câu hỏi đến khi thấy chữ đầu tiên)
- **Endpoint:** `/api/chat/stream` sử dụng `RAGEngine.stream_query()` + `astream_complete()`
- **Frontend:** Vercel AI SDK v6 `useChat` hook nhận tokens real-time

```env
# Giảm nếu cần response nhanh hơn
LLM_MAX_TOKENS=2048

# Temperature thấp cho consistency
LLM_TEMPERATURE=0.1
```

### Memory Optimization

```yaml
# docker-compose.prod.yml
ai-engine:
  deploy:
    resources:
      limits:
        memory: 2G      # Reranker model cần ~80MB in memory
      reservations:
        memory: 1G
```

### Re-ingestion sau khi thay đổi cấu hình

Khi thay đổi contextual enrichment, chunking, hoặc embedding config, cần re-ingest tất cả tài liệu:

```bash
# 1. Xóa collection cũ trong Qdrant (qua Qdrant Cloud UI hoặc API)

# 2. Re-sync tất cả documents
curl -X POST http://localhost:4003/api/gdrive/sync \
  -H "Content-Type: application/json" \
  -d '{"force_full_sync": true}'

# 3. Verify vectors count
curl -s http://localhost:4003/api/health | jq '.vectors_count'
```
