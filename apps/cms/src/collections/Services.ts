import type { CollectionConfig } from 'payload';
import { formatSlug } from '../utils/formatSlug';

export const Services: CollectionConfig = {
    slug: 'services',
    admin: {
        useAsTitle: 'name',
        group: 'Content',
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
            name: 'icon',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'description',
            type: 'richText',
            localized: true,
        },
    ],
};
