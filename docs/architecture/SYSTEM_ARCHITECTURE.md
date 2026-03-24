# System Architecture

## Overview

Nền tảng TTE được xây dựng dưới dạng monorepo chứa 4 ứng dụng chính: website công khai (Next.js), hệ thống quản lý nội dung (Payload CMS), backend AI services (NestJS), và AI engine RAG chatbot (FastAPI/Python).

---

## High-Level Architecture

```
                                    Internet
                                        |
                                   [Nginx Reverse Proxy]
                                   (SSL Termination)
                                        |
                    +-------------------+-------------------+
                    |                   |                   |
              toanthang.vn      cms.toanthang.vn    api.toanthang.vn
                    |                   |                   |
              +-----+-----+       +-----+-----+       +-----+-----+
              |           |       |           |       |           |
              | Next.js   |       | Payload   |       | NestJS    |
              | Frontend  |       | CMS       |       | Backend   |
              | :4000     |       | :4001     |       | :4002     |
              +-----------+       +-----------+       +-----------+
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                    +-------------------+-------------------+
                    |                   |                   |
              +-----+-----+       +-----+-----+       +-----+-----+
              | PostgreSQL|       |   Redis   |       | AI Engine |
              |   :5434   |       |   :6381   |       | (FastAPI) |
              +-----------+       +-----------+       |   :4003   |
                                                      +-----------+
                                                            |
                                                      +-----+-----+
                                                      |  Qdrant   |
                                                      | (Vector)  |
                                                      +-----------+
```

---

## Application Components

### 1. Web Frontend (apps/web)

| Attribute | Value |
|-----------|-------|
| Framework | Next.js 16.0.0 |
| Runtime | React 19.2.0 |
| Styling | Tailwind CSS 4.x |
| Port | 4000 |

**Responsibilities:**
- Server-side rendering for SEO
- Public website pages
- Product catalog display
- Contact forms
- Static content delivery

**Key Features:**
- Hybrid data fetching (CMS API with static fallback)
- Internationalization support (en, vi)
- Image optimization
- SEO metadata management

---

### 2. CMS (apps/cms)

| Attribute | Value |
|-----------|-------|
| Framework | Payload CMS 3.70.0 |
| Admin UI | Next.js 15.4.10 |
| Database | PostgreSQL via Drizzle ORM |
| Port | 4001 |

**Responsibilities:**
- Content management admin panel
- REST and GraphQL API
- Media asset management
- User authentication and authorization
- Localization management

**Key Features:**
- Role-based access control (admin, editor, marketing)
- Lexical rich text editor
- Automatic slug generation
- Vietnamese character support

---

### 3. Backend (apps/backend)

| Attribute | Value |
|-----------|-------|
| Framework | NestJS 10.4.x |
| Queue | BullMQ with Redis |
| AI Providers | DeepSeek, OpenAI |
| Port | 4002 |

**Responsibilities:**
- AI content generation
- SEO optimization
- Background job processing
- Scheduled tasks
- CMS integration

**Key Features:**
- AI provider routing (cost optimization)
- Content generation pipeline
- Cron job scheduling
- Rate limiting

---

### 4. AI Engine (apps/ai-engine)

| Attribute | Value |
|-----------|-------|
| Framework | FastAPI (Python 3.11+) |
| RAG | LlamaIndex + Qdrant |
| PDF Parser | LlamaParse |
| Port | 4003 |

**Responsibilities:**
- RAG chatbot pipeline
- PDF document ingestion
- Vector search (Qdrant Cloud)
- Google Drive knowledge sync

**Key Features:**
- Bilingual support (EN/VI)
- Embedding: Voyage 3.5-lite
- Table-aware PDF parsing
- Conversation history management

---

## Data Storage

### PostgreSQL (Primary Database)

- **Purpose:** Persistent data storage for CMS
- **Port:** 5434 (external), 5432 (internal)
- **Schema:** Managed by Payload CMS via Drizzle ORM
- **Backups:** Automated daily backups

### Redis (Cache and Queue)

- **Purpose:** Session cache, job queue storage
- **Port:** 6381 (external), 6379 (internal)
- **Usage:** BullMQ job queue, rate limiting

---

## Communication Patterns

### Frontend to CMS

```
[Next.js Frontend] --HTTP/REST--> [Payload CMS API]
                                       |
                                  /api/products
                                  /api/projects
                                  /api/globals/homepage
```

### Frontend to Backend

```
[Next.js Frontend] --HTTP/REST--> [NestJS Backend]
                                       |
                                  /api/ai/generate/article
                                  /api/ai/optimize/seo
                                  /api/rag/chat
```

### Backend to AI Engine

```
[NestJS Backend] --HTTP/REST--> [FastAPI AI Engine]
                                     |
                                /api/chat
                                /api/ingest
                                /api/gdrive/sync
```

### Backend to CMS

```
[NestJS Backend] --HTTP/REST--> [Payload CMS API]
                                     |
                                POST /api/articles
                                PATCH /api/articles/:id
```

---

## Security Architecture

### Network Security

- All external traffic via HTTPS (TLS 1.2+)
- Internal services communicate over private network
- Database and Redis not exposed to public

### Authentication

| Layer | Method |
|-------|--------|
| CMS Admin | Session-based with JWT |
| API Access | API Key authentication |
| Inter-service | Internal network only |

### Rate Limiting

| Endpoint | Limit |
|----------|-------|
| General | 30 req/s per IP |
| API | 10 req/s per IP |

---

## Scalability Considerations

### Horizontal Scaling

- Web and Backend services stateless
- Redis for shared session state
- Database connection pooling

### Caching Strategy

- Next.js ISR for static pages (60s revalidation)
- Redis caching for API responses
- CDN for static assets

---

## Monitoring Points

| Component | Endpoint |
|-----------|----------|
| Web | http://localhost:4000 |
| CMS | http://localhost:4001/api/health |
| Backend | http://localhost:4002/api/health |
| AI Engine | http://localhost:4003/health |
| PostgreSQL | pg_isready |
| Redis | PING |
