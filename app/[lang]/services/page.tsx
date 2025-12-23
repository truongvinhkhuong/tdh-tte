import type { Metadata } from "next"
import Link from "next/link"
import { Lightbulb, Package, Wrench, Settings, Users, Headphones, ArrowRight } from "lucide-react"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { services } from "@/lib/data"

const iconMap = {
    Lightbulb,
    Package,
    Wrench,
    Settings,
    Users,
    Headphones,
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params

    return {
        title: lang === 'vi' ? 'Dịch Vụ' : 'Services',
        description: lang === 'vi'
            ? 'Các dịch vụ kỹ thuật toàn diện từ Toàn Thắng Engineering'
            : 'Comprehensive technical services from Toan Thang Engineering',
    }
}

export default async function ServicesPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return (
        <main className="pt-20">
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-r from-[#2B54A7] to-[#1e3a75]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-6">
                        {dict.services.title}
                    </h1>
                    <p className="text-xl font-body text-white/80 max-w-3xl mx-auto">
                        {dict.services.subtitle}
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => {
                            const IconComponent = iconMap[service.icon as keyof typeof iconMap]
                            return (
                                <div
                                    key={service.id}
                                    className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <IconComponent size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">
                                        {service.title}
                                    </h3>
                                    <p className="font-body text-gray-600 leading-relaxed mb-6">
                                        {service.shortDescription}
                                    </p>
                                    <Link
                                        href={`/${lang}/services/${service.slug}`}
                                        className="inline-flex items-center gap-2 text-blue-600 font-heading font-semibold group-hover:gap-3 transition-all"
                                    >
                                        {dict.services.learnMore}
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                        {lang === 'vi' ? 'Cần tư vấn thêm?' : 'Need more consultation?'}
                    </h2>
                    <p className="font-body text-gray-600 mb-8">
                        {lang === 'vi'
                            ? 'Liên hệ với chúng tôi để được hỗ trợ nhanh chóng'
                            : 'Contact us for quick support'}
                    </p>
                    <Link
                        href={`/${lang}/contact`}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-heading font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
                    >
                        {dict.header.contactNow}
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </main>
    )
}
