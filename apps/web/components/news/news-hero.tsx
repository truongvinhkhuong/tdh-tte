"use client"

import Link from "next/link"
import { ChevronRight, Home, Newspaper } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"

interface NewsHeroProps {
    lang: Locale
    dict: Dictionary
}

export function NewsHero({ lang, dict }: NewsHeroProps) {
    return (
        <section className="relative py-16 md:py-20 bg-gradient-to-r from-[#2B54A7] to-[#1e3a75] overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Breadcrumb - SEO optimized */}
                <nav aria-label="Breadcrumb" className="mb-8">
                    <ol className="flex items-center gap-2 text-sm text-white/70" itemScope itemType="https://schema.org/BreadcrumbList">
                        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <Link 
                                href={`/${lang}`} 
                                className="flex items-center gap-1 hover:text-white transition-colors"
                                itemProp="item"
                            >
                                <Home size={14} />
                                <span itemProp="name">{lang === 'vi' ? 'Trang chủ' : 'Home'}</span>
                            </Link>
                            <meta itemProp="position" content="1" />
                        </li>
                        <ChevronRight size={14} className="text-white/50" />
                        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <span className="flex items-center gap-1 text-white font-svn-avo-bold" itemProp="name">
                                <Newspaper size={14} />
                                {dict.news.title}
                            </span>
                            <meta itemProp="position" content="2" />
                        </li>
                    </ol>
                </nav>

                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-svn-avo-extra-bold text-white mb-4">
                        {dict.news.title}
                    </h1>
                    <p className="text-lg md:text-xl font-svn-avo-bold text-white/80 max-w-3xl mx-auto leading-relaxed">
                        {dict.news.subtitle}
                    </p>
                </div>
            </div>
        </section>
    )
}
