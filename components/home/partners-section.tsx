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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-svn-avo-extra-bold text-gray-900 mb-2">
                            {lang === 'vi' ? 'Đối Tác Chiến Lược' : 'Strategic Partners'}
                        </h3>
                        <p className="font-svn-avo text-gray-600">
                            {lang === 'vi'
                                ? 'Hợp tác với các thương hiệu hàng đầu thế giới'
                                : 'Partnering with world-leading brands'}
                        </p>
                    </div>

                    {/* Infinite Scroll Container */}
                    <div className="relative overflow-hidden">
                        <div className="flex animate-marquee">
                            {duplicatedPartners.map((partner, index) => (
                                <div
                                    key={`${partner.id}-${index}`}
                                    className="flex-shrink-0 mx-8 w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                                >
                                    <div className="relative w-full h-full flex items-center justify-center bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                                        <Image
                                            src={partner.logo}
                                            alt={partner.name}
                                            width={100}
                                            height={40}
                                            className="object-contain max-h-10"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    )
}
