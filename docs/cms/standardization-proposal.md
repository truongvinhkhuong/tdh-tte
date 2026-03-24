# PayloadCMS — Standardization Proposal

> Lộ trình chuẩn hoá cấu trúc CMS theo 5 phase, từ zero-risk đến full integration.
> Mỗi phase độc lập — có thể dừng sau bất kỳ phase nào.
>
> **Cập nhật lần cuối:** 2026-03-24

---

## Phase Overview

| Phase | Scope | Risk | Issues Resolved |
|-------|-------|------|-----------------|
| **1** | Zero-risk fixes — thêm formatSlug hooks | None | ISS-005, 006, 007 |
| **2** | Schema enrichment — thêm fields mới | Low (additive) | ISS-008, 009, 011, 012, 013 |
| **3** | Field alignment — rename/replace fields | Medium (migration) | ISS-001, 002 |
| **4** | Shared types alignment | Low (type-only) | ISS-003, 015, 016 |
| **5** | CMS adapter layer — tích hợp frontend | Medium (integration) | ISS-004 |

---

## Phase 1: Zero-Risk Fixes

> Không cần migration. Không breaking changes. Chỉ thêm logic vào existing fields.

### 1.1 ProductCategories — thêm `formatSlug` hook

**File:** `apps/cms/src/collections/Taxonomies/ProductCategories.ts`

```typescript
// Thêm import
import { formatSlug } from '../../utils/formatSlug';

// Thêm hooks vào slug field
{
    name: 'slug',
    type: 'text',
    unique: true,
    hooks: {
        beforeChange: [formatSlug('name')],
    },
    admin: {
        position: 'sidebar',
        description: 'URL slug (tự động tạo từ tên)',
    },
},
```

### 1.2 Industries — thêm `formatSlug` hook

**File:** `apps/cms/src/collections/Taxonomies/Industries.ts`

Tương tự 1.1 — import `formatSlug`, thêm `hooks` vào slug field.

### 1.3 Services — fix slug localized + thêm `formatSlug`

**File:** `apps/cms/src/collections/Services.ts`

```typescript
// Thêm import
import { formatSlug } from '../utils/formatSlug';

// Sửa slug field: xoá localized, thêm hooks
{
    name: 'slug',
    type: 'text',
    // localized: true, ← XOÁ DÒNG NÀY
    unique: true,
    hooks: {
        beforeChange: [formatSlug('name')],
    },
    admin: {
        position: 'sidebar',
        description: 'URL slug (tự động tạo từ tên)',
    },
},
```

### 1.4 Products — thêm `filterOptions` cho subBrand

**File:** `apps/cms/src/collections/Products.ts`

```typescript
{
    name: 'subBrand',
    type: 'relationship',
    relationTo: 'sub-brands',
    hasMany: false,
    filterOptions: ({ data }) => ({
        parentBrand: { equals: data?.brand },
    }),
    admin: {
        description: 'Chọn danh mục con (nếu có). Lưu ý: Phải chọn Brand trước.',
        condition: (data) => Boolean(data?.brand),
    },
},
```

---

## Phase 2: Schema Enrichment

> Additive changes — thêm fields mới. Không ảnh hưởng data hiện có.
> **Lưu ý:** Sau khi thêm `required: true`, cần audit data hiện có trước khi deploy.

### 2.1 ProductCategories — thêm `icon` và `order`

**File:** `apps/cms/src/collections/Taxonomies/ProductCategories.ts`

```typescript
// Thêm sau field description
{
    name: 'icon',
    type: 'upload',
    relationTo: 'media',
    admin: {
        description: 'Icon/hình ảnh đại diện cho danh mục',
    },
},
{
    name: 'order',
    type: 'number',
    defaultValue: 0,
    admin: {
        position: 'sidebar',
        description: 'Thứ tự hiển thị (số nhỏ = ưu tiên cao)',
    },
},
```

### 2.2 Products — `required` + `featured` + `sortOrder` + SEO

**File:** `apps/cms/src/collections/Products.ts`

**a) Thêm `required: true` cho brand và category:**
```typescript
{ name: 'brand', type: 'relationship', relationTo: 'brands', hasMany: false, required: true },
{ name: 'category', type: 'relationship', relationTo: 'product-categories', hasMany: false, required: true },
```

**b) Thêm sidebar fields:**
```typescript
// Sau slug field
{
    name: 'featured',
    type: 'checkbox',
    defaultValue: false,
    admin: {
        position: 'sidebar',
        description: 'Đánh dấu sản phẩm nổi bật',
    },
},
{
    name: 'sortOrder',
    type: 'number',
    defaultValue: 0,
    admin: {
        position: 'sidebar',
        description: 'Thứ tự hiển thị (số nhỏ = ưu tiên cao)',
    },
},
```

**c) Thêm SEO tab:**
```typescript
// Thêm tab mới sau Relationships tab
{
    label: 'SEO',
    fields: [
        {
            name: 'seo',
            type: 'group',
            fields: [
                {
                    name: 'metaTitle',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: 'Tiêu đề hiển thị trên tab trình duyệt (max 60 ký tự)',
                    },
                },
                {
                    name: 'metaDescription',
                    type: 'textarea',
                    localized: true,
                    admin: {
                        description: 'Mô tả cho SEO (max 160 ký tự)',
                    },
                },
            ],
        },
    ],
},
```

### 2.3 Projects — thêm SEO group

**File:** `apps/cms/src/collections/Projects.ts`

Thêm SEO group tương tự Products (metaTitle, metaDescription) vào cuối fields array.

---

## Phase 3: Field Alignment (Cần DB Migration)

> ⚠️ **Cần backup database trước khi thực hiện.** Phase này rename/replace fields.

### 3.1 Rename specifications `label` → `key`

**File:** `apps/cms/src/collections/Products.ts`

1. Rename field `label` → `key` trong specifications array
2. Tạo migration: `pnpm db:migrate:create`
3. Trong migration file, thêm data update:
   ```sql
   -- Rename JSON key in specifications array
   UPDATE products SET specifications = (
     SELECT jsonb_agg(
       jsonb_set(elem - 'label', '{key}', elem->'label')
     )
     FROM jsonb_array_elements(specifications::jsonb) AS elem
   )
   WHERE specifications IS NOT NULL;
   ```
4. Run migration: `pnpm db:migrate`

### 3.2 Replace `catalogPDF` with `documents` array

**File:** `apps/cms/src/collections/Products.ts`

Replace `catalogPDF` upload with structured array:

```typescript
{
    name: 'documents',
    type: 'array',
    admin: {
        description: 'Tài liệu kỹ thuật sản phẩm',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            admin: { description: 'Tên tài liệu' },
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            options: [
                { label: 'Catalog', value: 'catalog' },
                { label: 'Datasheet', value: 'datasheet' },
                { label: 'Manual', value: 'manual' },
                { label: 'Certificate', value: 'certificate' },
            ],
        },
        {
            name: 'file',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'size',
            type: 'text',
            admin: { description: 'VD: "2.5 MB"' },
        },
    ],
},
```

Migration: Cần script để convert existing `catalogPDF` data sang `documents` format.

---

## Phase 4: Shared Types Alignment

> Type-only changes. Không ảnh hưởng runtime.

**File:** `packages/shared-types/src/index.ts`

### Thay đổi cần thiết:

1. **Specification:** Đã align — CMS rename `label` → `key` ở Phase 3
2. **Document:** Update interface match CMS `documents` array structure
3. **Brand.description:** Change type sang `string | Record<string, unknown>` (support cả plain text và Lexical JSON)
4. **Project:** Rename `title` → `name`, hoặc thêm `name` alias
5. **Project:** Thêm `heroImage` nếu đã thêm ở CMS, update `shortDescription`

---

## Phase 5: CMS Adapter Layer

> Build transform/aggregation layer để bridge CMS data → frontend types.

**Files:**
- `apps/web/lib/payload/client.ts` — đã có sẵn
- `apps/web/lib/payload/adapter.ts` — đã có sẵn, cần mở rộng

### Key transforms cần build:

1. **Brand aggregation:** Query brands + query sub-brands by parentBrand → nest `subBrands[]` vào brand objects
2. **Lexical → HTML:** Serialize richText fields (brand description, product description) sang HTML strings
3. **Media → URL:** Extract `url` (hoặc `externalURL` nếu có) từ Media relationship objects
4. **Documents mapping:** Map CMS `documents` array → shared types `Document[]` format
5. **Product type mapping:** Transform full CMS Product response → shared types `Product`

### Migration strategy:

```
Giai đoạn A: Bật NEXT_PUBLIC_USE_CMS=true cho 1 page (ví dụ: /products)
Giai đoạn B: Mở rộng cho /products/[slug], /projects
Giai đoạn C: Mở rộng cho tất cả pages
Giai đoạn D: Xoá static data từ lib/data.ts
```

---

## Conventions to Adopt

> Áp dụng cho tất cả collection mới hoặc khi refactor.

| Convention | Mô tả |
|------------|-------|
| **Slug auto-gen** | Mọi collection có URL-facing slug PHẢI dùng `formatSlug` hook |
| **Slug not localized** | Slug KHÔNG ĐƯỢC localized — URL identifier chung cho mọi ngôn ngữ |
| **SEO group** | Mọi content collection (Products, Projects, Services, Articles) PHẢI có SEO group |
| **Taxonomy fields** | Mọi taxonomy collection PHẢI có: `name` (required), `slug` (unique, auto-gen), `order` (number) |
| **Required relationships** | Relationship fields là core classification PHẢI `required: true` |
| **Conditional relationships** | Relationship phụ thuộc field khác PHẢI dùng `filterOptions` |
| **RichText serialization** | RichText fields map sang `string` trong shared-types PHẢI có documented serialization strategy |
