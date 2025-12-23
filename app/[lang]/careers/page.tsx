import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Calendar, Briefcase, Clock, Mail } from "lucide-react"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { vacancies } from "@/lib/data"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params

    return {
        title: lang === 'vi' ? 'Tuyển Dụng' : 'Careers',
        description: lang === 'vi'
            ? 'Cơ hội nghề nghiệp tại Toàn Thắng Engineering'
            : 'Career opportunities at Toan Thang Engineering',
    }
}

export default async function CareersPage({
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

    // Filter out expired jobs
    const today = new Date()
    const activeVacancies = vacancies.filter((v) => new Date(v.deadline) >= today)

    return (
        <main className="pt-20">
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-r from-[#2B54A7] to-[#1e3a75]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-6">
                        {dict.careers.title}
                    </h1>
                    <p className="text-xl font-body text-white/80 max-w-3xl mx-auto">
                        {dict.careers.subtitle}
                    </p>
                </div>
            </section>

            {/* Vacancies List */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">
                        {dict.careers.positions}
                    </h2>

                    {activeVacancies.length > 0 ? (
                        <div className="space-y-6">
                            {activeVacancies.map((vacancy) => (
                                <Link
                                    key={vacancy.id}
                                    href={`/${lang}/careers/${vacancy.slug}`}
                                    className="block bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300 group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {vacancy.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Briefcase size={14} />
                                                    {vacancy.department}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    {vacancy.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {vacancy.type === 'full-time'
                                                        ? (lang === 'vi' ? 'Toàn thời gian' : 'Full-time')
                                                        : vacancy.type === 'part-time'
                                                            ? (lang === 'vi' ? 'Bán thời gian' : 'Part-time')
                                                            : (lang === 'vi' ? 'Hợp đồng' : 'Contract')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-sm font-body text-gray-500">
                                                    {dict.careers.deadline}
                                                </p>
                                                <p className="flex items-center gap-1 text-sm font-heading font-semibold text-orange-600">
                                                    <Calendar size={14} />
                                                    {formatDate(vacancy.deadline)}
                                                </p>
                                            </div>
                                            <span className="px-4 py-2 bg-blue-600 text-white font-heading font-semibold rounded-lg group-hover:bg-blue-700 transition-colors">
                                                {dict.careers.apply}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl">
                            <p className="font-body text-gray-600">
                                {dict.careers.noPositions}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Contact HR */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                        {lang === 'vi' ? 'Không tìm thấy vị trí phù hợp?' : "Couldn't find a suitable position?"}
                    </h2>
                    <p className="font-body text-gray-600 mb-6">
                        {lang === 'vi'
                            ? 'Gửi CV của bạn cho chúng tôi để được xem xét trong tương lai'
                            : 'Send us your CV for future consideration'}
                    </p>
                    <a
                        href="mailto:hr@toanthang.vn"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-heading font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
                    >
                        <Mail size={20} />
                        hr@toanthang.vn
                    </a>
                </div>
            </section>
        </main>
    )
}
