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
        <section id="projects" className="py-24 scroll-mt-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
            <div className="absolute top-20 right-20 w-80 h-80 bg-[#364fa1]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"></div>
            <div
                className="absolute bottom-20 left-20 w-80 h-80 bg-[#5a7ec9]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"
                style={{ animationDelay: "2s" }}
            ></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <div className="text-center mb-20">
                        <div className="inline-block">
                            <h2 className="text-4xl md:text-5xl font-svn-avo-extra-bold bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent pb-2">
                                {dict.projects.featured}
                            </h2>
                        </div>
                        <p className="text-lg font-svn-avo-bold text-gray-800 max-w-2xl mx-auto mt-8">
                            {dict.projects.subtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <Link
                                key={project.id}
                                href={`/${lang}/projects/${project.slug}`}
                                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#364fa1]/40 h-96"
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
                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                    <div className="transform transition-all duration-300 group-hover:translate-y-0">
                                        {/* Industry Badge */}
                                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white text-xs font-svn-avo-extra-bold rounded-full mb-3">
                                            {project.industry.name}
                                        </span>

                                        <h3 className="text-2xl font-svn-avo-extra-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#7b93d1] group-hover:to-[#a8bcdf] group-hover:bg-clip-text transition-all duration-300">
                                            {project.title}
                                        </h3>

                                        <p className="text-sm font-svn-avo-bold text-gray-200 group-hover:text-white transition-colors line-clamp-2 mb-4">
                                            {project.shortDescription}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="flex items-center gap-4 text-sm text-gray-300">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                {project.location.split(',')[0]}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {project.completionYear}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Arrow */}
                                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                    <ArrowRight className="text-white" size={20} />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href={`/${lang}/projects`}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white font-svn-avo-extra-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            {dict.projects.viewAll}
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
