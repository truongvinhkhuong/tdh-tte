/**
 * CMS → Shared-Types Transform Layer
 *
 * Converts raw Payload CMS API responses to the shape expected
 * by @tte/shared-types interfaces. Handles all known mismatches:
 * - Media objects → URL strings
 * - Lexical JSON → HTML strings
 * - specifications.label → .key rename
 * - catalogPDF → documents mapping
 * - SubBrand aggregation (handled in adapter)
 * - Project name→title, gallery→heroImage
 * - Numeric IDs → string IDs
 */

import type {
    Brand,
    SubBrand,
    ProductCategory,
    Industry,
    Product,
    Project,
    Service,
    Specification,
    Document,
} from '@tte/shared-types';

// ============================================
// CMS Response Types (internal)
// ============================================
// Minimal interfaces matching what Payload REST API returns at depth >= 1.
// These are NOT exported — only used for type-safe transforms.

interface CmsMedia {
    id: number | string;
    url?: string | null;
    alt?: string;
    filename?: string | null;
    mimeType?: string | null;
    filesize?: number | null;
    externalURL?: string | null;
    width?: number | null;
    height?: number | null;
}

interface CmsLexicalField {
    root: {
        type: string;
        children: CmsLexicalNode[];
        direction?: ('ltr' | 'rtl') | null;
        format?: string;
        indent?: number;
        version?: number;
    };
    [k: string]: unknown;
}

interface CmsLexicalNode {
    type: string;
    text?: string;
    format?: number | string;
    tag?: string;
    listType?: string;
    children?: CmsLexicalNode[];
    fields?: { url?: string; newTab?: boolean; [k: string]: unknown };
    value?: { url?: string };
    [k: string]: unknown;
}

// ============================================
// Constants
// ============================================

const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:4001';

// ============================================
// Primitive Helpers
// ============================================

/** Coerce CMS numeric/string ID to string */
function idToString(id: number | string | null | undefined): string {
    if (id == null) return '';
    return String(id);
}

/** Extract URL string from a Media object or ID. Returns empty string if unresolvable. */
export function extractMediaUrl(media: CmsMedia | number | string | null | undefined): string {
    if (!media || typeof media === 'number' || typeof media === 'string') return '';
    // Prefer externalURL (Cloudinary), then url
    const url = media.externalURL || media.url;
    if (!url) return '';
    // If relative, prepend CMS base URL
    return url.startsWith('http') ? url : `${CMS_BASE_URL}${url}`;
}

/** Extract URL strings from a Media array */
export function extractMediaUrls(
    media: Array<CmsMedia | number | string> | null | undefined,
): string[] {
    if (!media || !Array.isArray(media)) return [];
    return media.map(extractMediaUrl).filter(Boolean);
}

/** Format bytes to human-readable size */
function formatFileSize(bytes: number | null | undefined): string {
    if (!bytes || bytes <= 0) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/** Escape HTML special characters */
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ============================================
// Lexical → HTML Serializer
// ============================================
// Lightweight custom serializer handling default Payload Lexical node types.
// Avoids adding @payloadcms/richtext-lexical as a dependency to the web app.

/** Convert Lexical JSON to HTML string */
export function lexicalToHtml(data: CmsLexicalField | null | undefined): string {
    if (!data?.root?.children) return '';
    return serializeNodes(data.root.children);
}

/** Convert Lexical JSON to plain text (for Brand.description etc.) */
export function lexicalToPlainText(data: CmsLexicalField | null | undefined): string {
    if (!data?.root?.children) return '';
    return extractTextFromNodes(data.root.children).trim();
}

function serializeNodes(nodes: CmsLexicalNode[]): string {
    return nodes.map(serializeNode).join('');
}

function serializeNode(node: CmsLexicalNode): string {
    const children = node.children ? serializeNodes(node.children) : '';

    switch (node.type) {
        case 'text': {
            let text = escapeHtml(node.text || '');
            const fmt = typeof node.format === 'number' ? node.format : 0;
            if (fmt & 1) text = `<strong>${text}</strong>`;
            if (fmt & 2) text = `<em>${text}</em>`;
            if (fmt & 4) text = `<s>${text}</s>`;
            if (fmt & 8) text = `<u>${text}</u>`;
            if (fmt & 16) text = `<code>${text}</code>`;
            if (fmt & 32) text = `<sub>${text}</sub>`;
            if (fmt & 64) text = `<sup>${text}</sup>`;
            return text;
        }
        case 'linebreak':
            return '<br/>';
        case 'paragraph':
            return `<p>${children}</p>`;
        case 'heading': {
            const tag = node.tag || 'h2';
            return `<${tag}>${children}</${tag}>`;
        }
        case 'list': {
            const tag = node.listType === 'number' ? 'ol' : 'ul';
            return `<${tag}>${children}</${tag}>`;
        }
        case 'listitem':
            return `<li>${children}</li>`;
        case 'link':
        case 'autolink': {
            const href = escapeHtml(node.fields?.url || '#');
            const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<a href="${href}"${target}>${children}</a>`;
        }
        case 'quote':
            return `<blockquote>${children}</blockquote>`;
        case 'horizontalrule':
            return '<hr/>';
        case 'upload': {
            // Inline media/image within rich text
            const url = extractMediaUrl(node.value as CmsMedia | undefined);
            if (url) return `<img src="${escapeHtml(url)}" alt="" />`;
            return '';
        }
        default:
            // Unknown node type — render children if present
            return children;
    }
}

function extractTextFromNodes(nodes: CmsLexicalNode[]): string {
    return nodes
        .map((node) => {
            if (node.type === 'text') return node.text || '';
            if (node.type === 'linebreak') return ' ';
            if (node.children) return extractTextFromNodes(node.children);
            return '';
        })
        .join('');
}

// ============================================
// Entity Transforms
// ============================================

/** Transform CMS Product → shared-types Product */
export function transformProduct(cms: any): Product {
    return {
        id: idToString(cms.id),
        slug: cms.slug || '',
        name: cms.name || '',
        modelNumber: cms.modelNumber || '',
        shortDescription: cms.shortDescription || '',
        description: isLexicalField(cms.description)
            ? lexicalToHtml(cms.description)
            : (cms.description || ''),
        images: extractMediaUrls(cms.images),
        brand: isPopulated(cms.brand)
            ? transformBrandFromProduct(cms.brand)
            : createMinimalBrand(cms.brand),
        category: isPopulated(cms.category)
            ? transformProductCategory(cms.category)
            : createMinimalCategory(cms.category),
        industries: Array.isArray(cms.industries)
            ? cms.industries.filter(isPopulated).map(transformIndustry)
            : [],
        specifications: Array.isArray(cms.specifications)
            ? cms.specifications.map(transformSpecification)
            : [],
        documents: transformCatalogPDFToDocuments(cms.catalogPDF),
        relatedProjects: Array.isArray(cms.relatedProjects)
            ? cms.relatedProjects.filter(isPopulated).map(transformProjectSummary)
            : [],
        createdAt: cms.createdAt || undefined,
        updatedAt: cms.updatedAt || undefined,
    };
}

/** Transform CMS Brand → shared-types Brand (with optional sub-brands injection) */
export function transformBrand(cms: any, subBrands?: any[]): Brand {
    return {
        id: idToString(cms.id),
        slug: cms.slug || '',
        name: cms.name || '',
        logo: extractMediaUrl(cms.logo),
        description: isLexicalField(cms.description)
            ? lexicalToPlainText(cms.description)
            : (cms.description || undefined),
        subBrands: Array.isArray(subBrands)
            ? subBrands.map(transformSubBrand)
            : undefined,
    };
}

/**
 * Transform Brand as it appears nested inside a Product response.
 * SubBrands are NOT available here — they're aggregated separately in getBrands().
 */
function transformBrandFromProduct(cms: any): Brand {
    return {
        id: idToString(cms.id),
        slug: cms.slug || '',
        name: cms.name || '',
        logo: extractMediaUrl(cms.logo),
        description: isLexicalField(cms.description)
            ? lexicalToPlainText(cms.description)
            : (cms.description || undefined),
    };
}

/** Transform CMS SubBrand → shared-types SubBrand */
export function transformSubBrand(cms: any): SubBrand {
    return {
        id: idToString(cms.id),
        slug: cms.slug || '',
        name: cms.name || '',
        logo: extractMediaUrl(cms.image), // CMS field is `image`, shared-types expects `logo`
    };
}

/** Transform CMS ProductCategory → shared-types ProductCategory */
export function transformProductCategory(cms: any): ProductCategory {
    return {
        id: idToString(cms.id),
        slug: cms.slug || '',
        name: cms.name || '',
        description: cms.description || undefined,
        icon: extractMediaUrl(cms.icon),
    };
}

/** Transform CMS Industry → shared-types Industry */
export function transformIndustry(cms: any): Industry {
    return {
        id: idToString(cms.id),
        slug: cms.slug || '',
        name: cms.name || '',
        icon: extractMediaUrl(cms.icon),
    };
}

/**
 * Transform CMS Project → shared-types Project (summary for related projects).
 * CMS uses `name` where shared-types uses `title`.
 * CMS uses `gallery[]` where shared-types uses `heroImage`.
 */
export function transformProjectSummary(cms: any): Project {
    const galleryUrls = extractMediaUrls(cms.gallery);
    return {
        id: idToString(cms.id),
        slug: cms.slug || '',
        title: cms.name || '', // CMS `name` → shared-types `title`
        shortDescription: cms.shortDescription || undefined,
        heroImage: galleryUrls[0] || '', // First gallery image → heroImage
        images: galleryUrls,
        client: cms.client || '',
        location: cms.location || '',
        completionYear: cms.completionYear || 0,
        industry: isPopulated(cms.industry)
            ? transformIndustry(cms.industry)
            : { id: '', slug: '', name: '' },
        challenge: isLexicalField(cms.challenge)
            ? lexicalToHtml(cms.challenge)
            : (cms.challenge || ''),
        solution: isLexicalField(cms.solution)
            ? lexicalToHtml(cms.solution)
            : (cms.solution || ''),
        products: [], // Avoid circular reference — not needed for project cards
        services: [],
        createdAt: cms.createdAt || undefined,
        updatedAt: cms.updatedAt || undefined,
    };
}

// ============================================
// Field-level Transforms
// ============================================

/** Transform CMS specification {label, value, unit} → {key, value, unit} */
function transformSpecification(cms: any): Specification {
    return {
        key: cms.label || cms.key || '', // CMS uses `label`, shared-types uses `key`
        value: cms.value || '',
        unit: cms.unit || undefined,
    };
}

/**
 * Transform CMS catalogPDF (Media[]) → Document[]
 * All documents from catalogPDF get type: 'catalog'
 */
function transformCatalogPDFToDocuments(
    catalogPDF: Array<CmsMedia | number | string> | null | undefined,
): Document[] {
    if (!catalogPDF || !Array.isArray(catalogPDF)) return [];
    return catalogPDF
        .filter((item): item is CmsMedia => typeof item === 'object' && item !== null)
        .map((media) => ({
            id: idToString(media.id),
            name: media.filename || media.alt || 'Catalog',
            type: 'catalog' as const,
            url: extractMediaUrl(media),
            size: formatFileSize(media.filesize),
        }))
        .filter((doc) => doc.url); // Only include docs with valid URLs
}

// ============================================
// Type Guards
// ============================================

/** Check if a value is a populated object (not just an ID reference) */
function isPopulated(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Check if a value looks like a Lexical rich text field */
function isLexicalField(value: unknown): value is CmsLexicalField {
    return (
        typeof value === 'object' &&
        value !== null &&
        'root' in value &&
        typeof (value as any).root === 'object'
    );
}

/** Create a minimal Brand when only an ID is available (depth not sufficient) */
function createMinimalBrand(id: unknown): Brand {
    return {
        id: typeof id === 'number' || typeof id === 'string' ? String(id) : '',
        slug: '',
        name: '',
        logo: '',
    };
}

/** Create a minimal ProductCategory when only an ID is available */
function createMinimalCategory(id: unknown): ProductCategory {
    return {
        id: typeof id === 'number' || typeof id === 'string' ? String(id) : '',
        slug: '',
        name: '',
    };
}
