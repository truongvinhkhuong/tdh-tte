import type { CollectionConfig } from 'payload';
import { formatSlug } from '../utils/formatSlug';

/**
 * Unified Articles Collection
 * 
 * Combines all content types:
 * - News (TTE Events, Industry News)
 * - Tech Hub (Solutions, Whitepapers, Case Studies)
 * 
 * Content editors select contentType first, then see relevant fields.
 */
export const Articles: CollectionConfig = {
    slug: 'articles',
    admin: {
        useAsTitle: 'title',
        group: 'Content',
        defaultColumns: ['title', 'contentType', 'publishedAt', '_status'],
        description: 'Tất cả bài viết: Tin tức, Giải pháp kỹ thuật, Tài liệu, Case Studies',
    },
    versions: {
        drafts: true,
    },
    access: {
        read: () => true,
    },
    fields: [
        // ============================================
        // BASIC INFO (All content types)
        // ============================================
        {
            name: 'title',
            label: 'Tiêu đề',
            type: 'text',
            localized: true,
            validate: (value, { req }) => {
                if (req.locale === 'vi' && !value) {
                    return 'Tiêu đề (tiếng Việt) là bắt buộc'
                }
                return true
            },
        },
        {
            name: 'slug',
            type: 'text',
            unique: true,
            hooks: {
                beforeChange: [formatSlug('title')],
            },
            admin: {
                position: 'sidebar',
                description: 'URL slug (tự động tạo từ tiêu đề)',
            },
        },
        {
            name: 'contentType',
            label: 'Loại nội dung',
            type: 'select',
            required: true,
            defaultValue: 'news',
            options: [
                { label: '📰 Tin tức & Sự kiện', value: 'news' },
                { label: '🔧 Tech Hub (Kỹ thuật)', value: 'tech-hub' },
            ],
            admin: {
                position: 'sidebar',
                description: 'Chọn loại nội dung để hiển thị các trường phù hợp',
            },
        },

        // ============================================
        // NEWS SPECIFIC
        // ============================================
        {
            name: 'newsCategory',
            label: 'Chuyên mục tin tức',
            type: 'select',
            options: [
                { label: 'Tin TTE', value: 'company' },
                { label: 'Tin đối tác', value: 'partner' },
                { label: 'Tin ngành', value: 'industry' },
            ],
            admin: {
                position: 'sidebar',
                condition: (data) => data.contentType === 'news',
            },
        },
        {
            name: 'tags',
            label: 'Tags',
            type: 'array',
            admin: {
                condition: (data) => data.contentType === 'news',
            },
            fields: [
                {
                    name: 'tag',
                    type: 'text',
                    required: true,
                },
            ],
        },

        // ============================================
        // TECH HUB SPECIFIC
        // ============================================
        {
            name: 'techCategory',
            label: 'Chuyên mục Tech Hub',
            type: 'select',
            options: [
                { label: 'Giải pháp & Ứng dụng', value: 'solution' },
                { label: 'Tài liệu kỹ thuật', value: 'whitepaper' },
                { label: 'Dự án tiêu biểu (Case Study)', value: 'case-study' },
            ],
            admin: {
                position: 'sidebar',
                condition: (data) => data.contentType === 'tech-hub',
                description: 'Loại nội dung trong Tech Hub',
            },
        },

        // ============================================
        // SHARED FIELDS
        // ============================================
        {
            name: 'excerpt',
            label: 'Tóm tắt',
            type: 'textarea',
            localized: true,
            maxLength: 300,
            admin: {
                description: 'Mô tả ngắn hiển thị ở danh sách',
            },
        },
        {
            name: 'coverImage',
            label: 'Ảnh bìa',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'publishedAt',
            label: 'Ngày đăng',
            type: 'date',
            admin: {
                position: 'sidebar',
                date: {
                    pickerAppearance: 'dayOnly',
                    displayFormat: 'dd/MM/yyyy',
                },
            },
        },
        {
            name: 'content',
            label: 'Nội dung bài viết',
            type: 'richText',
            localized: true,
            admin: {
                condition: (data) => 
                    data.contentType === 'news' || 
                    (data.contentType === 'tech-hub' && data.techCategory === 'solution'),
            },
        },
        {
            name: 'author',
            label: 'Tác giả',
            type: 'text',
            admin: {
                condition: (data) => 
                    data.contentType === 'news' || 
                    (data.contentType === 'tech-hub' && data.techCategory === 'solution'),
            },
        },

        // ============================================
        // SOLUTION SPECIFIC (Tech Hub)
        // ============================================
        {
            name: 'readTime',
            label: 'Thời gian đọc (phút)',
            type: 'number',
            min: 1,
            max: 60,
            admin: {
                position: 'sidebar',
                condition: (data) => data.contentType === 'tech-hub' && data.techCategory === 'solution',
            },
        },

        // ============================================
        // WHITEPAPER SPECIFIC (Tech Hub)
        // ============================================
        {
            name: 'documentType',
            label: 'Loại tài liệu',
            type: 'select',
            options: [
                { label: 'Catalog', value: 'catalog' },
                { label: 'Whitepaper', value: 'whitepaper' },
                { label: 'Hướng dẫn kỹ thuật', value: 'guide' },
                { label: 'Tiêu chuẩn (API/ISO)', value: 'standard' },
                { label: 'Hướng dẫn sử dụng', value: 'manual' },
                { label: 'Datasheet', value: 'datasheet' },
            ],
            admin: {
                position: 'sidebar',
                condition: (data) => data.contentType === 'tech-hub' && data.techCategory === 'whitepaper',
            },
        },
        {
            name: 'downloadFile',
            label: 'File tải về',
            type: 'upload',
            relationTo: 'media',
            admin: {
                condition: (data) => data.contentType === 'tech-hub' && data.techCategory === 'whitepaper',
                description: 'File PDF/DOC để khách hàng tải về',
            },
        },
        {
            name: 'fileSize',
            label: 'Kích thước file',
            type: 'text',
            admin: {
                position: 'sidebar',
                condition: (data) => data.contentType === 'tech-hub' && data.techCategory === 'whitepaper',
                description: 'VD: 2.5 MB',
            },
        },

        // ============================================
        // CASE STUDY SPECIFIC (Tech Hub)
        // ============================================
        {
            name: 'client',
            label: 'Khách hàng',
            type: 'text',
            admin: {
                condition: (data) => data.contentType === 'tech-hub' && data.techCategory === 'case-study',
            },
        },
        {
            name: 'location',
            label: 'Địa điểm',
            type: 'text',
            localized: true,
            admin: {
                condition: (data) => data.contentType === 'tech-hub' && data.techCategory === 'case-study',
            },
        },
        {
            name: 'projectYear',
            label: 'Năm thực hiện',
            type: 'number',
            min: 1993,
            max: 2100,
            admin: {
                position: 'sidebar',
                condition: (data) => data.contentType === 'tech-hub' && data.techCategory === 'case-study',
            },
        },
        {
            name: 'industry',
            label: 'Ngành công nghiệp',
            type: 'relationship',
            relationTo: 'industries',
            admin: {
                condition: (data) => data.contentType === 'tech-hub' && data.techCategory === 'case-study',
            },
        },
        {
            name: 'challenge',
            label: 'Thách thức',
            type: 'richText',
            localized: true,
            admin: {
                condition: (data) => data.contentType === 'tech-hub' && data.techCategory === 'case-study',
                description: 'Mô tả vấn đề/thách thức của dự án',
            },
        },
        {
            name: 'solutionProvided',
            label: 'Giải pháp cung cấp',
            type: 'richText',
            localized: true,
            admin: {
                condition: (data) => data.contentType === 'tech-hub' && data.techCategory === 'case-study',
                description: 'Giải pháp TTE đã cung cấp',
            },
        },
        {
            name: 'results',
            label: 'Kết quả đạt được',
            type: 'array',
            localized: true,
            admin: {
                condition: (data) => data.contentType === 'tech-hub' && data.techCategory === 'case-study',
                description: 'Danh sách kết quả/thành tựu',
            },
            fields: [
                {
                    name: 'result',
                    type: 'text',
                    required: true,
                },
            ],
        },
        {
            name: 'gallery',
            label: 'Thư viện ảnh',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
            admin: {
                condition: (data) => data.contentType === 'tech-hub' && data.techCategory === 'case-study',
                description: 'Ảnh dự án',
            },
        },

        // ============================================
        // RELATIONSHIPS (All content types)
        // ============================================
        {
            name: 'relatedProducts',
            label: 'Sản phẩm liên quan',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
            admin: {
                description: 'Sản phẩm được đề cập trong bài viết',
            },
        },
        {
            name: 'relatedBrand',
            label: 'Thương hiệu liên quan',
            type: 'relationship',
            relationTo: 'brands',
            admin: {
                position: 'sidebar',
                condition: (data) => data.contentType === 'tech-hub',
            },
        },
        {
            name: 'documentDownload',
            label: 'Tài liệu đính kèm',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
            admin: {
                description: 'Tài liệu đính kèm (PDF, brochure...)',
            },
        },
    ],
};
