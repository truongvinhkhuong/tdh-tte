"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Linkedin, Mail } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { companyInfo } from "@/lib/data"

interface FooterProps {
  lang: Locale
  dict: Dictionary
}

export function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: dict.footer.company,
      links: [
        { label: dict.footer.links.about, href: `/${lang}/about` },
        { label: dict.footer.links.services, href: `/${lang}/services` },
        { label: dict.footer.links.projects, href: `/${lang}/projects` },
        { label: dict.footer.links.blog, href: `/${lang}/news` },
        { label: dict.footer.links.careers, href: `/${lang}/careers` },
      ],
    },
    {
      title: dict.footer.support,
      links: [
        { label: dict.footer.links.contact, href: `/${lang}/contact` },
        { label: dict.footer.links.faq, href: `/${lang}/faq` },
        { label: dict.footer.links.guide, href: `/${lang}/tech-hub` },
        { label: dict.footer.links.policy, href: `/${lang}/policy` },
      ],
    },
    {
      title: dict.footer.legal,
      links: [
        { label: dict.footer.links.terms, href: `/${lang}/terms` },
        { label: dict.footer.links.privacy, href: `/${lang}/privacy` },
        { label: dict.footer.links.cookie, href: `/${lang}/cookie` },
        { label: dict.footer.links.copyright, href: `/${lang}/copyright` },
      ],
    },
  ]

  return (
    <footer className="bg-gradient-to-b from-slate-100 to-slate-200 text-slate-800 pt-20 pb-8 border-t-2 border-[#2B54A7]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image
                src="/ToanThang-Logo.svg"
                alt="Toàn Thắng"
                width={160}
                height={50}
                className="object-contain"
              />
            </div>
            <p className="font-svn-avo-bold text-slate-800 mb-4 leading-relaxed">
              {companyInfo.name}
            </p>
            <div className="space-y-2 text-sm text-slate-800 mb-6">
              <p>{companyInfo.address}</p>
              <p>{dict.contact.phone}: <a href={`tel:${companyInfo.phone}`} className="hover:text-[#2B54A7] transition-colors">{companyInfo.phone}</a></p>
              <p>{dict.contact.email}: {companyInfo.email}</p>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {companyInfo.socialLinks.facebook && (
                <a
                  href={companyInfo.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-200 hover:bg-[#2B54A7] rounded-lg flex items-center justify-center transition-all duration-300 group shadow-sm"
                >
                  <Facebook size={20} className="text-slate-700 group-hover:text-white" />
                </a>
              )}
              {companyInfo.socialLinks.linkedin && (
                <a
                  href={companyInfo.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-200 hover:bg-[#2B54A7] rounded-lg flex items-center justify-center transition-all duration-300 group shadow-sm"
                >
                  <Linkedin size={20} className="text-slate-700 group-hover:text-white" />
                </a>
              )}
              <a
                href={`mailto:${companyInfo.email}`}
                className="w-10 h-10 bg-slate-200 hover:bg-[#2B54A7] rounded-lg flex items-center justify-center transition-all duration-300 group shadow-sm"
              >
                <Mail size={20} className="text-slate-700 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-svn-avo-extra-bold text-lg mb-6 text-slate-900">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="font-svn-avo-bold text-slate-800 hover:text-[#2B54A7] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-white/60 rounded-2xl p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-svn-avo-extra-bold text-lg text-slate-900 mb-1">
                {dict.footer.newsletter}
              </h3>
              <p className="font-svn-avo-bold text-slate-800 text-sm">
                {dict.footer.newsletterDesc}
              </p>
            </div>
            <form className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder={dict.footer.emailPlaceholder}
                className="flex-1 md:w-64 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B54A7] transition-all duration-300 font-body"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#2B54A7] to-[#1e3a75] text-white font-svn-avo-bold rounded-lg hover:shadow-lg transition-all duration-300"
              >
                {dict.footer.subscribe}
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-300 mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-svn-avo-bold text-slate-800 text-sm">
            © {currentYear} {dict.footer.copyright}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href={`/${lang}/terms`} className="text-slate-800 hover:text-[#2B54A7] transition-colors">
              {dict.footer.links.terms}
            </Link>
            <Link href={`/${lang}/privacy`} className="text-slate-800 hover:text-[#2B54A7] transition-colors">
              {dict.footer.links.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
