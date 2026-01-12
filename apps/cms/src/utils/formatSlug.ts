import type { FieldHook } from 'payload';

/**
 * Remove Vietnamese accents from a string
 */
const removeAccents = (str: string): string => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

/**
 * Convert a string to kebab-case slug
 */
const toKebabCase = (str: string): string => {
    return removeAccents(str)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
};

/**
 * Hook to auto-generate slugs from a source field
 * Only generates on create if slug is empty
 * 
 * @param sourceField - The field name to generate slug from (e.g., 'title', 'name')
 */
export const formatSlug = (sourceField: string): FieldHook => {
    return ({ data, value, operation }) => {
        // Only auto-generate on create if slug is empty
        if (operation === 'create' && !value) {
            const sourceValue = data?.[sourceField];
            if (typeof sourceValue === 'string') {
                return toKebabCase(sourceValue);
            }
        }
        return value;
    };
};

export { removeAccents, toKebabCase };
