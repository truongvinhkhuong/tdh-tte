"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Phone, Mail, Send } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { companyInfo } from "@/lib/data"

interface ContactSectionProps {
    lang: Locale
    dict: Dictionary
}

export function ContactSection({ lang, dict }: ContactSectionProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

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

        console.log("Form submitted:", formData)
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        setIsSubmitting(false)

        // Show success message (you can add a toast here)
        alert(lang === 'vi' ? 'Gửi thành công!' : 'Message sent successfully!')
    }

    const contactInfo = [
        {
            icon: MapPin,
            title: dict.contact.address,
            content: companyInfo.address,
        },
        {
            icon: Phone,
            title: dict.contact.phone,
            content: companyInfo.phone,
        },
        {
            icon: Mail,
            title: dict.contact.email,
            content: companyInfo.email,
        },
    ]

    return (
        <section id="contact" className="py-12 md:py-20 lg:py-24 scroll-mt-24 bg-gradient-to-b from-white via-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 md:mb-12 lg:mb-16">
                    <div className="inline-block">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2">
                            {dict.contact.title}
                        </h2>
                    </div>
                    <p className="text-sm md:text-base lg:text-lg font-svn-avo-bold text-gray-800 max-w-2xl mx-auto mt-3 md:mt-6 lg:mt-8">
                        {dict.contact.subtitle}
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 lg:mb-16">
                    {contactInfo.map((info, index) => {
                        const IconComponent = info.icon
                        return (
                            <div
                                key={index}
                                className="bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-md md:shadow-lg text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 hover:border-[#364fa1]/40 group"
                            >
                                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-2 sm:mb-3 md:mb-4 lg:mb-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#364fa1] to-[#5a7ec9] text-white group-hover:scale-110 transition-transform duration-300">
                                    <IconComponent size={20} className="sm:hidden" strokeWidth={1.5} />
                                    <IconComponent size={24} className="hidden sm:block md:hidden" strokeWidth={1.5} />
                                    <IconComponent size={28} className="hidden md:block" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-sm sm:text-base md:text-lg font-svn-avo-extra-bold text-gray-900 mb-1 md:mb-2">{info.title}</h3>
                                <p className="font-svn-avo-bold text-gray-800 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-none">{info.content}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Contact Form and Map */}
                <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                    {/* Map */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg overflow-hidden h-[250px] sm:h-[300px] md:h-[350px] lg:h-auto order-2 lg:order-1">
                        <iframe
                            src="https://maps.google.com/maps?q=11B%20Nguy%E1%BB%85n%20B%E1%BB%89nh%20Khi%C3%AAm%2C%20B%E1%BA%BFn%20Ngh%C3%A9%2C%20Qu%E1%BA%ADn%201%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=17&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '250px' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Toan Thang Engineering Location"
                        ></iframe>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-md md:shadow-lg order-1 lg:order-2">
                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-xs md:text-sm font-svn-avo-extra-bold text-gray-700 mb-1 md:mb-2">
                                        {dict.contact.form.name} *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1] focus:border-transparent transition-all duration-300 font-svn-avo text-sm md:text-base"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-xs md:text-sm font-svn-avo-extra-bold text-gray-700 mb-1 md:mb-2">
                                        {dict.contact.form.email} *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1] focus:border-transparent transition-all duration-300 font-svn-avo text-sm md:text-base"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                                <div>
                                    <label htmlFor="phone" className="block text-xs md:text-sm font-svn-avo-extra-bold text-gray-700 mb-1 md:mb-2">
                                        {dict.contact.form.phone}
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1] focus:border-transparent transition-all duration-300 font-svn-avo text-sm md:text-base"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-xs md:text-sm font-svn-avo-extra-bold text-gray-700 mb-1 md:mb-2">
                                        {dict.contact.form.subject}
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1] focus:border-transparent transition-all duration-300 font-svn-avo text-sm md:text-base"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-xs md:text-sm font-svn-avo-extra-bold text-gray-700 mb-1 md:mb-2">
                                    {dict.contact.form.message} *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1] focus:border-transparent transition-all duration-300 resize-none font-svn-avo text-sm md:text-base"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-extra-bold rounded-lg md:rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm md:text-base"
                            >
                                {isSubmitting ? (
                                    <span>{dict.common.loading}</span>
                                ) : (
                                    <>
                                        <Send size={16} className="md:hidden" />
                                        <Send size={20} className="hidden md:block" />
                                        <span>{dict.contact.form.submit}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
