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
            required: true,
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
            name: 'client',
            type: 'text',
        },
        {
            name: 'location',
            type: 'text',
            localized: true,
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
