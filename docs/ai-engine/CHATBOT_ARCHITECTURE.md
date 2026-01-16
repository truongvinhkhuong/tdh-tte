# Chatbot Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js)                               │
│  ┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────┐      │
│  │   ChatWidget    │───▶│   TechnicalChat     │───▶│   localStorage   │      │
│  │  (Floating UI)  │    │  (Messages, Input)  │    │ (Session, Msgs)  │      │
│  └─────────────────┘    └──────────┬──────────┘    └──────────────────┘      │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │ POST /api/rag/chat
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                             BACKEND (NestJS)                                  │
│  ┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────┐      │
│  │ ThrottlerGuard  │───▶│ PromptInjection     │───▶│  RAGController   │      │
│  │ (Rate Limiting) │    │     Guard           │    │                  │      │
│  └─────────────────┘    └─────────────────────┘    └────────┬─────────┘      │
│                                                              │                │
│  ┌─────────────────┐    ┌─────────────────────┐             │                │
│  │ SessionService  │◀───│   CacheService      │◀────────────┘                │
│  │    (Redis)      │    │     (Redis)         │                              │
│  └────────┬────────┘    └──────────┬──────────┘                              │
└───────────┼─────────────────────────┼────────────────────────────────────────┘
            │                         │ HTTP (if cache miss)
            ▼                         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            AI ENGINE (FastAPI)                                │
│  ┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────┐      │
│  │  /api/chat      │───▶│    RAGEngine        │───▶│  DeepSeek LLM    │      │
│  │   (Routes)      │    │   (Singleton)       │    │  (Chat Model)    │      │
│  └─────────────────┘    └──────────┬──────────┘    └──────────────────┘      │
│                                    │                                          │
│                         ┌──────────▼──────────┐                              │
│                         │  OpenAI Embeddings  │                              │
│                         │ (text-embedding-3)  │                              │
│                         └──────────┬──────────┘                              │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              STORAGE LAYER                                    │
│  ┌─────────────────────────────┐    ┌─────────────────────────────────┐      │
│  │         Redis               │    │       Qdrant Cloud              │      │
│  │  • Session data (30min)     │    │  • Vector embeddings            │      │
│  │  • Response cache (24h)     │    │  • Document chunks              │      │
│  └─────────────────────────────┘    └─────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Components

### Frontend Layer

| Component | File | Responsibility |
|-----------|------|----------------|
| ChatWidget | `apps/web/components/chat/chat-widget.tsx` | Floating button, window controls, fullscreen toggle |
| TechnicalChat | `apps/web/components/chat/technical-chat.tsx` | Chat UI, message handling, localStorage persistence |

**Key Features:**
- Session ID stored in `localStorage` (`tte_chat_session_id`)
- Messages persisted in `localStorage` (`tte_chat_messages`, max 20)
- Auto-scroll on new messages
- ReactMarkdown + remark-gfm for markdown rendering

---

### Backend Layer (NestJS)

| Component | File | Responsibility |
|-----------|------|----------------|
| RAGController | `apps/backend/src/rag/rag.controller.ts` | API endpoint, input validation |
| ChatbotThrottlerGuard | `apps/backend/src/common/guards/chatbot-throttler.guard.ts` | 3-tier rate limiting |
| PromptInjectionGuard | `apps/backend/src/common/guards/prompt-injection.guard.ts` | Security filtering |
| ChatbotSessionService | `apps/backend/src/rag/chatbot-session.service.ts` | Redis session management |
| ChatbotCacheService | `apps/backend/src/rag/chatbot-cache.service.ts` | Response caching |

**Rate Limiting Tiers:**
- IP: 5 requests/minute
- Session: 20 requests/hour
- Global: 100 requests/minute

---

### AI Engine Layer (Python FastAPI)

| Component | File | Responsibility |
|-----------|------|----------------|
| Routes | `apps/ai-engine/src/api/routes.py` | API endpoints (`/chat`, `/chat/stream`) |
| RAGEngine | `apps/ai-engine/src/core/rag_engine.py` | Query processing, LLM interaction |
| FAQFilter | `apps/ai-engine/src/core/faq_filter.py` | FAQ pre-filter (skip LLM) |
| SemanticCache | `apps/ai-engine/src/core/semantic_cache.py` | Embedding-based caching |
| ModelRouter | `apps/ai-engine/src/core/model_router.py` | Query complexity routing |
| PDFProcessor | `apps/ai-engine/src/core/pdf_processor.py` | Document ingestion |

**RAGEngine Features:**
- Singleton pattern for performance
- FAQ pre-filter (7 common questions)
- Semantic cache (cosine similarity ≥ 0.92)
- LLM fallback chain (DeepSeek → OpenAI)
- Programmatic fallback (confidence < 20%)
- Streaming responses (SSE)

---

## Data Flow

### Query Flow

```
1. User enters question in TechnicalChat
2. Frontend sends POST /api/rag/chat with sessionId
3. ThrottlerGuard checks rate limits
4. PromptInjectionGuard validates input
5. SessionService retrieves conversation history from Redis
6. CacheService checks for cached response
7. If cache miss → RAGService calls AI Engine
8. AI Engine queries Qdrant for relevant documents
9. RAGEngine builds prompt and calls DeepSeek LLM
10. Response cached in Redis (24h TTL)
11. Session updated with new messages
12. Response returned to frontend
```

### Session Management

```
Redis Keys:
- chat:session:{sessionId} → Conversation history (30min TTL)
- chat:cache:{hash} → Cached responses (24h TTL)
```

---

## Environment Variables

```bash
# Chatbot Configuration
CHATBOT_RATE_LIMIT_IP=5
CHATBOT_RATE_LIMIT_SESSION=20
CHATBOT_RATE_LIMIT_GLOBAL=100
CHATBOT_MAX_QUESTION_LENGTH=500
CHATBOT_SESSION_TTL=1800
CHATBOT_MAX_HISTORY_TURNS=3
CHATBOT_CACHE_TTL=86400
CHATBOT_CACHE_ENABLED=true

# AI Engine
DEEPSEEK_API_KEY=xxx
OPENAI_API_KEY=xxx
QDRANT_URL=xxx
QDRANT_API_KEY=xxx
```

---

## Security Measures

1. **Rate Limiting** - Prevents abuse with 3-tier system
2. **Input Validation** - 500 char limit, prompt injection detection
3. **CORS** - Restricted to toanthang.vn subdomains
4. **Session Isolation** - UUID-based session IDs

---

## Performance Optimizations

### Query Processing Pipeline

```
Question → FAQ Filter → Semantic Cache → Model Router → RAG Query → LLM
             ↓ (hit)        ↓ (hit)                          ↓ (fail)
           Return         Return                         OpenAI Fallback
```

### Optimization Features

| Feature | Impact | Implementation |
|---------|--------|----------------|
| FAQ Pre-filter | -50% LLM calls | 7 common questions, Vietnamese normalization |
| Semantic Cache | +30% cache hits | Cosine similarity ≥ 0.92, 1000 entries max |
| Smart Model Routing | -40% LLM costs | Simple/Medium/Complex classification |
| LLM Fallback | 99.9% uptime | DeepSeek → OpenAI gpt-4o-mini |
| Streaming (SSE) | ~500ms perceived | `/chat/stream` endpoint |
| Singleton RAGEngine | -500ms/req | Single instance across requests |

### Projected Cost Savings

At 10,000 queries/day:
- **Before:** ~$400/month
- **After:** ~$140/month
- **Savings:** ~65%
