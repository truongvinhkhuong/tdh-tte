"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Lightbulb, Package, Wrench, Settings, Users, Headphones } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"

interface ServicesSectionProps {
    lang: Locale
    dict: Dictionary
}

const iconMap = {
    Lightbulb,
    Package,
    Wrench,
    Settings,
    Users,
    Headphones,
}

export function ServicesSection({ lang, dict }: ServicesSectionProps) {
    const [isVisible, setIsVisible] = useState(false)
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

    const services = [
        {
            title: dict.services.consulting,
            description: dict.services.consultingDesc,
            icon: "Lightbulb",
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            title: dict.services.supply,
            description: dict.services.supplyDesc,
            icon: "Package",
            gradient: "from-cyan-500 to-blue-500",
        },
        {
            title: dict.services.installation,
            description: dict.services.installationDesc,
            icon: "Wrench",
            gradient: "from-blue-600 to-purple-500",
        },
        {
            title: dict.services.maintenance,
            description: dict.services.maintenanceDesc,
            icon: "Settings",
            gradient: "from-purple-500 to-cyan-500",
        },
        {
            title: dict.services.training,
            description: dict.services.trainingDesc,
            icon: "Users",
            gradient: "from-blue-500 to-purple-500",
        },
        {
            title: dict.services.support,
            description: dict.services.supportDesc,
            icon: "Headphones",
            gradient: "from-cyan-500 to-purple-500",
        },
    ]

    return (
        <section id="services" className="py-24 scroll-mt-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"></div>
            <div
                className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"
                style={{ animationDelay: "2s" }}
            ></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <div className="text-center mb-20">
                        <div className="inline-block relative">
                            <h2 className="text-4xl md:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                {dict.services.title}
                            </h2>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
                        </div>
                        <p className="text-lg font-svn-avo text-gray-600 max-w-2xl mx-auto mt-8 leading-relaxed">
                            {dict.services.subtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const IconComponent = iconMap[service.icon as keyof typeof iconMap]
                            return (
                                <div
                                    key={index}
                                    className="group relative p-8 bg-white rounded-2xl border border-gray-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                                    style={{
                                        animationName: isVisible ? 'cardLift' : 'none',
                                        animationDuration: '0.8s',
                                        animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        animationFillMode: 'forwards',
                                        animationDelay: `${index * 0.1}s`,
                                        opacity: isVisible ? 1 : 0,
                                    }}
                                >
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                                    ></div>

                                    <div className="relative z-10">
                                        <div className="text-5xl mb-4 transition-all duration-300 group-hover:scale-125 inline-block text-blue-600 group-hover:text-cyan-500">
                                            <IconComponent size={48} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-xl font-svn-avo-extra-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm font-svn-avo text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                                            {service.description}
                                        </p>

                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href={`/${lang}/services`}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-svn-avo-extra-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            {dict.services.learnMore}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
