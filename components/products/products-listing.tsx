"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Filter, X, ChevronDown, ChevronRight } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { products, brands, categories, industries } from "@/lib/data"

interface ProductsListingProps {
    lang: Locale
    dict: Dictionary
}

export function ProductsListing({ lang, dict }: ProductsListingProps) {
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
    const [selectedSubBrand, setSelectedSubBrand] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [expandedBrands, setExpandedBrands] = useState<string[]>([])

    const filteredProducts = products.filter((product) => {
        if (selectedBrand && product.brand.id !== selectedBrand) return false
        if (selectedCategory && product.category.id !== selectedCategory) return false
        if (selectedIndustry && !product.industries.some((i) => i.id === selectedIndustry)) return false
        // Sub-brand filter - check if product brand has matching sub-brand
        if (selectedSubBrand) {
            const brand = brands.find(b => b.id === product.brand.id)
            if (!brand?.subBrands?.some(sb => sb.id === selectedSubBrand)) return false
        }
        return true
    })

    const clearFilters = () => {
        setSelectedBrand(null)
        setSelectedSubBrand(null)
        setSelectedCategory(null)
        setSelectedIndustry(null)
        setExpandedBrands([])
    }

    const toggleBrandExpand = (brandId: string) => {
        setExpandedBrands(prev =>
            prev.includes(brandId)
                ? prev.filter(id => id !== brandId)
                : [...prev, brandId]
        )
    }

    const handleBrandSelect = (brandId: string) => {
        if (selectedBrand === brandId) {
            setSelectedBrand(null)
            setSelectedSubBrand(null)
        } else {
            setSelectedBrand(brandId)
            setSelectedSubBrand(null)
            // Auto expand when selected
            if (!expandedBrands.includes(brandId)) {
                setExpandedBrands(prev => [...prev, brandId])
            }
        }
    }

    const handleSubBrandSelect = (subBrandId: string, brandId: string) => {
        if (selectedSubBrand === subBrandId) {
            setSelectedSubBrand(null)
        } else {
            setSelectedSubBrand(subBrandId)
            setSelectedBrand(brandId)
        }
    }

    const hasActiveFilters = selectedBrand || selectedSubBrand || selectedCategory || selectedIndustry

    // Check if logo file exists, fallback to placeholder
    const getBrandLogo = (logoPath: string) => {
        // Always try the specified path first, Next.js Image will handle errors
        return logoPath || '/placeholder-logo.svg'
    }

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Brand Filter with Logos */}
            <div>
                <h3 className="font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-[#364fa1] to-[#5a7ec9] rounded-full"></span>
                    {dict.products.filter.brand}
                </h3>
                <div className="space-y-2">
                    {brands.map((brand) => {
                        const isSelected = selectedBrand === brand.id
                        const isExpanded = expandedBrands.includes(brand.id)
                        const hasSubBrands = brand.subBrands && brand.subBrands.length > 0

                        return (
                            <div key={brand.id} className="rounded-xl overflow-hidden">
                                {/* Brand Card */}
                                <div
                                    className={`
                                        flex items-center gap-3 p-3 cursor-pointer transition-all duration-300
                                        ${isSelected
                                            ? 'bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white shadow-lg'
                                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                        }
                                    `}
                                >
                                    {/* Logo */}
                                    <div
                                        onClick={() => handleBrandSelect(brand.id)}
                                        className={`
                                            relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 
                                            ${isSelected ? 'bg-white/20' : 'bg-white'} 
                                            p-1.5 shadow-sm
                                        `}
                                    >
                                        <Image
                                            src={getBrandLogo(brand.logo)}
                                            alt={brand.name}
                                            fill
                                            className="object-contain"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement
                                                target.src = '/placeholder-logo.svg'
                                            }}
                                        />
                                    </div>

                                    {/* Brand Name */}
                                    <div
                                        onClick={() => handleBrandSelect(brand.id)}
                                        className="flex-1 min-w-0"
                                    >
                                        <p className={`font-heading font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                                            {brand.name}
                                        </p>
                                        {brand.subBrands && (
                                            <p className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                                                {brand.subBrands.length} {lang === 'vi' ? 'nhãn hàng' : 'sub-brands'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Expand Toggle */}
                                    {hasSubBrands && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleBrandExpand(brand.id)
                                            }}
                                            className={`
                                                p-1.5 rounded-lg transition-all duration-200
                                                ${isSelected
                                                    ? 'hover:bg-white/20 text-white'
                                                    : 'hover:bg-gray-200 text-gray-500'
                                                }
                                            `}
                                        >
                                            {isExpanded ? (
                                                <ChevronDown size={18} />
                                            ) : (
                                                <ChevronRight size={18} />
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Sub-brands List */}
                                {hasSubBrands && (
                                    <div
                                        className={`
                                            overflow-hidden transition-all duration-300 ease-in-out
                                            ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                                        `}
                                    >
                                        <div className="pl-3 pr-2 py-3 bg-gray-50/80 border-l-2 border-[#364fa1]/30 ml-5 space-y-1.5">
                                            {brand.subBrands?.map((subBrand) => {
                                                const isSubSelected = selectedSubBrand === subBrand.id

                                                return (
                                                    <button
                                                        key={subBrand.id}
                                                        onClick={() => handleSubBrandSelect(subBrand.id, brand.id)}
                                                        className={`
                                                            w-full text-left px-3 py-2.5 rounded-lg text-sm font-heading font-medium
                                                            transition-all duration-200 flex items-start gap-2
                                                            ${isSubSelected
                                                                ? 'bg-[#364fa1] text-white shadow-md'
                                                                : 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-gray-900'
                                                            }
                                                        `}
                                                    >
                                                        <span className={`
                                                            w-2 h-2 rounded-full flex-shrink-0 mt-1.5
                                                            ${isSubSelected ? 'bg-white' : 'bg-[#364fa1]/50'}
                                                        `}></span>
                                                        <span className="leading-snug">{subBrand.name}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Category Filter */}
            <div>
                <h3 className="font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-[#364fa1] to-[#5a7ec9] rounded-full"></span>
                    {dict.products.filter.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                            className={`
                                px-3 py-1.5 rounded-full text-sm font-body transition-all duration-200
                                ${selectedCategory === category.id
                                    ? 'bg-[#364fa1] text-white shadow-md'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }
                            `}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Industry Filter */}
            <div>
                <h3 className="font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-[#364fa1] to-[#5a7ec9] rounded-full"></span>
                    {dict.products.filter.industry}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {industries.map((industry) => (
                        <button
                            key={industry.id}
                            onClick={() => setSelectedIndustry(selectedIndustry === industry.id ? null : industry.id)}
                            className={`
                                px-3 py-1.5 rounded-full text-sm font-body transition-all duration-200
                                ${selectedIndustry === industry.id
                                    ? 'bg-[#364fa1] text-white shadow-md'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }
                            `}
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
                    className="w-full px-4 py-2.5 border-2 border-gray-300 text-gray-600 rounded-xl hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 font-heading font-semibold text-sm flex items-center justify-center gap-2"
                >
                    <X size={16} />
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
                    <h1 className="text-4xl font-heading font-black bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent mb-2 pb-2">
                        {dict.products.title}
                    </h1>
                    <p className="font-body text-gray-600">
                        {dict.products.subtitle}
                    </p>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                            <h2 className="font-heading font-bold text-lg text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
                                <Filter size={20} className="text-[#364fa1]" />
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
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-md font-heading font-semibold text-gray-700 hover:shadow-lg transition-shadow"
                            >
                                <Filter size={20} />
                                {lang === 'vi' ? 'Bộ lọc' : 'Filters'}
                                {hasActiveFilters && (
                                    <span className="w-5 h-5 bg-[#364fa1] text-white text-xs rounded-full flex items-center justify-center">
                                        {[selectedBrand, selectedSubBrand, selectedCategory, selectedIndustry].filter(Boolean).length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Active Filters Tags */}
                        {hasActiveFilters && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {selectedBrand && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#364fa1]/10 text-[#364fa1] rounded-full text-sm font-body">
                                        {brands.find(b => b.id === selectedBrand)?.name}
                                        <button onClick={() => { setSelectedBrand(null); setSelectedSubBrand(null); }} className="hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {selectedSubBrand && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#5a7ec9]/10 text-[#5a7ec9] rounded-full text-sm font-body">
                                        {brands.flatMap(b => b.subBrands || []).find(sb => sb.id === selectedSubBrand)?.name}
                                        <button onClick={() => setSelectedSubBrand(null)} className="hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {selectedCategory && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-body">
                                        {categories.find(c => c.id === selectedCategory)?.name}
                                        <button onClick={() => setSelectedCategory(null)} className="hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {selectedIndustry && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-body">
                                        {industries.find(i => i.id === selectedIndustry)?.name}
                                        <button onClick={() => setSelectedIndustry(null)} className="hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}

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
                                        {/* Brand badge with logo */}
                                        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                                            <div className="relative w-5 h-5">
                                                <Image
                                                    src={getBrandLogo(product.brand.logo)}
                                                    alt={product.brand.name}
                                                    fill
                                                    className="object-contain"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement
                                                        target.src = '/placeholder-logo.svg'
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs font-heading font-bold text-gray-700">
                                                {product.brand.name}
                                            </span>
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
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Filter size={32} className="text-gray-400" />
                                </div>
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
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowMobileFilters(false)}
                        ></div>
                        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
                                    <Filter size={20} className="text-[#364fa1]" />
                                    {lang === 'vi' ? 'Bộ lọc' : 'Filters'}
                                </h2>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
