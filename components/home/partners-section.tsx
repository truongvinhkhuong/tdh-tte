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
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    {/* Section Header - Synced with CustomersSection */}
                    <div className="text-center mb-12">
                        <div className="inline-block">
                            <h2 className="text-4xl md:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2">
                                {lang === 'vi' ? 'Đối tác chiến lược' : 'Strategic Partners'}
                            </h2>
                        </div>
                        <p className="text-lg font-svn-avo-bold text-gray-800 max-w-2xl mx-auto mt-8">
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
                            {duplicatedPartners.map((partner, index) => (
                                <div
                                    key={`${partner.id}-${index}`}
                                    className="flex-shrink-0"
                                >
                                    <div className="w-40 h-28 md:w-56 md:h-36 lg:w-64 lg:h-40 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex items-center justify-center p-4 md:p-5 border border-gray-100 hover:border-[#364fa1]/40 hover:scale-110 cursor-pointer">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={partner.logo}
                                                alt={partner.name}
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
