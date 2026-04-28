import type { CollectionConfig } from 'payload';
import { formatSlug } from '../../utils/formatSlug';
import { requiredInVietnamese } from '../../utils/validators';

export const Industries: CollectionConfig = {
    slug: 'industries',
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
            validate: requiredInVietnamese('Tên ngành (tiếng Việt) là bắt buộc'),
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
    ],
};
