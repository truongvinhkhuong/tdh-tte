"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Calendar } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { projects } from "@/lib/data"

interface ProjectsSectionProps {
    lang: Locale
    dict: Dictionary
}

export function ProjectsSection({ lang, dict }: ProjectsSectionProps) {
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

    return (
        <section id="projects" className="py-12 md:py-20 lg:py-24 scroll-mt-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
            <div className="absolute top-20 right-20 w-80 h-80 bg-[#364fa1]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating hidden md:block"></div>
            <div
                className="absolute bottom-20 left-20 w-80 h-80 bg-[#5a7ec9]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating hidden md:block"
                style={{ animationDelay: "2s" }}
            ></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <div className="text-center mb-8 md:mb-12 lg:mb-20">
                        <div className="inline-block">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2">
                                {dict.projects.featured}
                            </h2>
                        </div>
                        <p className="text-sm md:text-base lg:text-lg font-svn-avo-bold text-gray-800 max-w-2xl mx-auto mt-3 md:mt-6 lg:mt-8">
                            {dict.projects.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        {projects.map((project, index) => (
                            <Link
                                key={project.id}
                                href={`/${lang}/projects/${project.slug}`}
                                className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-md md:shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#364fa1]/40 h-64 sm:h-72 md:h-80 lg:h-96"
                                style={{
                                    animationName: isVisible ? 'cardLift' : 'none',
                                    animationDuration: '0.8s',
                                    animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    animationFillMode: 'forwards',
                                    animationDelay: `${index * 0.1}s`,
                                    opacity: isVisible ? 1 : 0,
                                }}
                            >
                                <Image
                                    src={project.heroImage || "/placeholder.svg"}
                                    alt={project.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-all duration-300"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#364fa1]/20 to-[#5a7ec9]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 lg:p-6 text-white">
                                    <div className="transform transition-all duration-300 group-hover:translate-y-0">
                                        {/* Industry Badge */}
                                        <span className="inline-block px-2 md:px-3 py-0.5 md:py-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white text-[10px] md:text-xs font-svn-avo-extra-bold rounded-full mb-2 md:mb-3">
                                            {project.industry.name}
                                        </span>

                                        <h3 className="text-lg sm:text-xl md:text-2xl font-svn-avo-extra-bold mb-1.5 md:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#7b93d1] group-hover:to-[#a8bcdf] group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                                            {project.title}
                                        </h3>

                                        <p className="text-xs md:text-sm font-svn-avo-bold text-gray-200 group-hover:text-white transition-colors line-clamp-2 mb-2 md:mb-4 hidden sm:block">
                                            {project.shortDescription}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-300">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} className="md:hidden" />
                                                <MapPin size={14} className="hidden md:block" />
                                                {project.location.split(',')[0]}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} className="md:hidden" />
                                                <Calendar size={14} className="hidden md:block" />
                                                {project.completionYear}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Arrow */}
                                <div className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                    <ArrowRight className="text-white" size={16} />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-8 md:mt-10 lg:mt-12">
                        <Link
                            href={`/${lang}/projects`}
                            className="inline-flex items-center gap-2 px-5 md:px-6 lg:px-8 py-2.5 md:py-3 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-extra-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-sm md:text-base"
                        >
                            {dict.projects.viewAll}
                            <ArrowRight size={16} className="md:hidden" />
                            <ArrowRight size={20} className="hidden md:block" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
