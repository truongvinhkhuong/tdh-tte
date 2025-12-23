import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight } from "lucide-react"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { newsArticles } from "@/lib/data"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params

    return {
        title: lang === 'vi' ? 'Tin Tức' : 'News',
        description: lang === 'vi'
            ? 'Cập nhật tin tức mới nhất từ Toàn Thắng Engineering'
            : 'Latest news updates from Toan Thang Engineering',
    }
}

export default async function NewsPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

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
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-r from-[#2B54A7] to-[#1e3a75]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-6">
                        {dict.news.title}
                    </h1>
                    <p className="text-xl font-body text-white/80 max-w-3xl mx-auto">
                        {dict.news.subtitle}
                    </p>
                </div>
            </section>

            {/* News Grid */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {newsArticles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/${lang}/news/${article.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={article.coverImage || "/placeholder.svg"}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-heading font-bold rounded-full">
                                        {article.category === 'company' ? dict.news.categories.company : dict.news.categories.industry}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                        <Calendar size={14} />
                                        <span className="font-body">{formatDate(article.publishedAt)}</span>
                                    </div>
                                    <h3 className="text-lg font-heading font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="font-body text-gray-600 text-sm line-clamp-2 mb-4">
                                        {article.excerpt}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-blue-600 font-heading font-semibold text-sm group-hover:gap-2 transition-all">
                                        {dict.news.readMore}
                                        <ArrowRight size={16} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
