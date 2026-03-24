# CMS API Reference

## Overview

Payload CMS cung cấp REST API cho tất cả collections và globals. API trả về JSON responses.

> **Source:** `apps/cms/src/payload.config.ts`
> **Schema chi tiết:** xem [CMS Current State](../cms/current-state.md) và [Data Model](../cms/data-model.md)

---

## Base URL

| Environment | URL |
|-------------|-----|
| Development | http://localhost:4001/api |
| Production | https://cms.toanthang.vn/api |

---

## Authentication

### Admin API Key

Include the API key in the request header:

```
Authorization: Bearer <API_KEY>
```

### Public Endpoints

The following endpoints are publicly accessible:
- GET requests to published content
- Collections with public read access

---

## Response Format

### Success Response

```json
{
  "docs": [...],
  "totalDocs": 100,
  "limit": 10,
  "page": 1,
  "totalPages": 10,
  "hasNextPage": true,
  "hasPrevPage": false,
  "pagingCounter": 1
}
```

### Single Document

```json
{
  "id": "uuid",
  "name": "...",
  "slug": "...",
  "createdAt": "2026-01-12T00:00:00.000Z",
  "updatedAt": "2026-01-12T00:00:00.000Z"
}
```

### Error Response

```json
{
  "errors": [
    {
      "message": "Error description",
      "field": "fieldName"
    }
  ]
}
```

---

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Number of results per page (default: 10) |
| page | number | Page number (default: 1) |
| depth | number | Relationship population depth (default: 0) |
| locale | string | Locale code (en, vi) |
| sort | string | Sort field, prefix with - for descending |
| where | object | Query filters |

### Where Query Examples

```
# Published products (dùng _status từ Payload versions)
?where[_status][equals]=published

# Relationship filter
?where[brand][equals]=<brand_id>

# Multiple conditions
?where[_status][equals]=published&where[contentType][equals]=news

# Not equal
?where[contentType][not_equals]=tech-hub
```

> **Lưu ý:** Collections có `versions: { drafts: true }` (Products, Projects, Articles, Vacancies)
> sử dụng field `_status` (không phải `status`) với giá trị `draft` hoặc `published`.

---

## Collections API

### Products

**Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /products | List all products |
| GET | /products/:id | Get single product |
| POST | /products | Create product |
| PATCH | /products/:id | Update product |
| DELETE | /products/:id | Delete product |

**List Published Products:**

```
GET /api/products?limit=10&depth=2&where[_status][equals]=published
```

**Response (depth=2):**

```json
{
  "docs": [
    {
      "id": 1,
      "name": "Hệ Thống Xử Lý Khí",
      "slug": "he-thong-xu-ly-khi",
      "modelNumber": "GPS-5000",
      "shortDescription": "Hệ thống xử lý khí công nghiệp hiệu suất cao",
      "brand": {
        "id": 1,
        "name": "Emerson",
        "slug": "emerson",
        "logo": { "id": 10, "url": "/media/emerson-logo.png" }
      },
      "subBrand": null,
      "category": {
        "id": 5,
        "name": "Hệ thống lọc",
        "slug": "filtration"
      },
      "industries": [
        { "id": 1, "name": "Dầu khí", "slug": "oil-gas" }
      ],
      "images": [
        { "id": 20, "url": "/media/gps-5000.jpg", "alt": "GPS-5000" }
      ],
      "catalogPDF": [],
      "specifications": [
        { "label": "Áp suất tối đa", "value": "100", "unit": "Bar" }
      ],
      "seo": {
        "metaTitle": null,
        "metaDescription": null
      },
      "featured": false,
      "sortOrder": 0,
      "_status": "published",
      "createdAt": "2026-01-12T00:00:00.000Z",
      "updatedAt": "2026-03-24T00:00:00.000Z"
    }
  ],
  "totalDocs": 50,
  "limit": 10,
  "page": 1
}
```

---

### Projects

**Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /projects | List all projects |
| GET | /projects/:id | Get single project |
| POST | /projects | Create project |
| PATCH | /projects/:id | Update project |
| DELETE | /projects/:id | Delete project |

**List Projects:**

```
GET /api/projects?depth=2&sort=-completionYear
```

---

### Services

**Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /services | List all services |
| GET | /services/:id | Get single service |
| POST | /services | Create service |
| PATCH | /services/:id | Update service |
| DELETE | /services/:id | Delete service |

**List Services:**

```
GET /api/services?sort=name
```

---

### Articles

**Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /articles | List all articles |
| GET | /articles/:id | Get single article |
| POST | /articles | Create article |
| PATCH | /articles/:id | Update article |
| DELETE | /articles/:id | Delete article |

**List Tech Hub articles:**

```
GET /api/articles?where[contentType][equals]=tech-hub&sort=-publishedAt
```

**List News:**

```
GET /api/articles?where[contentType][equals]=news&sort=-publishedAt
```

> **Lưu ý:** Articles dùng field `contentType` (giá trị: `news`, `tech-hub`) không phải `type`.

---

### Vacancies

**Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /vacancies | List all vacancies |
| GET | /vacancies/:id | Get single vacancy |
| POST | /vacancies | Create vacancy |
| PATCH | /vacancies/:id | Update vacancy |
| DELETE | /vacancies/:id | Delete vacancy |

**List Published Vacancies:**

```
GET /api/vacancies?where[_status][equals]=published
```

---

## Taxonomy Collections

### Brands

```
GET /api/brands
GET /api/brands/:id
```

### Sub-Brands

```
GET /api/sub-brands
GET /api/sub-brands/:id

# Lọc sub-brands theo brand
GET /api/sub-brands?where[parentBrand][equals]=<brand_id>
```

### Product Categories

```
GET /api/product-categories
GET /api/product-categories/:id
```

### Industries

```
GET /api/industries
GET /api/industries/:id
```

---

## Globals API

Globals are singletons accessed without pagination.

### Homepage

```
GET /api/globals/homepage
PATCH /api/globals/homepage
```

**Response (depth=2):**

```json
{
  "heroTitle": "Welcome",
  "heroSubtitle": "Industrial Solutions",
  "heroBanner": { "id": 1, "url": "/media/hero.jpg", "alt": "Hero" },
  "featuredProjects": [
    { "id": 1, "name": "...", "slug": "..." }
  ],
  "featuredBrands": [
    { "id": 1, "name": "Emerson", "slug": "emerson" }
  ],
  "seo": {
    "metaTitle": "...",
    "metaDescription": "...",
    "shareImage": null
  }
}
```

### About Page

```
GET /api/globals/about-page
PATCH /api/globals/about-page
```

### Contact Page

```
GET /api/globals/contact-page
PATCH /api/globals/contact-page
```

---

## Media API

### Upload Media

```
POST /api/media
Content-Type: multipart/form-data

file: <binary>
alt: "Image description"
```

**Response:**

```json
{
  "id": "...",
  "filename": "image.jpg",
  "mimeType": "image/jpeg",
  "filesize": 102400,
  "width": 1920,
  "height": 1080,
  "url": "/api/media/file/image.jpg"
}
```

### Get Media

```
GET /api/media/:id
```

---

## Localization

Include locale parameter to get localized content:

```
GET /api/products?locale=vi
GET /api/globals/homepage?locale=vi
```

**Fallback Behavior:**
Nếu field chưa được dịch, giá trị locale mặc định (`vi`) sẽ được trả về.

> **Lưu ý:** Default locale là `vi` (không phải `en`). Xem `payload.config.ts:86`.

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| General | 30 requests/second |
| API | 10 requests/second |

Exceeded limits return HTTP 429.
