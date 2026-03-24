import type { CollectionConfig } from 'payload';
import { formatSlug } from '../../utils/formatSlug';

export const ProductCategories: CollectionConfig = {
    slug: 'product-categories',
    admin: {
        useAsTitle: 'name',
        group: 'Taxonomies',
        defaultColumns: ['name', 'slug', 'updatedAt'],
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
                description: 'URL slug (tự động tạo từ tên)',
            },
        },
        {
            name: 'description',
            type: 'textarea',
            localized: true,
        },
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
    ],
};
