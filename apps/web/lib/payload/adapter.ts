/**
 * Data Adapter
 * 
 * Provides a unified interface that:
 * - Tries to fetch from CMS API first
 * - Falls back to static data if CMS is unavailable
 * 
 * This allows gradual migration from static data to CMS.
 */

import type {
    Brand,
    ProductCategory,
    Industry,
    Product,
    Project,
    Service,
    Article,
    TechArticle,
    NewsArticle,
    Vacancy,
    CompanyInfo,
    TimelineMilestone,
    Certificate,
    Partner,
} from '@tte/shared-types';

import * as cms from './client';
import * as staticData from '../data';

// Environment check
const USE_CMS = process.env.NEXT_PUBLIC_USE_CMS === 'true';

// ============================================
// BRANDS
// ============================================

export async function getBrands(): Promise<Brand[]> {
    if (USE_CMS) {
        try {
            const res = await cms.getBrands({ limit: 100 });
            return res.docs;
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.brands;
}

export async function getBrand(slug: string): Promise<Brand | null> {
    if (USE_CMS) {
        try {
            return await cms.getBrand(slug);
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.brands.find(b => b.slug === slug) || null;
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories(): Promise<ProductCategory[]> {
    if (USE_CMS) {
        try {
            const res = await cms.getCategories({ limit: 100 });
            return res.docs;
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.categories;
}

// ============================================
// INDUSTRIES
// ============================================

export async function getIndustries(): Promise<Industry[]> {
    if (USE_CMS) {
        try {
            const res = await cms.getIndustries({ limit: 100 });
            return res.docs;
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.industries;
}

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(): Promise<Product[]> {
    if (USE_CMS) {
        try {
            const res = await cms.getProducts({ limit: 100 });
            return res.docs;
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.products;
}

export async function getProduct(slug: string): Promise<Product | null> {
    if (USE_CMS) {
        try {
            return await cms.getProduct(slug);
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.products.find(p => p.slug === slug) || null;
}

// ============================================
// PROJECTS
// ============================================

export async function getProjects(): Promise<Project[]> {
    if (USE_CMS) {
        try {
            const res = await cms.getProjects({ limit: 100 });
            return res.docs;
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.projects;
}

export async function getProject(slug: string): Promise<Project | null> {
    if (USE_CMS) {
        try {
            return await cms.getProject(slug);
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.projects.find(p => p.slug === slug) || null;
}

// ============================================
// SERVICES
// ============================================

export async function getServices(): Promise<Service[]> {
    if (USE_CMS) {
        try {
            const res = await cms.getServices({ limit: 100 });
            return res.docs;
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.services;
}

export async function getService(slug: string): Promise<Service | null> {
    if (USE_CMS) {
        try {
            return await cms.getService(slug);
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.services.find(s => s.slug === slug) || null;
}

// ============================================
// ARTICLES
// ============================================

/**
 * Get all articles from CMS or static data
 */
export async function getArticles(): Promise<Article[]> {
    if (USE_CMS) {
        try {
            const res = await cms.getArticles({ limit: 100 });
            return res.docs;
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    // Combine static data
    return [...staticData.techArticles, ...staticData.newsArticles] as unknown as Article[];
}

/**
 * Get Tech Hub articles (solutions, whitepapers, case studies)
 */
export async function getTechArticles(): Promise<TechArticle[] | Article[]> {
    if (USE_CMS) {
        try {
            const res = await cms.getTechHubArticles({ limit: 100 });
            return res.docs;
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.techArticles;
}

/**
 * Get News articles (company, partner, industry news)
 */
export async function getNewsArticles(): Promise<NewsArticle[] | Article[]> {
    if (USE_CMS) {
        try {
            const res = await cms.getNewsArticles({ limit: 100 });
            return res.docs;
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.newsArticles;
}

/**
 * Get single article by slug
 */
export async function getArticle(slug: string): Promise<TechArticle | NewsArticle | Article | null> {
    if (USE_CMS) {
        try {
            return await cms.getArticle(slug);
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return (
        staticData.techArticles.find(a => a.slug === slug) ||
        staticData.newsArticles.find(a => a.slug === slug) ||
        null
    );
}

// ============================================
// VACANCIES
// ============================================

export async function getVacancies(): Promise<Vacancy[]> {
    if (USE_CMS) {
        try {
            const res = await cms.getVacancies({ limit: 100 });
            return res.docs;
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.vacancies;
}

export async function getVacancy(slug: string): Promise<Vacancy | null> {
    if (USE_CMS) {
        try {
            return await cms.getVacancy(slug);
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.vacancies.find(v => v.slug === slug) || null;
}

// ============================================
// COMPANY DATA (Static only for now)
// ============================================

export function getCompanyInfo(): CompanyInfo {
    return staticData.companyInfo;
}

export function getTimeline(): TimelineMilestone[] {
    return staticData.timeline;
}

export function getCertificates(): Certificate[] {
    return staticData.certificates;
}

export function getPartners(): Partner[] {
    return staticData.partners;
}
