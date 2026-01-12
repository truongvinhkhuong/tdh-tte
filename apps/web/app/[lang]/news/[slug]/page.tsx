import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, User, Building2, Handshake, Globe } from "lucide-react"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { newsArticles } from "@/lib/data"

export async function generateStaticParams() {
    return newsArticles.map((article) => ({
        slug: article.slug,
    }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}): Promise<Metadata> {
    const { lang, slug } = await params
    const article = newsArticles.find((a) => a.slug === slug)

    if (!article) {
        return { title: 'Article Not Found' }
    }

    return {
        title: lang === 'vi' ? article.title : (article.titleEn || article.title),
        description: lang === 'vi' ? article.excerpt : (article.excerptEn || article.excerpt),
    }
}

export default async function NewsArticlePage({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}) {
    const { lang, slug } = await params
    const dict = await getDictionary(lang)
    const article = newsArticles.find((a) => a.slug === slug)

    if (!article) {
        notFound()
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const getCategoryLabel = (category: string) => {
        if (category === 'company') return dict.news?.categories?.company || 'TTE'
        if (category === 'partner') return dict.news?.categories?.partner || 'Partner'
        return dict.news?.categories?.industry || 'Industry'
    }

    const getCategoryIcon = (category: string) => {
        if (category === 'company') return Building2
        if (category === 'partner') return Handshake
        return Globe
    }

    const title = lang === 'vi' ? article.title : (article.titleEn || article.title)
    const excerpt = lang === 'vi' ? article.excerpt : (article.excerptEn || article.excerpt)
    const content = lang === 'vi' ? article.content : (article.contentEn || article.content)
    const CategoryIcon = getCategoryIcon(article.category)

    return (
        <main className="pt-20">
            {/* Hero */}
            <section className="relative h-[40vh] min-h-[300px]">
                <Image
                    src="/placeholder.svg"
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
                        <Link
                            href={`/${lang}/news`}
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-svn-avo-bold text-sm mb-4 transition-colors"
                        >
                            <ArrowLeft size={18} />
                            {dict.common?.back || 'Quay lại'}
                        </Link>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#364fa1] text-white text-xs font-svn-avo-bold rounded">
                                <CategoryIcon size={12} />
                                {getCategoryLabel(article.category)}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-svn-avo-extra-bold text-white leading-tight">
                            {title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="py-10 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                        {article.author && (
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span className="font-svn-avo-bold">{article.author}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span className="font-svn-avo-bold">{formatDate(article.publishedAt)}</span>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-lg font-svn-avo-bold text-gray-700 mb-6 leading-relaxed">
                        {excerpt}
                    </p>

                    {/* Content */}
                    <div
                        className="prose prose-lg max-w-none font-svn-avo-bold prose-headings:font-svn-avo-extra-bold prose-headings:text-gray-900 prose-a:text-[#364fa1]"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                    {/* Back Link */}
                    <div className="mt-10 pt-6 border-t border-gray-100">
                        <Link
                            href={`/${lang}/news`}
                            className="inline-flex items-center gap-2 text-[#364fa1] font-svn-avo-bold hover:gap-3 transition-all"
                        >
                            <ArrowLeft size={16} />
                            {lang === 'vi' ? 'Xem tất cả tin tức' : 'View all news'}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
