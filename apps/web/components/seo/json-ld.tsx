'use client'

import Script from 'next/script'
import type { Locale } from '@/i18n/config'

interface JsonLdProps {
    lang: Locale
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toanthang.vn'

export function OrganizationSchema({ lang }: JsonLdProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: lang === 'vi'
            ? 'Công Ty Cổ Phần Kỹ Thuật Toàn Thắng'
            : 'Toan Thang Engineering Joint Stock Company',
        alternateName: 'TTE',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        description: lang === 'vi'
            ? 'Cung cấp thiết bị, giải pháp công nghệ cho ngành Dầu khí, Lọc - Hóa dầu, Năng lượng'
            : 'Providing equipment and technology solutions for Oil & Gas, Petrochemical, and Energy industries',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '11B Nguyễn Bỉnh Khiêm, P. Bến Nghé, Q.1',
            addressLocality: 'TP. Hồ Chí Minh',
            addressCountry: 'VN',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+84-254-3522219',
            contactType: 'customer service',
            availableLanguage: ['Vietnamese', 'English'],
        },
        sameAs: [
            'https://facebook.com/toanthangengineering',
            'https://linkedin.com/company/toanthang',
        ],
    }

    return (
        <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

interface ProductSchemaProps {
    lang: Locale
    product: {
        name: string
        description: string
        slug: string
        images: string[]
        brand: { name: string }
        category: { name: string }
    }
}

export function ProductSchema({ lang, product }: ProductSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        url: `${BASE_URL}/${lang}/products/${product.slug}`,
        image: product.images[0] ? `${BASE_URL}${product.images[0]}` : undefined,
        brand: {
            '@type': 'Brand',
            name: product.brand.name,
        },
        category: product.category.name,
        offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
    }

    return (
        <Script
            id="product-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

interface BreadcrumbSchemaProps {
    lang: Locale
    items: Array<{
        name: string
        url: string
    }>
}

export function BreadcrumbSchema({ lang, items }: BreadcrumbSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${BASE_URL}${item.url}`,
        })),
    }

    return (
        <Script
            id="breadcrumb-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

interface LocalBusinessSchemaProps {
    lang: Locale
}

export function LocalBusinessSchema({ lang }: LocalBusinessSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: lang === 'vi'
            ? 'Công Ty Cổ Phần Kỹ Thuật Toàn Thắng'
            : 'Toan Thang Engineering Joint Stock Company',
        image: `${BASE_URL}/logo.png`,
        '@id': BASE_URL,
        url: BASE_URL,
        telephone: '+84-254-3522219',
        priceRange: '$$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '11B Nguyễn Bỉnh Khiêm, P. Bến Nghé, Q.1',
            addressLocality: 'TP. Hồ Chí Minh',
            addressRegion: 'HCM',
            postalCode: '700000',
            addressCountry: 'VN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 10.7872,
            longitude: 106.7046,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '17:00',
        },
    }

    return (
        <Script
            id="local-business-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}
