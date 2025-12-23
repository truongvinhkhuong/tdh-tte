"use client"

import Image from "next/image"
import { Facebook, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Công Ty",
      links: ["Về chúng tôi", "Dịch vụ", "Dự án", "Blog"],
    },
    {
      title: "Hỗ Trợ",
      links: ["Liên hệ", "FAQ", "Hướng dẫn", "Chính sách"],
    },
    {
      title: "Pháp Lý",
      links: ["Điều khoản", "Chính sách bảo mật", "Cookie", "Bản quyền"],
    },
  ]

  return (
    <footer className="bg-gradient-to-b from-slate-350 to-slate-400 text-slate-800 pt-20 pb-8 rounded-t-3xl border-t-2 border-[#2B54A7]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <Image 
                src="/ToanThang-Logo.svg" 
                alt="Toàn Thắng" 
                width={140}
                height={40}
                className="object-contain"
              />
            </div>
            <p className="font-body text-slate-600 mb-6 leading-relaxed">
              Công ty cổ phần Kỹ Thuật Toàn Thắng - Cung cấp giải pháp công nghệ hàng đầu cho ngành dầu khí.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-slate-200 hover:bg-[#2B54A7] rounded-lg flex items-center justify-center transition-all duration-300 group shadow-sm"
              >
                <Facebook size={20} className="text-slate-700 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-200 hover:bg-[#2B54A7] rounded-lg flex items-center justify-center transition-all duration-300 group shadow-sm"
              >
                <Twitter size={20} className="text-slate-700 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-200 hover:bg-[#2B54A7] rounded-lg flex items-center justify-center transition-all duration-300 group shadow-sm"
              >
                <Linkedin size={20} className="text-slate-700 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-heading font-bold text-lg mb-6 text-slate-900">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="font-body text-slate-600 hover:text-[#2B54A7] transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-300 mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-slate-600 text-sm">
            © {currentYear} Công ty cổ phần Kỹ Thuật Toàn Thắng. 
          </p>
         
        </div>
      </div>
    </footer>
  )
}
