"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, Search, Globe } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"

interface HeaderProps {
  lang: Locale
  dict: Dictionary
}

export function Header({ lang, dict }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: dict.nav.home, href: `/${lang}` },
    { label: dict.nav.about, href: `/${lang}/about` },
    { label: dict.nav.products, href: `/${lang}/products` },
    { label: dict.nav.services, href: `/${lang}/services` },
    { label: dict.nav.projects, href: `/${lang}/projects` },
    { label: dict.nav.techHub, href: `/${lang}/tech-hub` },
    { label: dict.nav.news, href: `/${lang}/news` },
    { label: dict.nav.careers, href: `/${lang}/careers` },
  ]

  const otherLang = lang === 'vi' ? 'en' : 'vi'

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 py-2'
          : 'bg-gradient-to-b from-[#2B54A7]/95 via-[#2B54A7]/90 to-[#2B54A7]/85 backdrop-blur-md shadow-xl py-3'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'
          }`}>
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className={`flex items-center group transform transition-all duration-300 hover:scale-105 ${isScrolled ? 'scale-95' : 'scale-100'
              }`}
          >
            <div className={`relative flex items-center transition-all duration-500 ${!isScrolled ? 'px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-2xl' : ''
              }`}>
              <Image
                src="/ToanThang-Logo.svg"
                alt="Toàn Thắng"
                width={isScrolled ? 120 : 150}
                height={isScrolled ? 40 : 50}
                className={`transition-all duration-500 object-contain ${!isScrolled ? 'drop-shadow-sm' : ''
                  }`}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`relative px-3 py-2 text-sm font-svn-avo-bold transition-all duration-300 rounded-lg group overflow-hidden ${isScrolled
                  ? 'text-gray-700 hover:text-[#2B54A7]'
                  : 'text-white/95 hover:text-white drop-shadow-sm'
                  }`}
              >
                <span className={`absolute inset-0 rounded-lg transition-all duration-300 transform scale-0 group-hover:scale-100 ${isScrolled
                  ? 'bg-[#2B54A7]/10'
                  : 'bg-white/20 backdrop-blur-sm'
                  }`}></span>
                <span className="relative z-10">{item.label}</span>
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-3/4 ${isScrolled
                  ? 'bg-gradient-to-r from-[#2B54A7] to-[#1e3a75]'
                  : 'bg-white shadow-lg'
                  }`}></span>
              </Link>
            ))}
          </nav>

          {/* Right Section: Search, Language, CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${isScrolled
                ? 'hover:bg-gray-100 text-gray-700'
                : 'hover:bg-white/20 text-white'
                }`}
            >
              <Search size={20} />
            </button>

            {/* Language Switcher */}
            <Link
              href={`/${otherLang}`}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-svn-avo-bold text-sm transition-all duration-300 ${isScrolled
                ? 'hover:bg-gray-100 text-gray-700'
                : 'hover:bg-white/20 text-white'
                }`}
            >
              <Globe size={18} />
              <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
            </Link>

            {/* CTA Button */}
            <Link
              href={`/${lang}/contact`}
              className={`inline-flex items-center gap-2 px-5 py-2.5 font-svn-avo-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 shadow-lg hover:shadow-2xl ${isScrolled
                ? 'bg-gradient-to-r from-[#2B54A7] to-[#1e3a75] text-white hover:shadow-[#2B54A7]/30'
                : 'bg-white text-[#2B54A7] hover:bg-gray-50 hover:shadow-white/20'
                }`}
            >
              <span>{dict.header.contactNow}</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${isScrolled
              ? 'hover:bg-[#2B54A7]/10 text-gray-700'
              : 'hover:bg-white/20 text-white backdrop-blur-sm'
              }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Search Bar (Desktop) */}
        {isSearchOpen && (
          <div className={`hidden md:block py-4 transition-all duration-300 ${isScrolled ? 'bg-white' : 'bg-white/10 backdrop-blur-md rounded-lg mt-2'
            }`}>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder={dict.header.searchPlaceholder}
                className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-300 font-body ${isScrolled
                  ? 'border-gray-200 focus:border-[#2B54A7] bg-gray-50'
                  : 'border-white/30 focus:border-white bg-white/20 text-white placeholder:text-white/70'
                  }`}
              />
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isScrolled ? 'text-gray-400' : 'text-white/70'
                }`} size={20} />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 py-4' : 'max-h-0 opacity-0'
          }`}>
          <nav className="space-y-1">
            {/* Language Switcher Mobile */}
            <Link
              href={`/${otherLang}`}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-svn-avo-bold transition-all duration-300 ${isScrolled
                ? 'text-gray-700 hover:bg-[#2B54A7]/10 hover:text-[#2B54A7]'
                : 'text-white hover:bg-white/20'
                }`}
            >
              <Globe size={18} />
              <span>{lang === 'vi' ? 'English' : 'Tiếng Việt'}</span>
            </Link>

            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`block px-4 py-3 rounded-xl font-svn-avo-bold transition-all duration-300 transform hover:translate-x-2 hover:scale-105 ${isMobileMenuOpen ? 'animate-fade-in-up' : ''
                  } ${isScrolled
                    ? 'text-gray-700 hover:bg-[#2B54A7]/10 hover:text-[#2B54A7]'
                    : 'text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isScrolled ? 'bg-[#2B54A7]' : 'bg-white'
                    }`}></span>
                  {item.label}
                </span>
              </Link>
            ))}
            <Link
              href={`/${lang}/contact`}
              className={`w-full mt-3 px-4 py-3 font-svn-avo-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg ${isScrolled
                ? 'bg-gradient-to-r from-[#2B54A7] to-[#1e3a75] text-white'
                : 'bg-white text-[#2B54A7] hover:bg-gray-50'
                } ${isMobileMenuOpen ? 'animate-fade-in-up' : ''}`}
            >
              <span>{dict.header.contactNow}</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
