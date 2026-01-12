# CMS API Reference

## Overview

The Payload CMS provides a REST API for all collections and globals. The API follows REST conventions and returns JSON responses.

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
# Exact match
?where[status][equals]=published

# Not equal
?where[type][not_equals]=draft

# Relationship filter
?where[brand][equals]=<brand_id>

# Multiple conditions
?where[status][equals]=published&where[type][equals]=Technical_Solution
```

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

**List Products:**

```
GET /api/products?limit=10&depth=2&where[status][equals]=published
```

**Response:**

```json
{
  "docs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Gas Processing System",
      "slug": "gas-processing-system",
      "modelNumber": "GPS-5000",
      "shortDescription": "High-performance gas processing system",
      "brand": {
        "id": "...",
        "name": "Emerson",
        "slug": "emerson"
      },
      "category": {
        "id": "...",
        "name": "Filtration Systems",
        "slug": "filtration"
      },
      "industries": [
        { "id": "...", "name": "Oil & Gas", "slug": "oil-gas" }
      ],
      "images": [
        { "id": "...", "url": "/media/image.jpg" }
      ],
      "status": "published"
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
GET /api/services?sort=order
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

**List Technical Articles:**

```
GET /api/articles?where[type][equals]=Technical_Solution&sort=-publishedAt
```

**List News:**

```
GET /api/articles?where[type][in]=TTE_Event,Industry_News&sort=-publishedAt
```

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

**List Open Positions:**

```
GET /api/vacancies?where[status][equals]=open
```

---

## Taxonomy Collections

### Brands

```
GET /api/brands
GET /api/brands/:id
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

**Response:**

```json
{
  "heroTitle": "Welcome",
  "heroSubtitle": "Industrial Solutions",
  "heroImage": { "id": "...", "url": "/media/hero.jpg" },
  "featuredProducts": [...],
  "featuredProjects": [...]
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
If a field is not translated, the default locale (en) value is returned.

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| General | 30 requests/second |
| API | 10 requests/second |

Exceeded limits return HTTP 429.
