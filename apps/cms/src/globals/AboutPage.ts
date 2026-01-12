import type { GlobalConfig } from 'payload';

export const AboutPage: GlobalConfig = {
    slug: 'about-page',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'history',
            type: 'richText',
            localized: true,
            admin: {
                description: 'Lịch sử hình thành và phát triển công ty',
            },
        },
        {
            name: 'mission',
            type: 'textarea',
            localized: true,
            admin: {
                description: 'Sứ mệnh của TTE',
            },
        },
        {
            name: 'vision',
            type: 'textarea',
            localized: true,
            admin: {
                description: 'Tầm nhìn của TTE',
            },
        },
        {
            name: 'coreValues',
            type: 'richText',
            localized: true,
            admin: {
                description: 'Giá trị cốt lõi của TTE',
            },
        },
        {
            name: 'certificates',
            type: 'upload',
            relationTo: 'media',
            hasMany: true,
            admin: {
                description: 'Chứng chỉ, giấy phép kinh doanh',
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
