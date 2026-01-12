"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    Building2,
    Handshake,
    Globe,
    Calendar,
    ArrowRight,
    User,
    Clock,
    TrendingUp,
    Mail,
    Tag,
    ChevronRight,
    Newspaper,
} from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { newsArticles } from "@/lib/data"

interface NewsListingProps {
    lang: Locale
    dict: Dictionary
}

type TabType = 'all' | 'company' | 'partner' | 'industry'

export function NewsListing({ lang, dict }: NewsListingProps) {
    const [activeTab, setActiveTab] = useState<TabType>('all')
    const [email, setEmail] = useState('')

    const companyNews = useMemo(() => newsArticles.filter(a => a.category === 'company'), [])
    const partnerNews = useMemo(() => newsArticles.filter(a => a.category === 'partner'), [])
    const industryNews = useMemo(() => newsArticles.filter(a => a.category === 'industry'), [])

    const filteredNews = useMemo(() => {
        if (activeTab === 'all') return newsArticles
        return newsArticles.filter(a => a.category === activeTab)
    }, [activeTab])

    // Get featured article (latest)
    const featuredArticle = filteredNews[0]
    const restArticles = filteredNews.slice(1)

    // Get popular articles (for sidebar)
    const popularArticles = useMemo(() => {
        return [...newsArticles].slice(0, 5)
    }, [])

    // Get all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>()
        newsArticles.forEach(article => {
            article.tags?.forEach(tag => tags.add(tag))
        })
        return Array.from(tags)
    }, [])

    const tabs = [
        { id: 'all' as TabType, label: lang === 'vi' ? 'Tất cả' : 'All', icon: Newspaper, count: newsArticles.length },
        { id: 'company' as TabType, label: lang === 'vi' ? 'Tin TTE' : 'TTE News', icon: Building2, count: companyNews.length },
        { id: 'partner' as TabType, label: lang === 'vi' ? 'Đối tác' : 'Partners', icon: Handshake, count: partnerNews.length },
        { id: 'industry' as TabType, label: lang === 'vi' ? 'Tin ngành' : 'Industry', icon: Globe, count: industryNews.length },
    ]

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const formatDateShort = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
            month: 'short',
            day: 'numeric',
        })
    }

    const getCategoryLabel = (category: string) => {
        if (category === 'company') return lang === 'vi' ? 'Tin TTE' : 'TTE News'
        if (category === 'partner') return lang === 'vi' ? 'Đối tác' : 'Partner'
        return lang === 'vi' ? 'Tin ngành' : 'Industry'
    }

    const getCategoryColor = (category: string) => {
        if (category === 'company') return 'bg-blue-600'
        if (category === 'partner') return 'bg-emerald-600'
        return 'bg-amber-600'
    }

    const getReadingTime = (content: string) => {
        const wordsPerMinute = 200
        const words = content.split(/\s+/).length
        const minutes = Math.ceil(words / wordsPerMinute)
        return lang === 'vi' ? `${minutes} phút đọc` : `${minutes} min read`
    }

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle newsletter subscription
        setEmail('')
        alert(lang === 'vi' ? 'Đăng ký thành công!' : 'Subscription successful!')
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Category Tabs */}
                <nav className="mb-10" aria-label="News categories">
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full text-sm font-svn-avo-bold transition-all duration-300
                                        ${isActive
                                            ? 'bg-[#2B54A7] text-white shadow-lg shadow-[#2B54A7]/25'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }
                                    `}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <Icon size={16} />
                                    <span>{tab.label}</span>
                                    <span className={`
                                        px-2 py-0.5 rounded-full text-xs
                                        ${isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}
                                    `}>
                                        {tab.count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </nav>

                {/* Main Content Layout */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Column - Featured + News Grid */}
                    <div className="lg:col-span-2">
                        {/* Featured Article */}
                        {featuredArticle && (
                            <article className="mb-10">
                                <Link
                                    href={`/${lang}/news/${featuredArticle.slug}`}
                                    className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <Image
                                            src={featuredArticle.coverImage || "/placeholder.svg"}
                                            alt={lang === 'vi' ? featuredArticle.title : (featuredArticle.titleEn || featuredArticle.title)}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                        
                                        {/* Category Badge */}
                                        <span className={`absolute top-4 left-4 px-3 py-1 ${getCategoryColor(featuredArticle.category)} text-white text-xs font-svn-avo-bold rounded-full`}>
                                            {getCategoryLabel(featuredArticle.category)}
                                        </span>

                                        {/* Featured Badge */}
                                        <span className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-white text-xs font-svn-avo-bold rounded-full flex items-center gap-1">
                                            <TrendingUp size={12} />
                                            {lang === 'vi' ? 'Nổi bật' : 'Featured'}
                                        </span>

                                        {/* Title Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h2 className="text-2xl md:text-3xl font-svn-avo-extra-bold text-white mb-3 group-hover:text-blue-200 transition-colors line-clamp-2">
                                                {lang === 'vi' ? featuredArticle.title : (featuredArticle.titleEn || featuredArticle.title)}
                                            </h2>
                                            <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-4 font-svn-avo-bold">
                                                {lang === 'vi' ? featuredArticle.excerpt : (featuredArticle.excerptEn || featuredArticle.excerpt)}
                                            </p>
                                            <div className="flex items-center gap-4 text-white/70 text-sm">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    {formatDate(featuredArticle.publishedAt)}
                                                </span>
                                                {featuredArticle.author && (
                                                    <span className="flex items-center gap-1.5">
                                                        <User size={14} />
                                                        {featuredArticle.author}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    {getReadingTime(featuredArticle.content || '')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        )}

                        {/* News Grid */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            {restArticles.map((article) => (
                                <article key={article.id}>
                                    <Link
                                        href={`/${lang}/news/${article.slug}`}
                                        className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <Image
                                                src={article.coverImage || "/placeholder.svg"}
                                                alt={lang === 'vi' ? article.title : (article.titleEn || article.title)}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            <span className={`absolute top-3 left-3 px-2.5 py-1 ${getCategoryColor(article.category)} text-white text-xs font-svn-avo-bold rounded-full`}>
                                                {getCategoryLabel(article.category)}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {formatDateShort(article.publishedAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {getReadingTime(article.content || '')}
                                                </span>
                                            </div>
                                            <h3 className="font-svn-avo-extra-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#2B54A7] transition-colors">
                                                {lang === 'vi' ? article.title : (article.titleEn || article.title)}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-4 font-svn-avo-bold">
                                                {lang === 'vi' ? article.excerpt : (article.excerptEn || article.excerpt)}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                {article.author && (
                                                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <User size={12} />
                                                        {article.author}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1 text-[#2B54A7] text-sm font-svn-avo-bold ml-auto">
                                                    {lang === 'vi' ? 'Đọc thêm' : 'Read more'}
                                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>

                        {/* Load More / Pagination */}
                        {restArticles.length > 0 && (
                            <div className="mt-10 text-center">
                                <button className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-[#2B54A7] text-[#2B54A7] rounded-full font-svn-avo-bold hover:bg-[#2B54A7] hover:text-white transition-all duration-300">
                                    {lang === 'vi' ? 'Xem thêm bài viết' : 'Load more articles'}
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {filteredNews.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-2xl">
                                <Globe size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500 font-svn-avo-bold text-lg">
                                    {lang === 'vi' ? 'Chưa có tin tức trong danh mục này' : 'No news in this category'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-8">
                        {/* Newsletter Subscription */}
                        <div className="bg-gradient-to-br from-[#2B54A7] to-[#1e3a75] rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <Mail size={24} />
                                <h3 className="font-svn-avo-extra-bold text-lg">
                                    {lang === 'vi' ? 'Đăng ký nhận tin' : 'Newsletter'}
                                </h3>
                            </div>
                            <p className="text-white/80 text-sm mb-4 font-svn-avo-bold">
                                {lang === 'vi' 
                                    ? 'Nhận tin tức mới nhất về TTE và ngành công nghiệp dầu khí' 
                                    : 'Get the latest news about TTE and oil & gas industry'}
                            </p>
                            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={lang === 'vi' ? 'Email của bạn' : 'Your email'}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 font-svn-avo-bold text-sm"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 bg-white text-[#2B54A7] rounded-xl font-svn-avo-bold hover:bg-gray-100 transition-colors"
                                >
                                    {lang === 'vi' ? 'Đăng ký ngay' : 'Subscribe'}
                                </button>
                            </form>
                        </div>

                        {/* Popular Articles */}
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp size={20} className="text-[#2B54A7]" />
                                <h3 className="font-svn-avo-extra-bold text-lg text-gray-900">
                                    {lang === 'vi' ? 'Tin được quan tâm' : 'Popular Articles'}
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {popularArticles.map((article, index) => (
                                    <Link
                                        key={article.id}
                                        href={`/${lang}/news/${article.slug}`}
                                        className="group flex gap-4 items-start"
                                    >
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-svn-avo-extra-bold text-[#2B54A7] text-sm">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-svn-avo-bold text-sm text-gray-900 line-clamp-2 group-hover:text-[#2B54A7] transition-colors">
                                                {lang === 'vi' ? article.title : (article.titleEn || article.title)}
                                            </h4>
                                            <span className="text-xs text-gray-500 mt-1 block">
                                                {formatDateShort(article.publishedAt)}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Tags Cloud */}
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <div className="flex items-center gap-2 mb-6">
                                <Tag size={20} className="text-[#2B54A7]" />
                                <h3 className="font-svn-avo-extra-bold text-lg text-gray-900">
                                    {lang === 'vi' ? 'Chủ đề' : 'Tags'}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-svn-avo-bold rounded-full hover:bg-[#2B54A7] hover:text-white transition-colors cursor-pointer"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* CTA Banner */}
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
                            <h3 className="font-svn-avo-extra-bold text-xl mb-3">
                                {lang === 'vi' ? 'Cần tư vấn?' : 'Need consultation?'}
                            </h3>
                            <p className="text-white/90 text-sm mb-4 font-svn-avo-bold">
                                {lang === 'vi' 
                                    ? 'Liên hệ đội ngũ chuyên gia của chúng tôi để được hỗ trợ'
                                    : 'Contact our expert team for support'}
                            </p>
                            <Link
                                href={`/${lang}/contact`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-amber-600 rounded-full font-svn-avo-bold hover:bg-gray-100 transition-colors"
                            >
                                {lang === 'vi' ? 'Liên hệ ngay' : 'Contact now'}
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}
