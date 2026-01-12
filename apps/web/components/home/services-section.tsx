"use client"

import Link from "next/link"
import { ArrowRight, Award, Wrench, Gauge, Wind, Paintbrush, Box, CircleDot } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"

interface ServicesSectionProps {
    lang: Locale
    dict: Dictionary
}

// Services data matching the Services page
const servicesData = [
    {
        id: 'valve',
        icon: Gauge,
        titleVi: 'Dịch vụ Van',
        titleEn: 'Valve Services',
        badge: 'Emerson Authorized',
        badgeColor: 'bg-emerald-500',
        descriptionVi: 'TTS là Nhà cung cấp dịch vụ ủy quyền của Emerson cho các sản phẩm van tại Việt Nam. Đại tu, bảo trì, kiểm tra và hiệu chuẩn.',
        descriptionEn: 'TTS is Emerson\'s Authorized Service Provider for valve products in Vietnam. Overhaul, maintenance, inspection and calibration.',
    },
    {
        id: 'pump',
        icon: Wrench,
        titleVi: 'Dịch vụ Bơm',
        titleEn: 'Pump Services',
        badge: null,
        descriptionVi: 'Dịch vụ kỹ thuật cho các loại máy bơm: ly tâm, quay, chuyển vị. Lắp đặt, vận hành, sửa chữa và đại tu.',
        descriptionEn: 'Technical services for pumps: centrifugal, rotary, positive displacement. Installation, commissioning, repair and overhaul.',
    },
    {
        id: 'compressor',
        icon: Wind,
        titleVi: 'Dịch vụ Máy Nén Khí',
        titleEn: 'Compressor Services',
        badge: null,
        descriptionVi: 'Dịch vụ kỹ thuật cho máy nén khí ly tâm, trục vít, piston. Bảo trì 2K, 4K, 8K, xử lý sự cố và đại tu.',
        descriptionEn: 'Technical services for centrifugal, screw, piston compressors. 2K, 4K, 8K maintenance, troubleshooting and overhaul.',
    },
    {
        id: 'coating',
        icon: Paintbrush,
        titleVi: 'Công nghệ Mạ HVOF/ESP',
        titleEn: 'HVOF/ESP Coating Technology',
        badge: null,
        descriptionVi: 'Công nghệ mạ chọn lọc tiên tiến, tân trang bơm, trục máy nén, van bi. Thực hiện tại xưởng hoặc tại chỗ.',
        descriptionEn: 'Advanced selective plating technology, pump and compressor shaft refurbishment. Performed in-shop or on-site.',
    },
    {
        id: 'skid',
        icon: Box,
        titleVi: 'Gia công Skid',
        titleEn: 'Skid Fabrication',
        badge: null,
        descriptionVi: 'Năng lực gia công skid chuyên nghiệp với thiết bị hiện đại. Kích thước: dài tới 10m & rộng 6m.',
        descriptionEn: 'Professional skid fabrication capability with modern equipment. Dimensions: up to 10m long & 6m wide.',
    },
    {
        id: 'seal',
        icon: CircleDot,
        titleVi: 'Dịch vụ Seal Cơ khí',
        titleEn: 'Mechanical Seal Services',
        badge: 'Flowserve Certified',
        badgeColor: 'bg-blue-500',
        descriptionVi: 'Xưởng sửa chữa Seals (CSC) được chứng nhận bởi Flowserve. Đại tu, bảo trì, kiểm tra và xử lý sự cố.',
        descriptionEn: 'Certified Seals Center (CSC) by Flowserve. Overhaul, maintenance, inspection and troubleshooting.',
    },
]

export function ServicesSection({ lang, dict }: ServicesSectionProps) {
    const isVi = lang === 'vi'

    return (
        <section id="services" className="py-20 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#364fa1]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#5a7ec9]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2">
                        {isVi ? 'Năng lực Dịch vụ' : 'Service Capabilities'}
                    </h2>
                    <p className="text-base md:text-lg font-svn-avo-bold text-gray-700 max-w-3xl mx-auto mt-4 md:mt-6 leading-relaxed">
                        {isVi
                            ? 'Chúng tôi cung cấp các dịch vụ kỹ thuật chuyên sâu để giúp khách hàng tối đa hóa hiệu quả hoạt động thiết bị'
                            : 'We provide specialized technical services to help customers maximize equipment operating efficiency'}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {servicesData.map((service, index) => {
                        const IconComponent = service.icon
                        return (
                            <div
                                key={service.id}
                                className="group relative p-6 md:p-8 bg-white rounded-2xl border border-gray-100 hover:border-[#364fa1]/40 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                            >
                                {/* Hover gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#364fa1]/5 to-[#5a7ec9]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative z-10">
                                    {/* Badge */}
                                    {service.badge && (
                                        <div className={`absolute top-0 right-0 flex items-center gap-1 px-2 py-1 ${service.badgeColor} text-white text-xs font-svn-avo-bold rounded-full`}>
                                            <Award size={12} />
                                            <span>{service.badge}</span>
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className="mb-4 transition-all duration-300 group-hover:scale-110 inline-block text-[#364fa1] group-hover:text-[#5a7ec9]">
                                        <IconComponent size={44} strokeWidth={1.5} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg md:text-xl font-svn-avo-extra-bold text-gray-900 mb-3 group-hover:text-[#364fa1] transition-colors">
                                        {isVi ? service.titleVi : service.titleEn}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm font-svn-avo-bold text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                                        {isVi ? service.descriptionVi : service.descriptionEn}
                                    </p>

                                    {/* Bottom accent line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* CTA Button */}
                <div className="text-center mt-10 md:mt-12">
                    <Link
                        href={`/${lang}/services`}
                        className="inline-flex items-center gap-2 px-6 md:px-8 py-3 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-extra-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                        {isVi ? 'Xem chi tiết dịch vụ' : 'View Service Details'}
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    )
}
