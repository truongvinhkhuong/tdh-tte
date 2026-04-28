import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    ArrowLeft,
    Calendar,
    User,
    Clock,
    Download,
    Building2,
    MapPin,
    Target,
    TrendingUp,
    ChevronRight,
    FileText
} from "lucide-react"
import { normalizeLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { techArticles, products } from "@/lib/data"

export async function generateStaticParams() {
    return techArticles.map((article) => ({
        slug: article.slug,
    }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
    const { lang: rawLang, slug } = await params
    const lang = normalizeLocale(rawLang)
    const article = techArticles.find((a) => a.slug === slug)

    if (!article) {
        return { title: 'Article Not Found' }
    }

    return {
        title: lang === 'vi' ? article.title : (article.titleEn || article.title),
        description: lang === 'vi' ? article.excerpt : (article.excerptEn || article.excerpt),
    }
}

export default async function TechArticlePage({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>
}) {
    const { lang: rawLang, slug } = await params
    const lang = normalizeLocale(rawLang)
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

    const title = lang === 'vi' ? article.title : (article.titleEn || article.title)
    const excerpt = lang === 'vi' ? article.excerpt : (article.excerptEn || article.excerpt)
    const content = lang === 'vi' ? article.content : (article.contentEn || article.content)
    const results = lang === 'vi' ? article.results : (article.resultsEn || article.results)

    // Get related products
    const relatedProductsList = article.relatedProducts
        ? products.filter(p => article.relatedProducts?.includes(p.id))
        : []

    return (
        <main className="pt-20">
            {/* Hero */}
            <section className="relative h-[50vh] min-h-[400px]">
                <Image
                    src={article.coverImage || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
                        <Link
                            href={`/${lang}/tech-hub`}
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-svn-avo-bold mb-4 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            {dict.common?.back || 'Quay lại'}
                        </Link>

                        {/* Category Badge */}
                        <div className="mb-4">
                            <span className={`
                                px-3 py-1 text-sm font-svn-avo-bold rounded-full
                                ${article.category === 'solution' ? 'bg-blue-500 text-white' :
                                    article.category === 'whitepaper' ? 'bg-emerald-500 text-white' :
                                        'bg-orange-500 text-white'}
                            `}>
                                {article.category === 'solution'
                                    ? (lang === 'vi' ? 'Giải pháp' : 'Solution')
                                    : article.category === 'whitepaper'
                                        ? (lang === 'vi' ? 'Tài liệu kỹ thuật' : 'Technical Document')
                                        : (lang === 'vi' ? 'Case Study' : 'Case Study')}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-svn-avo-extra-bold text-white leading-tight">
                            {title}
                        </h1>

                        {/* Case Study Meta */}
                        {article.category === 'case-study' && article.client && (
                            <div className="flex flex-wrap items-center gap-4 mt-6 text-white/80">
                                <span className="flex items-center gap-2">
                                    <Building2 size={16} />
                                    <span className="font-svn-avo-bold">{article.client}</span>
                                </span>
                                {article.location && (
                                    <span className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span className="font-svn-avo-bold">{article.location}</span>
                                    </span>
                                )}
                                {article.projectYear && (
                                    <span className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span className="font-svn-avo-bold">{article.projectYear}</span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Meta Info for Solutions */}
                    {article.category === 'solution' && (
                        <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8 pb-8 border-b border-gray-200">
                            {article.author && (
                                <div className="flex items-center gap-2">
                                    <User size={18} />
                                    <span className="font-svn-avo-bold">{article.author}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar size={18} />
                                <span className="font-svn-avo-bold">{formatDate(article.publishedAt)}</span>
                            </div>
                            {article.readTime && (
                                <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    <span className="font-svn-avo-bold">{article.readTime} {lang === 'vi' ? 'phút đọc' : 'min read'}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Excerpt */}
                    <p className="text-lg font-svn-avo-bold text-gray-700 mb-8 leading-relaxed">
                        {excerpt}
                    </p>

                    {/* Content */}
                    {content && (
                        <div
                            className="prose prose-lg max-w-none font-svn-avo-bold prose-headings:font-svn-avo-extra-bold prose-headings:text-gray-900 prose-a:text-[#364fa1]"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    )}

                    {/* Whitepaper Download Section */}
                    {article.category === 'whitepaper' && article.downloadUrl && (
                        <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <FileText size={32} className="text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-svn-avo-extra-bold text-gray-900 mb-1">
                                        {lang === 'vi' ? 'Tải tài liệu' : 'Download Document'}
                                    </h3>
                                    <p className="text-sm font-svn-avo-bold text-gray-600">
                                        {article.fileSize && `${article.fileSize} • `}
                                        {article.fileType?.toUpperCase() || 'PDF'}
                                    </p>
                                </div>
                                <a
                                    href={article.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-svn-avo-bold hover:bg-emerald-600 transition-colors"
                                >
                                    <Download size={18} />
                                    {lang === 'vi' ? 'Tải về' : 'Download'}
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Case Study Results */}
                    {article.category === 'case-study' && results && results.length > 0 && (
                        <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp size={24} className="text-green-600" />
                                <h3 className="text-xl font-svn-avo-extra-bold text-gray-900">
                                    {lang === 'vi' ? 'Kết quả đạt được' : 'Results Achieved'}
                                </h3>
                            </div>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {results.map((result, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm"
                                    >
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <ChevronRight size={16} className="text-green-600" />
                                        </div>
                                        <span className="font-svn-avo-bold text-gray-800">{result}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Case Study Gallery */}
                    {article.category === 'case-study' && article.gallery && article.gallery.length > 1 && (
                        <div className="mt-12">
                            <h3 className="text-xl font-svn-avo-extra-bold text-gray-900 mb-6">
                                {lang === 'vi' ? 'Hình ảnh dự án' : 'Project Gallery'}
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {article.gallery.map((img, idx) => (
                                    <div key={idx} className="relative h-48 rounded-xl overflow-hidden">
                                        <Image
                                            src={img}
                                            alt={`${title} - ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Products */}
                    {relatedProductsList.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-svn-avo-extra-bold text-gray-900 mb-6">
                                {lang === 'vi' ? 'Sản phẩm liên quan' : 'Related Products'}
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {relatedProductsList.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/${lang}/products/${product.slug}`}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.images[0] || "/placeholder.svg"}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-svn-avo-bold text-gray-900">{product.name}</h4>
                                            <p className="text-sm text-gray-500">{product.brand?.name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-svn-avo-extra-bold text-gray-900 mb-4">
                        {lang === 'vi'
                            ? 'Cần tư vấn thêm về giải pháp này?'
                            : 'Need more consultation on this solution?'}
                    </h3>
                    <p className="font-svn-avo-bold text-gray-600 mb-6">
                        {lang === 'vi'
                            ? 'Đội ngũ kỹ sư chuyên nghiệp của TTE sẵn sàng hỗ trợ bạn'
                            : 'TTE professional engineering team is ready to help you'}
                    </p>
                    <Link
                        href={`/${lang}/contact`}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#364fa1] text-white rounded-xl font-svn-avo-bold hover:bg-[#2d4388] transition-colors"
                    >
                        {lang === 'vi' ? 'Liên hệ tư vấn' : 'Contact Us'}
                        <ChevronRight size={18} />
                    </Link>
                </div>
            </section>
        </main>
    )
}
