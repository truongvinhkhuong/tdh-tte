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

export interface Brand {
    id: string;
    slug: string;
    name: string;
    logo: string;
    description?: string;
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
    excerpt: string;
    content: string;
    coverImage: string;
    author?: string;
    publishedAt: string;
    category: 'solution' | 'library';
    downloadUrl?: string;
    readTime?: number;
}

// News Types
export interface NewsArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author?: string;
    publishedAt: string;
    category: 'company' | 'industry';
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
