"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"

// Customer logos from /public/customer folder
const customerLogos = [
    { id: '1', name: 'PetroVietnam', logo: '/customer/01-Petro.jpg' },
    { id: '2', name: 'PVEP', logo: '/customer/02-PVEP-1.jpg' },
    { id: '3', name: 'PTSC', logo: '/customer/03-PTSC.jpg' },
    { id: '4', name: 'PV Gas', logo: '/customer/06-GAS.jpg' },
    { id: '5', name: 'PVCFC', logo: '/customer/08-PVCFC-1.jpg' },
    { id: '6', name: 'Vietsovpetro', logo: '/customer/10-VIETSOPETRO.jpg' },
    { id: '7', name: 'EVN', logo: '/customer/17-evn.jpg' },
    { id: '8', name: 'PMPC', logo: '/customer/17-pmpc.jpg' },
    { id: '9', name: 'Mekong', logo: '/customer/20-mekong.jpg' },
    { id: '10', name: 'POSCO', logo: '/customer/22-posco.jpg' },
    { id: '11', name: 'Linde', logo: '/customer/23-linde.jpg' },
    { id: '12', name: 'POSCO E&C', logo: '/customer/25-posco.jpg' },
    { id: '13', name: 'Messer', logo: '/customer/32-messer.jpg' },
]

interface CustomersSectionProps {
    lang: Locale
    dict: Dictionary
    variant?: 'home' | 'about'
}

export function CustomersSection({ lang, dict, variant = 'home' }: CustomersSectionProps) {
    const [isPaused, setIsPaused] = useState(false)

    // Double the logos array for seamless infinite scroll
    const duplicatedLogos = [...customerLogos, ...customerLogos]

    // Access customers translations with fallback
    const customers = (dict as Record<string, unknown>).customers as {
        title?: string;
        subtitle?: string;
        projects?: string;
        years?: string;
        satisfaction?: string;
    } | undefined

    return (
        <section className={`py-16 ${variant === 'about' ? 'bg-white' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-block">
                        <h2 className="text-4xl md:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2">
                            {customers?.title || 'Khách hàng tiêu biểu'}
                        </h2>
                    </div>
                    <p className="text-lg font-svn-avo-bold text-gray-800 max-w-2xl mx-auto mt-8">
                        {customers?.subtitle || 'Chúng tôi tự hào được hợp tác với các doanh nghiệp hàng đầu trong ngành'}
                    </p>
                </div>

                {/* Auto-scrolling Logo Slider */}
                <div
                    className="relative overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Gradient Fade Left */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>

                    {/* Gradient Fade Right */}
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                    {/* Scrolling Container */}
                    <div
                        className={`flex gap-8 ${isPaused ? 'animation-paused' : ''}`}
                        style={{
                            animation: 'scroll 30s linear infinite',
                            width: 'fit-content',
                        }}
                    >
                        {duplicatedLogos.map((customer, index) => (
                            <div
                                key={`${customer.id}-${index}`}
                                className="flex-shrink-0"
                            >
                                <div className="w-40 h-28 md:w-56 md:h-36 lg:w-64 lg:h-40 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex items-center justify-center p-4 md:p-5 border border-gray-100 hover:border-[#364fa1]/40 hover:scale-110 cursor-pointer">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={customer.logo}
                                            alt={customer.name}
                                            fill
                                            className="object-contain transition-transform duration-300"
                                            sizes="(max-width: 768px) 160px, (max-width: 1024px) 224px, 256px"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats or Trust indicators */}
                <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-svn-avo-extra-bold text-[#364fa1]">500+</div>
                        <div className="text-gray-800 font-svn-avo-bold text-sm mt-1">{customers?.projects || 'Dự án thành công'}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-svn-avo-extra-bold text-[#364fa1]">30+</div>
                        <div className="text-gray-800 font-svn-avo-bold text-sm mt-1">{customers?.years || 'Năm kinh nghiệm'}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-svn-avo-extra-bold text-[#364fa1]">100%</div>
                        <div className="text-gray-800 font-svn-avo-bold text-sm mt-1">{customers?.satisfaction || 'Khách hàng hài lòng'}</div>
                    </div>
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animation-paused {
                    animation-play-state: paused !important;
                }
            `}</style>
        </section>
    )
}
