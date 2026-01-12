"use client"

import { Layers, CircleDot, Droplets, Wind, Settings, Box } from "lucide-react"
import type { Locale } from "@/i18n/config"

interface ServicesNavigationProps {
    lang: Locale
    activeCategory: string
    onCategoryChange: (category: string) => void
}

const serviceCategories = [
    {
        id: 'all',
        labelVi: 'Tất cả',
        labelEn: 'All',
        icon: Layers,
    },
    {
        id: 'valves',
        labelVi: 'Van điều khiển',
        labelEn: 'Control Valves',
        icon: CircleDot,
    },
    {
        id: 'pumps',
        labelVi: 'Bơm công nghiệp',
        labelEn: 'Industrial Pumps',
        icon: Droplets,
    },
    {
        id: 'compressors',
        labelVi: 'Máy nén khí',
        labelEn: 'Compressors',
        icon: Wind,
    },
    {
        id: 'seals',
        labelVi: 'Seal cơ khí',
        labelEn: 'Mechanical Seals',
        icon: Settings,
    },
    {
        id: 'skid',
        labelVi: 'Gia công Skid',
        labelEn: 'Skid Fabrication',
        icon: Box,
    },
]

export function ServicesNavigation({ lang, activeCategory, onCategoryChange }: ServicesNavigationProps) {
    const isVi = lang === 'vi'

    return (
        <div className="w-full bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {serviceCategories.map((category) => {
                        const Icon = category.icon
                        const isActive = activeCategory === category.id

                        return (
                            <button
                                key={category.id}
                                onClick={() => onCategoryChange(category.id)}
                                className={`
                                    flex items-center gap-2 px-5 py-2.5 rounded-full
                                    font-svn-avo-bold text-sm transition-all duration-300
                                    ${isActive
                                        ? 'bg-[#2B54A7] text-white shadow-md'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }
                                `}
                            >
                                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500'} />
                                <span>{isVi ? category.labelVi : category.labelEn}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
