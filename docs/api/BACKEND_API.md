# Backend API Reference

## Overview

The NestJS Backend provides AI-powered services for content generation and SEO optimization. It integrates with the CMS and uses a multi-provider AI routing system.

---

## Base URL

| Environment | URL |
|-------------|-----|
| Development | http://localhost:4002/api |
| Production | https://api.toanthang.vn/api |

---

## Authentication

API requests require authentication via API key:

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
  "timestamp": "2026-01-12T00:00:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "cms": "connected"
  }
}
```

---

## AI Content Generation

### Generate Article

Generates a complete article with SEO optimization.

```
POST /api/ai/generate
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
| topic | string | Yes | Article topic |
| type | enum | Yes | Technical_Solution, TTE_Event, Industry_News |
| keywords | string[] | Yes | Target keywords (3-10) |
| language | enum | No | vi, en (default: vi) |
| targetLength | number | No | Word count (default: 1000) |
| tone | string | No | Writing tone (default: professional) |

**Response:**

```json
{
  "success": true,
  "data": {
    "title": "Huong dan Lua chon Van Cong nghiep",
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

Analyzes content and generates SEO recommendations.

```
POST /api/ai/optimize
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

## AI Provider Routing

The backend uses an intelligent routing system to optimize cost and quality.

### Routing Logic

| Stage | Provider | Reasoning |
|-------|----------|-----------|
| Draft | DeepSeek | Cost-effective for initial generation |
| Polish | OpenAI | High quality for final refinement |
| SEO | DeepSeek | Cost-effective for analysis |

### Provider Configuration

```
DEEPSEEK_API_KEY=<key>
OPENAI_API_KEY=<key>
```

**Fallback Behavior:**
If primary provider fails, routes to secondary provider.

---

## Background Jobs

### Content Generation Queue

Jobs are processed asynchronously via BullMQ.

**Queue Name:** content-generation

**Job Data:**

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

### Daily SEO Audit

- **Schedule:** 2:00 AM daily
- **Function:** Analyzes all published articles for SEO issues

### Content Refresh

- **Schedule:** Weekly (Sunday 3:00 AM)
- **Function:** Updates outdated content recommendations

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
| AI_PROVIDER_UNAVAILABLE | No AI providers available |
| RATE_LIMIT_EXCEEDED | Too many requests |
| UNAUTHORIZED | Missing or invalid API key |
| CMS_CONNECTION_ERROR | Cannot connect to CMS |

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/ai/generate | 10 | per minute |
| /api/ai/optimize | 20 | per minute |
| /api/health | unlimited | - |

---

## Integration with CMS

### Publishing Generated Articles

After generating an article, publish directly to CMS:

```
POST /api/ai/generate-and-publish
```

**Request Body:**

```json
{
  "topic": "...",
  "type": "Technical_Solution",
  "keywords": ["..."],
  "publish": true,
  "collection": "articles"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "articleId": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "generated-slug",
    "status": "draft",
    "previewUrl": "https://cms.toanthang.vn/admin/collections/articles/550e8400-e29b-41d4-a716-446655440000"
  }
}
```
