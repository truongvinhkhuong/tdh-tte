// Product Types
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
}

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
    icon?: string;
}

export interface Industry {
    id: string;
    slug: string;
    name: string;
    icon?: string;
}

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

// Project Types
export interface Project {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    heroImage: string;
    images: string[];
    client: string;
    location: string;
    completionYear: number;
    industry: Industry;
    challenge: string;
    solution: string;
    products: Product[];
}

// Service Types
export interface Service {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    description: string;
    icon: string;
    image?: string;
}

// Tech Hub Types
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
    category: 'solution' | 'whitepaper' | 'case-study';
    downloadUrl?: string;
    readTime?: number;
    // Fields for whitepapers
    fileType?: 'pdf' | 'doc' | 'xls';
    fileSize?: string;
    documentType?: 'catalog' | 'whitepaper' | 'guide' | 'standard' | 'manual' | 'datasheet';
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

// News Types
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
    category: 'company' | 'partner' | 'industry';
    // Optional tags for filtering
    tags?: string[];
}

// Career Types
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
}

// Company Info Types
export interface CompanyInfo {
    name: string;
    address: string;
    phone: string;
    fax?: string;
    email: string;
    website?: string;
    socialLinks: {
        facebook?: string;
        linkedin?: string;
        twitter?: string;
        youtube?: string;
    };
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
