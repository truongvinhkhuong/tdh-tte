"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Calendar, Filter, X, Package, Clock, ChevronDown, SlidersHorizontal } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { projects, industries, products } from "@/lib/data"

interface ProjectsListingProps {
    lang: Locale
    dict: Dictionary
}

type SortOption = 'newest' | 'oldest'

export function ProjectsListing({ lang, dict }: ProjectsListingProps) {
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
    const [selectedYear, setSelectedYear] = useState<number | null>(null)
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

    // Get unique years from projects
    const availableYears = useMemo(() => {
        const years = [...new Set(projects.map(p => p.completionYear))].sort((a, b) => b - a)
        return years
    }, [])

    // Get products that are used in projects
    const projectProducts = useMemo(() => {
        const productIds = new Set<string>()
        projects.forEach(p => {
            p.products?.forEach(prod => productIds.add(prod.id))
        })
        return products.filter(p => productIds.has(p.id))
    }, [])

    // Filter and sort projects
    const filteredProjects = useMemo(() => {
        let result = [...projects]

        if (selectedIndustry) {
            result = result.filter(p => p.industry.id === selectedIndustry)
        }

        if (selectedYear) {
            result = result.filter(p => p.completionYear === selectedYear)
        }

        if (selectedProduct) {
            result = result.filter(p => p.products?.some(prod => prod.id === selectedProduct))
        }

        result.sort((a, b) => {
            if (sortBy === 'newest') {
                return b.completionYear - a.completionYear
            } else {
                return a.completionYear - b.completionYear
            }
        })

        return result
    }, [selectedIndustry, selectedYear, selectedProduct, sortBy])

    const clearFilters = () => {
        setSelectedIndustry(null)
        setSelectedYear(null)
        setSelectedProduct(null)
    }

    const hasActiveFilters = selectedIndustry || selectedYear || selectedProduct
    const activeFilterCount = [selectedIndustry, selectedYear, selectedProduct].filter(Boolean).length

    const toggleDropdown = (name: string) => {
        setActiveDropdown(activeDropdown === name ? null : name)
    }

    // Filter Dropdown Component
    const FilterDropdown = ({ 
        name, 
        label, 
        icon: Icon, 
        value, 
        options, 
        onSelect 
    }: { 
        name: string
        label: string
        icon: React.ElementType
        value: string | number | null
        options: { id: string | number; label: string }[]
        onSelect: (val: string | number | null) => void 
    }) => {
        const isOpen = activeDropdown === name
        const selectedOption = options.find(o => o.id === value)

        return (
            <div className="relative">
                <button
                    onClick={() => toggleDropdown(name)}
                    className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-svn-avo-bold
                        transition-all duration-200 border
                        ${value 
                            ? 'bg-[#364fa1] text-white border-[#364fa1]' 
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#364fa1]/50 hover:bg-gray-50'
                        }
                    `}
                >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{selectedOption?.label || label}</span>
                    <span className="sm:hidden">{selectedOption?.label || label}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setActiveDropdown(null)}
                        />
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 max-h-64 overflow-y-auto">
                            <button
                                onClick={() => { onSelect(null); setActiveDropdown(null); }}
                                className={`w-full text-left px-4 py-2.5 text-sm font-svn-avo-bold transition-colors ${!value ? 'bg-[#364fa1]/10 text-[#364fa1]' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                {lang === 'vi' ? 'Tất cả' : 'All'}
                            </button>
                            {options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => { onSelect(option.id); setActiveDropdown(null); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-svn-avo-bold transition-colors ${value === option.id ? 'bg-[#364fa1]/10 text-[#364fa1]' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        )
    }

    return (
        <section className="py-8 md:py-12 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop Filter Bar */}
                <div className="hidden md:flex items-center justify-between gap-4 mb-8 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 flex-wrap">
                        <FilterDropdown
                            name="year"
                            label={lang === 'vi' ? 'Năm' : 'Year'}
                            icon={Calendar}
                            value={selectedYear}
                            options={availableYears.map(y => ({ id: y, label: String(y) }))}
                            onSelect={(val) => setSelectedYear(val as number | null)}
                        />
                        <FilterDropdown
                            name="industry"
                            label={lang === 'vi' ? 'Ngành' : 'Industry'}
                            icon={Filter}
                            value={selectedIndustry}
                            options={industries.map(i => ({ id: i.id, label: i.name }))}
                            onSelect={(val) => setSelectedIndustry(val as string | null)}
                        />
                        <FilterDropdown
                            name="product"
                            label={lang === 'vi' ? 'Sản phẩm' : 'Product'}
                            icon={Package}
                            value={selectedProduct}
                            options={projectProducts.map(p => ({ id: p.id, label: p.name }))}
                            onSelect={(val) => setSelectedProduct(val as string | null)}
                        />

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-svn-avo-bold"
                            >
                                <X size={14} />
                                {lang === 'vi' ? 'Xóa' : 'Clear'}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                        <Clock size={16} className="text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="text-sm font-svn-avo-bold text-gray-700 focus:outline-none bg-transparent cursor-pointer"
                        >
                            <option value="newest">{lang === 'vi' ? 'Mới nhất' : 'Newest'}</option>
                            <option value="oldest">{lang === 'vi' ? 'Cũ nhất' : 'Oldest'}</option>
                        </select>
                    </div>
                </div>

                {/* Mobile Filter Bar */}
                <div className="md:hidden mb-6">
                    <div className="flex items-center justify-between gap-3">
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 font-svn-avo-bold text-gray-700"
                        >
                            <SlidersHorizontal size={18} />
                            <span>{lang === 'vi' ? 'Bộ lọc' : 'Filters'}</span>
                            {activeFilterCount > 0 && (
                                <span className="w-5 h-5 bg-[#364fa1] text-white text-xs rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 text-sm font-svn-avo-bold text-gray-700 focus:outline-none"
                        >
                            <option value="newest">{lang === 'vi' ? 'Mới nhất' : 'Newest'}</option>
                            <option value="oldest">{lang === 'vi' ? 'Cũ nhất' : 'Oldest'}</option>
                        </select>
                    </div>

                    {/* Active Filters Pills - Mobile */}
                    {hasActiveFilters && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {selectedYear && (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#364fa1] text-white rounded-full text-xs font-svn-avo-bold">
                                    {selectedYear}
                                    <button onClick={() => setSelectedYear(null)}><X size={12} /></button>
                                </span>
                            )}
                            {selectedIndustry && (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#364fa1] text-white rounded-full text-xs font-svn-avo-bold">
                                    {industries.find(i => i.id === selectedIndustry)?.name}
                                    <button onClick={() => setSelectedIndustry(null)}><X size={12} /></button>
                                </span>
                            )}
                            {selectedProduct && (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#364fa1] text-white rounded-full text-xs font-svn-avo-bold truncate max-w-[200px]">
                                    {products.find(p => p.id === selectedProduct)?.name}
                                    <button onClick={() => setSelectedProduct(null)}><X size={12} /></button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-4 md:mb-6">
                    <p className="text-sm font-svn-avo-bold text-gray-600">
                        {lang === 'vi'
                            ? `${filteredProjects.length} dự án`
                            : `${filteredProjects.length} projects`}
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    {filteredProjects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/${lang}/projects/${project.slug}`}
                            className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-[4/5] sm:aspect-[3/4]"
                        >
                            <Image
                                src={project.heroImage || "/placeholder.svg"}
                                alt={project.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300"></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 text-white">
                                <div className="flex items-center gap-2 mb-2 md:mb-3">
                                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-svn-avo-bold rounded-full">
                                        {project.industry.name}
                                    </span>
                                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-svn-avo-bold rounded-full">
                                        {project.completionYear}
                                    </span>
                                </div>

                                <h3 className="text-lg md:text-xl lg:text-2xl font-svn-avo-extra-bold mb-2 group-hover:text-[#a8bcdf] transition-colors line-clamp-2">
                                    {project.title}
                                </h3>

                                <p className="text-xs md:text-sm font-svn-avo-bold text-gray-300 line-clamp-2 mb-3">
                                    {project.shortDescription}
                                </p>

                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        {project.location.split(',')[0]}
                                    </span>
                                    {project.products && project.products.length > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Package size={12} />
                                            {project.products.length}
                                        </span>
                                    )}
                                </div>

                                {/* Hover Arrow */}
                                <div className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                    <ArrowRight className="text-white" size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-12 md:py-16 bg-white rounded-2xl">
                        <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Filter size={28} className="text-gray-400" />
                        </div>
                        <p className="font-svn-avo-bold text-gray-800 mb-4">
                            {lang === 'vi'
                                ? 'Không tìm thấy dự án phù hợp'
                                : 'No projects found'}
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-5 py-2 bg-[#364fa1] text-white rounded-lg font-svn-avo-bold hover:bg-[#2d4388] transition-colors text-sm"
                        >
                            {lang === 'vi' ? 'Xóa bộ lọc' : 'Clear Filters'}
                        </button>
                    </div>
                )}

                {/* Mobile Filter Drawer */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowMobileFilters(false)}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
                            {/* Drawer Handle */}
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-svn-avo-extra-bold text-xl text-gray-900">
                                    {lang === 'vi' ? 'Bộ lọc' : 'Filters'}
                                </h2>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Year Filter */}
                                <div>
                                    <h3 className="font-svn-avo-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                                        <Calendar size={16} className="text-[#364fa1]" />
                                        {lang === 'vi' ? 'Năm hoàn thành' : 'Year'}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedYear(null)}
                                            className={`px-4 py-2 rounded-full text-sm font-svn-avo-bold transition-all ${!selectedYear ? 'bg-[#364fa1] text-white' : 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {lang === 'vi' ? 'Tất cả' : 'All'}
                                        </button>
                                        {availableYears.map((year) => (
                                            <button
                                                key={year}
                                                onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                                                className={`px-4 py-2 rounded-full text-sm font-svn-avo-bold transition-all ${selectedYear === year ? 'bg-[#364fa1] text-white' : 'bg-gray-100 text-gray-700'}`}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Industry Filter */}
                                <div>
                                    <h3 className="font-svn-avo-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                                        <Filter size={16} className="text-[#364fa1]" />
                                        {lang === 'vi' ? 'Ngành' : 'Industry'}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedIndustry(null)}
                                            className={`px-4 py-2 rounded-full text-sm font-svn-avo-bold transition-all ${!selectedIndustry ? 'bg-[#364fa1] text-white' : 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {lang === 'vi' ? 'Tất cả' : 'All'}
                                        </button>
                                        {industries.map((industry) => (
                                            <button
                                                key={industry.id}
                                                onClick={() => setSelectedIndustry(selectedIndustry === industry.id ? null : industry.id)}
                                                className={`px-4 py-2 rounded-full text-sm font-svn-avo-bold transition-all ${selectedIndustry === industry.id ? 'bg-[#364fa1] text-white' : 'bg-gray-100 text-gray-700'}`}
                                            >
                                                {industry.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Product Filter */}
                                <div>
                                    <h3 className="font-svn-avo-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                                        <Package size={16} className="text-[#364fa1]" />
                                        {lang === 'vi' ? 'Sản phẩm' : 'Product'}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedProduct(null)}
                                            className={`px-4 py-2 rounded-full text-sm font-svn-avo-bold transition-all ${!selectedProduct ? 'bg-[#364fa1] text-white' : 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {lang === 'vi' ? 'Tất cả' : 'All'}
                                        </button>
                                        {projectProducts.map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                                                className={`px-4 py-2 rounded-full text-sm font-svn-avo-bold transition-all ${selectedProduct === product.id ? 'bg-[#364fa1] text-white' : 'bg-gray-100 text-gray-700'}`}
                                            >
                                                {product.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-svn-avo-bold hover:border-red-500 hover:text-red-500 transition-colors"
                                    >
                                        {lang === 'vi' ? 'Xóa bộ lọc' : 'Clear'}
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="flex-1 px-4 py-3 bg-[#364fa1] text-white rounded-xl font-svn-avo-bold hover:bg-[#2d4388] transition-colors"
                                >
                                    {lang === 'vi' ? `Xem ${filteredProjects.length} dự án` : `View ${filteredProjects.length} projects`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </section>
    )
}
