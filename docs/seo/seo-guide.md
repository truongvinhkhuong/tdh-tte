# SEO Implementation Guide

Tài liệu hướng dẫn SEO cho TTE Website.

## Mục lục

1. [Tổng quan](#tổng-quan)
2. [Cấu trúc files SEO](#cấu-trúc-files-seo)
3. [Metadata & Open Graph](#metadata--open-graph)
4. [Sitemap & Robots](#sitemap--robots)
5. [JSON-LD Schema](#json-ld-schema)
6. [Hreflang cho đa ngôn ngữ](#hreflang-cho-đa-ngôn-ngữ)
7. [Checklist SEO cho content mới](#checklist-seo-cho-content-mới)
8. [Công cụ kiểm tra SEO](#công-cụ-kiểm-tra-seo)

---

## Tổng quan

Website TTE đã được cấu hình SEO theo best practices:

| Feature | File | Mô tả |
|---------|------|-------|
| Sitemap | `app/sitemap.ts` | Dynamic sitemap tự động |
| Robots | `app/robots.ts` | Crawler rules |
| Metadata | `app/[lang]/layout.tsx` | Title, description, OG |
| JSON-LD | `components/seo/json-ld.tsx` | Structured data |

---

## Cấu trúc files SEO

```
apps/web/
├── app/
│   ├── sitemap.ts           # Dynamic sitemap.xml
│   ├── robots.ts            # robots.txt
│   └── [lang]/
│       └── layout.tsx       # Global metadata
├── components/
│   └── seo/
│       └── json-ld.tsx      # Schema.org components
└── public/
    └── og-image.jpg         # Default OG image (1200x630)
```

---

## Metadata & Open Graph

### Global Metadata (layout.tsx)

```typescript
return {
    metadataBase: new URL('https://toanthang.vn'),
    title: {
        default: 'TTE - Công Ty Cổ Phần Kỹ Thuật Toàn Thắng',
        template: '%s | TTE',  // Tự động thêm suffix
    },
    description: 'Mô tả...',
    alternates: {
        canonical: `${BASE_URL}/${lang}`,
        languages: {
            'vi': `${BASE_URL}/vi`,
            'en': `${BASE_URL}/en`,
        },
    },
    openGraph: {
        images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
}
```

### Page-level Metadata

Mỗi page cần có `generateMetadata`:

```typescript
// app/[lang]/products/page.tsx
export async function generateMetadata({ params }) {
    const { lang } = await params
    return {
        title: lang === 'vi' ? 'Sản Phẩm' : 'Products',
        description: 'Mô tả trang sản phẩm...',
    }
}
```

---

## Sitemap & Robots

### Sitemap tự động

Sitemap được generate tự động từ data. Truy cập: `https://toanthang.vn/sitemap.xml`

**Thêm page mới vào sitemap:**

1. Mở `app/sitemap.ts`
2. Thêm vào `staticPages` array hoặc tạo entries mới

### Robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

Sitemap: https://toanthang.vn/sitemap.xml
```

---

## JSON-LD Schema

### Sử dụng Schema Components

```tsx
import { ProductSchema, BreadcrumbSchema } from '@/components/seo/json-ld'

// Trong product detail page
<ProductSchema 
    lang={lang} 
    product={{
        name: product.name,
        description: product.shortDescription,
        slug: product.slug,
        images: product.images,
        brand: product.brand,
        category: product.category,
    }} 
/>
```

### Available Schemas

| Component | Dùng cho |
|-----------|----------|
| `OrganizationSchema` | Trang chủ (đã có trong layout) |
| `LocalBusinessSchema` | Trang liên hệ |
| `ProductSchema` | Chi tiết sản phẩm |
| `BreadcrumbSchema` | Breadcrumb navigation |

---

## Hreflang cho đa ngôn ngữ

### Tự động trong Sitemap

Mỗi URL trong sitemap có alternates:

```xml
<url>
    <loc>https://toanthang.vn/vi/products</loc>
    <xhtml:link rel="alternate" hreflang="vi" href="https://toanthang.vn/vi/products"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://toanthang.vn/en/products"/>
</url>
```

### Trong HTML Head

Layout tự động thêm meta tags:

```html
<link rel="alternate" hreflang="vi" href="https://toanthang.vn/vi/..." />
<link rel="alternate" hreflang="en" href="https://toanthang.vn/en/..." />
<link rel="alternate" hreflang="x-default" href="https://toanthang.vn/vi/..." />
```

---

## Checklist SEO cho content mới

### Khi thêm Product mới (CMS)

- [ ] Nhập **name** tiếng Việt và tiếng Anh
- [ ] Viết **shortDescription** (max 160 ký tự) - dùng làm meta description
- [ ] Thêm **images** chất lượng cao (min 800x600)
- [ ] Điền đầy đủ **specifications**
- [ ] Liên kết đúng **brand** và **category**

### Khi thêm Project mới

- [ ] Tiêu đề rõ ràng, có keyword
- [ ] Mô tả challenge/solution chi tiết
- [ ] Ảnh hero chất lượng cao
- [ ] Liên kết products liên quan

### Khi thêm Page mới

1. Tạo `generateMetadata` function
2. Đảm bảo có `title` và `description`
3. Thêm vào `staticPages` trong sitemap.ts
4. Test với SEO tools

---

## Công cụ kiểm tra SEO

### 1. Google Search Console

- URL: https://search.google.com/search-console
- Submit sitemap: `https://toanthang.vn/sitemap.xml`
- Kiểm tra index status

### 2. Rich Results Test

- URL: https://search.google.com/test/rich-results
- Test JSON-LD schemas

### 3. PageSpeed Insights

- URL: https://pagespeed.web.dev
- Kiểm tra Core Web Vitals

### 4. Meta Tags Preview

- Facebook: https://developers.facebook.com/tools/debug
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector

---

## Environment Variables

```env
# .env.production
NEXT_PUBLIC_SITE_URL=https://toanthang.vn
GOOGLE_SITE_VERIFICATION=your_verification_code
```

---

## Troubleshooting

### Sitemap không hiển thị đúng

```bash
# Rebuild và kiểm tra
pnpm build
curl https://toanthang.vn/sitemap.xml
```

### OG Image không hiển thị

1. Kiểm tra file `/public/og-image.jpg` tồn tại
2. Size đúng: 1200x630px
3. Clear Facebook cache: https://developers.facebook.com/tools/debug

### Hreflang không được nhận

1. Kiểm tra `alternates` trong metadata
2. Verify trong HTML source
3. Test với hreflang checker tool
