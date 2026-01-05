"use client"

import { Target, Eye, Heart, Users } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"

interface CompanyIntroProps {
    lang: Locale
    dict: Dictionary
}

export function CompanyIntro({ lang, dict }: CompanyIntroProps) {
    const values = [
        {
            icon: Target,
            title: dict.about.values.quality,
            description: dict.about.values.qualityDesc,
            color: "from-[#364fa1] to-[#5a7ec9]",
        },
        {
            icon: Eye,
            title: dict.about.values.innovation,
            description: dict.about.values.innovationDesc,
            color: "from-[#5a7ec9] to-[#364fa1]",
        },
        {
            icon: Heart,
            title: dict.about.values.integrity,
            description: dict.about.values.integrityDesc,
            color: "from-[#364fa1] to-[#6b7fc6]",
        },
        {
            icon: Users,
            title: dict.about.values.partnership,
            description: dict.about.values.partnershipDesc,
            color: "from-[#5a6cb8] to-[#7b93d1]",
        },
    ]

    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mission & Vision - Compact Side by Side */}
                <div className="grid lg:grid-cols-2 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-[#364fa1]/5 to-[#5a7ec9]/10 p-6 md:p-8 rounded-2xl border border-[#364fa1]/20">
                        <h2 className="text-2xl font-svn-avo-extra-bold text-gray-900 mb-3">
                            {dict.about.mission}
                        </h2>
                        <p className="font-svn-avo-bold  text-gray-800 text-base leading-relaxed">
                            {dict.about.missionDesc}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-[#5a7ec9]/10 to-[#364fa1]/5 p-6 md:p-8 rounded-2xl border border-[#5a7ec9]/20">
                        <h2 className="text-2xl font-svn-avo-extra-bold text-gray-900 mb-3">
                            {dict.about.vision}
                        </h2>
                        <p className="font-svn-avo-bold text-gray-800 text-base leading-relaxed">
                            {dict.about.visionDesc}
                        </p>
                    </div>
                </div>

                {/* Core Values - Compact Horizontal Design */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 md:p-8 border border-gray-100">
                    <div className="text-center mb-6">
                        <div className="inline-block">
                            <h2 className="text-3xl md:text-4xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-1">
                                {dict.about.coreValues}
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {values.map((value, index) => {
                            const Icon = value.icon
                            return (
                                <div
                                    key={index}
                                    className="group flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-100 hover:border-[#364fa1]/40 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className={`flex items-center justify-center w-11 h-11 mb-3 rounded-lg bg-gradient-to-r ${value.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-base font-svn-avo-extra-bold text-gray-900 mb-1">
                                        {value.title}
                                    </h3>
                                    <p className="font-svn-avo-bold text-gray-800 text-xs leading-relaxed line-clamp-2">
                                        {value.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
