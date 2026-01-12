# Data Flow

## Overview

This document describes how data flows through the TTE platform, from content creation in the CMS to display on the public website.

---

## Content Management Flow

```
[Content Editor]
       |
       v
+-------------+
|   CMS Admin |
|  (Payload)  |
+-------------+
       |
       | POST /api/products
       v
+-------------+
| PostgreSQL  |
|  Database   |
+-------------+
       |
       | Webhook / Poll
       v
+-------------+
| Next.js ISR |
|   (Web)     |
+-------------+
       |
       v
  [Website]
```

---

## API Request Flow

### Frontend Data Fetching

```
[User Browser]
       |
       | Request page
       v
+------------------+
| Next.js Server   |
| (apps/web)       |
+------------------+
       |
       | Fetch data from CMS
       |
       +------ Option A: CMS Available ------+
       |                                      |
       v                                      v
+------------------+              +------------------+
| Payload CMS API  |              | Static Fallback  |
| GET /api/...     |              | (lib/data.ts)    |
+------------------+              +------------------+
       |                                      |
       +--------------------------------------+
       |
       v
+------------------+
| Render Page      |
| Send HTML        |
+------------------+
       |
       v
[User Browser]
```

---

## AI Content Generation Flow

```
[Admin Dashboard]
       |
       | Trigger generation
       v
+------------------+
| Backend API      |
| POST /api/ai/    |
+------------------+
       |
       | Queue job
       v
+------------------+
| Redis (BullMQ)   |
| Job Queue        |
+------------------+
       |
       | Process job
       v
+------------------+
| AI Router        |
+------------------+
       |
       +---- Stage 1: Draft ----+
       |                        |
       v                        v
+-------------+         +-------------+
| DeepSeek    |   or    | OpenAI      |
| (Cost-opt)  |         | (Quality)   |
+-------------+         +-------------+
       |
       v
+------------------+
| Content          |
| Generator        |
+------------------+
       |
       | Polish content
       v
+------------------+
| SEO Optimizer    |
+------------------+
       |
       | Save to CMS
       v
+------------------+
| Payload API      |
| POST /api/       |
| articles         |
+------------------+
       |
       v
+------------------+
| PostgreSQL       |
+------------------+
```

---

## Data Fetching Strategy

### Server-Side Rendering (SSR)

Used for dynamic pages requiring fresh data.

```typescript
// app/products/[slug]/page.tsx
export default async function Page({ params }) {
  const product = await getProduct(params.slug);
  return <ProductPage product={product} />;
}
```

### Incremental Static Regeneration (ISR)

Used for semi-static pages with periodic updates.

```typescript
// Cache for 60 seconds
const res = await fetch(url, {
  next: { revalidate: 60 }
});
```

### Static Generation

Used for truly static pages.

```typescript
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(p => ({ slug: p.slug }));
}
```

---

## Caching Layers

### Layer 1: Next.js Data Cache

- Built-in fetch caching
- Revalidation: 60 seconds default
- Stored in `.next/cache`

### Layer 2: Redis Cache (Backend)

- API response caching
- Session storage
- Rate limit counters

### Layer 3: CDN (Production)

- Static assets
- ISR pages
- Media files

---

## Authentication Flow

### CMS Admin Login

```
[Admin Browser]
       |
       | Email + Password
       v
+------------------+
| Payload CMS      |
| /admin/login     |
+------------------+
       |
       | Validate credentials
       v
+------------------+
| PostgreSQL       |
| users table      |
+------------------+
       |
       | Generate JWT
       v
+------------------+
| Set HTTP-only    |
| Session Cookie   |
+------------------+
       |
       v
[CMS Admin Panel]
```

### API Authentication

```
[Client Application]
       |
       | API Key in header
       | Authorization: Bearer <key>
       v
+------------------+
| API Middleware   |
| Validate Key     |
+------------------+
       |
       | Valid?
       +------ Yes ------+------ No ------+
       |                 |                |
       v                 v                v
  [Process]        [401 Error]       [Log Attempt]
```

---

## Error Handling Flow

```
[Request]
    |
    v
+------------------+
| Try API Call     |
+------------------+
    |
    +------ Success ------+------ Failure ------+
    |                     |                      |
    v                     v                      |
[Return Data]       [Check Type]                 |
                         |                       |
    +--------------------+--------------------+  |
    |                    |                    |  |
    v                    v                    v  |
[Network]           [CMS Down]           [Timeout]
    |                    |                    |  |
    +--------------------+--------------------+  |
                         |                       |
                         v                       |
                  [Fallback to]                  |
                  [Static Data]                  |
                         |                       |
                         v                       v
                   [Return Data]            [Return 503]
```

---

## Webhook Flow (Optional)

For real-time updates after CMS changes:

```
[CMS Save Action]
       |
       | Payload Webhook
       v
+------------------+
| Backend Webhook  |
| Endpoint         |
+------------------+
       |
       | Invalidate cache
       v
+------------------+
| Redis            |
| Clear Keys       |
+------------------+
       |
       | Trigger revalidation
       v
+------------------+
| Next.js          |
| revalidatePath() |
+------------------+
```

---

## State Management

### Server State (Primary)

All content data is server-state, fetched at request time.

| Data Type | Source | Caching |
|-----------|--------|---------|
| Products | CMS API | ISR 60s |
| Projects | CMS API | ISR 60s |
| Articles | CMS API | ISR 60s |
| Globals | CMS API | ISR 300s |

### Client State (Minimal)

| State | Storage | Purpose |
|-------|---------|---------|
| Theme | localStorage | Dark/light mode |
| Language | Cookie | Locale preference |
| Form Data | React State | Form inputs |
