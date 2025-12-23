"use client"

import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { timeline } from "@/lib/data"

interface HistoryTimelineProps {
    lang: Locale
    dict: Dictionary
}

export function HistoryTimeline({ lang, dict }: HistoryTimelineProps) {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                        {dict.about.history}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] rounded-full mx-auto"></div>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#364fa1] via-[#5a7ec9] to-[#364fa1] rounded-full"></div>

                    {/* Timeline Items */}
                    <div className="space-y-12">
                        {timeline.map((item, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                                    }`}
                            >
                                {/* Content */}
                                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-[#364fa1]/30">
                                        <span className="inline-block px-4 py-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white text-sm font-heading font-bold rounded-full mb-3">
                                            {item.year}
                                        </span>
                                        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="font-body text-gray-600 text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Center Dot */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white border-4 border-[#364fa1] rounded-full z-10 hover:scale-125 transition-transform duration-300"></div>

                                {/* Empty Space */}
                                <div className="w-5/12"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
