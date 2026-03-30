import type { CollectionConfig } from 'payload';
import { formatSlug } from '../utils/formatSlug';

export const Projects: CollectionConfig = {
    slug: 'projects',
    admin: {
        useAsTitle: 'name',
        group: 'Content',
        defaultColumns: ['name', 'client', 'completionYear', 'updatedAt'],
    },
    versions: {
        drafts: true,
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            localized: true,
            validate: (value, { req }) => {
                if (req.locale === 'vi' && !value) {
                    return 'Tên dự án (tiếng Việt) là bắt buộc'
                }
                return true
            },
        },
        {
            name: 'slug',
            type: 'text',
            unique: true,
            hooks: {
                beforeChange: [formatSlug('name')],
            },
            admin: {
                position: 'sidebar',
                description: 'URL slug (không dịch, tự động tạo từ tên)',
            },
        },
        {
            name: 'shortDescription',
            type: 'textarea',
            localized: true,
            validate: (value, { req }) => {
                if (req.locale === 'vi' && !value) {
                    return 'Mô tả ngắn (tiếng Việt) là bắt buộc'
                }
                return true
            },
            admin: {
                description: 'Mô tả ngắn (~150 ký tự) hiển thị trên card và SEO',
            },
        },
        {
            name: 'heroImage',
            type: 'upload',
            relationTo: 'media',
            required: true,
            admin: {
                description: 'Ảnh đại diện hiển thị trên card danh sách và trang chi tiết',
            },
        },
        {
            name: 'client',
            type: 'text',
        },
        {
            name: 'location',
            type: 'text',
            localized: true,
        },
        {
            name: 'industry',
            type: 'relationship',
            relationTo: 'industries',
            required: true,
            admin: {
                position: 'sidebar',
                description: 'Ngành công nghiệp (dùng để lọc và hiển thị badge)',
            },
        },
        {
            name: 'completionYear',
            type: 'number',
            min: 1990,
            max: 2100,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'challenge',
            type: 'richText',
            localized: true,
            admin: {
                description: 'Thách thức/vấn đề của dự án',
            },
        },
        {
            name: 'solution',
            type: 'richText',
            localized: true,
            admin: {
                description: 'Giải pháp TTE cung cấp',
            },
        },
        {
            name: 'gallery',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
        },
        // Relationships
        {
            name: 'products',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
            admin: {
                description: 'Sản phẩm sử dụng trong dự án',
            },
        },
        {
            name: 'services',
            type: 'relationship',
            relationTo: 'services',
            hasMany: true,
            admin: {
                description: 'Dịch vụ cung cấp trong dự án',
            },
        },
        // SEO
        {
            name: 'seo',
            type: 'group',
            admin: {
                position: 'sidebar',
            },
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
};
