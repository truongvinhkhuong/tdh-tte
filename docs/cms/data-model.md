# PayloadCMS — Data Model & Relationships

> Trực quan hoá chi tiết tất cả trường dữ liệu trong từng object và mối quan hệ giữa chúng.
> Tập trung vào product domain (Products, Brands, SubBrands, ProductCategories, Industries).
>
> **Cập nhật lần cuối:** 2026-03-24

---

## Class Diagram — Product Domain

> Hiển thị đầy đủ fields, types, và constraints cho mỗi collection. Đường nối thể hiện relationships.

```mermaid
classDiagram
    direction TB

    class Products {
        +int id
        +text name ⟨required, localized⟩
        +text modelNumber
        +textarea shortDescription ⟨localized, max300⟩
        +richText description ⟨localized⟩
        +upload[] images → Media
        +upload[] catalogPDF → Media
        +array specifications
        +rel brand → Brands ⟨required⟩
        +rel subBrand → SubBrands ⟨filtered by brand⟩
        +rel category → ProductCategories ⟨required⟩
        +rel[] industries → Industries
        +rel[] relatedProjects → Projects
        +group seo
        +text slug ⟨unique, auto-gen⟩
        +checkbox featured
        +number sortOrder
        +select _status ⟨draft, published⟩
        +timestamp createdAt
        +timestamp updatedAt
    }

    class Brands {
        +int id
        +text name ⟨required⟩
        +text slug ⟨unique, auto-gen⟩
        +upload logo → Media
        +richText description ⟨localized⟩
        +timestamp createdAt
        +timestamp updatedAt
    }

    class SubBrands {
        +int id
        +text name ⟨required, localized⟩
        +text slug ⟨unique, auto-gen⟩
        +rel parentBrand → Brands ⟨required⟩
        +upload image → Media
        +richText description ⟨localized⟩
        +text website
        +timestamp createdAt
        +timestamp updatedAt
    }

    class ProductCategories {
        +int id
        +text name ⟨required, localized⟩
        +text slug ⟨unique, auto-gen⟩
        +textarea description ⟨localized⟩
        +upload icon → Media
        +number order
        +timestamp createdAt
        +timestamp updatedAt
    }

    class Industries {
        +int id
        +text name ⟨required, localized⟩
        +text slug ⟨unique, auto-gen⟩
        +upload icon → Media
        +timestamp createdAt
        +timestamp updatedAt
    }

    class Projects {
        +int id
        +text name ⟨required, localized⟩
        +text slug ⟨unique, auto-gen⟩
        +text client
        +text location ⟨localized⟩
        +number completionYear
        +richText challenge ⟨localized⟩
        +richText solution ⟨localized⟩
        +upload[] gallery → Media
        +rel[] products → Products
        +rel[] services → Services
        +group seo
        +select _status ⟨draft, published⟩
        +timestamp createdAt
        +timestamp updatedAt
    }

    class Media {
        +int id
        +text externalURL
        +text alt ⟨required, localized⟩
        +auto filename
        +auto mimeType
        +auto url
        +auto width
        +auto height
        +timestamp createdAt
    }

    class Specifications {
        <<embedded array>>
        +text label ⟨required, localized⟩
        +text value ⟨required, localized⟩
        +text unit ⟨localized⟩
    }

    class SEO {
        <<embedded group>>
        +text metaTitle ⟨localized⟩
        +textarea metaDescription ⟨localized⟩
    }

    Brands "1" --> "*" SubBrands : parentBrand
    Brands "1" --> "*" Products : brand
    SubBrands "0..1" --> "*" Products : subBrand
    ProductCategories "1" --> "*" Products : category
    Industries "*" --> "*" Products : industries
    Products "*" --> "*" Projects : relatedProjects
    Projects "*" --> "*" Products : products
    Media "1" --> "*" Products : images, catalogPDF
    Media "1" --> "*" Brands : logo
    Media "1" --> "*" SubBrands : image
    Media "1" --> "*" Industries : icon
    Media "1" --> "*" ProductCategories : icon
    Media "1" --> "*" Projects : gallery
    Products *-- Specifications : specifications
    Products *-- SEO : seo
    Projects *-- SEO : seo
```

---

## Class Diagram — Full CMS System

> Bao gồm tất cả collections (Content, Taxonomy, System) và globals.

```mermaid
classDiagram
    direction LR

    class Users {
        +int id
        +email email ⟨unique⟩
        +text name ⟨required⟩
        +select role ⟨admin, editor, marketing⟩
        ---
        Auth collection
    }

    class Media {
        +int id
        +text externalURL
        +text alt ⟨required, localized⟩
        +auto filename
        +auto mimeType
        +auto url
        ---
        Image sizes: thumbnail, card, hero
        Accepts: image/*, application/pdf
    }

    class Products {
        +text name ⟨required, localized⟩
        +text modelNumber
        +textarea shortDescription ⟨localized⟩
        +richText description ⟨localized⟩
        +upload[] images
        +upload[] catalogPDF
        +array specifications
        +rel brand ⟨required⟩
        +rel subBrand ⟨filtered⟩
        +rel category ⟨required⟩
        +rel[] industries
        +rel[] relatedProjects
        +group seo
        +text slug ⟨auto-gen⟩
        +checkbox featured
        +number sortOrder
        ---
        Versions: drafts enabled
    }

    class Projects {
        +text name ⟨required, localized⟩
        +text slug ⟨auto-gen⟩
        +text client
        +text location ⟨localized⟩
        +number completionYear
        +richText challenge ⟨localized⟩
        +richText solution ⟨localized⟩
        +upload[] gallery
        +rel[] products
        +rel[] services
        +group seo
        ---
        Versions: drafts enabled
    }

    class Services {
        +text name ⟨required, localized⟩
        +text slug ⟨auto-gen⟩
        +upload icon
        +richText description ⟨localized⟩
    }

    class Articles {
        +text title ⟨required, localized⟩
        +text slug ⟨auto-gen⟩
        +select contentType ⟨news, tech-hub⟩
        +richText content ⟨localized⟩
        +upload coverImage
        +rel[] relatedProducts
        +rel relatedBrand
        ---
        Versions: drafts enabled
    }

    class Vacancies {
        +text title ⟨required, localized⟩
        +text slug ⟨auto-gen⟩
        +text department
        +select type ⟨full-time, part-time, contract⟩
        +richText description ⟨localized⟩
        ---
        Versions: drafts enabled
    }

    class Brands {
        +text name ⟨required⟩
        +text slug ⟨auto-gen⟩
        +upload logo
        +richText description ⟨localized⟩
    }

    class SubBrands {
        +text name ⟨required, localized⟩
        +text slug ⟨auto-gen⟩
        +rel parentBrand ⟨required⟩
        +upload image
        +richText description ⟨localized⟩
        +text website
    }

    class ProductCategories {
        +text name ⟨required, localized⟩
        +text slug ⟨auto-gen⟩
        +textarea description ⟨localized⟩
        +upload icon
        +number order
    }

    class Industries {
        +text name ⟨required, localized⟩
        +text slug ⟨auto-gen⟩
        +upload icon
    }

    class Homepage {
        <<Global>>
        +text heroTitle ⟨localized⟩
        +text heroSubtitle ⟨localized⟩
        +upload heroBanner
        +rel[] featuredProjects
        +rel[] featuredBrands
        +group seo
    }

    class AboutPage {
        <<Global>>
        +richText history ⟨localized⟩
        +textarea mission ⟨localized⟩
        +textarea vision ⟨localized⟩
        +richText coreValues ⟨localized⟩
        +upload[] certificates
        +group seo
    }

    class ContactPage {
        <<Global>>
        +text address ⟨localized⟩
        +text hotline
        +text email
        +textarea mapEmbed
        +group seo
    }

    Brands "1" --> "*" SubBrands : parentBrand
    Brands "1" --> "*" Products : brand
    SubBrands "0..1" --> "*" Products : subBrand
    ProductCategories "1" --> "*" Products : category
    Industries "*" --> "*" Products : industries
    Products "*" <--> "*" Projects : products/relatedProjects
    Services "*" --> "*" Projects : services
    Products "*" --> "*" Articles : relatedProducts
    Brands "0..1" --> "*" Articles : relatedBrand
    Homepage --> Projects : featuredProjects
    Homepage --> Brands : featuredBrands
```

---

## Relationship Summary

### Product → Taxonomy (Phân loại sản phẩm)

```mermaid
graph LR
    P["Products"]

    B["Brands"]
    SB["SubBrands"]
    C["ProductCategories"]
    I["Industries"]

    B -- "brand (required, 1:N)" --> P
    SB -. "subBrand (optional, 1:N, filtered by brand)" .-> P
    C -- "category (required, 1:N)" --> P
    I -- "industries (optional, N:M)" --> P

    style P fill:#E8913A,color:#fff
    style B fill:#4A90D9,color:#fff
    style SB fill:#6BAED6,color:#fff
    style C fill:#4A90D9,color:#fff
    style I fill:#4A90D9,color:#fff
```

**Quy tắc:**
- Mỗi Product PHẢI có 1 Brand và 1 Category (`required`)
- SubBrand là optional, chỉ hiện khi đã chọn Brand, và được lọc theo Brand đã chọn (`filterOptions`)
- Product có thể thuộc nhiều Industries (`hasMany`)

### Brand → SubBrand Hierarchy

```mermaid
graph TD
    B1["Emerson"]
    B2["Flowserve"]
    B3["Pleuger"]

    SB1["Fisher"]
    SB2["Sempell"]
    SB3["Yarway"]
    SB4["Vanessa"]
    SB5["KTM"]
    SB6["PUMPS"]
    SB7["Mechanical Seals"]
    SB8["Submersible Pump"]

    B1 --> SB1
    B1 --> SB2
    B1 --> SB3
    B1 --> SB4
    B1 --> SB5
    B2 --> SB6
    B2 --> SB7
    B3 --> SB8

    style B1 fill:#4A90D9,color:#fff
    style B2 fill:#4A90D9,color:#fff
    style B3 fill:#4A90D9,color:#fff
    style SB1 fill:#6BAED6,color:#fff
    style SB2 fill:#6BAED6,color:#fff
    style SB3 fill:#6BAED6,color:#fff
    style SB4 fill:#6BAED6,color:#fff
    style SB5 fill:#6BAED6,color:#fff
    style SB6 fill:#6BAED6,color:#fff
    style SB7 fill:#6BAED6,color:#fff
    style SB8 fill:#6BAED6,color:#fff
```

> SubBrands là collection riêng, liên kết về Brand qua field `parentBrand` (required).
> Trên frontend, sub-brands được gộp ngược vào brand object qua adapter layer.

### Product ↔ Project (Bidirectional)

```mermaid
graph LR
    P["Products"] -- "relatedProjects (N:M)" --> PJ["Projects"]
    PJ -- "products (N:M)" --> P

    style P fill:#E8913A,color:#fff
    style PJ fill:#E8913A,color:#fff
```

> Quan hệ 2 chiều: Product biết mình dùng trong Project nào, Project biết dùng Product nào.
> Cần đồng bộ thủ công khi thêm/xoá — không có auto-sync.

### Media References

```mermaid
graph TD
    M["Media"]

    M -- "logo" --> BR["Brands"]
    M -- "image" --> SB["SubBrands"]
    M -- "icon" --> PC["ProductCategories"]
    M -- "icon" --> IND["Industries"]
    M -- "icon" --> SV["Services"]
    M -- "images (hasMany)" --> P["Products"]
    M -- "catalogPDF (hasMany)" --> P
    M -- "gallery (hasMany)" --> PJ["Projects"]
    M -- "coverImage" --> AR["Articles"]
    M -- "heroBanner" --> HP["Homepage"]
    M -- "certificates (hasMany)" --> AP["AboutPage"]

    style M fill:#7B8D8E,color:#fff
    style P fill:#E8913A,color:#fff
    style PJ fill:#E8913A,color:#fff
    style BR fill:#4A90D9,color:#fff
    style SB fill:#6BAED6,color:#fff
    style PC fill:#4A90D9,color:#fff
    style IND fill:#4A90D9,color:#fff
```

---

## Embedded Structures

> Các cấu trúc nhúng (array, group) bên trong collections — không phải collections riêng.

### Products.specifications (Array)

```
┌─────────────────────────────────────────────┐
│ specifications[]                            │
├─────────────┬───────────┬───────────────────┤
│ label       │ value     │ unit              │
│ text        │ text      │ text              │
│ required    │ required  │ optional          │
│ localized   │ localized │ localized         │
├─────────────┼───────────┼───────────────────┤
│ "Áp suất"   │ "100"     │ "Bar"             │
│ "Lưu lượng" │ "500"     │ "m³/h"            │
│ "Nhiệt độ"  │ "-40~200" │ "°C"              │
└─────────────┴───────────┴───────────────────┘
```

### Products.seo / Projects.seo (Group)

```
┌─────────────────────────────────────────────┐
│ seo (group)                                 │
├─────────────────────┬───────────────────────┤
│ metaTitle           │ metaDescription       │
│ text, localized     │ textarea, localized   │
│ Max 60 ký tự        │ Max 160 ký tự         │
└─────────────────────┴───────────────────────┘
```

### Homepage SEO (Group — mở rộng hơn)

```
┌─────────────────────────────────────────────────────┐
│ seo (group)                                         │
├──────────────────┬──────────────────┬───────────────┤
│ metaTitle        │ metaDescription  │ shareImage    │
│ text, localized  │ textarea, local. │ upload→Media  │
└──────────────────┴──────────────────┴───────────────┘
```

---

## Field Type Legend

| Ký hiệu | Ý nghĩa |
|----------|---------|
| `text` | Chuỗi ngắn |
| `textarea` | Chuỗi dài (nhiều dòng) |
| `richText` | Nội dung rich text (Lexical JSON) |
| `number` | Số |
| `checkbox` | Boolean (true/false) |
| `select` | Chọn từ danh sách cố định |
| `upload → Media` | File upload, tham chiếu đến collection Media |
| `rel → X` | Relationship đơn lẻ đến collection X |
| `rel[] → X` | Relationship hasMany đến collection X |
| `array` | Mảng các object nhúng (embedded) |
| `group` | Object nhúng (không lặp lại) |
| `⟨required⟩` | Bắt buộc nhập |
| `⟨localized⟩` | Có bản dịch vi/en |
| `⟨auto-gen⟩` | Tự động tạo bằng formatSlug hook |
| `⟨filtered⟩` | Dropdown được lọc theo field khác |
