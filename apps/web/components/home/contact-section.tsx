"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Phone, Mail, Send, Clock, Building2, MessageSquare, CheckCircle2 } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"

interface ContactSectionProps {
    lang: Locale
    dict: Dictionary
}

// Office data matching the Services page
const officeData = [
    {
        id: 'hcm',
        nameVi: 'Văn phòng Hồ Chí Minh',
        nameEn: 'Ho Chi Minh Office',
        companyVi: 'Công ty Cổ phần Kỹ thuật Toàn Thắng',
        companyEn: 'Toan Thang Engineering Corp.',
        phone: '(84-28) 3911 5611',
        email: 'info@toanthang.vn',
        addressVi: '11B Nguyễn Bỉnh Khiêm, P. Bến Nghé, Q.1, TP. Hồ Chí Minh',
        addressEn: '11B Nguyen Binh Khiem, Ben Nghe Ward, District 1, Ho Chi Minh City',
        isPrimary: true,
        badge: 'Trụ sở chính',
        badgeEn: 'Headquarters',
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
        isPrimary: false,
        badge: 'Emerson ASP',
        badgeEn: 'Emerson ASP',
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
        isPrimary: false,
        badge: 'Flowserve CSC',
        badgeEn: 'Flowserve CSC',
    },
]

export function ContactSection({ lang, dict }: ContactSectionProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const isVi = lang === 'vi'

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000))

        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        setIsSubmitting(false)
        setIsSubmitted(true)

        // Reset success state after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false)
        }, 3000)
    }

    return (
        <section id="contact" className="py-12 md:py-20 lg:py-24 scroll-mt-24 bg-gradient-to-b from-white via-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#364fa1]/10 rounded-full mb-4">
                        <MessageSquare className="w-5 h-5 text-[#364fa1]" />
                        <span className="text-sm font-svn-avo-bold text-[#364fa1]">
                            {isVi ? 'Hỗ trợ 24/7' : '24/7 Support'}
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2">
                        {dict.contact.title}
                    </h2>
                    <p className="text-sm md:text-base lg:text-lg font-svn-avo-bold text-gray-800 max-w-2xl mx-auto mt-3 md:mt-6 lg:mt-8">
                        {dict.contact.subtitle}
                    </p>
                </div>

                {/* Office Cards - Full Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-16">
                    {officeData.map((office, index) => (
                        <div
                            key={office.id}
                            className={`relative bg-white p-5 md:p-6 rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border ${office.isPrimary
                                    ? 'border-[#364fa1]/30 ring-2 ring-[#364fa1]/10'
                                    : 'border-gray-100 hover:border-[#364fa1]/30'
                                } group`}
                        >
                            {/* Badge */}
                            <div className={`absolute -top-3 right-4 px-3 py-1 text-xs font-svn-avo-bold rounded-full shadow-sm ${office.isPrimary
                                    ? 'bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                {isVi ? office.badge : office.badgeEn}
                            </div>

                            {/* Office Header */}
                            <div className="flex items-start gap-3 mb-4 mt-2">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#364fa1] to-[#5a7ec9] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <Building2 size={20} className="text-white md:hidden" />
                                    <Building2 size={24} className="text-white hidden md:block" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-svn-avo-extra-bold text-gray-900 text-sm md:text-base leading-tight">
                                        {isVi ? office.nameVi : office.nameEn}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-500 font-svn-avo-bold truncate">
                                        {isVi ? office.companyVi : office.companyEn}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-3">
                                {/* Phone */}
                                <a
                                    href={`tel:${office.phone.replace(/[^0-9+]/g, '')}`}
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#364fa1] transition-colors group/link"
                                >
                                    <div className="w-8 h-8 bg-[#364fa1]/10 rounded-lg flex items-center justify-center group-hover/link:bg-[#364fa1]/20 transition-colors">
                                        <Phone size={14} className="text-[#364fa1]" />
                                    </div>
                                    <div>
                                        <span className="font-svn-avo-bold">{office.phone}</span>
                                        {office.altPhone && (
                                            <span className="text-gray-400 text-xs ml-1">| {office.altPhone}</span>
                                        )}
                                    </div>
                                </a>

                                {/* Email */}
                                {office.email && (
                                    <a
                                        href={`mailto:${office.email}`}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#364fa1] transition-colors group/link"
                                    >
                                        <div className="w-8 h-8 bg-[#364fa1]/10 rounded-lg flex items-center justify-center group-hover/link:bg-[#364fa1]/20 transition-colors">
                                            <Mail size={14} className="text-[#364fa1]" />
                                        </div>
                                        <span className="font-svn-avo-bold">{office.email}</span>
                                    </a>
                                )}

                                {/* Address */}
                                <div className="flex items-start gap-2 text-sm text-gray-500">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin size={14} className="text-gray-400" />
                                    </div>
                                    <span className="font-svn-avo-bold text-xs md:text-sm leading-relaxed">
                                        {isVi ? office.addressVi : office.addressEn}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Working Hours Banner */}
                <div className="bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] rounded-xl md:rounded-2xl p-4 md:p-6 mb-10 md:mb-16 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Clock size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-svn-avo-extra-bold text-lg">
                                    {isVi ? 'Giờ làm việc' : 'Working Hours'}
                                </h3>
                                <p className="font-svn-avo-bold text-white/80 text-sm">
                                    {isVi ? 'Thứ 2 - Thứ 6: 8:00 - 17:30' : 'Mon - Fri: 8:00 - 17:30'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                            <span className="font-svn-avo-bold text-sm">
                                {isVi ? 'Hỗ trợ kỹ thuật 24/7' : '24/7 Technical Support'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact Form and Map */}
                <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                    {/* Map */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg overflow-hidden h-[300px] md:h-[400px] lg:h-auto order-2 lg:order-1">
                        <iframe
                            src="https://maps.google.com/maps?q=11B%20Nguy%E1%BB%85n%20B%E1%BB%89nh%20Khi%C3%AAm%2C%20B%E1%BA%BFn%20Ngh%C3%A9%2C%20Qu%E1%BA%ADn%201%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=17&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '300px' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Toan Thang Engineering Location"
                        ></iframe>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-5 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-md md:shadow-lg order-1 lg:order-2 border border-gray-100">
                        {/* Form Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#364fa1] to-[#5a7ec9] rounded-xl flex items-center justify-center">
                                <Send size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-svn-avo-extra-bold text-gray-900">
                                    {isVi ? 'Gửi tin nhắn' : 'Send Message'}
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
                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-xs md:text-sm font-svn-avo-bold text-gray-700 mb-1.5">
                                            {dict.contact.form.name} *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1]/20 focus:border-[#364fa1] transition-all duration-300 font-svn-avo-bold text-sm md:text-base"
                                            placeholder={isVi ? 'Nhập họ và tên' : 'Enter your name'}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-xs md:text-sm font-svn-avo-bold text-gray-700 mb-1.5">
                                            {dict.contact.form.email} *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1]/20 focus:border-[#364fa1] transition-all duration-300 font-svn-avo-bold text-sm md:text-base"
                                            placeholder={isVi ? 'Nhập email' : 'Enter email'}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-xs md:text-sm font-svn-avo-bold text-gray-700 mb-1.5">
                                            {dict.contact.form.phone}
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1]/20 focus:border-[#364fa1] transition-all duration-300 font-svn-avo-bold text-sm md:text-base"
                                            placeholder={isVi ? 'Số điện thoại' : 'Phone number'}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-xs md:text-sm font-svn-avo-bold text-gray-700 mb-1.5">
                                            {dict.contact.form.subject}
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1]/20 focus:border-[#364fa1] transition-all duration-300 font-svn-avo-bold text-sm md:text-base"
                                            placeholder={isVi ? 'Chủ đề' : 'Subject'}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-xs md:text-sm font-svn-avo-bold text-gray-700 mb-1.5">
                                        {dict.contact.form.message} *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1]/20 focus:border-[#364fa1] transition-all duration-300 resize-none font-svn-avo-bold text-sm md:text-base"
                                        placeholder={isVi ? 'Nội dung tin nhắn...' : 'Your message...'}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 md:px-6 md:py-4 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-extra-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm md:text-base"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>{dict.common.loading}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>{dict.contact.form.submit}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
