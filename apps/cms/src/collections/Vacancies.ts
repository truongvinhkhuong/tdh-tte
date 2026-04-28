import type { CollectionConfig } from 'payload';
import { requiredInVietnamese } from '../utils/validators';

export const Vacancies: CollectionConfig = {
    slug: 'vacancies',
    admin: {
        useAsTitle: 'position',
        group: 'Content',
        defaultColumns: ['position', 'department', 'deadline', 'quantity'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'position',
            type: 'text',
            localized: true,
            validate: requiredInVietnamese('Tên vị trí (tiếng Việt) là bắt buộc'),
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
            name: 'department',
            type: 'select',
            required: true,
            options: [
                { label: 'Kinh doanh', value: 'Sales' },
                { label: 'Kỹ thuật', value: 'Technical' },
                { label: 'Hành chính', value: 'Admin' },
                { label: 'Kho vận', value: 'Logistics' },
                { label: 'Quản lý', value: 'Management' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'location',
            type: 'text',
            localized: true,
        },
        {
            name: 'quantity',
            type: 'number',
            min: 1,
            defaultValue: 1,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'deadline',
            type: 'date',
            admin: {
                position: 'sidebar',
                date: {
                    pickerAppearance: 'dayOnly',
                    displayFormat: 'dd/MM/yyyy',
                },
            },
        },
        {
            name: 'salaryRange',
            type: 'text',
            localized: true,
            admin: {
                description: 'VD: "15-25 triệu" hoặc "Thỏa thuận"',
            },
        },
        {
            name: 'description',
            type: 'richText',
            localized: true,
            admin: {
                description: 'Mô tả công việc, yêu cầu, quyền lợi...',
            },
        },
    ],
};
