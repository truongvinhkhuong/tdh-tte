import type { CollectionConfig } from 'payload';
import { formatSlug } from '../../utils/formatSlug';
import { requiredInVietnamese } from '../../utils/validators';

export const SubBrands: CollectionConfig = {
    slug: 'sub-brands',
    admin: {
        useAsTitle: 'name',
        group: 'Taxonomies',
        defaultColumns: ['name', 'parentBrand', 'updatedAt'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            localized: true,
            validate: requiredInVietnamese('Tên sub-brand (tiếng Việt) là bắt buộc'),
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
                description: 'URL slug (tự động tạo từ tên)',
            },
        },
        {
            name: 'parentBrand',
            type: 'relationship',
            relationTo: 'brands',
            required: true,
            admin: {
                description: 'Thuộc về thương hiệu nào?',
            },
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            admin: {
                description: 'Hình ảnh đại diện cho danh mục con (nếu có)',
            },
        },
        {
            name: 'description',
            type: 'richText',
            localized: true,
        },
        // Additional fields can be added here
        {
            name: 'website',
            type: 'text',
            admin: {
                description: 'Website riêng của sub-brand (nếu có)',
            },
        },
    ],
};
