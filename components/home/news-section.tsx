"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { newsArticles } from "@/lib/data"

interface NewsSectionProps {
    lang: Locale
    dict: Dictionary
}

export function NewsSection({ lang, dict }: NewsSectionProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 },
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    // Show only latest 3 news articles
    const latestNews = newsArticles.slice(0, 3)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <section id="news" className="py-24 scroll-mt-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"></div>
            <div
                className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"
                style={{ animationDelay: "2s" }}
            ></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <div className="text-center mb-20">
                        <div className="inline-block relative">
                            <h2 className="text-4xl md:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                {dict.news.latest}
                            </h2>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
                        </div>
                        <p className="text-lg font-svn-avo text-gray-600 max-w-2xl mx-auto mt-8">
                            {dict.news.subtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {latestNews.map((article, index) => (
                            <Link
                                key={article.id}
                                href={`/${lang}/news/${article.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-300"
                                style={{
                                    animationName: isVisible ? 'cardLift' : 'none',
                                    animationDuration: '0.8s',
                                    animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    animationFillMode: 'forwards',
                                    animationDelay: `${index * 0.1}s`,
                                    opacity: isVisible ? 1 : 0,
                                }}
                            >
                                <div className="relative h-48 bg-gray-200 overflow-hidden">
                                    <Image
                                        src={article.coverImage || "/placeholder.svg"}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-svn-avo-extra-bold rounded-full">
                                        {article.category === 'company' ? dict.news.categories.company : dict.news.categories.industry}
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Date */}
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                        <Calendar size={14} />
                                        <span>{formatDate(article.publishedAt)}</span>
                                    </div>

                                    <h3 className="text-lg font-svn-avo-extra-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {article.title}
                                    </h3>

                                    <p className="text-sm font-svn-avo text-gray-600 line-clamp-2 mb-4">
                                        {article.excerpt}
                                    </p>

                                    <span className="inline-flex items-center gap-1 text-blue-600 font-svn-avo-extra-bold text-sm group-hover:gap-2 transition-all">
                                        {dict.news.readMore}
                                        <ArrowRight size={16} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href={`/${lang}/news`}
                            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-blue-600 text-blue-600 font-svn-avo-extra-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
                        >
                            {dict.common.viewMore}
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
