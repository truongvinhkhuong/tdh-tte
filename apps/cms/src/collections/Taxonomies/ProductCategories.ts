import type { CollectionConfig } from 'payload';

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
            localized: true,
            unique: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'description',
            type: 'textarea',
            localized: true,
        },
    ],
};
