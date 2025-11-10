"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Mail } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa Chỉ",
      content: " 11B Nguyễn Bỉnh Khiêm, P. Bến Nghé, Q.1, TP. HCM",
    },
    {
      icon: Phone,
      title: "Điện Thoại",
      content: "(84-254) 3522219",
    },
    {
      icon: Mail,
      title: "Email",
      content: "tts@toanthang.vn",
    },
  ]

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Liên Hệ Với Chúng Tôi</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hãy liên hệ với chúng tôi để được tư vấn miễn phí về các giải pháp phù hợp với nhu cầu của bạn
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100 hover:border-blue-300 group"
              >
                <div className="text-4xl mb-4 text-blue-600 group-hover:text-cyan-500 transition-colors inline-block">
                  <IconComponent size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{info.title}</h3>
                <p className="text-muted-foreground">{info.content}</p>
              </div>
            )
          })}
        </div>

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Tên của bạn"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email của bạn"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                required
              />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
            />
            <textarea
              name="message"
              placeholder="Nội dung tin nhắn"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 resize-none"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Gửi Thông Tin
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
