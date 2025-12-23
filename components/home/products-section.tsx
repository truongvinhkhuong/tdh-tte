"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { products } from "@/lib/data"

interface ProductsSectionProps {
    lang: Locale
    dict: Dictionary
}

export function ProductsSection({ lang, dict }: ProductsSectionProps) {
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

    // Show only first 6 products
    const featuredProducts = products.slice(0, 6)

    return (
        <section
            id="products"
            className="py-24 scroll-mt-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#5a7ec9]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"></div>
            <div
                className="absolute bottom-0 left-0 w-96 h-96 bg-[#364fa1]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"
                style={{ animationDelay: "2s" }}
            ></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <div className="text-center mb-20">
                        <div className="inline-block">
                            <h2 className="text-4xl md:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2">
                                {dict.products.featured}
                            </h2>
                        </div>
                        <p className="text-lg font-svn-avo text-gray-600 max-w-2xl mx-auto mt-8">
                            {dict.products.subtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProducts.map((product, index) => (
                            <Link
                                key={product.id}
                                href={`/${lang}/products/${product.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#364fa1]/40"
                                style={{
                                    animationName: isVisible ? 'cardLift' : 'none',
                                    animationDuration: '0.8s',
                                    animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    animationFillMode: 'forwards',
                                    animationDelay: `${index * 0.1}s`,
                                    opacity: isVisible ? 1 : 0,
                                }}
                            >
                                <div className="relative h-56 bg-gray-200 overflow-hidden">
                                    <Image
                                        src={product.images[0] || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Brand Badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-svn-avo-extra-bold text-gray-700">
                                        {product.brand.name}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white text-xs font-svn-avo-extra-bold rounded-full mb-3">
                                        {product.category.name}
                                    </div>
                                    <h3 className="text-lg font-svn-avo-extra-bold text-gray-900 mb-2 group-hover:text-[#364fa1] transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm font-svn-avo text-gray-500 mb-4">
                                        {product.modelNumber}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-svn-avo text-gray-600">{dict.products.contact}</span>
                                        <span className="flex items-center gap-1 text-[#364fa1] font-svn-avo-extra-bold text-sm group-hover:gap-2 transition-all">
                                            {dict.products.viewDetails}
                                            <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href={`/${lang}/products`}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-extra-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            {dict.products.viewAll}
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
