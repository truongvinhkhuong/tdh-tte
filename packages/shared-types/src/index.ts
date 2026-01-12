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
// PRODUCT TYPES
// ============================================

export interface Specification {
    label: string;
    value: string;
    unit?: string;
}

export interface MediaItem {
    id: string;
    url: string;
    alt: string;
    width?: number;
    height?: number;
    mimeType?: string;
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
    images: MediaItem[];
    brand: Brand;
    category: ProductCategory;
    industries: Industry[];
    specifications: Specification[];
    documents: Document[];
    relatedProjects?: Project[];
    createdAt?: string;
    updatedAt?: string;
}

// ============================================
// PROJECT TYPES
// ============================================

export interface Project {
    id: string;
    slug: string;
    name: string;
    shortDescription?: string;
    client: string;
    location: string;
    completionYear: number;
    challenge: string;
    solution: string;
    gallery: MediaItem[];
    products?: Product[];
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
    name: string;
    description: string;
    icon?: MediaItem;
    createdAt?: string;
    updatedAt?: string;
}

// ============================================
// ARTICLE TYPES
// ============================================

export type ArticleType = 'Technical_Solution' | 'TTE_Event' | 'Industry_News';

export interface Article {
    id: string;
    slug: string;
    title: string;
    summary: string;
    content: string;
    coverImage: MediaItem;
    type: ArticleType;
    documentDownload?: Document[];
    relatedProducts?: Product[];
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
}

// Legacy support - alias for backward compatibility
export type TechArticle = Article;
export type NewsArticle = Article;

// ============================================
// VACANCY TYPES
// ============================================

export type Department = 'Sales' | 'Technical' | 'Admin' | 'Logistics' | 'Management';

export interface Vacancy {
    id: string;
    slug: string;
    position: string;
    department: Department;
    location: string;
    quantity: number;
    deadline: string;
    salaryRange?: string;
    description: string;
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
    images?: MediaItem[];
}

export interface Certificate {
    id: string;
    name: string;
    issuer: string;
    image: MediaItem;
    year: number;
}

export interface Partner {
    id: string;
    name: string;
    logo: MediaItem;
    website?: string;
}

// ============================================
// SEO TYPES
// ============================================

export interface SEO {
    metaTitle?: string;
    metaDescription?: string;
    shareImage?: MediaItem;
    keywords?: string;
    canonicalUrl?: string;
}

// ============================================
// GLOBAL TYPES (Payload Globals)
// ============================================

export interface Homepage {
    heroTitle: string;
    heroSubtitle: string;
    heroBanner: MediaItem;
    featuredProjects: Project[];
    featuredBrands: Brand[];
    seo: SEO;
}

export interface AboutPage {
    history: string;
    mission: string;
    vision: string;
    coreValues: string;
    certificates: MediaItem[];
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
