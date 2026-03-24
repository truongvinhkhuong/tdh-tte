# PayloadCMS Documentation — TTE Monorepo

> Tài liệu tổng hợp cho hệ thống PayloadCMS, tập trung vào cấu trúc sản phẩm và danh mục.
>
> **Source code:** `apps/cms/src/` · **Config:** `apps/cms/src/payload.config.ts`

---

## Documents

| File | Nội dung |
|------|----------|
| [CURRENT_STATE.md](./CURRENT_STATE.md) | Hiện trạng chính xác — ER diagrams, field tables, globals, frontend data layer |
| [DATA_MODEL.md](./DATA_MODEL.md) | Trực quan hoá chi tiết — class diagrams, fields, relationships, embedded structures |
| [ISSUES_AND_GAPS.md](./ISSUES_AND_GAPS.md) | 16 issues phát hiện — phân loại CRITICAL / HIGH / MEDIUM / LOW |
| [STANDARDIZATION_PROPOSAL.md](./STANDARDIZATION_PROPOSAL.md) | Lộ trình chuẩn hoá 5 phase — từ zero-risk đến full CMS integration |

---

## Quick Reference — Collections

| Collection | Slug | File | Admin Group | Versions | `formatSlug` |
|------------|------|------|-------------|----------|--------------|
| Users | `users` | `collections/Users.ts` | Admin | No | - |
| Media | `media` | `collections/Media.ts` | Media | No | - |
| Products | `products` | `collections/Products.ts` | Content | Yes (drafts) | Yes |
| Projects | `projects` | `collections/Projects.ts` | Content | Yes (drafts) | Yes |
| Services | `services` | `collections/Services.ts` | Content | No | Yes |
| Articles | `articles` | `collections/Articles.ts` | Content | Yes (drafts) | Yes |
| Vacancies | `vacancies` | `collections/Vacancies.ts` | Content | Yes (drafts) | Yes |
| Brands | `brands` | `collections/Taxonomies/Brands.ts` | Taxonomies | No | Yes |
| SubBrands | `sub-brands` | `collections/Taxonomies/SubBrands.ts` | Taxonomies | No | Yes |
| ProductCategories | `product-categories` | `collections/Taxonomies/ProductCategories.ts` | Taxonomies | No | Yes |
| Industries | `industries` | `collections/Taxonomies/Industries.ts` | Taxonomies | No | Yes |

## Quick Reference — Globals

| Global | Slug | File | SEO Group |
|--------|------|------|-----------|
| Homepage | `homepage` | `globals/Homepage.ts` | Yes |
| AboutPage | `about-page` | `globals/AboutPage.ts` | Yes |
| ContactPage | `contact-page` | `globals/ContactPage.ts` | Yes |

---

## Key Architecture Decisions

- **Localization:** Vietnamese (vi) là default locale, English (en) là secondary. Fallback enabled.
- **SubBrands:** Collection riêng (không nested trong Brands) — cho phép quản lý độc lập, query linh hoạt.
- **Media:** Hỗ trợ cả local upload và external URL (Cloudinary/S3) qua field `externalURL`.
- **Versioning:** Chỉ content collections chính (Products, Projects, Articles, Vacancies) có draft/publish workflow.
- **Access control:** Tất cả collections có `read: () => true` (public). Write access chỉ qua admin panel.
