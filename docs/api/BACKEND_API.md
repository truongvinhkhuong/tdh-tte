# Backend API Reference

## Overview

NestJS Backend cung cấp AI-powered services cho content generation, SEO optimization, và RAG chatbot. Tích hợp CMS qua HTTP và sử dụng multi-provider AI routing.

> **Source code:** `apps/backend/src/` · **Entry:** `apps/backend/src/main.ts`

---

## Base URL

| Environment | URL |
|-------------|-----|
| Development | http://localhost:4002/api |
| Production | https://api.toanthang.vn/api |

---

## Authentication

API requests yêu cầu API key:

```
Authorization: Bearer <API_KEY>
```

---

## Endpoints

### Health Check

```
GET /api/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-01-12T00:00:00.000Z"
}
```

### AI Status

```
GET /api/ai/status
```

**Response:**

```json
{
  "service": "ai",
  "status": "ready",
  "providers": ["deepseek", "openai"]
}
```

---

## AI Content Generation

### Generate Article

> **Source:** `apps/backend/src/ai/ai.controller.ts`

```
POST /api/ai/generate/article
```

**Request Body:**

```json
{
  "topic": "Industrial valve selection guide",
  "type": "Technical_Solution",
  "keywords": ["valve", "industrial", "selection"],
  "language": "vi",
  "targetLength": 1500,
  "tone": "professional"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| topic | string | Yes | Chủ đề bài viết |
| type | enum | Yes | Technical_Solution, TTE_Event, Industry_News |
| keywords | string[] | Yes | Từ khoá mục tiêu (3-10) |
| language | enum | No | vi, en (default: vi) |
| targetLength | number | No | Số từ (default: 1000) |
| tone | string | No | Giọng văn (default: professional) |

**Response:**

```json
{
  "success": true,
  "data": {
    "title": "Hướng dẫn Lựa chọn Van Công nghiệp",
    "content": "<article content in markdown>",
    "summary": "Article summary (excerpt)",
    "seo": {
      "metaTitle": "SEO optimized title (max 60 chars)",
      "metaDescription": "Meta description (max 160 chars)",
      "keywords": ["valve", "industrial", "selection", "equipment"]
    },
    "readingTime": 8
  },
  "metadata": {
    "provider": "deepseek",
    "tokensUsed": 2500,
    "processingTime": 12500
  }
}
```

---

### Optimize SEO

> **Source:** `apps/backend/src/ai/ai.controller.ts`

```
POST /api/ai/optimize/seo
```

**Request Body:**

```json
{
  "content": "Article content to analyze...",
  "keywords": ["target", "keywords"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "metaTitle": "Optimized title",
    "metaDescription": "Optimized description",
    "excerpt": "Content excerpt",
    "keywords": ["optimized", "keywords", "list"],
    "suggestions": [
      "Add more internal links",
      "Include heading structure"
    ]
  }
}
```

---

## RAG Chatbot

> **Source:** `apps/backend/src/rag/rag.controller.ts`
> **Guards:** `ChatbotThrottlerGuard`, `PromptInjectionGuard`

### Chat

```
POST /api/rag/chat
```

**Request Body:**

```json
{
  "question": "Sản phẩm van công nghiệp nào phù hợp cho ngành dầu khí?",
  "language": "vi",
  "conversationId": "optional-conversation-id",
  "sessionId": "client-generated-uuid"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| question | string | Yes | Câu hỏi (1-500 ký tự) |
| language | enum | No | vi, en (default: vi) |
| conversationId | string | No | ID cuộc hội thoại để tiếp tục context |
| sessionId | string | No | Client-generated UUID cho session tracking |

**Rate Limiting:**

| Scope | Limit | Config env |
|-------|-------|------------|
| Per IP per minute | 5 | `CHATBOT_RATE_LIMIT_IP` |
| Per session per hour | 20 | `CHATBOT_RATE_LIMIT_SESSION` |
| Global per minute | 100 | `CHATBOT_RATE_LIMIT_GLOBAL` |

---

## AI Provider Routing

Backend sử dụng routing system để tối ưu chi phí và chất lượng.

| Stage | Provider | Lý do |
|-------|----------|-------|
| Draft | DeepSeek | Chi phí thấp cho bản nháp |
| Polish | OpenAI | Chất lượng cao cho bản cuối |
| SEO | DeepSeek | Chi phí thấp cho phân tích |

**Provider Configuration:**

```
DEEPSEEK_API_KEY=<key>
OPENAI_API_KEY=<key>
```

**Fallback:** Nếu provider chính fail, tự động chuyển sang provider phụ.

---

## Background Jobs

### Content Generation Queue

Jobs được xử lý bất đồng bộ qua BullMQ + Redis.

**Queue Name:** content-generation

```json
{
  "type": "generate_article",
  "payload": {
    "topic": "...",
    "type": "Technical_Solution",
    "keywords": ["..."]
  },
  "options": {
    "priority": 1,
    "attempts": 3
  }
}
```

### SEO Optimization Queue

**Queue Name:** seo-optimization

---

## Scheduled Tasks

| Task | Schedule | Mô tả |
|------|----------|-------|
| Daily SEO Audit | 2:00 AM daily | Phân tích SEO cho tất cả bài viết published |
| Content Refresh | Sunday 3:00 AM | Cập nhật khuyến nghị nội dung |

---

## Integration with CMS

Backend giao tiếp với Payload CMS qua HTTP REST API.

> **Source:** `apps/backend/src/payload/payload.service.ts`
> **Base URL:** `PAYLOAD_PUBLIC_SERVER_URL` hoặc `http://localhost:4001/api`

**Supported operations:**
- Create article (`POST /api/articles`)
- Update article (`PATCH /api/articles/:id`)
- Get articles (`GET /api/articles`)
- Get single article (`GET /api/articles/:id`)

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "AI_GENERATION_FAILED",
    "message": "Failed to generate content",
    "details": "Provider timeout after 30s"
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Invalid request parameters |
| AI_GENERATION_FAILED | AI provider error |
| AI_PROVIDER_UNAVAILABLE | Không có AI provider khả dụng |
| RATE_LIMIT_EXCEEDED | Vượt quá giới hạn request |
| UNAUTHORIZED | Thiếu hoặc sai API key |
| CMS_CONNECTION_ERROR | Không kết nối được CMS |

---

## Module Structure

> **Source:** `apps/backend/src/app.module.ts`

```
AppModule
├── ConfigModule          — Environment configuration
├── HttpModule            — HTTP client
├── ScheduleModule        — Cron jobs (@nestjs/schedule)
├── BullModule            — Job queue (BullMQ + Redis)
├── RedisModule           — Cache, rate limiting
├── AIModule              — AI generation (DeepSeek/OpenAI)
├── AutomationModule      — Scheduled tasks
├── QueueModule           — Background job processors
├── PayloadModule         — CMS integration
└── RAGModule             — RAG chatbot
```
