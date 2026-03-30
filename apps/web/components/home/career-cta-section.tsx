"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Users, Star, Briefcase, ArrowRight } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"

interface CareerCtaSectionProps {
    lang: Locale
    dict: Dictionary
}

export function CareerCtaSection({ lang, dict }: CareerCtaSectionProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true)
            },
            { threshold: 0.1 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    const cards = [
        {
            icon: Users,
            label: dict.careers.cta.lifeLabel,
            desc: dict.careers.cta.lifeDesc,
            href: `/${lang}/careers#life-at-tte`,
        },
        {
            icon: Star,
            label: dict.careers.cta.whyLabel,
            desc: dict.careers.cta.whyDesc,
            href: `/${lang}/careers#why-tte`,
        },
        {
            icon: Briefcase,
            label: dict.careers.cta.jobsLabel,
            desc: dict.careers.cta.jobsDesc,
            href: `/${lang}/careers#open-positions`,
        },
    ]

    return (
        <section
            ref={ref}
            className={`py-20 bg-gradient-to-br from-[#1e3a75] via-[#2B54A7] to-[#1e3a75] transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-5 gap-12 items-center">
                    {/* Left: Headline + CTAs */}
                    <div className="lg:col-span-3">
                        <p className="text-sm font-svn-avo-bold text-white/60 uppercase tracking-widest mb-4">
                            {lang === "vi" ? "Cơ hội nghề nghiệp" : "Career Opportunities"}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-svn-avo-extra-bold text-white mb-4 leading-snug">
                            {dict.careers.cta.title}
                        </h2>
                        <p className="text-lg font-svn-avo-bold text-white/70 mb-8 leading-relaxed">
                            {dict.careers.cta.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={`/${lang}/careers#join-us`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2B54A7] font-svn-avo-bold rounded-xl hover:bg-gray-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                {dict.careers.cta.primaryCta}
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href={`/${lang}/careers#life-at-tte`}
                                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/40 text-white font-svn-avo-bold rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300"
                            >
                                {dict.careers.cta.secondaryCta}
                            </Link>
                        </div>
                    </div>

                    {/* Right: Mini-cards */}
                    <div className="lg:col-span-2 space-y-3">
                        {cards.map(({ icon: Icon, label, desc, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className="flex items-center gap-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-4 transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-all duration-300">
                                    <Icon size={20} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-svn-avo-extra-bold text-white text-sm">{label}</p>
                                    <p className="text-xs font-svn-avo-bold text-white/60 truncate">{desc}</p>
                                </div>
                                <ArrowRight
                                    size={16}
                                    className="text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300 shrink-0"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
