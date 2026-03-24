"use client"

import { useState, useMemo, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, SlidersHorizontal, X, ChevronDown, ChevronRight, Search } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import type { Product, Brand, ProductCategory, Industry } from "@tte/shared-types"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"

interface ProductsListingProps {
    lang: Locale
    dict: Dictionary
    products: Product[]
    brands: Brand[]
    categories: ProductCategory[]
    industries: Industry[]
}

const ITEMS_PER_PAGE = 9

type SortOption = 'default' | 'name-az' | 'name-za' | 'newest' | 'brand'

export function ProductsListing({ lang, dict, products, brands, categories, industries }: ProductsListingProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('default')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
    const [selectedSubBrand, setSelectedSubBrand] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [expandedBrands, setExpandedBrands] = useState<string[]>([])
    const gridRef = useRef<HTMLDivElement>(null)

    // ========== Data Pipeline: search → filter → sort → paginate ==========

    // 1. Search
    const searchedProducts = useMemo(() => {
        if (!searchQuery.trim()) return products
        const q = searchQuery.toLowerCase()
        return products.filter((product) =>
            product.name.toLowerCase().includes(q) ||
            product.modelNumber.toLowerCase().includes(q) ||
            product.brand.name.toLowerCase().includes(q)
        )
    }, [products, searchQuery])

    // 2. Filter
    const filteredProducts = useMemo(() => {
        return searchedProducts.filter((product) => {
            if (selectedBrand && product.brand.id !== selectedBrand) return false
            if (selectedCategory && product.category.id !== selectedCategory) return false
            if (selectedIndustry && !product.industries.some((i) => i.id === selectedIndustry)) return false
            if (selectedSubBrand) {
                const brand = brands.find(b => b.id === product.brand.id)
                if (!brand?.subBrands?.some(sb => sb.id === selectedSubBrand)) return false
            }
            return true
        })
    }, [searchedProducts, selectedBrand, selectedSubBrand, selectedCategory, selectedIndustry, brands])

    // 3. Sort
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts]
        switch (sortBy) {
            case 'name-az':
                return sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
            case 'name-za':
                return sorted.sort((a, b) => b.name.localeCompare(a.name, 'vi'))
            case 'newest':
                return sorted.sort((a, b) =>
                    new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
                )
            case 'brand':
                return sorted.sort((a, b) => a.brand.name.localeCompare(b.brand.name, 'vi'))
            default:
                return sorted
        }
    }, [filteredProducts, sortBy])

    // 4. Paginate
    const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE)
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return sortedProducts.slice(start, start + ITEMS_PER_PAGE)
    }, [sortedProducts, currentPage])

    // Product counts per filter option (based on searchedProducts before category/industry filter)
    const categoryProductCounts = useMemo(() => {
        const counts = new Map<string, number>()
        const base = searchedProducts.filter(p => {
            if (selectedBrand && p.brand.id !== selectedBrand) return false
            if (selectedIndustry && !p.industries.some(i => i.id === selectedIndustry)) return false
            return true
        })
        for (const p of base) {
            counts.set(p.category.id, (counts.get(p.category.id) || 0) + 1)
        }
        return counts
    }, [searchedProducts, selectedBrand, selectedIndustry])

    const industryProductCounts = useMemo(() => {
        const counts = new Map<string, number>()
        const base = searchedProducts.filter(p => {
            if (selectedBrand && p.brand.id !== selectedBrand) return false
            if (selectedCategory && p.category.id !== selectedCategory) return false
            return true
        })
        for (const p of base) {
            for (const ind of p.industries) {
                counts.set(ind.id, (counts.get(ind.id) || 0) + 1)
            }
        }
        return counts
    }, [searchedProducts, selectedBrand, selectedCategory])

    // ========== Handlers ==========

    const resetPage = () => setCurrentPage(1)

    const clearFilters = () => {
        setSelectedBrand(null)
        setSelectedSubBrand(null)
        setSelectedCategory(null)
        setSelectedIndustry(null)
        setExpandedBrands([])
        setSearchQuery('')
        resetPage()
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
            if (!expandedBrands.includes(brandId)) {
                setExpandedBrands(prev => [...prev, brandId])
            }
        }
        resetPage()
    }

    const handleSubBrandSelect = (subBrandId: string, brandId: string) => {
        if (selectedSubBrand === subBrandId) {
            setSelectedSubBrand(null)
        } else {
            setSelectedSubBrand(subBrandId)
            setSelectedBrand(brandId)
        }
        resetPage()
    }

    const hasActiveFilters = selectedBrand || selectedSubBrand || selectedCategory || selectedIndustry || searchQuery.trim()

    const getBrandLogo = (logoPath: string) => logoPath || '/placeholder-logo.svg'

    // ========== Pagination helpers ==========

    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = []
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (currentPage > 3) pages.push('ellipsis')
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i)
            }
            if (currentPage < totalPages - 2) pages.push('ellipsis')
            pages.push(totalPages)
        }
        return pages
    }

    // ========== Filter Sidebar Content ==========

    const FilterContent = () => (
        <div className="space-y-4">
            {/* Category Filter */}
            <div>
                <label className="font-svn-avo-bold text-xs text-gray-500 mb-1.5 block">
                    {dict.products.filter.category}
                </label>
                <Select
                    value={selectedCategory || 'all'}
                    onValueChange={(val) => { setSelectedCategory(val === 'all' ? null : val); resetPage() }}
                >
                    <SelectTrigger className="w-full text-sm font-svn-avo-bold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{dict.products.allCategories}</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name} ({categoryProductCounts.get(category.id) || 0})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Industry Filter */}
            <div>
                <label className="font-svn-avo-bold text-xs text-gray-500 mb-1.5 block">
                    {dict.products.filter.industry}
                </label>
                <Select
                    value={selectedIndustry || 'all'}
                    onValueChange={(val) => { setSelectedIndustry(val === 'all' ? null : val); resetPage() }}
                >
                    <SelectTrigger className="w-full text-sm font-svn-avo-bold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{dict.products.allIndustries}</SelectItem>
                        {industries.map((industry) => (
                            <SelectItem key={industry.id} value={industry.id}>
                                {industry.name} ({industryProductCounts.get(industry.id) || 0})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

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
                                <div
                                    onClick={() => handleBrandSelect(brand.id)}
                                    className={`
                                        flex items-center gap-3 p-3 cursor-pointer transition-all duration-200
                                        ${isSelected
                                            ? 'bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white'
                                            : 'bg-white hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                >
                                    <div className={`relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ${isSelected ? 'bg-white' : 'bg-gray-50 border border-gray-100'} p-1.5`}>
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
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-svn-avo-bold text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                            {brand.name}
                                        </p>
                                    </div>
                                    {hasSubBrands && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleBrandExpand(brand.id) }}
                                            className={`p-1.5 rounded-lg transition-all duration-200 ${isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-gray-400'}`}
                                        >
                                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </button>
                                    )}
                                </div>

                                {hasSubBrands && (
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {brand.subBrands?.map((subBrand) => {
                                                    const isSubSelected = selectedSubBrand === subBrand.id
                                                    return (
                                                        <button
                                                            key={subBrand.id}
                                                            onClick={() => handleSubBrandSelect(subBrand.id, brand.id)}
                                                            className={`text-left px-2.5 py-2 rounded-lg text-xs font-svn-avo-bold transition-all duration-200 ${isSubSelected ? 'bg-[#364fa1] text-white' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'}`}
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
                    {dict.products.clearFilters}
                </button>
            )}
        </div>
    )

    return (
        <section className="py-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/${lang}`} className="font-svn-avo-bold text-sm text-gray-500 hover:text-[#364fa1]">
                                {dict.breadcrumb.home}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-svn-avo-bold text-sm text-gray-900">
                                {dict.breadcrumb.products}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Compact Header */}
                <h1 className="text-2xl md:text-3xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent mb-5 pb-1">
                    {dict.products.title}
                </h1>

                {/* Search + Sort Row */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder={dict.products.search}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); resetPage() }}
                            className="pl-10 h-10 font-svn-avo-bold text-sm bg-white border-gray-200 focus-visible:border-[#364fa1] focus-visible:ring-[#364fa1]/20"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => { setSearchQuery(''); resetPage() }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <Select value={sortBy} onValueChange={(val) => { setSortBy(val as SortOption); resetPage() }}>
                        <SelectTrigger className="w-full sm:w-48 h-10 font-svn-avo-bold text-sm bg-white border-gray-200">
                            <SelectValue placeholder={dict.products.sort.label} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">{dict.products.sort.default}</SelectItem>
                            <SelectItem value="name-az">{dict.products.sort.nameAZ}</SelectItem>
                            <SelectItem value="name-za">{dict.products.sort.nameZA}</SelectItem>
                            <SelectItem value="newest">{dict.products.sort.newest}</SelectItem>
                            <SelectItem value="brand">{dict.products.sort.brand}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-8" ref={gridRef}>
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                            <h2 className="font-svn-avo-bold text-base text-gray-900 mb-5 pb-3 border-b border-gray-200 flex items-center gap-2">
                                <SlidersHorizontal size={18} className="text-[#364fa1]" />
                                {dict.products.filters}
                            </h2>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Button */}
                        <div className="lg:hidden mb-4">
                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm border border-gray-200 font-svn-avo-bold text-gray-700 hover:shadow-md transition-shadow text-sm"
                            >
                                <SlidersHorizontal size={18} />
                                {dict.products.filters}
                                {hasActiveFilters && (
                                    <span className="w-5 h-5 bg-[#364fa1] text-white text-xs rounded-full flex items-center justify-center">
                                        {[selectedBrand, selectedSubBrand, selectedCategory, selectedIndustry].filter(Boolean).length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Active Filters Tags */}
                        {(selectedBrand || selectedSubBrand || selectedCategory || selectedIndustry) && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {selectedBrand && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#364fa1]/10 text-[#364fa1] rounded-full text-sm font-svn-avo-bold">
                                        {brands.find(b => b.id === selectedBrand)?.name}
                                        <button onClick={() => { setSelectedBrand(null); setSelectedSubBrand(null); resetPage() }} className="hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {selectedSubBrand && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#5a7ec9]/10 text-[#5a7ec9] rounded-full text-sm font-svn-avo-bold">
                                        {brands.flatMap(b => b.subBrands || []).find(sb => sb.id === selectedSubBrand)?.name}
                                        <button onClick={() => { setSelectedSubBrand(null); resetPage() }} className="hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {selectedCategory && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#364fa1]/10 text-[#364fa1] rounded-full text-sm font-svn-avo-bold">
                                        {categories.find(c => c.id === selectedCategory)?.name}
                                        <button onClick={() => { setSelectedCategory(null); resetPage() }} className="hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {selectedIndustry && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#5a7ec9]/10 text-[#5a7ec9] rounded-full text-sm font-svn-avo-bold">
                                        {industries.find(i => i.id === selectedIndustry)?.name}
                                        <button onClick={() => { setSelectedIndustry(null); resetPage() }} className="hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Results Count */}
                        <div className="mb-4">
                            <p className="font-svn-avo-bold text-sm text-gray-600">
                                {searchQuery.trim() ? (
                                    <>
                                        {sortedProducts.length} {dict.products.resultsFor} &ldquo;{searchQuery.trim()}&rdquo;
                                    </>
                                ) : (
                                    <>
                                        {dict.products.showing} {Math.min(paginatedProducts.length, sortedProducts.length)}{dict.products.of}{sortedProducts.length} {dict.products.product}
                                    </>
                                )}
                            </p>
                        </div>

                        {/* Products Grid */}
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {paginatedProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/${lang}/products/${product.slug}`}
                                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 border border-gray-100 hover:border-[#364fa1]/30"
                                >
                                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                                        <Image
                                            src={product.images[0] || "/placeholder.svg"}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {/* Brand badge */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                                            <div className="relative w-4 h-4">
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

                                    <div className="p-4">
                                        {/* Category + Model Number row */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="inline-block px-2 py-0.5 bg-[#364fa1] text-white text-[11px] font-svn-avo-bold rounded-full">
                                                {product.category.name}
                                            </span>
                                            <span className="text-xs font-svn-avo-bold text-gray-400">
                                                {product.modelNumber}
                                            </span>
                                        </div>

                                        {/* Product Name */}
                                        <h3 className="text-base font-svn-avo-extra-bold text-gray-900 mb-1.5 group-hover:text-[#364fa1] transition-colors line-clamp-2 leading-snug">
                                            {product.name}
                                        </h3>

                                        {/* Short Description */}
                                        {product.shortDescription && (
                                            <p className="text-xs font-svn-avo-bold text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                                                {product.shortDescription}
                                            </p>
                                        )}

                                        {/* CTA */}
                                        <div className="flex justify-end items-center pt-2 border-t border-gray-100">
                                            <span className="flex items-center gap-1 text-[#364fa1] font-svn-avo-bold text-sm group-hover:gap-2 transition-all">
                                                {dict.products.viewDetails}
                                                <ArrowRight size={15} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Empty State */}
                        {sortedProducts.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                                <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Search size={28} className="text-gray-400" />
                                </div>
                                <p className="font-svn-avo-bold text-gray-600 mb-4">
                                    {dict.products.noResults}
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-5 py-2 bg-[#364fa1] text-white rounded-lg font-svn-avo-bold text-sm hover:bg-[#2d4388] transition-colors"
                                >
                                    {dict.products.clearFilters}
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                                className={`cursor-pointer font-svn-avo-bold text-sm ${currentPage === 1 ? 'pointer-events-none opacity-40' : ''}`}
                                            >
                                                {dict.products.pagination.previous}
                                            </PaginationPrevious>
                                        </PaginationItem>

                                        {getPageNumbers().map((page, idx) => (
                                            <PaginationItem key={idx}>
                                                {page === 'ellipsis' ? (
                                                    <PaginationEllipsis />
                                                ) : (
                                                    <PaginationLink
                                                        onClick={() => handlePageChange(page)}
                                                        isActive={currentPage === page}
                                                        className="cursor-pointer font-svn-avo-bold text-sm"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                )}
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                                className={`cursor-pointer font-svn-avo-bold text-sm ${currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}`}
                                            >
                                                {dict.products.pagination.next}
                                            </PaginationNext>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
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
                                    <SlidersHorizontal size={20} className="text-[#364fa1]" />
                                    {dict.products.filters}
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
