"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Filter, X } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { products, brands, categories, industries } from "@/lib/data"

interface ProductsListingProps {
    lang: Locale
    dict: Dictionary
}

export function ProductsListing({ lang, dict }: ProductsListingProps) {
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    const filteredProducts = products.filter((product) => {
        if (selectedBrand && product.brand.id !== selectedBrand) return false
        if (selectedCategory && product.category.id !== selectedCategory) return false
        if (selectedIndustry && !product.industries.some((i) => i.id === selectedIndustry)) return false
        return true
    })

    const clearFilters = () => {
        setSelectedBrand(null)
        setSelectedCategory(null)
        setSelectedIndustry(null)
    }

    const hasActiveFilters = selectedBrand || selectedCategory || selectedIndustry

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Brand Filter */}
            <div>
                <h3 className="font-heading font-bold text-gray-900 mb-3">
                    {dict.products.filter.brand}
                </h3>
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <button
                            key={brand.id}
                            onClick={() => setSelectedBrand(selectedBrand === brand.id ? null : brand.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-body text-sm ${selectedBrand === brand.id
                                ? 'bg-[#364fa1] text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                        >
                            {brand.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Filter */}
            <div>
                <h3 className="font-heading font-bold text-gray-900 mb-3">
                    {dict.products.filter.category}
                </h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-body text-sm ${selectedCategory === category.id
                                ? 'bg-[#364fa1] text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Industry Filter */}
            <div>
                <h3 className="font-heading font-bold text-gray-900 mb-3">
                    {dict.products.filter.industry}
                </h3>
                <div className="space-y-2">
                    {industries.map((industry) => (
                        <button
                            key={industry.id}
                            onClick={() => setSelectedIndustry(selectedIndustry === industry.id ? null : industry.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-body text-sm ${selectedIndustry === industry.id
                                ? 'bg-[#364fa1] text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                        >
                            {industry.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-red-500 hover:text-red-500 transition-all duration-200 font-heading font-semibold text-sm"
                >
                    {lang === 'vi' ? 'Xóa bộ lọc' : 'Clear Filters'}
                </button>
            )}
        </div>
    )

    return (
        <section className="py-12 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-heading font-black bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent mb-2">
                        {dict.products.title}
                    </h1>
                    <p className="font-body text-gray-600">
                        {dict.products.subtitle}
                    </p>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
                            <h2 className="font-heading font-bold text-lg text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                {lang === 'vi' ? 'Bộ lọc' : 'Filters'}
                            </h2>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Button */}
                        <div className="lg:hidden mb-6">
                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md font-heading font-semibold text-gray-700"
                            >
                                <Filter size={20} />
                                {lang === 'vi' ? 'Bộ lọc' : 'Filters'}
                                {hasActiveFilters && (
                                    <span className="w-5 h-5 bg-[#364fa1] text-white text-xs rounded-full flex items-center justify-center">
                                        {[selectedBrand, selectedCategory, selectedIndustry].filter(Boolean).length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Results Count */}
                        <div className="mb-6">
                            <p className="font-body text-gray-600">
                                {lang === 'vi'
                                    ? `Hiển thị ${filteredProducts.length} sản phẩm`
                                    : `Showing ${filteredProducts.length} products`}
                            </p>
                        </div>

                        {/* Products Grid */}
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/${lang}/products/${product.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#364fa1]/40"
                                >
                                    <div className="relative h-56 bg-gray-200 overflow-hidden">
                                        <Image
                                            src={product.images[0] || "/placeholder.svg"}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-heading font-bold text-gray-700">
                                            {product.brand.name}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white text-xs font-heading font-bold rounded-full mb-3">
                                            {product.category.name}
                                        </div>
                                        <h3 className="text-lg font-heading font-bold text-gray-900 mb-2 group-hover:text-[#364fa1] transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm font-body text-gray-500 mb-4">
                                            {product.modelNumber}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-body text-gray-600 font-semibold">{dict.products.contact}</span>
                                            <span className="flex items-center gap-1 text-[#364fa1] font-heading font-semibold text-sm group-hover:gap-2 transition-all">
                                                {dict.products.viewDetails}
                                                <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-2xl">
                                <p className="font-body text-gray-600 mb-4">
                                    {lang === 'vi'
                                        ? 'Không tìm thấy sản phẩm phù hợp'
                                        : 'No products found matching your criteria'}
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 bg-[#364fa1] text-white rounded-lg font-heading font-semibold hover:bg-[#2d4388] transition-colors"
                                >
                                    {lang === 'vi' ? 'Xóa bộ lọc' : 'Clear Filters'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Filter Drawer */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setShowMobileFilters(false)}
                        ></div>
                        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-heading font-bold text-lg text-gray-900">
                                    {lang === 'vi' ? 'Bộ lọc' : 'Filters'}
                                </h2>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <FilterContent />
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
