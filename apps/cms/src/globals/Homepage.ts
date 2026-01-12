import type { GlobalConfig } from 'payload';

export const Homepage: GlobalConfig = {
    slug: 'homepage',
    access: {
        read: () => true,
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Hero',
                    fields: [
                        {
                            name: 'heroTitle',
                            type: 'text',
                            localized: true,
                        },
                        {
                            name: 'heroSubtitle',
                            type: 'text',
                            localized: true,
                        },
                        {
                            name: 'heroBanner',
                            type: 'upload',
                            relationTo: 'media',
                        },
                    ],
                },
                {
                    label: 'Featured',
                    fields: [
                        {
                            name: 'featuredProjects',
                            type: 'relationship',
                            relationTo: 'projects',
                            hasMany: true,
                            admin: {
                                description: 'Dự án nổi bật hiển thị trên trang chủ',
                            },
                        },
                        {
                            name: 'featuredBrands',
                            type: 'relationship',
                            relationTo: 'brands',
                            hasMany: true,
                            admin: {
                                description: 'Thương hiệu đối tác nổi bật',
                            },
                        },
                    ],
                },
                {
                    label: 'SEO',
                    fields: [
                        {
                            name: 'seo',
                            type: 'group',
                            fields: [
                                {
                                    name: 'metaTitle',
                                    type: 'text',
                                    localized: true,
                                    admin: {
                                        description: 'Tiêu đề hiển thị trên tab trình duyệt (max 60 ký tự)',
                                    },
                                },
                                {
                                    name: 'metaDescription',
                                    type: 'textarea',
                                    localized: true,
                                    admin: {
                                        description: 'Mô tả cho SEO (max 160 ký tự)',
                                    },
                                },
                                {
                                    name: 'shareImage',
                                    type: 'upload',
                                    relationTo: 'media',
                                    admin: {
                                        description: 'Hình ảnh khi chia sẻ lên mạng xã hội',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};
