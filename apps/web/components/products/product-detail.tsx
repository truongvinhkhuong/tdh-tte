"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Download, FileText, Send } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import type { Product } from "@tte/shared-types"

interface ProductDetailProps {
    lang: Locale
    dict: Dictionary
    product: Product
}

export function ProductDetail({ lang, dict, product }: ProductDetailProps) {
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'documents'>('description')
    const [selectedImage, setSelectedImage] = useState(0)
    const [showQuoteForm, setShowQuoteForm] = useState(false)

    const tabs = [
        { id: 'description' as const, label: dict.products.tabs.description },
        { id: 'specifications' as const, label: dict.products.tabs.specifications },
        { id: 'documents' as const, label: dict.products.tabs.documents },
    ]

    return (
        <section className="py-12 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link
                        href={`/${lang}/products`}
                        className="inline-flex items-center gap-2 text-[#364fa1] hover:text-[#2d4388] font-svn-avo-bold"
                    >
                        <ArrowLeft size={20} />
                        {lang === 'vi' ? 'Quay lại sản phẩm' : 'Back to Products'}
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Gallery */}
                    <div>
                        <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
                            <Image
                                src={product.images[selectedImage] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-[#364fa1]' : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} - ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        {/* Brand Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-4">
                            <span className="text-sm font-svn-avo-bold text-gray-600">
                                {product.brand.name}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-svn-avo-extra-bold text-gray-900 mb-2">
                            {product.name}
                        </h1>

                        <p className="text-lg font-svn-avo-bold text-gray-800 mb-6">
                            {lang === 'vi' ? 'Mã sản phẩm' : 'Model'}: {product.modelNumber}
                        </p>

                        <p className="font-svn-avo-bold text-gray-800 leading-relaxed mb-8">
                            {product.shortDescription}
                        </p>

                        {/* Category & Industry Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            <span className="px-3 py-1 bg-[#364fa1]/10 text-[#364fa1] text-sm font-svn-avo-bold rounded-full">
                                {product.category.name}
                            </span>
                            {product.industries.map((industry) => (
                                <span
                                    key={industry.id}
                                    className="px-3 py-1 bg-[#5a7ec9]/10 text-[#4a5ea0] text-sm font-svn-avo-bold rounded-full"
                                >
                                    {industry.name}
                                </span>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setShowQuoteForm(true)}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-bold rounded-xl hover:shadow-xl transition-all duration-300"
                            >
                                <Send size={20} />
                                {dict.products.requestQuote}
                            </button>
                            <Link
                                href={`/${lang}/contact`}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#364fa1] text-[#364fa1] font-svn-avo-bold rounded-xl hover:bg-[#364fa1]/5 transition-all duration-300"
                            >
                                {dict.contact.title}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
                    {/* Tab Headers */}
                    <div className="flex border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-6 py-4 font-svn-avo-bold transition-all duration-200 ${activeTab === tab.id
                                    ? 'text-[#364fa1] border-b-2 border-[#364fa1] bg-[#364fa1]/5'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'description' && (
                            <div
                                className="prose prose-lg max-w-none font-svn-avo-bold"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        )}

                        {activeTab === 'specifications' && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <tbody>
                                        {product.specifications.map((spec, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                <td className="px-6 py-4 font-svn-avo-bold text-gray-900 w-1/3">
                                                    {spec.key}
                                                </td>
                                                <td className="px-6 py-4 font-svn-avo-bold text-gray-800">
                                                    {spec.value} {spec.unit}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {product.specifications.length === 0 && (
                                    <p className="text-center text-gray-800 py-8 font-svn-avo-bold">
                                        {lang === 'vi' ? 'Chưa có thông số kỹ thuật' : 'No specifications available'}
                                    </p>
                                )}
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <div className="space-y-4">
                                {product.documents.map((doc) => (
                                    <a
                                        key={doc.id}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                                    >
                                        <div className="w-12 h-12 bg-[#364fa1]/10 rounded-lg flex items-center justify-center group-hover:bg-[#364fa1]/20 transition-colors">
                                            <FileText size={24} className="text-[#364fa1]" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-svn-avo-bold text-gray-900">{doc.name}</h4>
                                            <p className="text-sm font-svn-avo-bold text-gray-800">
                                                {doc.type.toUpperCase()} {doc.size && `• ${doc.size}`}
                                            </p>
                                        </div>
                                        <Download size={20} className="text-gray-400 group-hover:text-[#364fa1] transition-colors" />
                                    </a>
                                ))}
                                {product.documents.length === 0 && (
                                    <p className="text-center text-gray-800 py-8 font-svn-avo-bold">
                                        {lang === 'vi' ? 'Chưa có tài liệu' : 'No documents available'}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Projects */}
                {product.relatedProjects.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-svn-avo-extra-bold text-gray-900 mb-8">
                            {dict.products.relatedProjects}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {product.relatedProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/${lang}/projects/${project.slug}`}
                                    className="group relative h-64 rounded-2xl overflow-hidden shadow-lg"
                                >
                                    <Image
                                        src={project.heroImage}
                                        alt={project.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="text-lg font-svn-avo-extra-bold text-white group-hover:text-[#a8bcdf] transition-colors">
                                            {project.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Quote Request Modal */}
            {showQuoteForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowQuoteForm(false)}
                    ></div>
                    <div className="relative bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-svn-avo-extra-bold text-gray-900 mb-6">
                            {dict.products.requestQuote}
                        </h3>
                        <p className="font-svn-avo-bold text-gray-800 mb-6">
                            {lang === 'vi'
                                ? `Yêu cầu báo giá cho: ${product.name}`
                                : `Request quote for: ${product.name}`}
                        </p>
                        <form className="space-y-4">
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
                            <input
                                type="tel"
                                placeholder={dict.contact.form.phone}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <textarea
                                rows={4}
                                placeholder={dict.contact.form.message}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                            ></textarea>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowQuoteForm(false)}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-600 font-svn-avo-bold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    {dict.common.close}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    {dict.contact.form.submit}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}
