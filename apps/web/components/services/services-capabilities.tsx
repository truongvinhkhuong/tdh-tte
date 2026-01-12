"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Ruler, Weight, Users, MapPin, Wrench, Shield, Zap, Camera, Building2, CheckCircle2 } from "lucide-react"
import type { Locale } from "@/i18n/config"

interface ServicesCapabilitiesProps {
    lang: Locale
}

const statsData = [
    {
        icon: Ruler,
        value: '1,400',
        unit: 'm²',
        labelVi: 'Diện tích xưởng',
        labelEn: 'Workshop Area',
    },
    {
        icon: Weight,
        value: '10+',
        unit: 'tấn',
        labelVi: 'Sức nâng cần cẩu',
        labelEn: 'Crane Capacity',
    },
    {
        icon: Users,
        value: '30+',
        unit: '',
        labelVi: 'Kỹ sư chuyên sâu',
        labelEn: 'Expert Engineers',
    },
    {
        icon: MapPin,
        value: '3',
        unit: '',
        labelVi: 'Xưởng dịch vụ',
        labelEn: 'Service Workshops',
    },
]

const workshopData = [
    {
        id: 'vung-tau',
        nameVi: 'Xưởng 1: Vũng Tàu',
        nameEn: 'Workshop 1: Vung Tau',
        badge: 'Emerson ASP',
        badgeColor: 'from-emerald-500 to-emerald-600',
        addressVi: 'Đường 12, KCN Đông Xuyên, Bà Rịa – Vũng Tàu',
        addressEn: 'Road 12, Dong Xuyen IP, Ba Ria – Vung Tau',
        phone: '(84-254) 352 2219',
        email: 'tts@toanthang.vn',
        featuresVi: [
            'Diện tích: 1,400 m², chiều cao 20m',
            'Hai cần cẩu trên 10 tấn',
            'Khu vực hàn/sơn với hệ thống thông gió',
            'Máy phát điện khẩn cấp',
            'Hệ thống chữa cháy & camera',
        ],
        featuresEn: [
            'Area: 1,400 m², height 20m',
            'Two cranes over 10 tons',
            'Welding/painting area with ventilation',
            'Emergency generator',
            'Fire & camera systems',
        ],
        image: '/placeholder.jpg',
    },
    {
        id: 'quang-ngai',
        nameVi: 'Xưởng 2: Quảng Ngãi',
        nameEn: 'Workshop 2: Quang Ngai',
        badge: 'Flowserve CSC',
        badgeColor: 'from-blue-500 to-blue-600',
        addressVi: 'Huyện Bình Sơn, Tỉnh Quảng Ngãi',
        addressEn: 'Binh Son District, Quang Ngai Province',
        phone: '(84) 985 864 339',
        email: null,
        featuresVi: [
            'Diện tích: 300m²',
            'Đội ngũ kỹ thuật: 5 người',
            'Chuyên phục vụ Nhà máy lọc dầu Bình Sơn',
            'Certified Seal Center (CSC)',
        ],
        featuresEn: [
            'Area: 300m²',
            'Technical team: 5 members',
            'Specialized for Binh Son Refinery',
            'Certified Seal Center (CSC)',
        ],
        image: '/placeholder.jpg',
    },
]

const equipmentIcons = [
    { icon: Wrench, labelVi: 'Thiết bị chuyên dụng', labelEn: 'Specialized Equipment' },
    { icon: Shield, labelVi: 'Tiêu chuẩn an toàn', labelEn: 'Safety Standards' },
    { icon: Zap, labelVi: 'Máy phát dự phòng', labelEn: 'Backup Generator' },
    { icon: Camera, labelVi: 'Giám sát 24/7', labelEn: '24/7 Monitoring' },
]

export function ServicesCapabilities({ lang }: ServicesCapabilitiesProps) {
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

    return (
        <section ref={ref} className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
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
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#364fa1]/10 rounded-full mb-4">
                        <Building2 className="w-5 h-5 text-[#364fa1]" />
                        <span className="text-sm font-svn-avo-bold text-[#364fa1]">
                            {isVi ? 'Cơ sở vật chất hiện đại' : 'Modern Facilities'}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2 mb-4">
                        {isVi ? 'Năng lực & Cơ sở vật chất' : 'Capabilities & Facilities'}
                    </h2>
                    <p className="text-gray-600 font-svn-avo-bold max-w-2xl mx-auto">
                        {isVi
                            ? 'Hệ thống xưởng hiện đại được trang bị đầy đủ để đáp ứng mọi yêu cầu kỹ thuật'
                            : 'Modern workshop system fully equipped to meet all technical requirements'}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {statsData.map((stat, index) => {
                        const IconComponent = stat.icon
                        return (
                            <div
                                key={index}
                                className={`text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#364fa1]/30 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#364fa1] to-[#5a7ec9] rounded-xl mb-4 shadow-lg">
                                    <IconComponent size={28} className="text-white" />
                                </div>
                                <div className="text-3xl md:text-4xl font-svn-avo-extra-bold text-gray-900 mb-1">
                                    {stat.value}
                                    {stat.unit && (
                                        <span className="text-lg text-gray-500 ml-1">
                                            {stat.unit}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-600 font-svn-avo-bold">
                                    {isVi ? stat.labelVi : stat.labelEn}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Workshops Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {workshopData.map((workshop, index) => (
                        <div
                            key={workshop.id}
                            className={`group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#364fa1]/30 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: `${(index + 4) * 100}ms` }}
                        >
                            {/* Image Header */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={workshop.image}
                                    alt={isVi ? workshop.nameVi : workshop.nameEn}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                {/* Badge */}
                                <div className={`absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r ${workshop.badgeColor} text-white text-xs font-svn-avo-bold rounded-full shadow-lg`}>
                                    {workshop.badge}
                                </div>

                                {/* Workshop Name */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-xl font-svn-avo-extra-bold text-white">
                                        {isVi ? workshop.nameVi : workshop.nameEn}
                                    </h3>
                                    <p className="text-white/80 text-sm font-svn-avo-bold flex items-center gap-1 mt-1">
                                        <MapPin size={14} />
                                        {isVi ? workshop.addressVi : workshop.addressEn}
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Features */}
                                <ul className="space-y-2 mb-6">
                                    {(isVi ? workshop.featuresVi : workshop.featuresEn).map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 size={16} className="text-[#364fa1] mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-600 font-svn-avo-bold">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Contact Info */}
                                <div className="pt-4 border-t border-gray-100 space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-svn-avo-extra-bold text-gray-700">
                                            {isVi ? 'Điện thoại:' : 'Phone:'}
                                        </span>
                                        <a href={`tel:${workshop.phone.replace(/[^0-9+]/g, '')}`} className="text-[#364fa1] font-svn-avo-bold hover:underline">
                                            {workshop.phone}
                                        </a>
                                    </div>
                                    {workshop.email && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-svn-avo-extra-bold text-gray-700">Email:</span>
                                            <a href={`mailto:${workshop.email}`} className="text-[#364fa1] font-svn-avo-bold hover:underline">
                                                {workshop.email}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Equipment Features */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                    <h3 className="text-xl font-svn-avo-extra-bold text-gray-900 text-center mb-6">
                        {isVi ? 'Trang thiết bị & Tiện ích' : 'Equipment & Amenities'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {equipmentIcons.map((item, index) => {
                            const IconComponent = item.icon
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-[#364fa1]/5 transition-colors ${isVisible ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    style={{ transitionDelay: `${(index + 6) * 100}ms` }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#364fa1] to-[#5a7ec9] rounded-xl flex items-center justify-center shadow-md">
                                        <IconComponent size={24} className="text-white" />
                                    </div>
                                    <span className="font-svn-avo-bold text-sm text-gray-700 text-center">
                                        {isVi ? item.labelVi : item.labelEn}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
