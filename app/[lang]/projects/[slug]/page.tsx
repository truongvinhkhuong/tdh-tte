import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, Building2, ArrowRight } from "lucide-react"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { projects } from "@/lib/data"

export async function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const project = projects.find((p) => p.slug === slug)

    if (!project) {
        return { title: 'Project Not Found' }
    }

    return {
        title: project.title,
        description: project.shortDescription,
    }
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}) {
    const { lang, slug } = await params
    const dict = await getDictionary(lang)
    const project = projects.find((p) => p.slug === slug)

    if (!project) {
        notFound()
    }

    return (
        <main className="pt-20">
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px]">
                <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
                        <Link
                            href={`/${lang}/projects`}
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-heading font-semibold mb-4"
                        >
                            <ArrowLeft size={20} />
                            {dict.common.back}
                        </Link>
                        <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-heading font-bold rounded-full mb-4">
                            {project.industry.name}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                            {project.title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Project Info */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Info Cards */}
                    <div className="grid md:grid-cols-3 gap-6 -mt-20 relative z-10 mb-12">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <Building2 className="text-blue-600" size={24} />
                                <span className="font-heading font-bold text-gray-900">{dict.projects.client}</span>
                            </div>
                            <p className="font-body text-gray-600">{project.client}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <MapPin className="text-blue-600" size={24} />
                                <span className="font-heading font-bold text-gray-900">{dict.projects.location}</span>
                            </div>
                            <p className="font-body text-gray-600">{project.location}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <Calendar className="text-blue-600" size={24} />
                                <span className="font-heading font-bold text-gray-900">{dict.projects.year}</span>
                            </div>
                            <p className="font-body text-gray-600">{project.completionYear}</p>
                        </div>
                    </div>

                    {/* Challenge & Solution */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl border border-red-100">
                            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                                {dict.projects.challenge}
                            </h2>
                            <p className="font-body text-gray-600 leading-relaxed">
                                {project.challenge}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-cyan-50 p-8 rounded-2xl border border-green-100">
                            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                                {dict.projects.solution}
                            </h2>
                            <p className="font-body text-gray-600 leading-relaxed">
                                {project.solution}
                            </p>
                        </div>
                    </div>

                    {/* Related Products */}
                    {project.products.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">
                                {dict.projects.relatedProducts}
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {project.products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/${lang}/products/${product.slug}`}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300"
                                    >
                                        <div className="relative h-48 bg-gray-200 overflow-hidden">
                                            <Image
                                                src={product.images[0] || "/placeholder.svg"}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-heading font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm font-body text-gray-500">{product.modelNumber}</p>
                                            <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-heading font-semibold mt-2 group-hover:gap-2 transition-all">
                                                {dict.products.viewDetails}
                                                <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
