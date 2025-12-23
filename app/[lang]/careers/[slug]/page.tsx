import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, Briefcase, Clock, CheckCircle, Mail } from "lucide-react"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { vacancies } from "@/lib/data"

export async function generateStaticParams() {
    return vacancies.map((vacancy) => ({
        slug: vacancy.slug,
    }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const vacancy = vacancies.find((v) => v.slug === slug)

    if (!vacancy) {
        return { title: 'Position Not Found' }
    }

    return {
        title: vacancy.title,
        description: vacancy.description,
    }
}

export default async function VacancyDetailPage({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}) {
    const { lang, slug } = await params
    const dict = await getDictionary(lang)
    const vacancy = vacancies.find((v) => v.slug === slug)

    if (!vacancy) {
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

    const isExpired = new Date(vacancy.deadline) < new Date()

    return (
        <main className="pt-20">
            {/* Header */}
            <section className="py-16 bg-gradient-to-r from-[#2B54A7] to-[#1e3a75]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href={`/${lang}/careers`}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white font-heading font-semibold mb-6"
                    >
                        <ArrowLeft size={20} />
                        {dict.common.back}
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                        {vacancy.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/80">
                        <span className="flex items-center gap-1">
                            <Briefcase size={16} />
                            {vacancy.department}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin size={16} />
                            {vacancy.location}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={16} />
                            {vacancy.type === 'full-time'
                                ? (lang === 'vi' ? 'Toàn thời gian' : 'Full-time')
                                : vacancy.type === 'part-time'
                                    ? (lang === 'vi' ? 'Bán thời gian' : 'Part-time')
                                    : (lang === 'vi' ? 'Hợp đồng' : 'Contract')}
                        </span>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            <div className="bg-white p-8 rounded-2xl shadow-md">
                                <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">
                                    {lang === 'vi' ? 'Mô tả công việc' : 'Job Description'}
                                </h2>
                                <p className="font-body text-gray-600 leading-relaxed">
                                    {vacancy.description}
                                </p>
                            </div>

                            {/* Requirements */}
                            <div className="bg-white p-8 rounded-2xl shadow-md">
                                <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">
                                    {lang === 'vi' ? 'Yêu cầu' : 'Requirements'}
                                </h2>
                                <ul className="space-y-3">
                                    {vacancy.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="font-body text-gray-600">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Benefits */}
                            <div className="bg-white p-8 rounded-2xl shadow-md">
                                <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">
                                    {lang === 'vi' ? 'Quyền lợi' : 'Benefits'}
                                </h2>
                                <ul className="space-y-3">
                                    {vacancy.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle size={20} className="text-[#364fa1] flex-shrink-0 mt-0.5" />
                                            <span className="font-body text-gray-600">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Apply Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-md">
                                <div className="mb-6">
                                    <p className="text-sm font-body text-gray-500 mb-1">
                                        {dict.careers.deadline}
                                    </p>
                                    <p className={`flex items-center gap-2 font-heading font-bold ${isExpired ? 'text-red-600' : 'text-orange-600'}`}>
                                        <Calendar size={18} />
                                        {formatDate(vacancy.deadline)}
                                    </p>
                                </div>

                                {isExpired ? (
                                    <div className="px-4 py-3 bg-red-100 text-red-700 rounded-lg text-center font-heading font-semibold">
                                        {lang === 'vi' ? 'Đã hết hạn' : 'Expired'}
                                    </div>
                                ) : (
                                    <a
                                        href={`mailto:${vacancy.contactEmail}?subject=${encodeURIComponent(vacancy.title)}`}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-heading font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                                    >
                                        <Mail size={20} />
                                        {dict.careers.apply}
                                    </a>
                                )}
                            </div>

                            {/* Share */}
                            <div className="bg-white p-6 rounded-2xl shadow-md">
                                <h3 className="font-heading font-bold text-gray-900 mb-3">
                                    {lang === 'vi' ? 'Chia sẻ' : 'Share'}
                                </h3>
                                <p className="text-sm font-body text-gray-500">
                                    {lang === 'vi'
                                        ? 'Chia sẻ cơ hội này với bạn bè'
                                        : 'Share this opportunity with friends'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
