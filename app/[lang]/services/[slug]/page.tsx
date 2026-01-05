import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Lightbulb, Package, Wrench, Settings, Users, Headphones } from "lucide-react"
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

export async function generateStaticParams() {
    return services.map((service) => ({
        slug: service.slug,
    }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const service = services.find((s) => s.slug === slug)

    if (!service) {
        return { title: 'Service Not Found' }
    }

    return {
        title: service.title,
        description: service.shortDescription,
    }
}

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}) {
    const { lang, slug } = await params
    const dict = await getDictionary(lang)
    const service = services.find((s) => s.slug === slug)

    if (!service) {
        notFound()
    }

    const IconComponent = iconMap[service.icon as keyof typeof iconMap]

    return (
        <main className="pt-20">
            {/* Header */}
            <section className="py-24 bg-gradient-to-r from-[#2B54A7] to-[#1e3a75]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href={`/${lang}/services`}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white font-svn-avo-bold mb-8"
                    >
                        <ArrowLeft size={20} />
                        {dict.common.back}
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <IconComponent size={40} className="text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-svn-avo-extra-bold text-white">
                            {service.title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="prose prose-lg max-w-none font-svn-avo-bold"
                        dangerouslySetInnerHTML={{ __html: service.description }}
                    />

                    {/* Contact Form */}
                    <div className="mt-16 bg-gradient-to-br from-gray-50 to-[#364fa1]/5 p-8 rounded-2xl">
                        <h2 className="text-2xl font-svn-avo-extra-bold text-gray-900 mb-6">
                            {lang === 'vi' ? 'Yêu cầu dịch vụ' : 'Request Service'}
                        </h2>
                        <form className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder={dict.contact.form.name}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1]"
                                />
                                <input
                                    type="email"
                                    placeholder={dict.contact.form.email}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <input
                                type="tel"
                                placeholder={dict.contact.form.phone}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <textarea
                                rows={5}
                                placeholder={dict.contact.form.message}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-bold rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                {dict.contact.form.submit}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}
