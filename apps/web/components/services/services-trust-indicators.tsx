"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Award, Building2, MapPin, Calendar } from "lucide-react"
import type { Locale } from "@/i18n/config"

interface ServicesTrustIndicatorsProps {
    lang: Locale
}

const certificateImages = [
    { src: '/service/cert-1.jpg', alt: 'Emerson Authorization Certificate' },
    { src: '/service/cert-2.jpg', alt: 'ISO 9001:2015 Certificate' },
    { src: '/service/cert-3.jpg', alt: 'Flowserve Certification' },
    { src: '/service/cert-4.png', alt: 'Service Provider Certificate' },
    { src: '/service/cert-5.png', alt: 'Quality Certificate' },
    { src: '/service/cert-6.jpg', alt: 'Authorization Certificate' },
]

const workshopsData = {
    vi: [
        {
            name: 'Công ty Cổ phần Dịch vụ Kỹ thuật Toàn Thắng (TTS)',
            certifiedBy: 'Emerson',
            year: '2011',
            location: 'Thành phố Vũng Tàu',
            description: 'Hoạt động theo Hệ thống quản lý chất lượng ISO 9001:2015',
            gradient: 'from-emerald-500 to-emerald-600',
        },
        {
            name: 'Xưởng sửa chữa Seals (CSC: Certified Seal Center)',
            certifiedBy: 'Flowserve',
            year: '2019',
            location: 'Huyện Bình Sơn, tỉnh Quảng Ngãi',
            description: 'Chuyên cung cấp dịch vụ sửa chữa seals, phục vụ Nhà máy lọc dầu Bình Sơn',
            gradient: 'from-blue-500 to-blue-600',
        },
    ],
    en: [
        {
            name: 'Toan Thang Technical Service JSC (TTS)',
            certifiedBy: 'Emerson',
            year: '2011',
            location: 'Vung Tau City',
            description: 'Operating under ISO 9001:2015 Quality Management System',
            gradient: 'from-emerald-500 to-emerald-600',
        },
        {
            name: 'Certified Seal Center (CSC)',
            certifiedBy: 'Flowserve',
            year: '2019',
            location: 'Binh Son District, Quang Ngai Province',
            description: 'Specialized in seal repair services, serving Binh Son Refinery',
            gradient: 'from-blue-500 to-blue-600',
        },
    ],
}

export function ServicesTrustIndicators({ lang }: ServicesTrustIndicatorsProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const ref = useRef<HTMLElement>(null)
    const sliderRef = useRef<HTMLDivElement>(null)
    const isVi = lang === 'vi'
    const workshops = isVi ? workshopsData.vi : workshopsData.en

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

    // Auto-slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % certificateImages.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index)
    }, [])

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % certificateImages.length)
    }, [])

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + certificateImages.length) % certificateImages.length)
    }, [])

    return (
        <section
            ref={ref}
            className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
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
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#364fa1]/10 rounded-full mb-4">
                        <Award className="w-5 h-5 text-[#364fa1]" />
                        <span className="text-sm font-svn-avo-bold text-[#364fa1]">
                            {isVi ? 'Được chứng nhận bởi các tập đoàn hàng đầu' : 'Certified by leading corporations'}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2 mb-4">
                        {isVi ? 'Chứng nhận uy tín' : 'Our Certifications'}
                    </h2>
                    <p className="text-gray-600 font-svn-avo-bold max-w-3xl mx-auto leading-relaxed">
                        {isVi
                            ? 'Để giúp khách hàng vận hành, tối đa hóa hiệu quả hoạt động của thiết bị, giảm chi phí sửa chữa và giảm thiểu rủi ro, chúng tôi đã thành lập 02 xưởng dịch vụ:'
                            : 'To help customers operate, maximize equipment efficiency, reduce repair costs and minimize risks, we have established 02 service workshops:'}
                    </p>
                </div>

                {/* Workshops Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {workshops.map((workshop, index) => (
                        <div
                            key={index}
                            className={`relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {/* Gradient accent */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${workshop.gradient}`} />
                            
                            {/* Badge */}
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${workshop.gradient} text-white text-xs font-svn-avo-bold rounded-full mb-4`}>
                                <Award size={14} />
                                <span>{isVi ? 'Chứng nhận bởi' : 'Certified by'} {workshop.certifiedBy}</span>
                            </div>

                            {/* Workshop Name */}
                            <h3 className="text-lg font-svn-avo-extra-bold text-gray-900 mb-3 leading-tight">
                                {workshop.name}
                            </h3>

                            {/* Info */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar size={16} className="text-[#364fa1] flex-shrink-0" />
                                    <span className="font-svn-avo-bold text-sm">
                                        {isVi ? 'Thành lập năm' : 'Established'} {workshop.year}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin size={16} className="text-[#364fa1] flex-shrink-0" />
                                    <span className="font-svn-avo-bold text-sm">{workshop.location}</span>
                                </div>
                                <div className="flex items-start gap-2 text-gray-600">
                                    <Building2 size={16} className="text-[#364fa1] flex-shrink-0 mt-0.5" />
                                    <span className="font-svn-avo-bold text-sm">{workshop.description}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Certificate Image Slider */}
                <div
                    className={`relative transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: '300ms' }}
                >
                    {/* Slider Container */}
                    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Main Slider */}
                        <div ref={sliderRef} className="relative">
                            <div 
                                className="flex transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {certificateImages.map((cert, index) => (
                                    <div 
                                        key={index} 
                                        className="w-full flex-shrink-0 cursor-pointer"
                                        onClick={() => setSelectedImage(cert.src)}
                                    >
                                        <div className="relative aspect-[16/10] md:aspect-[16/8]">
                                            <Image
                                                src={cert.src}
                                                alt={cert.alt}
                                                fill
                                                className="object-contain bg-gray-50 p-4"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-[#364fa1] hover:text-white transition-all duration-300 z-10"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-[#364fa1] hover:text-white transition-all duration-300 z-10"
                                aria-label="Next slide"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        {/* Dots Navigation */}
                        <div className="flex justify-center gap-2 py-4 bg-gray-50">
                            {certificateImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                        currentSlide === index
                                            ? 'bg-[#364fa1] w-8'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="mt-4 grid grid-cols-6 gap-2">
                        {certificateImages.map((cert, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                    currentSlide === index
                                        ? 'border-[#364fa1] shadow-lg scale-105'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                <Image
                                    src={cert.src}
                                    alt={cert.alt}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Click hint */}
                    <p className="text-center text-sm text-gray-500 font-svn-avo-bold mt-4">
                        {isVi ? 'Nhấn vào hình để xem chi tiết' : 'Click on image to view details'}
                    </p>
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-pointer"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl max-h-[90vh] w-full">
                        <Image
                            src={selectedImage}
                            alt="Certificate"
                            width={1400}
                            height={1000}
                            className="object-contain w-full h-full rounded-lg"
                        />
                        <button
                            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <span className="text-2xl leading-none">&times;</span>
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}
