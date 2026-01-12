import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin';

export const Users: CollectionConfig = {
    slug: 'users',
    auth: true,
    admin: {
        useAsTitle: 'email',
        group: 'Admin',
        defaultColumns: ['email', 'name', 'role', 'createdAt'],
    },
    access: {
        read: () => true,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'role',
            type: 'select',
            required: true,
            defaultValue: 'editor',
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' },
                { label: 'Marketing', value: 'marketing' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
    ],
};
