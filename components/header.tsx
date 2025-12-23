"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Detect scroll direction for hide/show effect
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false) // Scrolling down
      } else {
        setIsVisible(true) // Scrolling up
      }
      
      setIsScrolled(currentScrollY > 20)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navItems = [
    { label: "Trang chủ", href: "#" },
    { label: "Về chúng tôi", href: "#about" },
    { label: "Dịch vụ", href: "#services" },
    { label: "Sản phẩm", href: "#products" },
    { label: "Dự án", href: "#projects" },
    { label: "Liên hệ", href: "#contact" },
  ]

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 py-2' 
          : 'bg-gradient-to-b from-[#2B54A7]/95 via-[#2B54A7]/90 to-[#2B54A7]/85 backdrop-blur-md shadow-xl py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo */}
          <Link 
            href="#" 
            className={`flex items-center group transform transition-all duration-300 hover:scale-105 ${
              isScrolled ? 'scale-95' : 'scale-100'
            }`}
          >
            <div className={`relative flex items-center transition-all duration-500 ${
              !isScrolled ? 'px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-2xl' : ''
            }`}>
              <Image 
                src="/ToanThang-Logo.svg" 
                alt="Toàn Thắng" 
                width={isScrolled ? 120 : 150}
                height={isScrolled ? 40 : 50}
                className={`transition-all duration-500 object-contain ${
                  !isScrolled ? 'drop-shadow-sm' : ''
                }`}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`relative px-4 py-2 text-sm font-heading font-semibold transition-all duration-300 rounded-lg group overflow-hidden ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-[#2B54A7]' 
                    : 'text-white/95 hover:text-white drop-shadow-sm'
                }`}
              >
                {/* Hover background effect */}
                <span className={`absolute inset-0 rounded-lg transition-all duration-300 transform scale-0 group-hover:scale-100 ${
                  isScrolled 
                    ? 'bg-[#2B54A7]/10' 
                    : 'bg-white/20 backdrop-blur-sm'
                }`}></span>
                
                {/* Text */}
                <span className="relative z-10">{item.label}</span>
                
                {/* Animated underline */}
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-3/4 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-[#2B54A7] to-[#1e3a75]' 
                    : 'bg-white shadow-lg'
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <button 
            onClick={scrollToContact}
            className={`hidden md:inline-flex items-center gap-2 px-6 py-2.5 font-heading font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 shadow-lg hover:shadow-2xl ${
              isScrolled 
                ? 'bg-gradient-to-r from-[#2B54A7] to-[#1e3a75] text-white hover:shadow-[#2B54A7]/30' 
                : 'bg-white text-[#2B54A7] hover:bg-gray-50 hover:shadow-white/20'
            }`}
          >
            <span>Liên hệ ngay</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2.5 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
              isScrolled 
                ? 'hover:bg-[#2B54A7]/10 text-gray-700' 
                : 'hover:bg-white/20 text-white backdrop-blur-sm'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X size={24} className="transform rotate-0 transition-transform duration-300" />
            ) : (
              <Menu size={24} className="transform rotate-0 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Enhanced with better animations */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0'
        }`}>
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`block px-4 py-3 rounded-xl font-heading font-medium transition-all duration-300 transform hover:translate-x-2 hover:scale-105 ${
                  isMobileMenuOpen ? 'animate-fade-in-up' : ''
                } ${
                  isScrolled 
                    ? 'text-gray-700 hover:bg-[#2B54A7]/10 hover:text-[#2B54A7]' 
                    : 'text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isScrolled ? 'bg-[#2B54A7]' : 'bg-white'
                  }`}></span>
                  {item.label}
                </span>
              </Link>
            ))}
            <button 
              onClick={scrollToContact}
              className={`w-full mt-3 px-4 py-3 font-heading font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg ${
                isScrolled 
                  ? 'bg-gradient-to-r from-[#2B54A7] to-[#1e3a75] text-white' 
                  : 'bg-white text-[#2B54A7] hover:bg-gray-50'
              } ${isMobileMenuOpen ? 'animate-fade-in-up' : ''}`}
            >
              <span>Liên hệ ngay</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
