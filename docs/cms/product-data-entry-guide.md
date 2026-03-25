# Hướng dẫn nhập liệu Sản phẩm trên CMS

> Tài liệu hướng dẫn từng bước nhập dữ liệu sản phẩm lên Payload CMS, dùng cho content editor và developer khi setup dữ liệu ban đầu.
>
> **CMS Admin:** `http://localhost:4001/admin` · **Chạy:** `make dev-cms`

---

## Tổng quan Flow

```mermaid
flowchart TD
    M["1. MEDIA -- Upload ảnh, PDF, icon"]
    B["2. BRANDS -- Tên, Logo, Mô tả"]
    SB["3. SUB-BRANDS -- Tên, Parent Brand, Ảnh"]
    C["4. CATEGORIES -- Tên, Mô tả, Icon"]
    I["5. INDUSTRIES -- Tên, Icon"]
    P["6. PRODUCTS -- Tên, mô tả, Ảnh, PDF, Specs, SEO, Relationships"]

    M -->|"dùng Media"| B
    M -->|"dùng Media"| SB
    M -->|"dùng Media"| C
    M -->|"dùng Media"| I
    B --> SB
    SB --> P
    C --> P
    I --> P
    B --> P

    style M fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style B fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style SB fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style C fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style I fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style P fill:#364fa1,stroke:#1a2d6d,color:#fff
```



**Thứ tự nhập:** Media (1) → Brands (2) → SubBrands (3) → Categories (4) → Industries (5) → Products (6)

> Media cần được upload trước vì tất cả collection khác đều reference tới. Products nhập cuối cùng vì cần tất cả 1–5 trước.

---

## Quan hệ giữa các Collection

```mermaid
erDiagram
    MEDIA {
        string alt "Mô tả ảnh - bắt buộc"
        string externalURL "URL Cloudinary hoặc S3"
        file upload "JPG PNG PDF"
    }

    BRANDS {
        string name "Tên - bắt buộc"
        string slug "Auto từ name"
        ref logo "Media"
        richtext description "Localized VI EN"
    }

    SUB_BRANDS {
        string name "Tên - bắt buộc - localized"
        string slug "Auto từ name"
        ref parentBrand "Brands - bắt buộc"
        ref image "Media"
        string website "URL website"
    }

    PRODUCT_CATEGORIES {
        string name "Tên - bắt buộc - localized"
        string slug "Auto từ name"
        textarea description "Localized"
        ref icon "Media"
        number order "Thứ tự hiển thị"
    }

    INDUSTRIES {
        string name "Tên - bắt buộc - localized"
        string slug "Auto từ name"
        ref icon "Media"
    }

    PRODUCTS {
        string name "Tên - bắt buộc - localized"
        string modelNumber "Mã sản phẩm"
        textarea shortDescription "Max 300 ký tự - localized"
        richtext description "Mô tả chi tiết - localized"
        string slug "Auto từ name"
        boolean featured "Hiện ở trang chủ"
        number sortOrder "Thứ tự"
    }

    BRANDS ||--o{ SUB_BRANDS : "has"
    MEDIA ||--o{ BRANDS : "logo"
    MEDIA ||--o{ SUB_BRANDS : "image"
    MEDIA ||--o{ PRODUCT_CATEGORIES : "icon"
    MEDIA ||--o{ INDUSTRIES : "icon"
    MEDIA ||--o{ PRODUCTS : "images - catalogPDF"
    BRANDS ||--o{ PRODUCTS : "brand - bắt buộc"
    SUB_BRANDS ||--o{ PRODUCTS : "subBrand - optional"
    PRODUCT_CATEGORIES ||--o{ PRODUCTS : "category - bắt buộc"
    INDUSTRIES ||--o{ PRODUCTS : "industries - nhiều"
```



---

## Dataset tối thiểu để test


| Collection   | Số lượng    | Mục đích test                             |
| ------------ | ----------- | ----------------------------------------- |
| Media        | 10–15 files | Ảnh sản phẩm, logo, PDF                   |
| Brands       | 2–3         | Filter theo thương hiệu                   |
| SubBrands    | 1–2         | Hiển thị thương hiệu con                  |
| Categories   | 2–3         | Filter theo danh mục                      |
| Industries   | 2–3         | Filter theo ngành                         |
| **Products** | **>= 10**   | Search, sort, **pagination** (9 SP/trang) |


---

## Bước 1 — Upload Media

**Sidebar → Media → Create New**

```mermaid
flowchart TD
    subgraph media["Media Upload"]
        direction TB
        upload["Kéo thả hoặc chọn file"]
        format["Chấp nhận: image/* và application/pdf"]
        alt["Alt Text * -- Mô tả ảnh cho SEO"]
        ext["External URL -- optional, nếu có sẽ ưu tiên hiển thị thay file upload"]
        sizes["Auto tạo 3 size: thumbnail 400x300, card 768x512, hero 1920x1080"]

        upload --> format --> alt --> ext --> sizes
    end

    style media fill:#f8f9fa,stroke:#dee2e6,color:#1a1a1a
    style upload fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style sizes fill:#d4edda,stroke:#28a745,color:#1a1a1a
```



### Cần upload gì?


| Loại             | Số lượng       | Format   | Ghi chú                 |
| ---------------- | -------------- | -------- | ----------------------- |
| Ảnh sản phẩm     | 1–3 / sản phẩm | JPG, PNG | Nền trắng hoặc studio   |
| Logo thương hiệu | 1 / brand      | PNG      | Nền trong suốt tốt nhất |
| File catalog     | 0–1 / sản phẩm | PDF      | Tài liệu kỹ thuật       |
| Icon danh mục    | 0–1 / category | PNG, SVG | Optional                |
| Icon ngành       | 0–1 / industry | PNG, SVG | Optional                |


---

## Bước 2 — Tạo Brands (Thương hiệu)

**Sidebar → Taxonomies → Brands → Create New**

```mermaid
flowchart TD
    subgraph brand["Brand Form"]
        direction TB
        subgraph main["Main Fields"]
            name["Name * -- vd: Emerson, không localized"]
            logo["Logo -- Chọn từ Media"]
            desc["Description VI / EN -- Rich text editor, localized"]
        end
        subgraph sidebar["Sidebar"]
            slug["Slug: emerson -- auto"]
        end
        name --> logo --> desc
    end

    style brand fill:#f8f9fa,stroke:#dee2e6,color:#1a1a1a
    style main fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style sidebar fill:#fff3cd,stroke:#ffc107,color:#1a1a1a
```



### Ví dụ data


| Name      | Logo               | Description (VI)                                  |
| --------- | ------------------ | ------------------------------------------------- |
| Emerson   | emerson-logo.png   | Tập đoàn công nghệ toàn cầu chuyên về tự động hóa |
| Honeywell | honeywell-logo.png | Nhà cung cấp giải pháp công nghệ đa ngành         |
| Siemens   | siemens-logo.png   | Tập đoàn công nghệ hàng đầu châu Âu               |


---

## Bước 3 — Tạo SubBrands (Thương hiệu con) — Optional

**Sidebar → Taxonomies → Sub Brands → Create New**

```mermaid
flowchart TD
    subgraph subbrand["SubBrand Form -- VI / EN"]
        direction TB
        subgraph main["Main Fields"]
            name["Name * -- vd: Fisher, localized"]
            parent["Parent Brand * -- Chọn: Emerson, thuộc về thương hiệu nào?"]
            image["Image -- Chọn từ Media"]
            web["Website -- https://fisher.emerson.com"]
        end
        subgraph sidebar["Sidebar"]
            slug["Slug: fisher -- auto"]
        end
        name --> parent --> image --> web
    end

    style subbrand fill:#f8f9fa,stroke:#dee2e6,color:#1a1a1a
    style main fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style sidebar fill:#fff3cd,stroke:#ffc107,color:#1a1a1a
```



### Ví dụ data


| Name      | Parent Brand | Website                                                        |
| --------- | ------------ | -------------------------------------------------------------- |
| Fisher    | Emerson      | [https://fisher.emerson.com](https://fisher.emerson.com)       |
| Rosemount | Emerson      | [https://rosemount.emerson.com](https://rosemount.emerson.com) |


/

## Bước 4 — Tạo Product Categories (Danh mục)

**Sidebar → Taxonomies → Product Categories → Create New**

```mermaid
flowchart TD
    subgraph cat["Product Category Form -- VI / EN"]
        direction TB
        subgraph main["Main Fields"]
            name["Name * -- vd: Hệ thống lọc, localized. Tab EN: Filtration Systems"]
            desc["Description -- textarea, localized"]
            icon["Icon -- Chọn từ Media"]
        end
        subgraph sidebar["Sidebar"]
            slug["Slug: he-thong-loc -- auto"]
            order["Order: 0 -- số nhỏ hiện trước"]
        end
        name --> desc --> icon
    end

    style cat fill:#f8f9fa,stroke:#dee2e6,color:#1a1a1a
    style main fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style sidebar fill:#fff3cd,stroke:#ffc107,color:#1a1a1a
```



### Ví dụ data


| Name (VI)         | Name (EN)               | Order |
| ----------------- | ----------------------- | ----- |
| Hệ thống lọc      | Filtration Systems      | 0     |
| Van công nghiệp   | Industrial Valves       | 1     |
| Thiết bị đo lường | Measurement Instruments | 2     |


---

## Bước 5 — Tạo Industries (Ngành công nghiệp)

**Sidebar → Taxonomies → Industries → Create New**

```mermaid
flowchart TD
    subgraph ind["Industry Form -- VI / EN"]
        direction TB
        subgraph main["Main Fields"]
            name["Name * -- vd: Dầu khí, localized. Tab EN: Oil and Gas"]
            icon["Icon -- Chọn từ Media"]
        end
        subgraph sidebar["Sidebar"]
            slug["Slug: dau-khi -- auto"]
        end
        name --> icon
    end

    style ind fill:#f8f9fa,stroke:#dee2e6,color:#1a1a1a
    style main fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style sidebar fill:#fff3cd,stroke:#ffc107,color:#1a1a1a
```



### Ví dụ data


| Name (VI)  | Name (EN) |
| ---------- | --------- |
| Dầu khí    | Oil & Gas |
| Năng lượng | Energy    |
| Hóa chất   | Chemical  |


---

## Bước 6 — Tạo Products (Sản phẩm)

**Sidebar → Content → Products → Create New**

### Tổng quan giao diện — 5 tabs + sidebar

```mermaid
flowchart LR
    subgraph tabs["Product Form -- 5 Tabs"]
        direction TB
        T1["Tab 1: Basic Info -- Name, Model, Short Desc, Description"]
        T2["Tab 2: Media -- Images, Catalog PDF"]
        T3["Tab 3: Specifications -- Label / Value / Unit"]
        T4["Tab 4: Relationships -- Brand, SubBrand, Category, Industries"]
        T5["Tab 5: SEO -- Meta Title, Meta Description"]
    end

    subgraph sidebar["Sidebar"]
        slug["Slug -- auto"]
        feat["Featured -- checkbox"]
        sort["Sort Order: 0"]
        draft["Save Draft"]
        pub["PUBLISH"]
    end

    tabs --- sidebar

    style tabs fill:#f8f9fa,stroke:#364fa1,color:#1a1a1a
    style sidebar fill:#fff3cd,stroke:#ffc107,color:#1a1a1a
    style pub fill:#364fa1,stroke:#1a2d6d,color:#fff
```



> **QUAN TRỌNG:** Phải bấm **Publish** — Draft sẽ KHÔNG hiển thị trên frontend.

### Tab 1 — Basic Info

```mermaid
flowchart TD
    subgraph basic["Tab 1: Basic Info -- VI / EN"]
        direction TB
        name["Name * -- vd: Hệ Thống Xử Lý Khí GPS-5000, localized"]
        model["Model Number -- vd: GPS-5000, không localized"]
        short["Short Description -- max 300 ký tự, localized, hiển thị trên card"]
        desc["Description -- Rich Text Editor Lexical, localized. Hỗ trợ: heading, bold, italic, list, link"]

        name --> model --> short --> desc
    end

    style basic fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style name fill:#fff,stroke:#364fa1,color:#1a1a1a
    style model fill:#fff,stroke:#6c757d,color:#1a1a1a
    style short fill:#fff,stroke:#364fa1,color:#1a1a1a
    style desc fill:#fff,stroke:#364fa1,color:#1a1a1a
```



### Tab 2 — Media

```mermaid
flowchart TD
    subgraph media_tab["Tab 2: Media"]
        direction TB
        images["Images -- Chọn nhiều ảnh từ Media. Ảnh đầu tiên = ảnh chính trên card"]
        pdf["Catalog PDF -- Chọn file PDF từ Media. Hiển thị ở tab Tài liệu trên frontend"]

        images --> pdf
    end

    style media_tab fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
```



### Tab 3 — Specifications

```mermaid
flowchart TD
    subgraph specs["Tab 3: Specifications -- VI / EN"]
        direction TB
        row1["Row 1: Label = Công suất / Value = 500 / Unit = kW"]
        row2["Row 2: Label = Áp suất tối đa / Value = 150 / Unit = Bar"]
        row3["Row 3: Label = Nhiệt độ hoạt động / Value = -20~80 / Unit = C"]
        add["+ Add Specification"]
        note["Lưu ý: Label và Value là localized -- nhớ chuyển tab EN để nhập bản tiếng Anh"]

        row1 --> row2 --> row3 --> add --> note
    end

    style specs fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style note fill:#fff3cd,stroke:#ffc107,color:#1a1a1a
```



### Tab 4 — Relationships

```mermaid
flowchart TD
    subgraph rel["Tab 4: Relationships"]
        direction TB
        brand["Brand * -- Chọn Emerson, bắt buộc"]
        sub["Sub Brand -- Chọn Fisher. CHỈ HIỆN SAU KHI CHỌN BRAND, auto filter theo brand"]
        cat["Category * -- Chọn Hệ thống lọc, bắt buộc"]
        ind["Industries -- chọn nhiều, vd: Dầu khí, Năng lượng"]
        proj["Related Projects -- chọn nhiều, bỏ trống nếu chưa có"]

        brand --> sub --> cat --> ind --> proj
    end

    note["Lưu ý: Chọn Brand trước thì Sub Brand mới hiện"]
    brand ~~~ note

    style rel fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
    style note fill:#fff3cd,stroke:#ffc107,color:#1a1a1a
```



### Tab 5 — SEO (Optional)

```mermaid
flowchart TD
    subgraph seo["Tab 5: SEO -- VI / EN"]
        direction TB
        title["Meta Title -- tối đa 60 ký tự. vd: GPS-5000 - Hệ thống xử lý khí - TTE"]
        desc_seo["Meta Description -- tối đa 160 ký tự"]

        title --> desc_seo
    end

    style seo fill:#e8f0fe,stroke:#364fa1,color:#1a1a1a
```



---

## Bước 7 — Localization (Song ngữ)

Các field có **localized** sẽ hiển thị tab chuyển ngôn ngữ:

```mermaid
flowchart LR
    VI["VI -- Mặc định, nhập trước"]
    EN["EN -- Click để nhập bản tiếng Anh"]

    VI -->|"Chuyển tab"| EN

    style VI fill:#364fa1,stroke:#1a2d6d,color:#fff
    style EN fill:#f8f9fa,stroke:#dee2e6,color:#1a1a1a
```



### Các field cần nhập song ngữ


| Collection | Fields localized                                                              |
| ---------- | ----------------------------------------------------------------------------- |
| Products   | name, shortDescription, description, specifications (label, value, unit), SEO |
| SubBrands  | name, description                                                             |
| Categories | name, description                                                             |
| Industries | name                                                                          |
| Brands     | description (name KHÔNG localized)                                            |


> **Lưu ý:** Nếu chưa nhập bản EN, CMS sẽ tự **fallback về VI**. Nhưng nên nhập cả 2 để hiển thị chính xác.

---

## Bước 8 — Publish và Kiểm tra

### 8.1 Publish sản phẩm

```mermaid
flowchart LR
    D["DRAFT -- KHÔNG hiện trên frontend"]
    P["PUBLISHED -- Hiển thị trên frontend"]

    D -->|"Bấm Publish"| P

    style D fill:#fff3cd,stroke:#ffc107,color:#1a1a1a
    style P fill:#d4edda,stroke:#28a745,color:#1a1a1a
```



> Bấm **Publish** (không phải Save Draft) ở sidebar mỗi sản phẩm.

### 8.2 Kiểm tra API

Mở trình duyệt, truy cập các URL sau:


| Dữ liệu       | URL                                                    |
| ------------- | ------------------------------------------------------ |
| Sản phẩm (VI) | `http://localhost:4001/api/products?depth=2&locale=vi` |
| Sản phẩm (EN) | `http://localhost:4001/api/products?depth=2&locale=en` |
| Thương hiệu   | `http://localhost:4001/api/brands?depth=1`             |
| Danh mục      | `http://localhost:4001/api/product-categories`         |
| Ngành         | `http://localhost:4001/api/industries`                 |
| Sub-brands    | `http://localhost:4001/api/sub-brands?depth=1`         |


### 8.3 Kiểm tra Frontend

**Yêu cầu trước khi test:**


| Điều kiện    | Lệnh / Giá trị                                         |
| ------------ | ------------------------------------------------------ |
| Env variable | `NEXT_PUBLIC_USE_CMS=true` trong `apps/web/.env.local` |
| CMS chạy     | `make dev-cms` (port 4001)                             |
| Web chạy     | `make dev-web` (port 4000)                             |


**URL test:**


| Trang        | URL                                        |
| ------------ | ------------------------------------------ |
| Danh sách SP | `http://localhost:4000/vi/products`        |
| Chi tiết SP  | `http://localhost:4000/vi/products/{slug}` |


### 8.4 Checklist kiểm tra trên Frontend

#### Trang danh sách (`/vi/products`)

- Hiển thị đúng số sản phẩm
- Ảnh sản phẩm load đúng
- Tên, model number, mô tả ngắn hiển thị
- Badge thương hiệu, danh mục hiển thị
- Search — gõ tên/model, filter đúng
- Sort — sắp xếp A-Z, Z-A, mới nhất
- Filter sidebar — chọn brand/category/industry
- Pagination — chuyển trang khi > 9 SP
- Breadcrumb — Trang chủ > Sản phẩm

#### Trang chi tiết (`/vi/products/{slug}`)

- Ảnh gallery + thumbnail
- Tên, model, mô tả ngắn
- Badge brand + category + industries
- Tab Mô tả — rich text render đúng
- Tab Thông số — bảng spec hiển thị
- Tab Tài liệu — link PDF download
- Breadcrumb — Trang chủ > Sản phẩm > Tên SP

#### Chuyển ngôn ngữ

- `/en/products` hiển thị bản tiếng Anh
- Fallback về VI nếu chưa nhập EN

---

## Ví dụ Dataset mẫu

Dưới đây là bộ dữ liệu mẫu đủ để test tất cả tính năng:

### Brands (3)


| #   | Name      | Logo               |
| --- | --------- | ------------------ |
| 1   | Emerson   | emerson-logo.png   |
| 2   | Honeywell | honeywell-logo.png |
| 3   | Siemens   | siemens-logo.png   |


### SubBrands (2)


| #   | Name      | Parent Brand |
| --- | --------- | ------------ |
| 1   | Fisher    | Emerson      |
| 2   | Rosemount | Emerson      |


### Categories (3)


| #   | Name (VI)         | Name (EN)               | Order |
| --- | ----------------- | ----------------------- | ----- |
| 1   | Hệ thống lọc      | Filtration Systems      | 0     |
| 2   | Van công nghiệp   | Industrial Valves       | 1     |
| 3   | Thiết bị đo lường | Measurement Instruments | 2     |


### Industries (3)


| #   | Name (VI)  | Name (EN) |
| --- | ---------- | --------- |
| 1   | Dầu khí    | Oil & Gas |
| 2   | Năng lượng | Energy    |
| 3   | Hóa chất   | Chemical  |


### Products (12 — đủ test pagination 2 trang)


| #   | Name (VI)                     | Model           | Brand     | Category          | Industries           |
| --- | ----------------------------- | --------------- | --------- | ----------------- | -------------------- |
| 1   | Hệ Thống Xử Lý Khí            | GPS-5000        | Emerson   | Hệ thống lọc      | Dầu khí, Năng lượng  |
| 2   | Van Điều Khiển Tuyến Tính     | Fisher DVC-2000 | Emerson   | Van công nghiệp   | Dầu khí              |
| 3   | Bộ Đo Lưu Lượng Siêu Âm       | USM-3000        | Emerson   | Thiết bị đo lường | Dầu khí, Hóa chất    |
| 4   | Hệ Thống Lọc Dầu Thuỷ Lực     | HFS-200         | Honeywell | Hệ thống lọc      | Năng lượng           |
| 5   | Van An Toàn Áp Suất Cao       | PSV-4500        | Honeywell | Van công nghiệp   | Dầu khí, Hóa chất    |
| 6   | Cảm Biến Nhiệt Độ Công Nghiệp | TMP-900         | Honeywell | Thiết bị đo lường | Năng lượng           |
| 7   | Bộ Lọc Khí Nén Công Nghiệp    | CAF-1200        | Siemens   | Hệ thống lọc      | Hóa chất             |
| 8   | Van Bướm Điều Khiển Điện      | EBV-600         | Siemens   | Van công nghiệp   | Năng lượng, Hóa chất |
| 9   | Đồng Hồ Đo Áp Suất Số         | DPG-350         | Siemens   | Thiết bị đo lường | Dầu khí              |
| 10  | Hệ Thống Tách Dầu Nước        | OWS-800         | Emerson   | Hệ thống lọc      | Dầu khí              |
| 11  | Van Cổng Công Nghiệp          | GTV-1500        | Honeywell | Van công nghiệp   | Dầu khí, Năng lượng  |
| 12  | Bộ Phân Tích Khí Online       | OGA-250         | Siemens   | Thiết bị đo lường | Hóa chất, Năng lượng |


> **Kết quả:** 12 sản phẩm, trang 1 hiện 9, trang 2 hiện 3. Mỗi brand 4 SP, mỗi category 4 SP — filter hiển thị đều.

---

## Troubleshooting


| Vấn đề                      | Nguyên nhân                             | Cách fix                                     |
| --------------------------- | --------------------------------------- | -------------------------------------------- |
| Không thấy SP trên frontend | Chưa Publish                            | Vào CMS, Publish sản phẩm                    |
| Ảnh không hiển thị          | Media chưa upload hoặc external URL sai | Kiểm tra Media entry                         |
| Sub Brand không hiện        | Chưa chọn Brand trước                   | Chọn Brand ở tab Relationships trước         |
| API trả về `[]` rỗng        | Sai locale hoặc chưa có data            | Thử `?locale=vi` hoặc bỏ param locale        |
| Frontend hiện static data   | `NEXT_PUBLIC_USE_CMS` chưa set          | Thêm `=true` vào `apps/web/.env.local`       |
| Rich text hiện raw JSON     | Transform layer lỗi                     | Kiểm tra `transforms.ts` — `lexicalToHtml()` |


