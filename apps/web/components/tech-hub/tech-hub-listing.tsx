"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    Lightbulb,
    FileText,
    Briefcase,
    Download,
    ArrowRight,
    Clock,
    User,
    MapPin,
    Calendar,
    ChevronRight,
    Building2,
} from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { techArticles } from "@/lib/data"

interface TechHubListingProps {
    lang: Locale
    dict: Dictionary
}

type TabType = 'solutions' | 'whitepapers' | 'case-studies'

// Primary color: #364fa1 (main blue)
// Secondary: #5a7ec9 (lighter blue)

export function TechHubListing({ lang, dict }: TechHubListingProps) {
    const [activeTab, setActiveTab] = useState<TabType>('solutions')

    const solutions = useMemo(() => techArticles.filter(a => a.category === 'solution'), [])
    const whitepapers = useMemo(() => techArticles.filter(a => a.category === 'whitepaper'), [])
    const caseStudies = useMemo(() => techArticles.filter(a => a.category === 'case-study'), [])

    const tabs = [
        { id: 'solutions' as TabType, label: lang === 'vi' ? 'Giải pháp' : 'Solutions', icon: Lightbulb, count: solutions.length },
        { id: 'whitepapers' as TabType, label: lang === 'vi' ? 'Tài liệu' : 'Documents', icon: FileText, count: whitepapers.length },
        { id: 'case-studies' as TabType, label: lang === 'vi' ? 'Case Studies' : 'Case Studies', icon: Briefcase, count: caseStudies.length },
    ]

    return (
        <section className="py-6 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Compact Tabs - Inline style */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-svn-avo-bold transition-all
                                    ${isActive
                                        ? 'bg-[#364fa1] text-white shadow-sm'
                                        : 'text-gray-600 hover:text-[#364fa1] hover:bg-gray-50'
                                    }
                                `}
                            >
                                <Icon size={16} />
                                <span>{tab.label}</span>
                                <span className={`
                                    ml-0.5 px-1.5 py-0.5 rounded text-xs
                                    ${isActive ? 'bg-white/20' : 'bg-gray-200 text-gray-500'}
                                `}>
                                    {tab.count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Content */}
                <div className="min-h-[300px]">
                    {/* Solutions */}
                    {activeTab === 'solutions' && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {solutions.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/${lang}/tech-hub/${article.slug}`}
                                    className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all border border-gray-100"
                                >
                                    <div className="relative h-36 overflow-hidden">
                                        <Image
                                            src={article.coverImage || "/placeholder.svg"}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#364fa1] text-white text-xs font-svn-avo-bold rounded">
                                            {lang === 'vi' ? 'Giải pháp' : 'Solution'}
                                        </span>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-svn-avo-extra-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-[#364fa1] transition-colors">
                                            {lang === 'vi' ? article.title : (article.titleEn || article.title)}
                                        </h3>
                                        <p className="text-gray-500 text-xs line-clamp-2 mb-2 font-svn-avo-bold">
                                            {lang === 'vi' ? article.excerpt : (article.excerptEn || article.excerpt)}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <div className="flex items-center gap-2">
                                                {article.readTime && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {article.readTime} {lang === 'vi' ? 'phút' : 'min'}
                                                    </span>
                                                )}
                                            </div>
                                            <ArrowRight size={12} className="text-[#364fa1] group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Whitepapers */}
                    {activeTab === 'whitepapers' && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {whitepapers.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.downloadUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#364fa1]/30 hover:shadow-sm transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#364fa1]/10 flex items-center justify-center flex-shrink-0">
                                        <FileText size={18} className="text-[#364fa1]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-svn-avo-bold text-[#364fa1] uppercase bg-[#364fa1]/10 px-1.5 py-0.5 rounded">
                                            {item.documentType || 'PDF'}
                                        </span>
                                        <h4 className="font-svn-avo-bold text-gray-900 text-sm mt-1 line-clamp-2 group-hover:text-[#364fa1] transition-colors">
                                            {lang === 'vi' ? item.title : (item.titleEn || item.title)}
                                        </h4>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[10px] text-gray-400 font-svn-avo-bold">{item.fileSize || '2 MB'}</span>
                                            <span className="flex items-center gap-1 text-[#364fa1] text-xs font-svn-avo-bold">
                                                <Download size={10} />
                                                {lang === 'vi' ? 'Tải' : 'Get'}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Case Studies */}
                    {activeTab === 'case-studies' && (
                        <div className="grid md:grid-cols-2 gap-4">
                            {caseStudies.map((study) => (
                                <Link
                                    key={study.id}
                                    href={`/${lang}/tech-hub/${study.slug}`}
                                    className="group flex bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all"
                                >
                                    <div className="relative w-1/3 min-h-[140px]">
                                        <Image
                                            src={study.coverImage || "/placeholder.svg"}
                                            alt={study.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex-1 p-3 flex flex-col justify-between">
                                        <div>
                                            {study.client && (
                                                <div className="flex items-center gap-1 text-[10px] text-[#364fa1] mb-1">
                                                    <Building2 size={10} />
                                                    <span className="font-svn-avo-bold">{study.client}</span>
                                                </div>
                                            )}
                                            <h3 className="font-svn-avo-extra-bold text-gray-900 text-sm line-clamp-2 group-hover:text-[#364fa1] transition-colors">
                                                {lang === 'vi' ? study.title : (study.titleEn || study.title)}
                                            </h3>
                                            <p className="text-gray-500 text-xs line-clamp-2 mt-1 font-svn-avo-bold">
                                                {lang === 'vi' ? study.excerpt : (study.excerptEn || study.excerpt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                                            {study.projectYear && (
                                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-200 rounded">
                                                    <Calendar size={8} />
                                                    {study.projectYear}
                                                </span>
                                            )}
                                            {study.location && (
                                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-200 rounded">
                                                    <MapPin size={8} />
                                                    {study.location}
                                                </span>
                                            )}
                                            <ChevronRight size={12} className="ml-auto text-[#364fa1]" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Empty States */}
                    {activeTab === 'solutions' && solutions.length === 0 && (
                        <div className="text-center py-12">
                            <Lightbulb size={32} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-500 text-sm font-svn-avo-bold">{lang === 'vi' ? 'Đang cập nhật' : 'Coming soon'}</p>
                        </div>
                    )}
                    {activeTab === 'whitepapers' && whitepapers.length === 0 && (
                        <div className="text-center py-12">
                            <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-500 text-sm font-svn-avo-bold">{lang === 'vi' ? 'Chưa có tài liệu' : 'No documents'}</p>
                        </div>
                    )}
                    {activeTab === 'case-studies' && caseStudies.length === 0 && (
                        <div className="text-center py-12">
                            <Briefcase size={32} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-500 text-sm font-svn-avo-bold">{lang === 'vi' ? 'Đang cập nhật' : 'Coming soon'}</p>
                        </div>
                    )}
                </div>

                {/* Simple CTA */}
                <div className="mt-8 py-6 border-t border-gray-100 text-center">
                    <p className="text-gray-600 text-sm font-svn-avo-bold mb-3">
                        {lang === 'vi' ? 'Cần tư vấn giải pháp?' : 'Need a solution?'}
                    </p>
                    <Link
                        href={`/${lang}/contact`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#364fa1] text-white rounded-lg font-svn-avo-bold text-sm hover:bg-[#2d4388] transition-colors"
                    >
                        {lang === 'vi' ? 'Liên hệ' : 'Contact'}
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    )
}
