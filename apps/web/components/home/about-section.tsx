"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Settings, Headphones, Lightbulb, Target } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"

interface AboutSectionProps {
    lang: Locale
    dict: Dictionary
}

export function AboutSection({ lang, dict }: AboutSectionProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 },
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    const features = [
        {
            Icon: Settings,
            title: dict.about.features.equipment,
            description: dict.about.features.equipmentDesc,
            gradient: "from-[#364fa1] via-[#4056a8] to-[#5a7ec9]",
            iconColor: "text-[#364fa1]",
            shadowColor: "shadow-[#364fa1]/50",
        },
        {
            Icon: Headphones,
            title: dict.about.features.support,
            description: dict.about.features.supportDesc,
            gradient: "from-[#5a7ec9] via-[#4f6db3] to-[#364fa1]",
            iconColor: "text-[#4f6db3]",
            shadowColor: "shadow-[#4f6db3]/50",
        },
        {
            Icon: Lightbulb,
            title: dict.about.features.solutions,
            description: dict.about.features.solutionsDesc,
            gradient: "from-[#364fa1] via-[#4a5eb0] to-[#6b7fc6]",
            iconColor: "text-[#4a5eb0]",
            shadowColor: "shadow-[#4a5eb0]/50",
        },
        {
            Icon: Target,
            title: dict.about.features.experience,
            description: dict.about.features.experienceDesc,
            gradient: "from-[#5a6cb8] via-[#4f6db3] to-[#7b93d1]",
            iconColor: "text-[#5a6cb8]",
            shadowColor: "shadow-[#5a6cb8]/50",
        },
    ]

    const stats = [
        { number: "30+", label: dict.about.stats.years },
        { number: "500+", label: dict.about.stats.projects },
        { number: "100+", label: dict.about.stats.employees },
        { number: "98%", label: dict.about.stats.satisfaction },
    ]

    return (
        <section id="about" className="pt-32 pb-24 scroll-mt-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#364fa1]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"></div>
            <div
                className="absolute bottom-0 left-0 w-96 h-96 bg-[#5a7ec9]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"
                style={{ animationDelay: "2s" }}
            ></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <div className="inline-block">
                            <h2 className="text-4xl md:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2">
                                {dict.about.title}
                            </h2>
                        </div>
                        <p className="text-lg font-svn-avo-bold text-gray-800 max-w-2xl mx-auto mt-8 leading-relaxed">
                            {dict.about.subtitle}
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {features.map((feature, index) => {
                            const Icon = feature.Icon
                            return (
                                <div
                                    key={index}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className={`group relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 hover:border-transparent shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 ${hoveredIndex === index ? feature.shadowColor : ''}`}
                                    style={{
                                        animationName: isVisible ? 'cardLift' : 'none',
                                        animationDuration: '0.8s',
                                        animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        animationFillMode: 'forwards',
                                        animationDelay: `${index * 0.15}s`,
                                        opacity: isVisible ? 1 : 0,
                                    }}
                                >
                                    {/* Gradient Background */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                                    ></div>

                                    <div className="relative z-10">
                                        {/* Icon Container */}
                                        <div className={`relative inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[2px] transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                                            <div className="flex items-center justify-center w-full h-full bg-white rounded-2xl">
                                                <Icon
                                                    className={`w-8 h-8 ${feature.iconColor} transition-all duration-500 group-hover:scale-110`}
                                                    strokeWidth={2.5}
                                                />
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h4 className="font-svn-avo-extra-bold text-lg text-gray-900 mb-3 transition-colors duration-300">
                                            {feature.title}
                                        </h4>

                                        {/* Description */}
                                        <p className="text-sm font-svn-avo-bold text-gray-800 transition-colors leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Mission & Stats Section */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h3 className="text-3xl md:text-4xl font-svn-avo-extra-bold text-gray-900">
                                {dict.about.mission}
                            </h3>
                            <p className="font-svn-avo-bold text-gray-800 leading-relaxed text-lg">
                                {dict.about.missionDesc}
                            </p>
                            <p className="font-svn-avo-bold text-gray-800 leading-relaxed text-lg">
                                {dict.about.visionDesc}
                            </p>
                            <Link
                                href={`/${lang}/about`}
                                className="inline-block px-8 py-3 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-extra-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                {dict.about.learnMore}
                            </Link>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-gradient-to-br from-[#364fa1]/5 to-[#5a7ec9]/10 rounded-2xl text-center border border-[#364fa1]/20 hover:border-[#364fa1]/40 transition-all duration-300"
                                    style={{
                                        animationName: isVisible ? 'cardLift' : 'none',
                                        animationDuration: '0.8s',
                                        animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        animationFillMode: 'forwards',
                                        animationDelay: `${index * 0.15 + 0.6}s`,
                                        opacity: isVisible ? 1 : 0,
                                    }}
                                >
                                    <div className="text-3xl md:text-4xl font-svn-avo-extra-bold text-[#364fa1] mb-2">{stat.number}</div>
                                    <p className="text-sm font-svn-avo-bold text-gray-800">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
