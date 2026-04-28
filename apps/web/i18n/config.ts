export const i18n = {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
} as const;

export type Locale = (typeof i18n.locales)[number];

export function isValidLocale(locale: string): locale is Locale {
    return i18n.locales.includes(locale as Locale);
}

export function normalizeLocale(locale: string): Locale {
    return isValidLocale(locale) ? locale : i18n.defaultLocale;
}
