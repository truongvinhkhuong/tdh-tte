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
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mission & Vision */}
                <div className="grid lg:grid-cols-2 gap-12 mb-20">
                    <div className="bg-gradient-to-br from-[#364fa1]/5 to-[#5a7ec9]/10 p-10 rounded-3xl border border-[#364fa1]/20">
                        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
                            {dict.about.mission}
                        </h2>
                        <p className="font-body text-gray-600 text-lg leading-relaxed">
                            {dict.about.missionDesc}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-[#5a7ec9]/10 to-[#364fa1]/5 p-10 rounded-3xl border border-[#5a7ec9]/20">
                        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
                            {dict.about.vision}
                        </h2>
                        <p className="font-body text-gray-600 text-lg leading-relaxed">
                            {dict.about.visionDesc}
                        </p>
                    </div>
                </div>

                {/* Core Values */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                        {dict.about.coreValues}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => {
                        const Icon = value.icon
                        return (
                            <div
                                key={index}
                                className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-[#364fa1]/40 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className={`inline-flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gradient-to-r ${value.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                                    {value.title}
                                </h3>
                                <p className="font-body text-gray-600 text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
