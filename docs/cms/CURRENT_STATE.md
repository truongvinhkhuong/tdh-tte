# PayloadCMS — Current State Documentation

> Tài liệu hiện trạng chính xác, được tạo từ khảo sát source code trực tiếp.
> Thay thế `/docs/database/SCHEMA.md` (lỗi thời) làm nguồn tham chiếu chính.
>
> **Cập nhật lần cuối:** 2026-03-24 — dựa trên commit `0425f8f`

---

## Table of Contents

- [Configuration Overview](#configuration-overview)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Product Taxonomy Diagram](#product-taxonomy-diagram)
- [Collections — Product Domain](#collections--product-domain)
- [Collections — Taxonomy](#collections--taxonomy)
- [Collections — Other Content](#collections--other-content)
- [Collections — System](#collections--system)
- [Globals](#globals)
- [Frontend Data Layer](#frontend-data-layer)

---

## Configuration Overview

| Property | Value | Source file |
|----------|-------|------------|
| Database | PostgreSQL 16 via `@payloadcms/db-postgres` (Drizzle ORM) | `payload.config.ts:75` |
| Rich text editor | Lexical (`@payloadcms/richtext-lexical`) | `payload.config.ts:67` |
| Locales | `vi` (default), `en` — fallback enabled | `payload.config.ts:81-88` |
| Image processor | Sharp | `payload.config.ts:95` |
| Media types | `image/*`, `application/pdf` | `Media.ts:34` |
| Image sizes | thumbnail (400×300), card (768×512), hero (1920×1080) | `Media.ts:13-32` |
| Server URL | `PAYLOAD_PUBLIC_SERVER_URL` hoặc `http://localhost:4001` | `payload.config.ts:31` |
| CORS | `FRONTEND_URL` (default 3000), `BACKEND_URL` (default 3002) | `payload.config.ts:90-93` |

---

## Entity Relationship Diagram

> Toàn bộ hệ thống CMS — bao gồm tất cả collections và globals.

```mermaid
erDiagram
    USERS {
        int id PK
        email email "unique, login"
        text name "required"
        select role "admin | editor | marketing"
    }

    MEDIA {
        int id PK
        text externalURL "URL nguồn ngoài (ưu tiên)"
        text alt "required, localized"
        auto filename
        auto mimeType
        auto url
    }

    BRANDS {
        int id PK
        text name "required, NOT localized"
        text slug "unique, auto-gen"
        upload logo "-> media"
        richText description "localized"
    }

    SUB_BRANDS {
        int id PK
        text name "required, localized"
        text slug "unique, auto-gen"
        rel parentBrand "-> brands, required"
        upload image "-> media"
        richText description "localized"
        text website
    }

    PRODUCT_CATEGORIES {
        int id PK
        text name "required, localized"
        text slug "unique, NO auto-gen"
        textarea description "localized"
    }

    INDUSTRIES {
        int id PK
        text name "required, localized"
        text slug "unique, NO auto-gen"
        upload icon "-> media"
    }

    PRODUCTS {
        int id PK
        text name "required, localized"
        text slug "unique, auto-gen"
        text modelNumber
        textarea shortDescription "localized, max 300"
        richText description "localized"
        upload images "-> media, hasMany"
        upload catalogPDF "-> media, hasMany"
        array specifications "label-value-unit"
        select _status "draft | published"
    }

    PROJECTS {
        int id PK
        text name "required, localized"
        text slug "unique, auto-gen"
        text client
        text location "localized"
        number completionYear
        richText challenge "localized"
        richText solution "localized"
        upload gallery "-> media, hasMany"
        select _status "draft | published"
    }

    SERVICES {
        int id PK
        text name "required, localized"
        text slug "unique, localized, NO auto-gen"
        upload icon "-> media"
        richText description "localized"
    }

    ARTICLES {
        int id PK
        text title "required, localized"
        text slug "unique, auto-gen"
        select contentType "news | tech-hub"
        richText content "localized"
        upload coverImage "-> media"
        select _status "draft | published"
    }

    VACANCIES {
        int id PK
        text title "required, localized"
        text slug "unique, auto-gen"
        text department
        select type "full-time | part-time | contract"
        select _status "draft | published"
    }

    BRANDS ||--o{ SUB_BRANDS : "parentBrand"
    BRANDS ||--o{ PRODUCTS : "brand (required)"
    SUB_BRANDS ||--o{ PRODUCTS : "subBrand (optional, filtered)"
    PRODUCT_CATEGORIES ||--o{ PRODUCTS : "category (required)"
    INDUSTRIES }o--o{ PRODUCTS : "industries (hasMany)"
    PRODUCTS }o--o{ PROJECTS : "products / relatedProjects"
    SERVICES }o--o{ PROJECTS : "services (hasMany)"
    MEDIA ||--o{ PRODUCTS : "images, catalogPDF"
    MEDIA ||--o{ PROJECTS : "gallery"
    MEDIA ||--o{ BRANDS : "logo"
    MEDIA ||--o{ SUB_BRANDS : "image"
    MEDIA ||--o{ INDUSTRIES : "icon"
    MEDIA ||--o{ SERVICES : "icon"
    MEDIA ||--o{ ARTICLES : "coverImage"
    BRANDS ||--o{ ARTICLES : "relatedBrand"
    PRODUCTS }o--o{ ARTICLES : "relatedProducts"
```

---

## Product Taxonomy Diagram

> Trực quan hoá cấu trúc phân loại sản phẩm — focus area chính.

```mermaid
graph TD
    subgraph Taxonomy["Taxonomy Layer"]
        BR["Brands (brands)"]
        SB["SubBrands (sub-brands)"]
        PC["ProductCategories (product-categories)"]
        IND["Industries (industries)"]
    end

    subgraph Content["Content Layer"]
        P["Products (products)"]
        PJ["Projects (projects)"]
    end

    subgraph Media["Media Layer"]
        M["Media (media)"]
    end

    BR -->|"1:N parentBrand"| SB
    BR -->|"1:N brand (required)"| P
    SB -->|"1:N subBrand (filtered)"| P
    PC -->|"1:N category (required)"| P
    IND -->|"N:M industries"| P
    P -->|"N:M relatedProjects"| PJ
    PJ -->|"N:M products"| P
    M -->|"images, catalogPDF"| P
    M -->|"logo"| BR
    M -->|"image"| SB
    M -->|"icon"| IND
    M -->|"gallery"| PJ

    style BR fill:#4A90D9,color:#fff
    style SB fill:#4A90D9,color:#fff
    style PC fill:#4A90D9,color:#fff
    style IND fill:#4A90D9,color:#fff
    style P fill:#E8913A,color:#fff
    style PJ fill:#E8913A,color:#fff
    style M fill:#7B8D8E,color:#fff
```

**Quan hệ chính:**

| From | To | Type | Field | Required | Notes |
|------|----|------|-------|----------|-------|
| SubBrands | Brands | N:1 | `parentBrand` | Yes | Mỗi sub-brand thuộc 1 brand |
| Products | Brands | N:1 | `brand` | **Yes** | Bắt buộc |
| Products | SubBrands | N:1 | `subBrand` | No | Ẩn khi chưa chọn brand, filtered by brand |
| Products | ProductCategories | N:1 | `category` | **Yes** | Bắt buộc |
| Products | Industries | N:M | `industries` | No | Sản phẩm phục vụ nhiều ngành |
| Products | Projects | N:M | `relatedProjects` | No | Liên kết 2 chiều với Projects |
| Projects | Products | N:M | `products` | No | Liên kết 2 chiều với Products |

---

## Collections — Product Domain

### Products

> **Source:** `apps/cms/src/collections/Products.ts`
> **Slug:** `products` · **Admin group:** Content · **Versions/drafts:** Yes
> **Access:** read = public · **useAsTitle:** `name`

Giao diện admin dùng 4 tabs:

#### Tab 1: Basic Info

| Field | Type | Required | Localized | Unique | Hooks | Notes |
|-------|------|----------|-----------|--------|-------|-------|
| `name` | text | Yes | Yes | - | - | Tên sản phẩm |
| `modelNumber` | text | - | - | - | - | Mã sản phẩm (không cần dịch) |
| `shortDescription` | textarea | - | Yes | - | - | maxLength: 300 |
| `description` | richText | - | Yes | - | - | Lexical editor |

#### Tab 2: Media

| Field | Type | Required | Localized | Unique | Hooks | Notes |
|-------|------|----------|-----------|--------|-------|-------|
| `images` | upload → media | - | - | - | - | hasMany: true |
| `catalogPDF` | upload → media | - | - | - | - | hasMany: true, file PDF catalog |

#### Tab 3: Specifications

| Field | Type | Required | Localized | Unique | Hooks | Notes |
|-------|------|----------|-----------|--------|-------|-------|
| `specifications` | array | - | - | - | - | Mảng thông số kỹ thuật |
| ↳ `label` | text | Yes | Yes | - | - | VD: "Áp suất tối đa" |
| ↳ `value` | text | Yes | Yes | - | - | VD: "100" |
| ↳ `unit` | text | - | Yes | - | - | VD: "Bar" |

#### Tab 4: Relationships

| Field | Type | Required | Localized | Unique | Hooks | Notes |
|-------|------|----------|-----------|--------|-------|-------|
| `brand` | rel → brands | **Yes** | - | - | - | Đơn lẻ |
| `subBrand` | rel → sub-brands | No | - | - | - | Đơn lẻ, filtered by brand, ẩn khi chưa chọn brand |
| `category` | rel → product-categories | **Yes** | - | - | - | Đơn lẻ |
| `industries` | rel → industries | No | - | - | - | hasMany: true |
| `relatedProjects` | rel → projects | No | - | - | - | hasMany: true |

#### Sidebar

| Field | Type | Required | Localized | Unique | Hooks | Notes |
|-------|------|----------|-----------|--------|-------|-------|
| `slug` | text | - | - | Yes | `formatSlug('name')` | Tự động tạo từ tên |
| `featured` | checkbox | - | - | - | - | Sidebar, đánh dấu nổi bật |
| `sortOrder` | number | - | - | - | - | Sidebar, thứ tự hiển thị |

#### Tab 5: SEO

| Field | Type | Required | Localized | Unique | Hooks | Notes |
|-------|------|----------|-----------|--------|-------|-------|
| `seo.metaTitle` | text | - | Yes | - | - | Max 60 ký tự |
| `seo.metaDescription` | textarea | - | Yes | - | - | Max 160 ký tự |

---

## Collections — Taxonomy

### Brands

> **Source:** `apps/cms/src/collections/Taxonomies/Brands.ts`
> **Slug:** `brands` · **Admin group:** Taxonomies · **Versions:** No
> **Access:** read = public

| Field | Type | Required | Localized | Unique | Hooks | Notes |
|-------|------|----------|-----------|--------|-------|-------|
| `name` | text | Yes | **No** | - | - | Tên brand (proper noun, không dịch) |
| `slug` | text | - | - | Yes | `formatSlug('name')` | Sidebar |
| `logo` | upload → media | - | - | - | - | Logo thương hiệu |
| `description` | richText | - | Yes | - | - | Mô tả brand |

### SubBrands

> **Source:** `apps/cms/src/collections/Taxonomies/SubBrands.ts`
> **Slug:** `sub-brands` · **Admin group:** Taxonomies · **Versions:** No
> **Access:** read = public

| Field | Type | Required | Localized | Unique | Hooks | Notes |
|-------|------|----------|-----------|--------|-------|-------|
| `name` | text | Yes | Yes | - | - | Tên sub-brand |
| `slug` | text | - | - | Yes | `formatSlug('name')` | Sidebar |
| `parentBrand` | rel → brands | Yes | - | - | - | Thuộc brand nào |
| `image` | upload → media | - | - | - | - | Hình ảnh đại diện |
| `description` | richText | - | Yes | - | - | Mô tả |
| `website` | text | - | - | - | - | Website riêng |

### ProductCategories

> **Source:** `apps/cms/src/collections/Taxonomies/ProductCategories.ts`
> **Slug:** `product-categories` · **Admin group:** Taxonomies · **Versions:** No
> **Access:** read = public

| Field | Type | Required | Localized | Unique | Hooks | Notes |
|-------|------|----------|-----------|--------|-------|-------|
| `name` | text | Yes | Yes | - | - | Tên danh mục |
| `slug` | text | - | - | Yes | `formatSlug('name')` | Sidebar |
| `description` | textarea | - | Yes | - | - | Mô tả danh mục |
| `icon` | upload → media | - | - | - | - | Icon/hình ảnh đại diện |
| `order` | number | - | - | - | - | Sidebar, thứ tự hiển thị |

### Industries

> **Source:** `apps/cms/src/collections/Taxonomies/Industries.ts`
> **Slug:** `industries` · **Admin group:** Taxonomies · **Versions:** No
> **Access:** read = public

| Field | Type | Required | Localized | Unique | Hooks | Notes |
|-------|------|----------|-----------|--------|-------|-------|
| `name` | text | Yes | Yes | - | - | Tên ngành |
| `slug` | text | - | - | Yes | `formatSlug('name')` | Sidebar |
| `icon` | upload → media | - | - | - | - | Icon ngành |

---

## Collections — Other Content

### Projects

> **Source:** `apps/cms/src/collections/Projects.ts`
> **Slug:** `projects` · **Admin group:** Content · **Versions/drafts:** Yes
> **Access:** read = public · **useAsTitle:** `name`

| Field | Type | Required | Localized | Unique | Hooks | Notes |
|-------|------|----------|-----------|--------|-------|-------|
| `name` | text | Yes | Yes | - | - | Tên dự án |
| `slug` | text | - | - | Yes | `formatSlug('name')` | Sidebar |
| `client` | text | - | - | - | - | Khách hàng |
| `location` | text | - | Yes | - | - | Địa điểm |
| `completionYear` | number | - | - | - | - | Sidebar, min 1990 max 2100 |
| `challenge` | richText | - | Yes | - | - | Thách thức dự án |
| `solution` | richText | - | Yes | - | - | Giải pháp TTE cung cấp |
| `gallery` | upload → media | - | - | - | - | hasMany: true |
| `products` | rel → products | - | - | - | - | hasMany: true |
| `services` | rel → services | - | - | - | - | hasMany: true |

### Services

> **Source:** `apps/cms/src/collections/Services.ts`
> **Slug:** `services` · **Admin group:** Content · **Versions:** No
> **Access:** read = public · **useAsTitle:** `name`

| Field | Type | Required | Localized | Unique | Hooks | Notes |
|-------|------|----------|-----------|--------|-------|-------|
| `name` | text | Yes | Yes | - | - | Tên dịch vụ |
| `slug` | text | - | - | Yes | `formatSlug('name')` | Sidebar |
| `icon` | upload → media | - | - | - | - | Icon dịch vụ |
| `description` | richText | - | Yes | - | - | Mô tả dịch vụ |

### Articles

> **Source:** `apps/cms/src/collections/Articles.ts`
> **Slug:** `articles` · **Admin group:** Content · **Versions/drafts:** Yes
> Bao gồm cả News và Tech Hub content. Chi tiết xem source file.

### Vacancies

> **Source:** `apps/cms/src/collections/Vacancies.ts`
> **Slug:** `vacancies` · **Admin group:** Content · **Versions/drafts:** Yes
> Job listings. Chi tiết xem source file.

---

## Collections — System

### Users

> **Source:** `apps/cms/src/collections/Users.ts`
> **Slug:** `users` · **Admin group:** Admin · **Auth:** Yes

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | email | Yes (auto) | Login identifier |
| `name` | text | Yes | Tên hiển thị |
| `role` | select | Yes | `admin` \| `editor` \| `marketing`, default: `editor` |

**Access:** read = public, create/update/delete = admin only

### Media

> **Source:** `apps/cms/src/collections/Media.ts`
> **Slug:** `media` · **Admin group:** Media

| Field | Type | Required | Localized | Notes |
|-------|------|----------|-----------|-------|
| `externalURL` | text | - | - | URL ảnh từ nguồn ngoài (Cloudinary, S3), ưu tiên hiển thị |
| `alt` | text | Yes | Yes | Mô tả ảnh cho SEO/accessibility |

**Upload config:** staticDir `media`, mimeTypes `image/*` + `application/pdf`
**Image sizes:** thumbnail (400×300), card (768×512), hero (1920×1080)

---

## Globals

### Homepage

> **Source:** `apps/cms/src/globals/Homepage.ts` · **Slug:** `homepage`
> **Access:** read = public

| Tab | Field | Type | Localized | Notes |
|-----|-------|------|-----------|-------|
| Hero | `heroTitle` | text | Yes | Tiêu đề hero |
| Hero | `heroSubtitle` | text | Yes | Phụ đề hero |
| Hero | `heroBanner` | upload → media | - | Banner chính |
| Featured | `featuredProjects` | rel → projects | - | hasMany, dự án nổi bật |
| Featured | `featuredBrands` | rel → brands | - | hasMany, brand đối tác |
| SEO | `seo.metaTitle` | text | Yes | Max 60 ký tự |
| SEO | `seo.metaDescription` | textarea | Yes | Max 160 ký tự |
| SEO | `seo.shareImage` | upload → media | - | Ảnh social sharing |

### AboutPage

> **Source:** `apps/cms/src/globals/AboutPage.ts` · **Slug:** `about-page`
> **Access:** read = public

| Field | Type | Localized | Notes |
|-------|------|-----------|-------|
| `history` | richText | Yes | Lịch sử hình thành |
| `mission` | textarea | Yes | Sứ mệnh |
| `vision` | textarea | Yes | Tầm nhìn |
| `coreValues` | richText | Yes | Giá trị cốt lõi |
| `certificates` | upload → media | - | hasMany, chứng chỉ kinh doanh |
| `seo.metaTitle` | text | Yes | |
| `seo.metaDescription` | textarea | Yes | |
| `seo.shareImage` | upload → media | - | |

### ContactPage

> **Source:** `apps/cms/src/globals/ContactPage.ts` · **Slug:** `contact-page`
> **Access:** read = public

| Field | Type | Localized | Notes |
|-------|------|-----------|-------|
| `address` | text | Yes | Địa chỉ văn phòng |
| `hotline` | text | - | Số hotline |
| `email` | text | - | Email liên hệ |
| `mapEmbed` | textarea | - | Google Maps iframe embed code |
| `seo.metaTitle` | text | Yes | |
| `seo.metaDescription` | textarea | Yes | |
| `seo.shareImage` | upload → media | - | |

---

## Frontend Data Layer

> Ghi nhận hiện trạng data flow từ CMS đến frontend.

### Trạng thái hiện tại

Frontend (`apps/web`) hiện dùng **100% static data** từ `apps/web/lib/data.ts`. CMS API chưa được kích hoạt.

```
Frontend Request → lib/data.ts (static arrays) → Component render
                 ↗ lib/payload/adapter.ts (sẵn sàng nhưng NEXT_PUBLIC_USE_CMS=false)
                 ↗ lib/payload/client.ts (CMS API client đã có)
```

### Cấu trúc static data (`lib/data.ts`)

| Data | Số lượng | Đặc điểm |
|------|----------|----------|
| `brands` | 5 | SubBrands **nested** trong Brand objects (khác CMS: flat collection) |
| `categories` | 6 | Valves, Pumps, Compressors, Control Systems, Filtration, Boilers |
| `industries` | 5 | Oil & Gas, Petrochemical, Power, Water, Manufacturing |
| `products` | 6 | Đầy đủ specs, documents, relatedProjects |

### Khác biệt cấu trúc Static vs CMS

| Aspect | Static data (`lib/data.ts`) | CMS (PayloadCMS) |
|--------|----------------------------|-------------------|
| SubBrands | Nested trong `Brand.subBrands[]` | Flat collection `sub-brands` với `parentBrand` FK |
| Specifications key | `key` | `label` |
| Documents | `documents[]` với `{name, type, url, size}` | `catalogPDF` (upload to media, hasMany) |
| Brand description | `string` | `richText` (Lexical JSON) |
| IDs | `string` ("1", "2") | `number` (auto-increment) |

> Chi tiết các inconsistency xem [ISSUES_AND_GAPS.md](./ISSUES_AND_GAPS.md)
