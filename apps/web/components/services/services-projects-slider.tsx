"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, MapPin, Briefcase } from "lucide-react"
import type { Locale } from "@/i18n/config"

interface ServicesProjectsSliderProps {
    lang: Locale
}

// Projects data from https://toanthang.vn/dich-vu/
const projectsData = [
    {
        id: 'nsrp',
        nameVi: 'Nhà máy Lọc dầu Nghi Sơn',
        nameEn: 'Nghi Son Refinery (NSRP)',
        clientLogo: '/placeholder-logo.svg',
        scopeVi: 'Bảo dưỡng Van điều khiển',
        scopeEn: 'Control Valve Maintenance',
        locationVi: 'Thanh Hóa, Việt Nam',
        locationEn: 'Thanh Hoa, Vietnam',
        year: '2017 - nay',
        image: '/placeholder.jpg',
    },
    {
        id: 'bsr',
        nameVi: 'Nhà máy Lọc dầu Bình Sơn',
        nameEn: 'Binh Son Refinery (BSR)',
        clientLogo: '/placeholder-logo.svg',
        scopeVi: 'Dịch vụ Seal cơ khí',
        scopeEn: 'Mechanical Seal Services',
        locationVi: 'Quảng Ngãi, Việt Nam',
        locationEn: 'Quang Ngai, Vietnam',
        year: '2019 - nay',
        image: '/placeholder.jpg',
    },
    {
        id: 'pvd',
        nameVi: 'PV Drilling',
        nameEn: 'PV Drilling',
        clientLogo: '/placeholder-logo.svg',
        scopeVi: 'Giám sát & bảo trì thiết bị',
        scopeEn: 'Equipment Monitoring & Maintenance',
        locationVi: 'Vùng biển Việt Nam',
        locationEn: 'Vietnam Offshore',
        year: '2021 - nay',
        image: '/placeholder.jpg',
    },
    {
        id: 'pvgas',
        nameVi: 'PV Gas - Trạm GPP Dinh Cố',
        nameEn: 'PV Gas - Dinh Co GPP Station',
        clientLogo: '/placeholder-logo.svg',
        scopeVi: 'Cung cấp & lắp đặt máy nén khí',
        scopeEn: 'Compressor Supply & Installation',
        locationVi: 'Bà Rịa - Vũng Tàu',
        locationEn: 'Ba Ria - Vung Tau',
        year: '2020',
        image: '/placeholder.jpg',
    },
    {
        id: 'vietsovpetro',
        nameVi: 'Vietsovpetro - Trạm khí Bạch Hổ',
        nameEn: 'Vietsovpetro - Bach Ho Gas Station',
        clientLogo: '/placeholder-logo.svg',
        scopeVi: 'Hệ thống đo lường khí',
        scopeEn: 'Gas Measurement System',
        locationVi: 'Bà Rịa - Vũng Tàu',
        locationEn: 'Ba Ria - Vung Tau',
        year: '2023',
        image: '/placeholder.jpg',
    },
    {
        id: 'pha-lai',
        nameVi: 'Nhà máy Nhiệt điện Phả Lại',
        nameEn: 'Pha Lai Thermal Power Plant',
        clientLogo: '/placeholder-logo.svg',
        scopeVi: 'Bảo trì Van & Bơm',
        scopeEn: 'Valve & Pump Maintenance',
        locationVi: 'Hải Dương, Việt Nam',
        locationEn: 'Hai Duong, Vietnam',
        year: '2022',
        image: '/placeholder.jpg',
    },
]

export function ServicesProjectsSlider({ lang }: ServicesProjectsSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const ref = useRef<HTMLElement>(null)
    const isVi = lang === 'vi'

    const itemsPerView = {
        mobile: 1,
        tablet: 2,
        desktop: 3,
    }

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

    // Auto-play
    useEffect(() => {
        if (!isPaused && isVisible) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) =>
                    prev >= projectsData.length - itemsPerView.desktop ? 0 : prev + 1
                )
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [isPaused, isVisible])

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? projectsData.length - itemsPerView.desktop : prev - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prev) =>
            prev >= projectsData.length - itemsPerView.desktop ? 0 : prev + 1
        )
    }

    return (
        <section ref={ref} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-svn-avo-extra-bold text-gray-900 mb-4">
                        {isVi ? 'Dự án Tiêu biểu' : 'Featured Projects'}
                    </h2>
                    <p className="text-gray-600 font-svn-avo-bold max-w-2xl mx-auto">
                        {isVi
                            ? 'Các dự án tiêu biểu mà chúng tôi đã và đang phục vụ'
                            : 'Featured projects we have been serving'}
                    </p>
                </div>

                {/* Slider Container */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Navigation Arrows */}
                    <button
                        onClick={goToPrev}
                        className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-gray-600 hover:text-[#364fa1] transition-all duration-300 hover:scale-110"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-gray-600 hover:text-[#364fa1] transition-all duration-300 hover:scale-110"
                        aria-label="Next"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Slider Track */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / itemsPerView.desktop)}%)`,
                            }}
                        >
                            {projectsData.map((project, index) => (
                                <div
                                    key={project.id}
                                    className={`w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                        }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#364fa1]/30 h-full">
                                        {/* Project Image */}
                                        <div className="relative h-40 overflow-hidden">
                                            <Image
                                                src={project.image}
                                                alt={isVi ? project.nameVi : project.nameEn}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                            {/* Year Badge */}
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-svn-avo-bold text-[#364fa1] rounded-md">
                                                {project.year}
                                            </div>
                                        </div>

                                        {/* Project Info */}
                                        <div className="p-5">
                                            {/* Client Logo */}
                                            <div className="w-24 h-10 relative mb-3 filter grayscale group-hover:grayscale-0 transition-all duration-500">
                                                <Image
                                                    src={project.clientLogo}
                                                    alt="Client logo"
                                                    fill
                                                    className="object-contain object-left"
                                                />
                                            </div>

                                            {/* Project Name */}
                                            <h3 className="text-lg font-svn-avo-extra-bold text-gray-900 mb-3 group-hover:text-[#364fa1] transition-colors line-clamp-2">
                                                {isVi ? project.nameVi : project.nameEn}
                                            </h3>

                                            {/* Scope */}
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                <Briefcase size={14} className="text-[#364fa1] flex-shrink-0" />
                                                <span className="font-svn-avo-bold line-clamp-1">
                                                    {isVi ? project.scopeVi : project.scopeEn}
                                                </span>
                                            </div>

                                            {/* Location */}
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                                <span className="font-svn-avo-bold line-clamp-1">
                                                    {isVi ? project.locationVi : project.locationEn}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bottom accent */}
                                        <div className="h-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dot Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: projectsData.length - itemsPerView.desktop + 1 }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index
                                        ? 'w-8 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9]'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
