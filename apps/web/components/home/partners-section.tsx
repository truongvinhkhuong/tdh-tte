"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { partners } from "@/lib/data"

interface PartnersSectionProps {
    lang: Locale
    dict: Dictionary
}

export function PartnersSection({ lang, dict }: PartnersSectionProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
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

    // Duplicate partners for infinite scroll effect
    const duplicatedPartners = [...partners, ...partners]

    return (
        <section className="py-10 md:py-14 lg:py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    {/* Section Header - Synced with CustomersSection */}
                    <div className="text-center mb-6 md:mb-10 lg:mb-12">
                        <div className="inline-block">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2">
                                {lang === 'vi' ? 'Đối tác chiến lược' : 'Strategic Partners'}
                            </h2>
                        </div>
                        <p className="text-sm md:text-base lg:text-lg font-svn-avo-bold text-gray-800 max-w-2xl mx-auto mt-3 md:mt-6 lg:mt-8">
                            {lang === 'vi'
                                ? 'Hợp tác với các thương hiệu hàng đầu thế giới'
                                : 'Partnering with world-leading brands'}
                        </p>
                    </div>

                    {/* Auto-scrolling Logo Slider - Synced with CustomersSection */}
                    <div
                        className="relative overflow-hidden"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Gradient Fade Left */}
                        <div className="absolute left-0 top-0 bottom-0 w-10 md:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>

                        {/* Gradient Fade Right */}
                        <div className="absolute right-0 top-0 bottom-0 w-10 md:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                        {/* Scrolling Container */}
                        <div
                            className={`flex gap-4 md:gap-6 lg:gap-8 ${isPaused ? 'animation-paused' : ''}`}
                            style={{
                                animation: 'scroll 30s linear infinite',
                                width: 'fit-content',
                            }}
                        >
                            {duplicatedPartners.map((partner, index) => (
                                <div
                                    key={`${partner.id}-${index}`}
                                    className="flex-shrink-0"
                                >
                                    <div className="w-28 h-20 sm:w-36 sm:h-24 md:w-48 md:h-32 lg:w-56 lg:h-36 bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md hover:shadow-2xl transition-all duration-300 flex items-center justify-center p-2 sm:p-3 md:p-4 lg:p-5 border border-gray-100 hover:border-[#364fa1]/40 hover:scale-110 cursor-pointer">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={partner.logo || '/brands/placeholder-logo.svg'}
                                                alt={partner.name}
                                                fill
                                                className="object-contain transition-transform duration-300"
                                                sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, (max-width: 1024px) 192px, 224px"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/brands/placeholder-logo.svg';
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
