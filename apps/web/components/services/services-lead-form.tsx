"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Send, Phone, Mail, MapPin, Clock, CheckCircle2, MessageSquare } from "lucide-react"
import type { Locale } from "@/i18n/config"

interface ServicesLeadFormProps {
    lang: Locale
}

const officeData = [
    {
        id: 'hcm',
        nameVi: 'Văn phòng Hồ Chí Minh',
        nameEn: 'Ho Chi Minh Office',
        companyVi: 'Công ty Cổ phần Kỹ thuật Toàn Thắng',
        companyEn: 'Toan Thang Engineering Corp.',
        phone: '(84-28) 3911 5611',
        email: 'info@toanthang.vn',
        addressVi: 'TP. Hồ Chí Minh, Việt Nam',
        addressEn: 'Ho Chi Minh City, Vietnam',
    },
    {
        id: 'vung-tau',
        nameVi: 'Xưởng Vũng Tàu (TTS)',
        nameEn: 'Vung Tau Workshop (TTS)',
        companyVi: 'Công ty CP Dịch vụ Kỹ thuật Toàn Thắng',
        companyEn: 'Toan Thang Technical Service JSC',
        phone: '(84-254) 352 2219',
        email: 'tts@toanthang.vn',
        addressVi: 'Đường 12, KCN Đông Xuyên, Bà Rịa – Vũng Tàu',
        addressEn: 'Road 12, Dong Xuyen IP, Ba Ria – Vung Tau',
    },
    {
        id: 'quang-ngai',
        nameVi: 'Xưởng Quảng Ngãi (CSC)',
        nameEn: 'Quang Ngai Workshop (CSC)',
        companyVi: 'Certified Seals Center',
        companyEn: 'Certified Seals Center',
        phone: '(84) 985 864 339',
        altPhone: '(84) 907 977 840',
        email: null,
        addressVi: 'Huyện Bình Sơn, Tỉnh Quảng Ngãi',
        addressEn: 'Binh Son District, Quang Ngai Province',
    },
]

const supportOptions = [
    { valueVi: 'Dịch vụ Van', valueEn: 'Valve Services' },
    { valueVi: 'Dịch vụ Bơm', valueEn: 'Pump Services' },
    { valueVi: 'Máy nén khí', valueEn: 'Compressor Services' },
    { valueVi: 'Seal cơ khí', valueEn: 'Mechanical Seals' },
    { valueVi: 'Gia công Skid', valueEn: 'Skid Fabrication' },
    { valueVi: 'Khác', valueEn: 'Other' },
]

export function ServicesLeadForm({ lang }: ServicesLeadFormProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSubmitted(true)

        // Reset after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false)
            setFormData({ name: '', phone: '', email: '', service: '', message: '' })
        }, 3000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <section ref={ref} className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#364fa1]/10 rounded-full mb-4">
                        <MessageSquare className="w-5 h-5 text-[#364fa1]" />
                        <span className="text-sm font-svn-avo-bold text-[#364fa1]">
                            {isVi ? 'Hỗ trợ tư vấn miễn phí' : 'Free Consultation Support'}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2 mb-4">
                        {isVi ? 'Liên hệ tư vấn nhanh' : 'Quick Consultation'}
                    </h2>
                    <p className="text-gray-600 font-svn-avo-bold max-w-2xl mx-auto">
                        {isVi
                            ? 'Để lại thông tin để được tư vấn miễn phí về giải pháp phù hợp với nhu cầu của bạn'
                            : 'Leave your information for a free consultation on solutions that fit your needs'}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Lead Form */}
                    <div
                        className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                            }`}
                        style={{ transitionDuration: '700ms' }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#364fa1] to-[#5a7ec9] rounded-xl flex items-center justify-center">
                                <Send size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-svn-avo-extra-bold text-gray-900">
                                    {isVi ? 'Gửi yêu cầu' : 'Send Request'}
                                </h3>
                                <p className="text-sm text-gray-500 font-svn-avo-bold">
                                    {isVi ? 'Phản hồi trong vòng 24h' : 'Response within 24 hours'}
                                </p>
                            </div>
                        </div>

                        {isSubmitted ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <CheckCircle2 size={32} className="text-green-600" />
                                </div>
                                <h4 className="text-lg font-svn-avo-extra-bold text-gray-900 mb-2">
                                    {isVi ? 'Gửi thành công!' : 'Submitted Successfully!'}
                                </h4>
                                <p className="text-gray-600 font-svn-avo-bold">
                                    {isVi ? 'Chúng tôi sẽ liên hệ bạn sớm nhất.' : 'We will contact you shortly.'}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-svn-avo-bold text-gray-700 mb-2">
                                        {isVi ? 'Họ và tên *' : 'Full Name *'}
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#364fa1] focus:ring-2 focus:ring-[#364fa1]/20 outline-none transition-all font-svn-avo-bold"
                                        placeholder={isVi ? 'Nhập họ và tên' : 'Enter your name'}
                                    />
                                </div>

                                {/* Phone & Email Grid */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-svn-avo-bold text-gray-700 mb-2">
                                            {isVi ? 'Số điện thoại *' : 'Phone Number *'}
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#364fa1] focus:ring-2 focus:ring-[#364fa1]/20 outline-none transition-all font-svn-avo-bold"
                                            placeholder={isVi ? 'Nhập số điện thoại' : 'Enter phone number'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-svn-avo-bold text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#364fa1] focus:ring-2 focus:ring-[#364fa1]/20 outline-none transition-all font-svn-avo-bold"
                                            placeholder={isVi ? 'Nhập email' : 'Enter email'}
                                        />
                                    </div>
                                </div>

                                {/* Service Select */}
                                <div>
                                    <label className="block text-sm font-svn-avo-bold text-gray-700 mb-2">
                                        {isVi ? 'Dịch vụ quan tâm' : 'Service of Interest'}
                                    </label>
                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#364fa1] focus:ring-2 focus:ring-[#364fa1]/20 outline-none transition-all font-svn-avo-bold bg-white"
                                    >
                                        <option value="">{isVi ? '-- Chọn dịch vụ --' : '-- Select service --'}</option>
                                        {supportOptions.map((option, index) => (
                                            <option key={index} value={isVi ? option.valueVi : option.valueEn}>
                                                {isVi ? option.valueVi : option.valueEn}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-svn-avo-bold text-gray-700 mb-2">
                                        {isVi ? 'Vấn đề cần hỗ trợ' : 'Support Needed'}
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#364fa1] focus:ring-2 focus:ring-[#364fa1]/20 outline-none transition-all font-svn-avo-bold resize-none"
                                        placeholder={isVi ? 'Mô tả chi tiết vấn đề của bạn...' : 'Describe your issue in detail...'}
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-extra-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>{isVi ? 'Đang gửi...' : 'Sending...'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            <span>{isVi ? 'Gửi yêu cầu tư vấn' : 'Send Consultation Request'}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Office Contact Info */}
                    <div
                        className={`space-y-6 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                            }`}
                        style={{ transitionDuration: '700ms', transitionDelay: '200ms' }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#364fa1] to-[#5a7ec9] rounded-xl flex items-center justify-center">
                                <Phone size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-svn-avo-extra-bold text-gray-900">
                                    {isVi ? 'Liên hệ trực tiếp' : 'Direct Contact'}
                                </h3>
                                <p className="text-sm text-gray-500 font-svn-avo-bold flex items-center gap-1">
                                    <Clock size={14} />
                                    {isVi ? 'Hỗ trợ 24/7' : '24/7 Support'}
                                </p>
                            </div>
                        </div>

                        {/* Office Cards */}
                        {officeData.map((office, index) => (
                            <div
                                key={office.id}
                                className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:border-[#364fa1]/30"
                            >
                                <h4 className="font-svn-avo-extra-bold text-gray-900 mb-1">
                                    {isVi ? office.nameVi : office.nameEn}
                                </h4>
                                <p className="text-sm text-gray-500 font-svn-avo-bold mb-3">
                                    {isVi ? office.companyVi : office.companyEn}
                                </p>

                                <div className="space-y-2">
                                    {/* Phone */}
                                    <a
                                        href={`tel:${office.phone.replace(/[^0-9+]/g, '')}`}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#364fa1] transition-colors"
                                    >
                                        <Phone size={14} className="text-[#364fa1]" />
                                        <span className="font-svn-avo-bold">{office.phone}</span>
                                        {office.altPhone && (
                                            <span className="text-gray-400">| {office.altPhone}</span>
                                        )}
                                    </a>

                                    {/* Email */}
                                    {office.email && (
                                        <a
                                            href={`mailto:${office.email}`}
                                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#364fa1] transition-colors"
                                        >
                                            <Mail size={14} className="text-[#364fa1]" />
                                            <span className="font-svn-avo-bold">{office.email}</span>
                                        </a>
                                    )}

                                    {/* Address */}
                                    <div className="flex items-start gap-2 text-sm text-gray-500">
                                        <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="font-svn-avo-bold">
                                            {isVi ? office.addressVi : office.addressEn}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Full Contact Page Link */}
                        <Link
                            href={`/${lang}/contact`}
                            className="inline-flex items-center gap-2 text-[#364fa1] font-svn-avo-bold hover:underline"
                        >
                            {isVi ? 'Xem đầy đủ thông tin liên hệ' : 'View full contact information'}
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
