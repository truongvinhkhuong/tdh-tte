"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Filter, X, ChevronDown, ChevronRight } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import type { Product, Brand, ProductCategory, Industry } from "@tte/shared-types"

interface ProductsListingProps {
    lang: Locale
    dict: Dictionary
    products: Product[]
    brands: Brand[]
    categories: ProductCategory[]
    industries: Industry[]
}

export function ProductsListing({ lang, dict, products, brands, categories, industries }: ProductsListingProps) {
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
        <div className="space-y-4">
            {/* Category & Industry - Compact Select Style */}
            <div className="space-y-3">
                {/* Category Select */}
                <div>
                    <label className="font-svn-avo-bold text-xs text-gray-500 mb-1.5 block">
                        {dict.products.filter.category}
                    </label>
                    <select
                        value={selectedCategory || ''}
                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-svn-avo-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#364fa1]/30 focus:border-[#364fa1] transition-all cursor-pointer appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                    >
                        <option value="">{lang === 'vi' ? 'Tất cả danh mục' : 'All categories'}</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Industry Select */}
                <div>
                    <label className="font-svn-avo-bold text-xs text-gray-500 mb-1.5 block">
                        {dict.products.filter.industry}
                    </label>
                    <select
                        value={selectedIndustry || ''}
                        onChange={(e) => setSelectedIndustry(e.target.value || null)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-svn-avo-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#364fa1]/30 focus:border-[#364fa1] transition-all cursor-pointer appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                    >
                        <option value="">{lang === 'vi' ? 'Tất cả ngành' : 'All industries'}</option>
                        {industries.map((industry) => (
                            <option key={industry.id} value={industry.id}>
                                {industry.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Brand Filter with Logos */}
            <div>
                <label className="font-svn-avo-bold text-xs text-gray-500 mb-2 block">
                    {dict.products.filter.brand}
                </label>
                <div className="space-y-2">
                    {brands.map((brand) => {
                        const isSelected = selectedBrand === brand.id
                        const isExpanded = expandedBrands.includes(brand.id)
                        const hasSubBrands = brand.subBrands && brand.subBrands.length > 0

                        return (
                            <div key={brand.id} className="rounded-xl overflow-hidden border border-gray-200 hover:border-[#364fa1]/50 transition-colors">
                                {/* Brand Card */}
                                <div
                                    onClick={() => handleBrandSelect(brand.id)}
                                    className={`
                                        flex items-center gap-3 p-3 cursor-pointer transition-all duration-300
                                        ${isSelected
                                            ? 'bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white'
                                            : 'bg-white hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                >
                                    {/* Logo */}
                                    <div
                                        className={`
                                            relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 
                                            ${isSelected ? 'bg-white' : 'bg-gray-50 border border-gray-100'} 
                                            p-1.5
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
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-svn-avo-bold text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                            {brand.name}
                                        </p>
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
                                                    : 'hover:bg-gray-100 text-gray-400'
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
                                        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {brand.subBrands?.map((subBrand) => {
                                                    const isSubSelected = selectedSubBrand === subBrand.id

                                                    return (
                                                        <button
                                                            key={subBrand.id}
                                                            onClick={() => handleSubBrandSelect(subBrand.id, brand.id)}
                                                            className={`
                                                                text-left px-2.5 py-2 rounded-lg text-xs font-svn-avo-bold
                                                                transition-all duration-200
                                                                ${isSubSelected
                                                                    ? 'bg-[#364fa1] text-white'
                                                                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                                                                }
                                                            `}
                                                        >
                                                            {subBrand.name}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="w-full px-3 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 font-svn-avo-bold text-xs flex items-center justify-center gap-1.5"
                >
                    <X size={14} />
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
                    <h1 className="text-4xl md:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent mb-4 pb-2 leading-relaxed">
                        {dict.products.title}
                    </h1>
                    <p className="font-svn-avo-bold text-gray-800">
                        {dict.products.subtitle}
                    </p>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                            <h2 className="font-svn-avo-bold text-lg text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
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
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-md font-svn-avo-bold text-gray-700 hover:shadow-lg transition-shadow"
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
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#364fa1]/10 text-[#364fa1] rounded-full text-sm font-svn-avo-bold">
                                        {brands.find(b => b.id === selectedBrand)?.name}
                                        <button onClick={() => { setSelectedBrand(null); setSelectedSubBrand(null); }} className="hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {selectedSubBrand && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#5a7ec9]/10 text-[#5a7ec9] rounded-full text-sm font-svn-avo-bold">
                                        {brands.flatMap(b => b.subBrands || []).find(sb => sb.id === selectedSubBrand)?.name}
                                        <button onClick={() => setSelectedSubBrand(null)} className="hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {selectedCategory && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-svn-avo-bold">
                                        {categories.find(c => c.id === selectedCategory)?.name}
                                        <button onClick={() => setSelectedCategory(null)} className="hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {selectedIndustry && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-svn-avo-bold">
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
                            <p className="font-svn-avo-bold text-gray-800">
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
                                            <span className="text-xs font-svn-avo-bold text-gray-700">
                                                {product.brand.name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white text-xs font-svn-avo-bold rounded-full mb-3">
                                            {product.category.name}
                                        </div>
                                        <h3 className="text-lg font-svn-avo-extra-bold text-gray-900 mb-2 group-hover:text-[#364fa1] transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm font-svn-avo-bold text-gray-800 mb-4">
                                            {product.modelNumber}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-svn-avo-bold text-gray-800 font-semibold">{dict.products.contact}</span>
                                            <span className="flex items-center gap-1 text-[#364fa1] font-svn-avo-bold text-sm group-hover:gap-2 transition-all">
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
                                <p className="font-svn-avo-bold text-gray-800 mb-4">
                                    {lang === 'vi'
                                        ? 'Không tìm thấy sản phẩm phù hợp'
                                        : 'No products found matching your criteria'}
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 bg-[#364fa1] text-white rounded-lg font-svn-avo-bold hover:bg-[#2d4388] transition-colors"
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
                        <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-80 bg-white p-6 overflow-y-auto shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-svn-avo-bold text-lg text-gray-900 flex items-center gap-2">
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
