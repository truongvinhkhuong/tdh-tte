# Database Schema

> **⚠️ DEPRECATED:** Tài liệu này đã lỗi thời và có nhiều điểm sai so với code thực tế.
> Xem **[/docs/cms/current-state.md](../cms/current-state.md)** để có thông tin chính xác.
> Chi tiết các điểm sai: [/docs/cms/issues-and-gaps.md — ISS-014](../cms/issues-and-gaps.md#iss-014-schemamd-outdated-15-inaccuracies)

## Overview

The TTE platform uses PostgreSQL as its primary database, managed by Payload CMS through Drizzle ORM. This document describes the schema structure for all collections.

---

## Database Configuration

| Property | Value |
|----------|-------|
| Database | PostgreSQL 16 |
| ORM | Drizzle (via Payload) |
| Port | 5434 (dev), internal (prod) |
| Database Name | tte_cms |

---

## Entity Relationship Diagram

```
+-------------+       +------------------+       +------------+
|   Brands    |       | ProductCategories|       | Industries |
+-------------+       +------------------+       +------------+
| id          |       | id               |       | id         |
| name        |       | name             |       | name       |
| slug        |       | slug             |       | slug       |
| logo        |       +------------------+       +------------+
| description |             |                        |
| subBrands   |             |                        |
+-------------+             |                        |
      |                     v                        |
      |          +-------------------+               |
      +--------->|     Products      |<--------------+
                 +-------------------+
                 | id                |
                 | name              |
                 | slug              |
                 | modelNumber       |
                 | description       |
                 | images (Media)    |
                 | brand (rel)       |
                 | category (rel)    |
                 | industries (rel)  |
                 | specifications    |
                 | documents         |
                 +-------------------+
                          |
                          v
                 +-------------------+
                 |     Projects      |
                 +-------------------+
                 | id                |
                 | title             |
                 | slug              |
                 | heroImage (Media) |
                 | client            |
                 | location          |
                 | completionYear    |
                 | industry (rel)    |
                 | products (rel)    |
                 | challenge         |
                 | solution          |
                 +-------------------+
```

---

## Collections

### Users

Authentication collection for CMS access.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Auto | Primary key |
| email | email | Yes | Unique, login identifier |
| password | password | Yes | Hashed |
| name | text | No | Display name |
| role | select | Yes | admin, editor, marketing |
| avatar | relationship | No | Reference to Media |
| createdAt | timestamp | Auto | |
| updatedAt | timestamp | Auto | |

**Access Control:**
- Create: Admin only
- Read: Self or Admin
- Update: Self or Admin
- Delete: Admin only

---

### Media

File storage for images and documents.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Auto | Primary key |
| filename | text | Auto | Original filename |
| mimeType | text | Auto | File type |
| filesize | number | Auto | Bytes |
| width | number | Auto | Image width |
| height | number | Auto | Image height |
| alt | text | No | Localized alt text |
| caption | text | No | Localized caption |
| url | text | Auto | File URL |
| createdAt | timestamp | Auto | |

---

### Products

Industrial equipment catalog.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Auto | Primary key |
| name | text | Yes | Localized |
| slug | text | Yes | Auto-generated, unique |
| modelNumber | text | No | |
| shortDescription | text | Yes | Localized, max 200 chars |
| description | richtext | Yes | Localized, Lexical editor |
| images | relationship[] | No | Array of Media |
| brand | relationship | No | Reference to Brands |
| category | relationship | No | Reference to ProductCategories |
| industries | relationship[] | No | Array of Industries |
| specifications | array | No | Key-value pairs with unit |
| documents | array | No | Catalog, datasheet files |
| status | select | Yes | draft, published |
| createdAt | timestamp | Auto | |
| updatedAt | timestamp | Auto | |

**Indexes:**
- slug (unique)
- brand
- category
- status

---

### Projects

Portfolio of completed projects.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Auto | Primary key |
| title | text | Yes | Localized |
| slug | text | Yes | Auto-generated |
| shortDescription | text | Yes | Localized |
| heroImage | relationship | Yes | Reference to Media |
| images | relationship[] | No | Gallery |
| client | text | Yes | |
| location | text | Yes | |
| completionYear | number | Yes | |
| industry | relationship | Yes | Reference to Industries |
| challenge | richtext | No | Localized |
| solution | richtext | No | Localized |
| products | relationship[] | No | Referenced Products |
| status | select | Yes | draft, published |
| createdAt | timestamp | Auto | |
| updatedAt | timestamp | Auto | |

---

### Services

Service offerings.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Auto | Primary key |
| title | text | Yes | Localized |
| slug | text | Yes | Auto-generated |
| shortDescription | text | Yes | Localized |
| description | richtext | Yes | Localized |
| icon | text | No | Lucide icon name |
| order | number | No | Display order |
| status | select | Yes | draft, published |
| createdAt | timestamp | Auto | |
| updatedAt | timestamp | Auto | |

---

### Articles

Technical articles and news.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Auto | Primary key |
| title | text | Yes | Localized |
| slug | text | Yes | Auto-generated |
| type | select | Yes | Technical_Solution, TTE_Event, Industry_News |
| excerpt | text | Yes | Localized, max 300 chars |
| content | richtext | Yes | Localized |
| coverImage | relationship | Yes | Reference to Media |
| author | text | No | |
| readTime | number | No | Minutes |
| downloadUrl | text | No | For library items |
| status | select | Yes | draft, published |
| publishedAt | date | No | |
| createdAt | timestamp | Auto | |
| updatedAt | timestamp | Auto | |

---

### Vacancies

Job listings.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Auto | Primary key |
| title | text | Yes | Localized |
| slug | text | Yes | Auto-generated |
| department | text | Yes | |
| location | text | Yes | |
| type | select | Yes | full-time, part-time, contract |
| description | richtext | Yes | Localized |
| requirements | array | Yes | Text array |
| benefits | array | No | Text array |
| deadline | date | No | |
| contactEmail | email | Yes | |
| status | select | Yes | open, closed |
| createdAt | timestamp | Auto | |
| updatedAt | timestamp | Auto | |

---

## Taxonomy Collections

### Brands

| Field | Type | Required |
|-------|------|----------|
| id | UUID | Auto |
| name | text | Yes |
| slug | text | Yes |
| logo | relationship | No |
| description | text | No |
| subBrands | array | No |

### ProductCategories

| Field | Type | Required |
|-------|------|----------|
| id | UUID | Auto |
| name | text | Yes, Localized |
| slug | text | Yes |

### Industries

| Field | Type | Required |
|-------|------|----------|
| id | UUID | Auto |
| name | text | Yes, Localized |
| slug | text | Yes |

---

## Globals

### Homepage

| Field | Type | Notes |
|-------|------|-------|
| heroTitle | text | Localized |
| heroSubtitle | text | Localized |
| heroImage | relationship | Media |
| featuredProducts | relationship[] | Products |
| featuredProjects | relationship[] | Projects |

### AboutPage

| Field | Type | Notes |
|-------|------|-------|
| heroTitle | text | Localized |
| heroContent | richtext | Localized |
| timeline | array | Year, title, description, images |
| certificates | array | Name, issuer, image, year |
| partners | array | Name, logo |

### ContactPage

| Field | Type | Notes |
|-------|------|-------|
| title | text | Localized |
| address | text | |
| phone | text | |
| fax | text | |
| email | email | |
| mapCoordinates | point | lat, lng |

---

## Migrations

Payload CMS handles migrations automatically through Drizzle.

```bash
# Create migration
pnpm db:migrate:create

# Run migrations
pnpm db:migrate
```
