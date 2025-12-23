import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { techArticles } from "@/lib/data"

export async function generateStaticParams() {
    return techArticles
        .filter((a) => a.category === 'solution')
        .map((article) => ({
            slug: article.slug,
        }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const article = techArticles.find((a) => a.slug === slug)

    if (!article) {
        return { title: 'Article Not Found' }
    }

    return {
        title: article.title,
        description: article.excerpt,
    }
}

export default async function TechArticlePage({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}) {
    const { lang, slug } = await params
    const dict = await getDictionary(lang)
    const article = techArticles.find((a) => a.slug === slug)

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

    return (
        <main className="pt-20">
            {/* Hero */}
            <section className="relative h-[40vh] min-h-[300px]">
                <Image
                    src={article.coverImage || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
                        <Link
                            href={`/${lang}/tech-hub`}
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-heading font-semibold mb-4"
                        >
                            <ArrowLeft size={20} />
                            {dict.common.back}
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
                            {article.title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8 pb-8 border-b border-gray-200">
                        {article.author && (
                            <div className="flex items-center gap-2">
                                <User size={18} />
                                <span className="font-body">{article.author}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <span className="font-body">{formatDate(article.publishedAt)}</span>
                        </div>
                        {article.readTime && (
                            <div className="flex items-center gap-2">
                                <Clock size={18} />
                                <span className="font-body">{article.readTime} {lang === 'vi' ? 'phút đọc' : 'min read'}</span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-lg max-w-none font-body prose-headings:font-heading prose-headings:font-bold prose-a:text-[#364fa1]"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>
            </section>
        </main>
    )
}
