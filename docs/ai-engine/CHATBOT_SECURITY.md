# Chatbot Security & Optimization

Tài liệu kỹ thuật cho các cải tiến bảo mật và tối ưu của RAG Chatbot.

---

## Tổng quan

Chatbot đã được nâng cấp với các tính năng:
- **Rate Limiting** - 3 tầng giới hạn tần suất
- **Input Validation** - Giới hạn 500 ký tự, chặn prompt injection
- **Session Management** - Redis-backed với TTL 30 phút
- **Response Caching** - Tối ưu chi phí DeepSeek

---

## Rate Limiting

### Cấu hình (`.env`)

| Variable | Default | Mô tả |
|----------|---------|-------|
| `CHATBOT_RATE_LIMIT_IP` | 5 | Số request/phút mỗi IP |
| `CHATBOT_RATE_LIMIT_SESSION` | 20 | Số request/giờ mỗi session |
| `CHATBOT_RATE_LIMIT_GLOBAL` | 100 | Số request/phút toàn hệ thống |

### Response khi vượt giới hạn

```json
{
  "success": false,
  "error": "Too many requests",
  "message": "Rate limit exceeded (IP). Please try again later.",
  "retryAfter": 45
}
```
HTTP Status: **429 Too Many Requests**

---

## Input Validation

### Giới hạn ký tự

- Max: **500 ký tự** (có thể điều chỉnh qua `CHATBOT_MAX_QUESTION_LENGTH`)
- Trả về 400 Bad Request nếu vượt quá

### Prompt Injection Detection

Chặn các pattern:
- `ignore all previous instructions`
- `system prompt`
- `reveal your instructions`
- `you are now...` (trừ technical roles)
- `jailbreak`, `dan mode`, `developer mode`

**Whitelist** cho các câu hỏi kỹ thuật hợp lệ:
- `technical advisor/consultant`
- `van fisher`
- `thông số kỹ thuật`

---

## Session Management

### Client-side

Frontend tạo UUID lưu trong `localStorage` với key `tte_chat_session_id`:

```typescript
// Tự động tạo khi load component
const STORAGE_KEY = "tte_chat_session_id";
let storedId = localStorage.getItem(STORAGE_KEY);
if (!storedId) {
    storedId = uuidv4();
    localStorage.setItem(STORAGE_KEY, storedId);
}
```

### Server-side (Redis)

- Key pattern: `chat:session:{sessionId}`
- TTL: **30 phút** (tự động xóa nếu inactive)
- Giữ tối đa **3 lượt** hội thoại gần nhất

---

## Response Caching

### Cơ chế

1. Hash câu hỏi: `SHA256(normalize(question) + language)`
2. Tra Redis với key `chat:cache:{hash}`
3. Nếu có → Trả về ngay (tốn $0)
4. Nếu không → Gọi AI, lưu cache

### Normalization

- Lowercase
- Remove extra whitespace
- Remove punctuation (`?!.,;:'"`)

### TTL

Mặc định: **24 giờ** (`CHATBOT_CACHE_TTL=86400`)

---

## CORS Configuration

Cho phép domains:
- `http://localhost:*` (development)
- `https://toanthang.vn`
- `https://www.toanthang.vn`
- `https://cms.toanthang.vn`
- `https://api.toanthang.vn`
- `https://admin.toanthang.vn`

---

## Future: Cloudflare Turnstile

> [!NOTE]
> **Chưa implement** - Sẽ thêm ở phase sau để chống bot.

### Kế hoạch

1. Tạo Cloudflare Turnstile site tại [dash.cloudflare.com](https://dash.cloudflare.com)
2. Thêm `TURNSTILE_SITE_KEY` và `TURNSTILE_SECRET_KEY` vào `.env`
3. Thêm Turnstile widget vào frontend chat component
4. Validate token tại backend trước khi cho phép chat

---

## Files

| File | Mô tả |
|------|-------|
| `src/common/redis/redis.module.ts` | Global Redis module |
| `src/common/guards/chatbot-throttler.guard.ts` | 3-tier rate limiting |
| `src/common/guards/prompt-injection.guard.ts` | Input sanitization |
| `src/rag/chatbot-session.service.ts` | Session management |
| `src/rag/chatbot-cache.service.ts` | Response caching |

---

## API Changes

### POST /api/rag/chat

**Request:**
```json
{
  "question": "Van Fisher HP có thông số gì?",
  "language": "vi",
  "sessionId": "uuid-from-localstorage"
}
```

**Response (with caching):**
```json
{
  "success": true,
  "data": { ... },
  "cached": true
}
```

---

## UX Improvements

### Message Persistence

Chat messages được lưu vào `localStorage` và khôi phục khi refresh/đóng mở chatbot:

- Key: `tte_chat_messages`
- Giới hạn: 20 tin nhắn gần nhất
- Tự động load khi component mount

### No-Results Fallback

Khi không tìm thấy thông tin, AI tự động trả về thông tin liên hệ:

> Xin lỗi, tôi chưa tìm thấy thông tin này trong tài liệu kỹ thuật hiện có.
> Để được hỗ trợ nhanh nhất, vui lòng liên hệ:
>
> 📞 Điện thoại: (84-254) 3522219
> 📧 Email: tts@toanthang.vn
>
> Đội ngũ kỹ thuật TTE sẽ phản hồi trong thời gian sớm nhất!
