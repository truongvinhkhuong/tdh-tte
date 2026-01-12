import type { CollectionConfig } from 'payload';

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
            name: 'icon',
            type: 'upload',
            relationTo: 'media',
        },
    ],
};
