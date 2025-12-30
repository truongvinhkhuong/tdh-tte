"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Calendar } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { projects, industries } from "@/lib/data"

interface ProjectsListingProps {
    lang: Locale
    dict: Dictionary
}

export function ProjectsListing({ lang, dict }: ProjectsListingProps) {
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)

    const filteredProjects = selectedIndustry
        ? projects.filter((p) => p.industry.id === selectedIndustry)
        : projects

    return (
        <section className="py-12 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-black bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] bg-clip-text text-transparent mb-4">
                        {dict.projects.title}
                    </h1>
                    <p className="font-svn-avo-bold text-gray-800 text-lg max-w-2xl mx-auto">
                        {dict.projects.subtitle}
                    </p>
                </div>

                {/* Industry Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    <button
                        onClick={() => setSelectedIndustry(null)}
                        className={`px-5 py-2 rounded-full font-heading font-semibold transition-all duration-200 ${selectedIndustry === null
                            ? 'bg-[#364fa1] text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {dict.products.filter.all}
                    </button>
                    {industries.map((industry) => (
                        <button
                            key={industry.id}
                            onClick={() => setSelectedIndustry(industry.id)}
                            className={`px-5 py-2 rounded-full font-heading font-semibold transition-all duration-200 ${selectedIndustry === industry.id
                                ? 'bg-[#364fa1] text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {industry.name}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/${lang}/projects/${project.slug}`}
                            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-96"
                        >
                            <Image
                                src={project.heroImage || "/placeholder.svg"}
                                alt={project.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300"></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                <span className="inline-block w-fit px-3 py-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white text-xs font-heading font-bold rounded-full mb-3">
                                    {project.industry.name}
                                </span>

                                <h3 className="text-2xl font-heading font-bold mb-3 group-hover:text-[#a8bcdf] transition-colors">
                                    {project.title}
                                </h3>

                                <p className="text-sm font-svn-avo-bold text-gray-200 line-clamp-2 mb-4">
                                    {project.shortDescription}
                                </p>

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

                                {/* View More */}
                                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                    <ArrowRight className="text-white" size={20} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl">
                        <p className="font-svn-avo-bold text-gray-800">
                            {lang === 'vi'
                                ? 'Không tìm thấy dự án phù hợp'
                                : 'No projects found'}
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}
