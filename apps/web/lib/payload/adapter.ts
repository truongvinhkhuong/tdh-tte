/**
 * Data Adapter
 * 
 * Provides a unified interface that:
 * - Tries to fetch from CMS API first
 * - Falls back to static data if CMS is unavailable
 * 
 * This allows gradual migration from static data to CMS.
 */

import * as cms from './client';
import * as staticData from '../data';

// Environment check
const USE_CMS = process.env.NEXT_PUBLIC_USE_CMS === 'true';

// ============================================
// BRANDS
// ============================================

export async function getBrands() {
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

export async function getBrand(slug: string) {
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

export async function getCategories() {
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

export async function getIndustries() {
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

export async function getProducts() {
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

export async function getProduct(slug: string) {
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

export async function getProjects() {
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

export async function getProject(slug: string) {
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

export async function getServices() {
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

export async function getService(slug: string) {
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

export async function getTechArticles() {
    if (USE_CMS) {
        try {
            const res = await cms.getArticles({ type: 'Technical_Solution', limit: 100 });
            return res.docs;
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.techArticles;
}

export async function getNewsArticles() {
    if (USE_CMS) {
        try {
            // Both TTE_Event and Industry_News are news
            const res = await cms.getArticles({ limit: 100 });
            return res.docs.filter((a: any) => a.type !== 'Technical_Solution');
        } catch (error) {
            console.warn('CMS fetch failed, using static data:', error);
        }
    }
    return staticData.newsArticles;
}

export async function getArticle(slug: string) {
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

export async function getVacancies() {
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

export async function getVacancy(slug: string) {
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

export function getCompanyInfo() {
    return staticData.companyInfo;
}

export function getTimeline() {
    return staticData.timeline;
}

export function getCertificates() {
    return staticData.certificates;
}

export function getPartners() {
    return staticData.partners;
}
