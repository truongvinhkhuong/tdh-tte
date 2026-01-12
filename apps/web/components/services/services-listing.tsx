"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Award, Wrench } from "lucide-react"
import type { Locale } from "@/i18n/config"

interface ServicesListingProps {
    lang: Locale
    activeCategory: string
}

// Service data from https://toanthang.vn/dich-vu/
const servicesData = [
    {
        id: 'valve',
        category: 'valve',
        titleVi: 'Dịch vụ Van',
        titleEn: 'Valve Services',
        badge: 'Emerson Authorized',
        badgeColor: 'from-emerald-500 to-emerald-600',
        descriptionVi: 'TTS là Nhà cung cấp dịch vụ ủy quyền của Emerson cho các sản phẩm van tại Việt Nam.',
        descriptionEn: 'TTS is Emerson\'s Authorized Service Provider for valve products in Vietnam.',
        servicesVi: [
            'Đại tu, bảo trì, kiểm tra',
            'Xử lý sự cố',
            'Hiệu chuẩn',
            'Dịch vụ trực tuyến',
        ],
        servicesEn: [
            'Overhaul, maintenance, inspection',
            'Troubleshooting',
            'Calibration',
            'Online services',
        ],
        brandsVi: 'Fisher – Emerson, Metso, Masoneilan, Pentair (kích cỡ lên đến 48", áp suất lên đến 2,500)',
        brandsEn: 'Fisher – Emerson, Metso, Masoneilan, Pentair (sizes up to 48", pressure up to 2,500)',
        image: '/placeholder.jpg',
    },
    {
        id: 'pump',
        category: 'pump',
        titleVi: 'Dịch vụ Bơm',
        titleEn: 'Pump Services',
        badge: null,
        descriptionVi: 'TTS cung cấp các dịch vụ kỹ thuật cho các loại máy bơm: ly tâm, quay, chuyển vị, chuyển động qua lại.',
        descriptionEn: 'TTS provides technical services for pump types: centrifugal, rotary, positive displacement, reciprocating.',
        servicesVi: [
            'Lắp đặt và vận hành',
            'Xử lý sự cố',
            'Sửa chữa, đại tu và bảo trì',
            'Nâng cấp',
            'Chế tạo các bộ phận',
        ],
        servicesEn: [
            'Installation and commissioning',
            'Troubleshooting',
            'Repair, overhaul and maintenance',
            'Upgrades',
            'Parts fabrication',
        ],
        brandsVi: null,
        brandsEn: null,
        image: '/placeholder.jpg',
    },
    {
        id: 'compressor',
        category: 'compressor',
        titleVi: 'Dịch vụ Máy Nén Khí',
        titleEn: 'Compressor Services',
        badge: null,
        descriptionVi: 'TTS cung cấp các dịch vụ kỹ thuật cho các loại bơm, máy nén khí như ly tâm, trục vít, bơm piston.',
        descriptionEn: 'TTS provides technical services for compressor types: centrifugal, screw, piston.',
        servicesVi: [
            'Bảo trì 2K, 4K, 8K',
            'Xử lý sự cố',
            'Sửa chữa và đại tu',
            'Chỉnh sửa và nâng cấp',
        ],
        servicesEn: [
            '2K, 4K, 8K maintenance',
            'Troubleshooting',
            'Repair and overhaul',
            'Modification and upgrades',
        ],
        brandsVi: null,
        brandsEn: null,
        image: '/placeholder.jpg',
    },
    {
        id: 'coating',
        category: 'coating',
        titleVi: 'Công nghệ Mạ Chọn lọc / HVOF/ESP',
        titleEn: 'Selective Plating / HVOF/ESP Technology',
        badge: null,
        descriptionVi: 'TTS cung cấp công nghệ mạ chọn lọc mới, thực hiện tại xưởng của chúng tôi hoặc trực tiếp ở địa điểm khách hàng.',
        descriptionEn: 'TTS provides new selective plating technology, performed at our workshop or on-site at customer location.',
        servicesVi: [
            'Tân trang bơm, trục máy nén',
            'Tân trang van bi',
            'Cải tạo bề mặt bên trong và bên ngoài',
            'Cải tạo bề mặt kim loại',
        ],
        servicesEn: [
            'Pump and compressor shaft refurbishment',
            'Ball valve refurbishment',
            'Internal and external surface restoration',
            'Metal surface restoration',
        ],
        brandsVi: null,
        brandsEn: null,
        image: '/placeholder.jpg',
    },
    {
        id: 'skid',
        category: 'skid',
        titleVi: 'Gia công Skid',
        titleEn: 'Skid Fabrication',
        badge: null,
        descriptionVi: 'Năng lực gia công skid chuyên nghiệp tại xưởng TTS với thiết bị hiện đại.',
        descriptionEn: 'Professional skid fabrication capability at TTS workshop with modern equipment.',
        servicesVi: [
            'Lắp ráp skid',
            'Nâng cấp skid',
            'Kích thước skid: dài tới 10m & rộng 6m',
        ],
        servicesEn: [
            'Skid assembly',
            'Skid upgrades',
            'Skid dimensions: up to 10m long & 6m wide',
        ],
        brandsVi: null,
        brandsEn: null,
        image: '/placeholder.jpg',
    },
    {
        id: 'seal',
        category: 'seal',
        titleVi: 'Dịch vụ Seal Cơ khí',
        titleEn: 'Mechanical Seal Services',
        badge: 'Flowserve Certified',
        badgeColor: 'from-blue-500 to-blue-600',
        descriptionVi: 'Xưởng sửa chữa Seals (CSC) được chứng nhận bởi Flowserve, tiền thân là Trung tâm phản ứng nhanh của Flowserve (QRC).',
        descriptionEn: 'Certified Seals Center (CSC) certified by Flowserve, formerly Flowserve Quick Response Center (QRC).',
        servicesVi: [
            'Đại tu, bảo trì, kiểm tra',
            'Xử lý sự cố',
            'Dịch vụ trực tuyến',
        ],
        servicesEn: [
            'Overhaul, maintenance, inspection',
            'Troubleshooting',
            'Online services',
        ],
        brandsVi: 'Flowserve, John Crane, Eagle Burgmann, AES Seal',
        brandsEn: 'Flowserve, John Crane, Eagle Burgmann, AES Seal',
        image: '/placeholder.jpg',
    },
]

export function ServicesListing({ lang, activeCategory }: ServicesListingProps) {
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
            { threshold: 0.1 },
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    // Filter services based on active category
    const filteredServices = activeCategory === 'all'
        ? servicesData
        : servicesData.filter(service => service.category === activeCategory)

    return (
        <section ref={ref} className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#364fa1]/10 rounded-full mb-4">
                        <Wrench className="w-5 h-5 text-[#364fa1]" />
                        <span className="text-sm font-svn-avo-bold text-[#364fa1]">
                            {isVi ? 'Dịch vụ kỹ thuật chuyên sâu' : 'Specialized Technical Services'}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2 mb-4">
                        {isVi ? 'Năng lực dịch vụ' : 'Service Capabilities'}
                    </h2>
                    <p className="text-gray-600 font-svn-avo-bold max-w-2xl mx-auto">
                        {isVi
                            ? 'Chúng tôi cung cấp các dịch vụ kỹ thuật chuyên sâu để giúp khách hàng tối đa hóa hiệu quả hoạt động thiết bị'
                            : 'We provide specialized technical services to help customers maximize equipment operating efficiency'}
                    </p>
                </div>

                {/* Services List - Zig-zag Layout */}
                <div className="space-y-16 md:space-y-24">
                    {filteredServices.map((service, index) => {
                        const isEven = index % 2 === 0

                        return (
                            <div
                                key={service.id}
                                className={`group grid md:grid-cols-2 gap-8 md:gap-12 items-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    }`}
                                style={{
                                    transitionDuration: '700ms',
                                    transitionDelay: `${index * 150}ms`,
                                }}
                            >
                                {/* Image - Order changes based on index */}
                                <div className={`relative ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                                    <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-shadow duration-500">
                                        {/* Image */}
                                        <div className="relative aspect-[4/3]">
                                            <Image
                                                src={service.image}
                                                alt={isVi ? service.titleVi : service.titleEn}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>

                                        {/* Badge */}
                                        {service.badge && (
                                            <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${service.badgeColor} text-white text-xs font-svn-avo-bold rounded-full shadow-lg`}>
                                                <Award size={14} />
                                                <span>{service.badge}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Decorative element */}
                                    <div className={`absolute -z-10 w-full h-full ${isEven ? '-right-4 -bottom-4' : '-left-4 -bottom-4'} bg-gradient-to-br from-[#364fa1]/20 to-[#5a7ec9]/20 rounded-2xl`} />
                                </div>

                                {/* Content */}
                                <div className={`space-y-6 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                                    {/* Title */}
                                    <h3 className="text-2xl md:text-3xl font-svn-avo-extra-bold text-gray-900 group-hover:text-[#364fa1] transition-colors">
                                        {isVi ? service.titleVi : service.titleEn}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 font-svn-avo-bold leading-relaxed">
                                        {isVi ? service.descriptionVi : service.descriptionEn}
                                    </p>

                                    {/* Services List */}
                                    <ul className="space-y-3">
                                        {(isVi ? service.servicesVi : service.servicesEn).map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 size={20} className="text-[#364fa1] mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700 font-svn-avo-bold">{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Brands */}
                                    {(isVi ? service.brandsVi : service.brandsEn) && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <p className="text-sm text-gray-500 font-svn-avo-bold">
                                                <span className="font-svn-avo-extra-bold text-gray-700">
                                                    {isVi ? 'Thương hiệu: ' : 'Brands: '}
                                                </span>
                                                {isVi ? service.brandsVi : service.brandsEn}
                                            </p>
                                        </div>
                                    )}

                                    {/* CTA Button */}
                                    <div className="pt-2">
                                        <Link
                                            href={`/${lang}/contact`}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group/btn"
                                        >
                                            <span>{isVi ? 'Xem chi tiết kỹ thuật' : 'View Technical Details'}</span>
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Empty State */}
                {filteredServices.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 font-svn-avo-bold">
                            {isVi ? 'Không tìm thấy dịch vụ phù hợp.' : 'No matching services found.'}
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}
