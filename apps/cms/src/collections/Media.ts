import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
    slug: 'media',
    admin: {
        group: 'Media',
    },
    access: {
        read: () => true,
    },
    upload: {
        staticDir: 'media',
        imageSizes: [
            {
                name: 'thumbnail',
                width: 400,
                height: 300,
                position: 'centre',
            },
            {
                name: 'card',
                width: 768,
                height: 512,
                position: 'centre',
            },
            {
                name: 'hero',
                width: 1920,
                height: 1080,
                position: 'centre',
            },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*', 'application/pdf'],
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            localized: true,
            required: true,
            admin: {
                description: 'Mô tả hình ảnh cho SEO và accessibility',
            },
        },
    ],
};
