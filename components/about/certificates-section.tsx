"use client"

import Image from "next/image"
import { Award } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { certificates } from "@/lib/data"

interface CertificatesSectionProps {
    lang: Locale
    dict: Dictionary
}

export function CertificatesSection({ lang, dict }: CertificatesSectionProps) {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                        {dict.about.certificates}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] rounded-full mx-auto"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {certificates.map((cert) => (
                        <div
                            key={cert.id}
                            className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-[#364fa1]/40 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                        >
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#364fa1]/10 to-[#5a7ec9]/10 rounded-full"></div>
                                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                    <Award size={48} className="text-[#364fa1] group-hover:scale-110 transition-transform duration-300" />
                                </div>
                            </div>
                            <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                                {cert.name}
                            </h3>
                            <p className="font-body text-gray-600 text-sm mb-2">
                                {cert.issuer}
                            </p>
                            <span className="inline-block px-3 py-1 bg-[#364fa1]/10 text-[#364fa1] text-xs font-heading font-bold rounded-full">
                                {cert.year}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
