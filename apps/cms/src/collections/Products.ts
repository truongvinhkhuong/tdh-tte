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
                                    type: 'textarea',
                                    localized: true,
                                    required: true,
                                    admin: {
                                        description: 'VD: "100" hoặc "Bronze: 400 psi at 150°F/250 psi at 400°F"',
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
                            required: true,
                            hasMany: false,
                        },
                        {
                            name: 'subBrand',
                            type: 'relationship',
                            relationTo: 'sub-brands',
                            hasMany: false,
                            filterOptions: ({ data }) => ({
                                parentBrand: { equals: data?.brand },
                            }),
                            admin: {
                                description: 'Chọn danh mục con (nếu có). Lưu ý: Phải chọn Brand trước.',
                                condition: (data) => Boolean(data?.brand),
                            },
                        },
                        {
                            name: 'category',
                            type: 'relationship',
                            relationTo: 'product-categories',
                            required: true,
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
                            ],
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
        {
            name: 'featured',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: 'Đánh dấu sản phẩm nổi bật',
            },
        },
        {
            name: 'sortOrder',
            type: 'number',
            defaultValue: 0,
            admin: {
                position: 'sidebar',
                description: 'Thứ tự hiển thị (số nhỏ = ưu tiên cao)',
            },
        },
    ],
};
