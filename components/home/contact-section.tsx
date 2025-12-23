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
        <section id="contact" className="py-24 scroll-mt-24 bg-gradient-to-b from-white via-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <h2 className="text-4xl md:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2">
                            {dict.contact.title}
                        </h2>
                    </div>
                    <p className="text-lg font-svn-avo text-gray-600 max-w-2xl mx-auto mt-8">
                        {dict.contact.subtitle}
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {contactInfo.map((info, index) => {
                        const IconComponent = info.icon
                        return (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 hover:border-[#364fa1]/40 group"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-[#364fa1] to-[#5a7ec9] text-white group-hover:scale-110 transition-transform duration-300">
                                    <IconComponent size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-svn-avo-extra-bold text-gray-900 mb-2">{info.title}</h3>
                                <p className="font-svn-avo text-gray-600">{info.content}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Contact Form and Map */}
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Map */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[400px] lg:h-auto">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4240888837474!2d106.70076691474905!3d10.779821492319028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc7%3A0x4db964d76bf6e18e!2zMTFCIE5ndXnhu4VuIELhu4luaCBLaGnDqm0sIELhur9uIE5naMOpLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1703312000000!5m2!1svi!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '400px' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Toan Thang Engineering Location"
                        ></iframe>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-svn-avo-extra-bold text-gray-700 mb-2">
                                        {dict.contact.form.name} *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1] focus:border-transparent transition-all duration-300 font-svn-avo"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-svn-avo-extra-bold text-gray-700 mb-2">
                                        {dict.contact.form.email} *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1] focus:border-transparent transition-all duration-300 font-svn-avo"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-svn-avo-extra-bold text-gray-700 mb-2">
                                        {dict.contact.form.phone}
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1] focus:border-transparent transition-all duration-300 font-svn-avo"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-svn-avo-extra-bold text-gray-700 mb-2">
                                        {dict.contact.form.subject}
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1] focus:border-transparent transition-all duration-300 font-svn-avo"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-svn-avo-extra-bold text-gray-700 mb-2">
                                    {dict.contact.form.message} *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#364fa1] focus:border-transparent transition-all duration-300 resize-none font-svn-avo"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-extra-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmitting ? (
                                    <span>{dict.common.loading}</span>
                                ) : (
                                    <>
                                        <Send size={20} />
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
