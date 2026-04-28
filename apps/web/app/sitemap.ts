import { MetadataRoute } from 'next'
import {
    getNewsArticles,
    getProducts,
    getProjects,
    getServices,
    getTechArticles,
    getVacancies,
} from '@/lib/payload'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toanthang.vn'
const LOCALES = ['vi', 'en'] as const

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

function localizedEntry(
    locale: (typeof LOCALES)[number],
    path: string,
    lastModified: Date,
    changeFrequency: ChangeFrequency,
    priority: number,
) {
    return {
        url: `${BASE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
            languages: {
                vi: `${BASE_URL}/vi${path}`,
                en: `${BASE_URL}/en${path}`,
            },
        },
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

    const [products, projects, services, newsArticles, techArticles, vacancies] = await Promise.all([
        getProducts('vi', { limit: 1000 }),
        getProjects('vi', { limit: 1000 }),
        getServices('vi'),
        getNewsArticles({ limit: 1000 }),
        getTechArticles({ limit: 1000 }),
        getVacancies(),
    ])

    const staticEntries = LOCALES.flatMap((locale) =>
        staticPages.map((page) =>
            localizedEntry(locale, page, new Date(), page === '' ? 'daily' : 'weekly', page === '' ? 1 : 0.8)
        )
    )

    const productEntries = LOCALES.flatMap((locale) =>
        products.map((product) =>
            localizedEntry(locale, `/products/${product.slug}`, new Date(product.updatedAt || Date.now()), 'monthly', 0.7)
        )
    )

    const projectEntries = LOCALES.flatMap((locale) =>
        projects.map((project) =>
            localizedEntry(locale, `/projects/${project.slug}`, new Date(project.updatedAt || Date.now()), 'monthly', 0.7)
        )
    )

    const serviceEntries = LOCALES.flatMap((locale) =>
        services.map((service) =>
            localizedEntry(locale, `/services/${service.slug}`, new Date(service.updatedAt || Date.now()), 'monthly', 0.6)
        )
    )

    const newsEntries = LOCALES.flatMap((locale) =>
        newsArticles.map((article) =>
            localizedEntry(locale, `/news/${article.slug}`, new Date(article.publishedAt || Date.now()), 'yearly', 0.5)
        )
    )

    const techEntries = LOCALES.flatMap((locale) =>
        techArticles.map((article) =>
            localizedEntry(locale, `/tech-hub/${article.slug}`, new Date(article.publishedAt || Date.now()), 'yearly', 0.5)
        )
    )

    const careerEntries = LOCALES.flatMap((locale) =>
        vacancies.map((vacancy) =>
            localizedEntry(locale, `/careers/${vacancy.slug}`, new Date(vacancy.updatedAt || Date.now()), 'weekly', 0.6)
        )
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
