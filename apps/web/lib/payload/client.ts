/**
 * Payload CMS API Client
 * 
 * This module provides utilities for fetching data from Payload CMS API.
 * It's designed to work with both server-side and client-side rendering in Next.js.
 */

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export interface PayloadResponse<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    pagingCounter: number;
}

export interface QueryOptions {
    limit?: number;
    page?: number;
    where?: Record<string, unknown>;
    sort?: string;
    depth?: number;
    locale?: 'en' | 'vi';
}

/**
 * Build query string from options
 */
function buildQueryString(options: QueryOptions): string {
    const params = new URLSearchParams();

    if (options.limit) params.set('limit', options.limit.toString());
    if (options.page) params.set('page', options.page.toString());
    if (options.sort) params.set('sort', options.sort);
    if (options.depth !== undefined) params.set('depth', options.depth.toString());
    if (options.locale) params.set('locale', options.locale);

    if (options.where) {
        Object.entries(options.where).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                Object.entries(value as Record<string, unknown>).forEach(([op, val]) => {
                    params.set(`where[${key}][${op}]`, String(val));
                });
            } else {
                params.set(`where[${key}][equals]`, String(value));
            }
        });
    }

    return params.toString();
}

/**
 * Fetch from Payload API with error handling
 */
async function fetchPayload<T>(
    endpoint: string,
    options: QueryOptions = {}
): Promise<T> {
    const queryString = buildQueryString(options);
    const url = `${PAYLOAD_API_URL}/api${endpoint}${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
        next: { revalidate: 60 }, // Cache for 60 seconds
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Payload API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

// ============================================
// COLLECTION FETCHERS
// ============================================

export async function getBrands(options?: QueryOptions) {
    return fetchPayload<PayloadResponse<any>>('/brands', { depth: 1, ...options });
}

export async function getBrand(slug: string, locale?: 'en' | 'vi') {
    const res = await fetchPayload<PayloadResponse<any>>('/brands', {
        where: { slug: { equals: slug } },
        limit: 1,
        locale,
    });
    return res.docs[0] || null;
}

export async function getCategories(options?: QueryOptions) {
    return fetchPayload<PayloadResponse<any>>('/product-categories', { ...options });
}

export async function getIndustries(options?: QueryOptions) {
    return fetchPayload<PayloadResponse<any>>('/industries', { ...options });
}

export async function getProducts(options?: QueryOptions) {
    return fetchPayload<PayloadResponse<any>>('/products', { depth: 2, ...options });
}

export async function getProduct(slug: string, locale?: 'en' | 'vi') {
    const res = await fetchPayload<PayloadResponse<any>>('/products', {
        where: { slug: { equals: slug } },
        depth: 2,
        limit: 1,
        locale,
    });
    return res.docs[0] || null;
}

export async function getProjects(options?: QueryOptions) {
    return fetchPayload<PayloadResponse<any>>('/projects', { depth: 2, ...options });
}

export async function getProject(slug: string, locale?: 'en' | 'vi') {
    const res = await fetchPayload<PayloadResponse<any>>('/projects', {
        where: { slug: { equals: slug } },
        depth: 2,
        limit: 1,
        locale,
    });
    return res.docs[0] || null;
}

export async function getServices(options?: QueryOptions) {
    return fetchPayload<PayloadResponse<any>>('/services', { ...options });
}

export async function getService(slug: string, locale?: 'en' | 'vi') {
    const res = await fetchPayload<PayloadResponse<any>>('/services', {
        where: { slug: { equals: slug } },
        limit: 1,
        locale,
    });
    return res.docs[0] || null;
}

export async function getArticles(options?: QueryOptions & { type?: string }) {
    const { type, ...rest } = options || {};
    const where = type ? { type: { equals: type } } : undefined;
    return fetchPayload<PayloadResponse<any>>('/articles', {
        depth: 1,
        where,
        sort: '-createdAt',
        ...rest
    });
}

export async function getArticle(slug: string, locale?: 'en' | 'vi') {
    const res = await fetchPayload<PayloadResponse<any>>('/articles', {
        where: { slug: { equals: slug } },
        depth: 2,
        limit: 1,
        locale,
    });
    return res.docs[0] || null;
}

export async function getVacancies(options?: QueryOptions) {
    return fetchPayload<PayloadResponse<any>>('/vacancies', { ...options });
}

export async function getVacancy(slug: string, locale?: 'en' | 'vi') {
    const res = await fetchPayload<PayloadResponse<any>>('/vacancies', {
        where: { slug: { equals: slug } },
        limit: 1,
        locale,
    });
    return res.docs[0] || null;
}

// ============================================
// GLOBALS FETCHERS
// ============================================

export async function getHomepage(locale?: 'en' | 'vi') {
    return fetchPayload<any>('/globals/homepage', { depth: 2, locale });
}

export async function getAboutPage(locale?: 'en' | 'vi') {
    return fetchPayload<any>('/globals/about-page', { depth: 1, locale });
}

export async function getContactPage(locale?: 'en' | 'vi') {
    return fetchPayload<any>('/globals/contact-page', { locale });
}
