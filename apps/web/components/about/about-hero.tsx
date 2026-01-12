"use client"

import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"

interface AboutHeroProps {
    lang: Locale
    dict: Dictionary
}

export function AboutHero({ lang, dict }: AboutHeroProps) {
    return (
        <section className="relative py-24 bg-gradient-to-r from-[#2B54A7] to-[#1e3a75] overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-svn-avo-extra-bold text-white mb-6">
                        {dict.about.title}
                    </h1>
                    <p className="text-xl font-svn-avo-bold text-white/80 max-w-3xl mx-auto leading-relaxed">
                        {dict.about.subtitle}
                    </p>
                </div>
            </div>
        </section>
    )
}
