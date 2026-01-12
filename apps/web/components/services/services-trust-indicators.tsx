"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { Locale } from "@/i18n/config"

interface ServicesTrustIndicatorsProps {
    lang: Locale
}

const certifications = [
    {
        id: 'iso',
        name: 'ISO 9001:2015',
        logo: '/placeholder-logo.svg',
        description: 'Quality Management System',
        descriptionVi: 'Hệ thống Quản lý Chất lượng',
    },
    {
        id: 'emerson',
        name: 'Emerson Authorized Service Provider',
        logo: '/placeholder-logo.svg',
        description: 'Authorized Service Provider (ASP)',
        descriptionVi: 'Nhà cung cấp dịch vụ ủy quyền',
    },
    {
        id: 'flowserve',
        name: 'Flowserve Certified Seal Center',
        logo: '/placeholder-logo.svg',
        description: 'Certified Seal Center (CSC)',
        descriptionVi: 'Trung tâm Seal được chứng nhận',
    },
]

export function ServicesTrustIndicators({ lang }: ServicesTrustIndicatorsProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLElement>(null)
    const isVi = lang === 'vi'

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 },
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <section
            ref={ref}
            className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
        >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #364fa1 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-sm font-svn-avo-extra-bold text-[#364fa1] uppercase tracking-wider mb-2">
                        {isVi ? 'Chứng nhận uy tín' : 'Our Certifications'}
                    </h2>
                    <p className="text-gray-600 font-svn-avo-bold max-w-2xl mx-auto">
                        {isVi
                            ? 'Được công nhận bởi các tổ chức và nhà sản xuất hàng đầu thế giới'
                            : 'Recognized by leading global organizations and manufacturers'}
                    </p>
                </div>

                {/* Certification Logos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {certifications.map((cert, index) => (
                        <div
                            key={cert.id}
                            className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#364fa1]/30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                            style={{
                                transitionDelay: `${index * 150}ms`,
                            }}
                        >
                            {/* Hover gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#364fa1]/5 to-[#5a7ec9]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Logo Container */}
                            <div className="relative flex justify-center items-center h-24 mb-6">
                                <div className="relative w-40 h-20 filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110">
                                    <Image
                                        src={cert.logo}
                                        alt={cert.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            {/* Certification Info */}
                            <div className="relative text-center">
                                <h3 className="text-lg font-svn-avo-extra-bold text-gray-900 mb-2 group-hover:text-[#364fa1] transition-colors">
                                    {cert.name}
                                </h3>
                                <p className="text-sm text-gray-500 font-svn-avo-bold">
                                    {isVi ? cert.descriptionVi : cert.description}
                                </p>
                            </div>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] rounded-full group-hover:w-1/2 transition-all duration-500" />
                        </div>
                    ))}
                </div>

                {/* Trust message */}
                <div
                    className={`mt-10 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                    style={{ transitionDelay: '500ms' }}
                >
                    <p className="text-sm text-gray-500 font-svn-avo-bold">
                        {isVi
                            ? '✓ Hoạt động theo Hệ thống quản lý chất lượng ISO 9001:2015 từ năm 2011'
                            : '✓ Operating under ISO 9001:2015 Quality Management System since 2011'}
                    </p>
                </div>
            </div>
        </section>
    )
}
