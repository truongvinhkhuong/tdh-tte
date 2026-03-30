"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Calendar, Briefcase, Clock, Search } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import type { Vacancy } from "@tte/shared-types"

interface CareersJobListProps {
    vacancies: Vacancy[]
    lang: Locale
    dict: Dictionary
}

export function CareersJobList({ vacancies, lang, dict }: CareersJobListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDepartment, setSelectedDepartment] = useState("all")

    const departments = Array.from(new Set(vacancies.map((v) => v.department)))

    const filtered = vacancies.filter((v) => {
        const matchesSearch =
            searchQuery === "" ||
            v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.department.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDept =
            selectedDepartment === "all" || v.department === selectedDepartment
        return matchesSearch && matchesDept
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const jobTypeLabel = (type: string) => {
        if (type === "full-time") return lang === "vi" ? "Toàn thời gian" : "Full-time"
        if (type === "part-time") return lang === "vi" ? "Bán thời gian" : "Part-time"
        return lang === "vi" ? "Hợp đồng" : "Contract"
    }

    return (
        <div className="space-y-6">
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder={dict.careers.joinUs.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2B54A7] transition-all duration-300 font-body bg-white"
                    />
                </div>
                <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2B54A7] transition-all duration-300 font-body bg-white text-gray-700"
                >
                    <option value="all">{dict.careers.joinUs.filterAll}</option>
                    {departments.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>
            </div>

            {/* Results */}
            {filtered.length > 0 ? (
                <div className="space-y-4">
                    {filtered.map((vacancy) => (
                        <Link
                            key={vacancy.id}
                            href={`/${lang}/careers/${vacancy.slug}`}
                            className="block bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#364fa1]/40 group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-svn-avo-extra-bold text-gray-900 mb-2 group-hover:text-[#364fa1] transition-colors">
                                        {vacancy.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Briefcase size={14} />
                                            {vacancy.department}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            {vacancy.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {jobTypeLabel(vacancy.type)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="text-right">
                                        <p className="text-sm font-svn-avo-bold text-gray-800">
                                            {dict.careers.deadline}
                                        </p>
                                        <p className="flex items-center gap-1 text-sm font-svn-avo-bold text-orange-600">
                                            <Calendar size={14} />
                                            {formatDate(vacancy.deadline)}
                                        </p>
                                    </div>
                                    <span className="px-4 py-2 bg-[#364fa1] text-white font-svn-avo-bold rounded-lg group-hover:bg-[#2d4388] transition-colors">
                                        {dict.careers.apply}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                    <p className="font-svn-avo-bold text-gray-500">
                        {dict.careers.joinUs.noMatch}
                    </p>
                </div>
            )}
        </div>
    )
}
