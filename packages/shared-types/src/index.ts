// ============================================
// SHARED TYPES FOR TTE MONOREPO
// ============================================
// These types are shared between:
// - apps/web (Next.js Frontend)
// - apps/cms (Payload CMS)
// - apps/backend (NestJS AI Agent)
// ============================================

// ============================================
// TAXONOMY TYPES
// ============================================

export interface SubBrand {
    id: string;
    slug: string;
    name: string;
    logo?: string;
}

export interface Brand {
    id: string;
    slug: string;
    name: string;
    logo: string;
    description?: string;
    subBrands?: SubBrand[];
}

export interface ProductCategory {
    id: string;
    slug: string;
    name: string;
    description?: string;
    icon?: string;
}

export interface Industry {
    id: string;
    slug: string;
    name: string;
    icon?: string;
}

// ============================================
// MEDIA TYPES
// ============================================

/**
 * MediaItem is used when data comes from CMS (Payload)
 * For static data, images are simple strings
 */
export interface MediaItem {
    id: string;
    url: string;
    alt: string;
    width?: number;
    height?: number;
    mimeType?: string;
}

// ============================================
// PRODUCT TYPES
// ============================================

export interface Specification {
    key: string;
    value: string;
    unit?: string;
}

export interface Document {
    id: string;
    name: string;
    type: 'catalog' | 'datasheet' | 'manual' | 'certificate';
    url: string;
    size?: string;
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    modelNumber: string;
    shortDescription: string;
    description: string;
    images: string[];
    brand: Brand;
    category: ProductCategory;
    industries: Industry[];
    specifications: Specification[];
    documents: Document[];
    relatedProjects: Project[];
    createdAt?: string;
    updatedAt?: string;
}

// ============================================
// PROJECT TYPES
// ============================================

export interface Project {
    id: string;
    slug: string;
    title: string;
    shortDescription?: string;
    heroImage: string;
    images: string[];
    client: string;
    location: string;
    completionYear: number;
    industry: Industry;
    challenge: string;
    solution: string;
    products: Product[];
    services?: Service[];
    createdAt?: string;
    updatedAt?: string;
}

// ============================================
// SERVICE TYPES
// ============================================

export interface Service {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    description: string;
    icon: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

// ============================================
// ARTICLE TYPES
// ============================================

/**
 * Content type for the unified Articles collection
 */
export type ContentType = 'news' | 'tech-hub';

/**
 * News category options
 */
export type NewsCategory = 'company' | 'partner' | 'industry';

/**
 * Tech Hub category options
 */
export type TechCategory = 'solution' | 'whitepaper' | 'case-study';

/**
 * Document type for whitepapers
 */
export type DocumentType = 'catalog' | 'whitepaper' | 'guide' | 'standard' | 'manual' | 'datasheet';

/**
 * TechArticle - For Tech Hub content (solutions, whitepapers, case studies)
 * Used for static data compatibility
 */
export interface TechArticle {
    id: string;
    slug: string;
    title: string;
    titleEn?: string;
    excerpt: string;
    excerptEn?: string;
    content: string;
    contentEn?: string;
    coverImage: string;
    author?: string;
    publishedAt: string;
    category: TechCategory;
    downloadUrl?: string;
    readTime?: number;
    // Fields for whitepapers
    fileType?: 'pdf' | 'doc' | 'xls';
    fileSize?: string;
    documentType?: DocumentType;
    // Fields for case studies
    client?: string;
    location?: string;
    projectYear?: number;
    industry?: string;
    challenge?: string;
    solution?: string;
    results?: string[];
    resultsEn?: string[];
    gallery?: string[];
    relatedProducts?: string[];
}

/**
 * NewsArticle - For company news, partner news, industry news
 * Used for static data compatibility
 */
export interface NewsArticle {
    id: string;
    slug: string;
    title: string;
    titleEn?: string;
    excerpt: string;
    excerptEn?: string;
    content: string;
    contentEn?: string;
    coverImage: string;
    author?: string;
    publishedAt: string;
    category: NewsCategory;
    tags?: string[];
}

/**
 * Unified Article type for CMS
 * 
 * This is the main type used when data comes from Payload CMS.
 * It combines all article types with conditional fields based on contentType.
 */
export interface Article {
    id: string;
    slug: string;
    title: string;
    
    // Main classifier
    contentType: ContentType;
    
    // Category based on contentType
    newsCategory?: NewsCategory;
    techCategory?: TechCategory;
    
    // Shared fields
    excerpt?: string;
    coverImage: string | MediaItem;
    publishedAt?: string;
    content?: string;
    author?: string;
    
    // Relationships
    relatedProducts?: Product[] | string[];
    relatedBrand?: Brand | string;
    documentDownload?: Document[] | MediaItem[];
    
    // News specific
    tags?: Array<{ tag: string }>;
    
    // Solution specific (Tech Hub)
    readTime?: number;
    
    // Whitepaper specific (Tech Hub)
    documentType?: DocumentType;
    downloadFile?: MediaItem | string;
    fileSize?: string;
    
    // Case study specific (Tech Hub)
    client?: string;
    location?: string;
    projectYear?: number;
    industry?: Industry | string;
    challenge?: string;
    solutionProvided?: string;
    results?: Array<{ result: string }>;
    gallery?: MediaItem[] | string[];
    
    // Timestamps
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Legacy type aliases for backward compatibility
 */
export type ArticleType = ContentType | NewsCategory | TechCategory;

// ============================================
// VACANCY TYPES
// ============================================

export interface Vacancy {
    id: string;
    slug: string;
    title: string;
    department: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract';
    description: string;
    requirements: string[];
    benefits: string[];
    deadline: string;
    contactEmail: string;
    createdAt?: string;
    updatedAt?: string;
}

// ============================================
// COMPANY TYPES
// ============================================

export interface SocialLinks {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    zalo?: string;
}

export interface CompanyInfo {
    name: string;
    address: string;
    phone: string;
    fax?: string;
    email: string;
    website?: string;
    socialLinks: SocialLinks;
}

export interface TimelineMilestone {
    year: number;
    title: string;
    description: string;
    images?: string[];
}

export interface Certificate {
    id: string;
    name: string;
    issuer: string;
    image: string;
    year: number;
}

export interface Partner {
    id: string;
    name: string;
    logo: string;
    website?: string;
}

// ============================================
// SEO TYPES
// ============================================

export interface SEO {
    metaTitle?: string;
    metaDescription?: string;
    shareImage?: string | MediaItem;
    keywords?: string;
    canonicalUrl?: string;
}

// ============================================
// GLOBAL TYPES (Payload Globals)
// ============================================

export interface Homepage {
    heroTitle: string;
    heroSubtitle: string;
    heroBanner: string | MediaItem;
    featuredProjects: Project[];
    featuredBrands: Brand[];
    seo: SEO;
}

export interface AboutPage {
    history: string;
    mission: string;
    vision: string;
    coreValues: string;
    certificates: string[] | MediaItem[];
    seo: SEO;
}

export interface ContactPage {
    address: string;
    hotline: string;
    email: string;
    mapEmbed: string;
    seo: SEO;
}

// ============================================
// USER TYPES
// ============================================

export type UserRole = 'admin' | 'editor' | 'marketing';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PaginatedResponse<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
}

export interface PayloadResponse<T> extends PaginatedResponse<T> {
    pagingCounter: number;
}

export interface APIResponse<T> {
    data: T;
    message?: string;
    error?: string;
}

// ============================================
// LOCALIZATION
// ============================================

export type Locale = 'en' | 'vi';

export interface LocalizedField<T> {
    en: T;
    vi: T;
}
