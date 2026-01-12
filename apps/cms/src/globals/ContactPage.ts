import type { GlobalConfig } from 'payload';

export const ContactPage: GlobalConfig = {
    slug: 'contact-page',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'address',
            type: 'text',
            localized: true,
            admin: {
                description: 'Địa chỉ văn phòng',
            },
        },
        {
            name: 'hotline',
            type: 'text',
            admin: {
                description: 'Số điện thoại hotline',
            },
        },
        {
            name: 'email',
            type: 'text',
            admin: {
                description: 'Email liên hệ',
            },
        },
        {
            name: 'mapEmbed',
            type: 'textarea',
            admin: {
                description: 'Google Maps embed code (iframe)',
            },
        },
        // SEO
        {
            name: 'seo',
            type: 'group',
            fields: [
                {
                    name: 'metaTitle',
                    type: 'text',
                    localized: true,
                },
                {
                    name: 'metaDescription',
                    type: 'textarea',
                    localized: true,
                },
                {
                    name: 'shareImage',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
    ],
};
