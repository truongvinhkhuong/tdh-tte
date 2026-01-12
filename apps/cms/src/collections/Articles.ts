import type { CollectionConfig } from 'payload';
import { formatSlug } from '../utils/formatSlug';

export const Articles: CollectionConfig = {
    slug: 'articles',
    admin: {
        useAsTitle: 'title',
        group: 'Content',
        defaultColumns: ['title', 'type', 'createdAt', '_status'],
    },
    versions: {
        drafts: true,
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            localized: true,
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            localized: true,
            unique: true,
            hooks: {
                beforeChange: [formatSlug('title')],
            },
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            options: [
                { label: 'Giải pháp kỹ thuật', value: 'Technical_Solution' },
                { label: 'Sự kiện TTE', value: 'TTE_Event' },
                { label: 'Tin tức ngành', value: 'Industry_News' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'summary',
            type: 'textarea',
            localized: true,
            maxLength: 300,
        },
        {
            name: 'content',
            type: 'richText',
            localized: true,
        },
        {
            name: 'coverImage',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'documentDownload',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
            admin: {
                description: 'Tài liệu đính kèm (PDF, brochure...)',
            },
        },
        // Relationships
        {
            name: 'relatedProducts',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
        },
    ],
};
