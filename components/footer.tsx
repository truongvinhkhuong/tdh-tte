"use client"

import { Facebook, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Công Ty",
      links: ["Về Chúng Tôi", "Dịch Vụ", "Dự Án", "Blog"],
    },
    {
      title: "Hỗ Trợ",
      links: ["Liên Hệ", "FAQ", "Hướng Dẫn", "Chính Sách"],
    },
    {
      title: "Pháp Lý",
      links: ["Điều Khoản", "Chính Sách Bảo Mật", "Cookie", "Bản Quyền"],
    },
  ]

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black text-white pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold">TTE</span>
            </div>
            <p className="text-gray-400 mb-6">
              Công ty cổ phần Kỹ Thuật Toàn Thắng - Cung cấp giải pháp công nghệ hàng đầu cho ngành dầu khí.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <Facebook size={20} className="group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <Twitter size={20} className="group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <Linkedin size={20} className="group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-lg mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Công ty cổ phần Kỹ Thuật Toàn Thắng. Tất cả quyền được bảo lưu.
          </p>
          <p className="text-gray-400 text-sm">
            Thiết kế bởi <span className="text-white font-semibold">TTE Team</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
