import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Download, ArrowRight, BookOpen, FileText } from "lucide-react"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { techArticles } from "@/lib/data"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params

    return {
        title: lang === 'vi' ? 'Tech Hub' : 'Tech Hub',
        description: lang === 'vi'
            ? 'Trung tâm kiến thức kỹ thuật và thư viện tài liệu'
            : 'Technical knowledge center and document library',
    }
}

export default async function TechHubPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    const solutions = techArticles.filter((a) => a.category === 'solution')
    const library = techArticles.filter((a) => a.category === 'library')

    return (
        <main className="pt-20">
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-r from-[#2B54A7] to-[#1e3a75]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-svn-avo-extra-bold text-white mb-6">
                        {dict.techHub.title}
                    </h1>
                    <p className="text-xl font-svn-avo-bold text-white/80 max-w-3xl mx-auto">
                        {dict.techHub.subtitle}
                    </p>
                </div>
            </section>

            {/* Solutions Section */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <BookOpen className="text-[#364fa1]" size={28} />
                        <h2 className="text-3xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent">
                            {dict.techHub.solutions}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {solutions.map((article) => (
                            <Link
                                key={article.id}
                                href={`/${lang}/tech-hub/${article.slug}`}
                                className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={article.coverImage || "/placeholder.svg"}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-svn-avo-extra-bold text-gray-900 mb-2 group-hover:text-[#364fa1] transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="font-svn-avo-bold text-gray-800 text-sm mb-4 line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        {article.readTime && (
                                            <span className="text-sm font-svn-avo-bold text-gray-800">
                                                {article.readTime} {lang === 'vi' ? 'phút đọc' : 'min read'}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1 text-[#364fa1] font-svn-avo-bold text-sm group-hover:gap-2 transition-all">
                                            {dict.techHub.readMore}
                                            <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Library Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <FileText className="text-[#364fa1]" size={28} />
                        <h2 className="text-3xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent">
                            {dict.techHub.library}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {library.map((item) => (
                            <a
                                key={item.id}
                                href={item.downloadUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#364fa1]/40"
                            >
                                <div className="w-12 h-12 bg-[#364fa1]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#364fa1]/20 transition-colors">
                                    <FileText size={24} className="text-[#364fa1]" />
                                </div>
                                <h3 className="font-svn-avo-extra-bold text-gray-900 mb-2 group-hover:text-[#364fa1] transition-colors">
                                    {item.title}
                                </h3>
                                <p className="font-svn-avo-bold text-gray-800 text-sm mb-4">
                                    {item.excerpt}
                                </p>
                                <span className="inline-flex items-center gap-2 text-[#364fa1] font-svn-avo-bold text-sm">
                                    <Download size={16} />
                                    {dict.techHub.downloadCatalog}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
