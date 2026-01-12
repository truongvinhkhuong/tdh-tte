import type { CollectionConfig } from 'payload';
import { formatSlug } from '../utils/formatSlug';

export const TechArticles: CollectionConfig = {
    slug: 'tech-articles',
    admin: {
        useAsTitle: 'title',
        group: 'Tech Hub',
        defaultColumns: ['title', 'category', 'publishedAt', '_status'],
        description: 'Trang Tech Hub - Bài viết kỹ thuật, tài liệu và Case Studies',
    },
    versions: {
        drafts: true,
    },
    access: {
        read: () => true,
    },
    fields: [
        // Basic Info
        {
            name: 'title',
            label: 'Tiêu đề',
            type: 'text',
            localized: true,
            required: true,
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
            name: 'category',
            label: 'Chuyên mục',
            type: 'select',
            required: true,
            options: [
                { label: 'Giải pháp & Ứng dụng', value: 'solution' },
                { label: 'Tài liệu kỹ thuật', value: 'whitepaper' },
                { label: 'Dự án tiêu biểu (Case Study)', value: 'case-study' },
            ],
            admin: {
                position: 'sidebar',
                description: 'Loại nội dung trong Tech Hub',
            },
        },
        {
            name: 'excerpt',
            label: 'Tóm tắt',
            type: 'textarea',
            localized: true,
            maxLength: 300,
            required: true,
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

        // Content for Solutions
        {
            name: 'content',
            label: 'Nội dung bài viết',
            type: 'richText',
            localized: true,
            admin: {
                condition: (data) => data.category === 'solution',
                description: 'Nội dung chi tiết của giải pháp',
            },
        },
        {
            name: 'author',
            label: 'Tác giả',
            type: 'text',
            admin: {
                condition: (data) => data.category === 'solution',
            },
        },
        {
            name: 'readTime',
            label: 'Thời gian đọc (phút)',
            type: 'number',
            min: 1,
            max: 60,
            admin: {
                position: 'sidebar',
                condition: (data) => data.category === 'solution',
            },
        },

        // Fields for Whitepapers/Technical Documents
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
                condition: (data) => data.category === 'whitepaper',
            },
        },
        {
            name: 'downloadFile',
            label: 'File tải về',
            type: 'upload',
            relationTo: 'media',
            admin: {
                condition: (data) => data.category === 'whitepaper',
                description: 'File PDF/DOC để khách hàng tải về',
            },
        },
        {
            name: 'fileSize',
            label: 'Kích thước file',
            type: 'text',
            admin: {
                position: 'sidebar',
                condition: (data) => data.category === 'whitepaper',
                description: 'VD: 2.5 MB',
            },
        },

        // Fields for Case Studies
        {
            name: 'client',
            label: 'Khách hàng',
            type: 'text',
            admin: {
                condition: (data) => data.category === 'case-study',
            },
        },
        {
            name: 'location',
            label: 'Địa điểm',
            type: 'text',
            localized: true,
            admin: {
                condition: (data) => data.category === 'case-study',
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
                condition: (data) => data.category === 'case-study',
            },
        },
        {
            name: 'industry',
            label: 'Ngành công nghiệp',
            type: 'relationship',
            relationTo: 'industries',
            admin: {
                condition: (data) => data.category === 'case-study',
            },
        },
        {
            name: 'challenge',
            label: 'Thách thức',
            type: 'richText',
            localized: true,
            admin: {
                condition: (data) => data.category === 'case-study',
                description: 'Mô tả vấn đề/thách thức của dự án',
            },
        },
        {
            name: 'solutionProvided',
            label: 'Giải pháp cung cấp',
            type: 'richText',
            localized: true,
            admin: {
                condition: (data) => data.category === 'case-study',
                description: 'Giải pháp TTE đã cung cấp',
            },
        },
        {
            name: 'results',
            label: 'Kết quả đạt được',
            type: 'array',
            localized: true,
            admin: {
                condition: (data) => data.category === 'case-study',
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
                condition: (data) => data.category === 'case-study',
                description: 'Ảnh dự án',
            },
        },

        // Relationships
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
            },
        },
    ],
};
