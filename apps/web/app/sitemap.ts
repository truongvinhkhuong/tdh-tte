import { MetadataRoute } from 'next'
import { products, projects, services, newsArticles, techArticles, vacancies } from '@/lib/data'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toanthang.vn'

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

interface SitemapEntry {
    url: string
    lastModified: Date
    changeFrequency: ChangeFrequency
    priority: number
    alternates: {
        languages: {
            vi: string
            en: string
        }
    }
}

export default function sitemap(): MetadataRoute.Sitemap {
    const locales = ['vi', 'en']

    // Static pages
    const staticPages = [
        '',
        '/products',
        '/projects',
        '/services',
        '/about',
        '/contact',
        '/news',
        '/tech-hub',
        '/careers',
    ]

    const staticEntries: SitemapEntry[] = locales.flatMap((locale) =>
        staticPages.map((page) => ({
            url: `${BASE_URL}/${locale}${page}`,
            lastModified: new Date(),
            changeFrequency: (page === '' ? 'daily' : 'weekly') as ChangeFrequency,
            priority: page === '' ? 1 : 0.8,
            alternates: {
                languages: {
                    vi: `${BASE_URL}/vi${page}`,
                    en: `${BASE_URL}/en${page}`,
                },
            },
        }))
    )

    // Product pages
    const productEntries = locales.flatMap((locale) =>
        products.map((product) => ({
            url: `${BASE_URL}/${locale}/products/${product.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            alternates: {
                languages: {
                    vi: `${BASE_URL}/vi/products/${product.slug}`,
                    en: `${BASE_URL}/en/products/${product.slug}`,
                },
            },
        }))
    )

    // Project pages
    const projectEntries = locales.flatMap((locale) =>
        projects.map((project) => ({
            url: `${BASE_URL}/${locale}/projects/${project.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            alternates: {
                languages: {
                    vi: `${BASE_URL}/vi/projects/${project.slug}`,
                    en: `${BASE_URL}/en/projects/${project.slug}`,
                },
            },
        }))
    )

    // Service pages
    const serviceEntries = locales.flatMap((locale) =>
        services.map((service) => ({
            url: `${BASE_URL}/${locale}/services/${service.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
            alternates: {
                languages: {
                    vi: `${BASE_URL}/vi/services/${service.slug}`,
                    en: `${BASE_URL}/en/services/${service.slug}`,
                },
            },
        }))
    )

    // News articles
    const newsEntries = locales.flatMap((locale) =>
        newsArticles.map((article) => ({
            url: `${BASE_URL}/${locale}/news/${article.slug}`,
            lastModified: new Date(article.publishedAt),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
            alternates: {
                languages: {
                    vi: `${BASE_URL}/vi/news/${article.slug}`,
                    en: `${BASE_URL}/en/news/${article.slug}`,
                },
            },
        }))
    )

    // Tech articles
    const techEntries = locales.flatMap((locale) =>
        techArticles.map((article) => ({
            url: `${BASE_URL}/${locale}/tech-hub/${article.slug}`,
            lastModified: new Date(article.publishedAt),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
            alternates: {
                languages: {
                    vi: `${BASE_URL}/vi/tech-hub/${article.slug}`,
                    en: `${BASE_URL}/en/tech-hub/${article.slug}`,
                },
            },
        }))
    )

    // Career pages
    const careerEntries = locales.flatMap((locale) =>
        vacancies.map((vacancy) => ({
            url: `${BASE_URL}/${locale}/careers/${vacancy.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
            alternates: {
                languages: {
                    vi: `${BASE_URL}/vi/careers/${vacancy.slug}`,
                    en: `${BASE_URL}/en/careers/${vacancy.slug}`,
                },
            },
        }))
    )

    return [
        ...staticEntries,
        ...productEntries,
        ...projectEntries,
        ...serviceEntries,
        ...newsEntries,
        ...techEntries,
        ...careerEntries,
    ]
}
