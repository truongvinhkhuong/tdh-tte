import type { CollectionConfig } from 'payload';
import { formatSlug } from '../utils/formatSlug';

export const Products: CollectionConfig = {
    slug: 'products',
    admin: {
        useAsTitle: 'name',
        group: 'Content',
        defaultColumns: ['name', 'brand', 'category', 'updatedAt'],
    },
    versions: {
        drafts: true,
    },
    access: {
        read: () => true,
    },
    fields: [
        // Basic Info Tab
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Basic Info',
                    fields: [
                        {
                            name: 'name',
                            type: 'text',
                            localized: true,
                            required: true,
                        },
                        {
                            name: 'modelNumber',
                            type: 'text',
                            admin: {
                                description: 'Mã sản phẩm (không cần dịch)',
                            },
                        },
                        {
                            name: 'shortDescription',
                            type: 'textarea',
                            localized: true,
                            maxLength: 300,
                        },
                        {
                            name: 'description',
                            type: 'richText',
                            localized: true,
                        },
                    ],
                },
                {
                    label: 'Media',
                    fields: [
                        {
                            name: 'images',
                            type: 'upload',
                            relationTo: 'media',
                            hasMany: true,
                        },
                        {
                            name: 'catalogPDF',
                            type: 'upload',
                            relationTo: 'media',
                            hasMany: true,
                            admin: {
                                description: 'File PDF catalog sản phẩm',
                            },
                        },
                    ],
                },
                {
                    label: 'Specifications',
                    fields: [
                        {
                            name: 'specifications',
                            type: 'array',
                            admin: {
                                description: 'Thông số kỹ thuật sản phẩm',
                            },
                            fields: [
                                {
                                    name: 'label',
                                    type: 'text',
                                    localized: true,
                                    required: true,
                                    admin: {
                                        description: 'VD: "Áp suất tối đa"',
                                    },
                                },
                                {
                                    name: 'value',
                                    type: 'text',
                                    localized: true,
                                    required: true,
                                    admin: {
                                        description: 'VD: "100"',
                                    },
                                },
                                {
                                    name: 'unit',
                                    type: 'text',
                                    localized: true,
                                    admin: {
                                        description: 'VD: "Bar"',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    label: 'Relationships',
                    fields: [
                        {
                            name: 'brand',
                            type: 'relationship',
                            relationTo: 'brands',
                            hasMany: false,
                        },
                        {
                            name: 'category',
                            type: 'relationship',
                            relationTo: 'product-categories',
                            hasMany: false,
                        },
                        {
                            name: 'industries',
                            type: 'relationship',
                            relationTo: 'industries',
                            hasMany: true,
                        },
                        {
                            name: 'relatedProjects',
                            type: 'relationship',
                            relationTo: 'projects',
                            hasMany: true,
                        },
                    ],
                },
            ],
        },
        // Sidebar
        {
            name: 'slug',
            type: 'text',
            unique: true,
            hooks: {
                beforeChange: [formatSlug('name')],
            },
            admin: {
                position: 'sidebar',
                description: 'URL slug (không dịch, tự động tạo từ tên)',
            },
        },
    ],
};
