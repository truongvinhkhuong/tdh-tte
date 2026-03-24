/**
 * Payload CMS API Client
 * 
 * This module provides utilities for fetching data from Payload CMS API.
 * It's designed to work with both server-side and client-side rendering in Next.js.
 */

import type {
    Brand,
    ProductCategory,
    Industry,
    Product,
    Project,
    Service,
    Article,
    Vacancy,
    Homepage,
    AboutPage,
    ContactPage,
    PayloadResponse,
    Locale,
} from '@tte/shared-types';

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:4001';

export interface QueryOptions {
    limit?: number;
    page?: number;
    where?: Record<string, unknown>;
    sort?: string;
    depth?: number;
    locale?: Locale;
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

export async function getBrands(options?: QueryOptions): Promise<PayloadResponse<Brand>> {
    return fetchPayload<PayloadResponse<Brand>>('/brands', { depth: 1, ...options });
}

export async function getBrand(slug: string, locale?: Locale): Promise<Brand | null> {
    const res = await fetchPayload<PayloadResponse<Brand>>('/brands', {
        where: { slug: { equals: slug } },
        limit: 1,
        locale,
    });
    return res.docs[0] || null;
}

export async function getCategories(options?: QueryOptions): Promise<PayloadResponse<ProductCategory>> {
    return fetchPayload<PayloadResponse<ProductCategory>>('/product-categories', { ...options });
}

export async function getIndustries(options?: QueryOptions): Promise<PayloadResponse<Industry>> {
    return fetchPayload<PayloadResponse<Industry>>('/industries', { ...options });
}

export async function getProducts(options?: QueryOptions): Promise<PayloadResponse<Product>> {
    return fetchPayload<PayloadResponse<Product>>('/products', { depth: 2, ...options });
}

export async function getProduct(slug: string, locale?: Locale): Promise<Product | null> {
    const res = await fetchPayload<PayloadResponse<Product>>('/products', {
        where: { slug: { equals: slug } },
        depth: 2,
        limit: 1,
        locale,
    });
    return res.docs[0] || null;
}

export async function getProjects(options?: QueryOptions): Promise<PayloadResponse<Project>> {
    return fetchPayload<PayloadResponse<Project>>('/projects', { depth: 2, ...options });
}

export async function getProject(slug: string, locale?: Locale): Promise<Project | null> {
    const res = await fetchPayload<PayloadResponse<Project>>('/projects', {
        where: { slug: { equals: slug } },
        depth: 2,
        limit: 1,
        locale,
    });
    return res.docs[0] || null;
}

export async function getServices(options?: QueryOptions): Promise<PayloadResponse<Service>> {
    return fetchPayload<PayloadResponse<Service>>('/services', { ...options });
}

export async function getService(slug: string, locale?: Locale): Promise<Service | null> {
    const res = await fetchPayload<PayloadResponse<Service>>('/services', {
        where: { slug: { equals: slug } },
        limit: 1,
        locale,
    });
    return res.docs[0] || null;
}

export interface ArticleQueryOptions extends QueryOptions {
    contentType?: 'news' | 'tech-hub';
    newsCategory?: 'company' | 'partner' | 'industry';
    techCategory?: 'solution' | 'whitepaper' | 'case-study';
}

export async function getArticles(options?: ArticleQueryOptions): Promise<PayloadResponse<Article>> {
    const { contentType, newsCategory, techCategory, ...rest } = options || {};
    
    // Build where clause based on filters
    let where: Record<string, unknown> | undefined;
    
    if (contentType) {
        where = { ...where, contentType: { equals: contentType } };
    }
    if (newsCategory) {
        where = { ...where, newsCategory: { equals: newsCategory } };
    }
    if (techCategory) {
        where = { ...where, techCategory: { equals: techCategory } };
    }
    
    return fetchPayload<PayloadResponse<Article>>('/articles', {
        depth: 1,
        where,
        sort: '-publishedAt',
        ...rest
    });
}

/**
 * Get news articles only
 */
export async function getNewsArticles(options?: QueryOptions & { category?: 'company' | 'partner' | 'industry' }): Promise<PayloadResponse<Article>> {
    const { category, ...rest } = options || {};
    return getArticles({
        contentType: 'news',
        newsCategory: category,
        ...rest
    });
}

/**
 * Get tech hub articles only
 */
export async function getTechHubArticles(options?: QueryOptions & { category?: 'solution' | 'whitepaper' | 'case-study' }): Promise<PayloadResponse<Article>> {
    const { category, ...rest } = options || {};
    return getArticles({
        contentType: 'tech-hub',
        techCategory: category,
        ...rest
    });
}

export async function getArticle(slug: string, locale?: Locale): Promise<Article | null> {
    const res = await fetchPayload<PayloadResponse<Article>>('/articles', {
        where: { slug: { equals: slug } },
        depth: 2,
        limit: 1,
        locale,
    });
    return res.docs[0] || null;
}

export async function getVacancies(options?: QueryOptions): Promise<PayloadResponse<Vacancy>> {
    return fetchPayload<PayloadResponse<Vacancy>>('/vacancies', { ...options });
}

export async function getVacancy(slug: string, locale?: Locale): Promise<Vacancy | null> {
    const res = await fetchPayload<PayloadResponse<Vacancy>>('/vacancies', {
        where: { slug: { equals: slug } },
        limit: 1,
        locale,
    });
    return res.docs[0] || null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSubBrands(options?: QueryOptions): Promise<PayloadResponse<any>> {
    return fetchPayload<PayloadResponse<any>>('/sub-brands', { depth: 1, ...options });
}

// ============================================
// GLOBALS FETCHERS
// ============================================

export async function getHomepage(locale?: Locale): Promise<Homepage> {
    return fetchPayload<Homepage>('/globals/homepage', { depth: 2, locale });
}

export async function getAboutPage(locale?: Locale): Promise<AboutPage> {
    return fetchPayload<AboutPage>('/globals/about-page', { depth: 1, locale });
}

export async function getContactPage(locale?: Locale): Promise<ContactPage> {
    return fetchPayload<ContactPage>('/globals/contact-page', { locale });
}

// Re-export types for convenience
export type { PayloadResponse };
