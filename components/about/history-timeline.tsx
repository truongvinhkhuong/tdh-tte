"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { timeline } from "@/lib/data"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HistoryTimelineProps {
    lang: Locale
    dict: Dictionary
}

export function HistoryTimeline({ lang, dict }: HistoryTimelineProps) {
    // Reverse timeline to show newest first
    const reversedTimeline = [...timeline].reverse()

    const [activeIndex, setActiveIndex] = useState(0)
    const [imageIndex, setImageIndex] = useState(0)

    const activeItem = reversedTimeline[activeIndex]
    const images = activeItem.images || []

    const handleYearClick = useCallback((index: number) => {
        setActiveIndex(index)
        setImageIndex(0) // Reset image slider when changing year
    }, [])

    const prevImage = useCallback(() => {
        setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }, [images.length])

    const nextImage = useCallback(() => {
        setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, [images.length])

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4 pb-2">
                        {dict.about.history}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] rounded-full mx-auto"></div>
                </div>

                {/* Year Tabs - Horizontal Timeline */}
                <div className="mb-10 overflow-x-auto scrollbar-hide">
                    <div className="relative flex justify-center items-center min-w-max px-4 py-4">
                        {/* Timeline connector line */}
                        <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-y-1/2"></div>

                        {/* Year buttons */}
                        <div className="relative flex gap-1 md:gap-2">
                            {reversedTimeline.map((item, index) => (
                                <button
                                    key={item.year}
                                    onClick={() => handleYearClick(index)}
                                    className={`
                                        relative z-10 px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-heading font-bold text-sm md:text-base
                                        transition-all duration-300 whitespace-nowrap
                                        ${activeIndex === index
                                            ? 'bg-gradient-to-br from-[#364fa1] to-[#5a7ec9] text-white shadow-xl shadow-[#364fa1]/30 scale-110 -translate-y-1'
                                            : 'bg-white text-gray-500 hover:text-[#364fa1] hover:bg-gray-50 border border-gray-200 hover:border-[#364fa1]/50 hover:shadow-md'
                                        }
                                    `}
                                >
                                    {item.year}
                                    {/* Active indicator dot */}
                                    {activeIndex === index && (
                                        <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#364fa1] rounded-full border-2 border-white shadow-md"></span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Text Content */}
                        <div className="p-6 md:p-10 flex flex-col justify-center order-2 md:order-1">
                            <div className="inline-flex items-center gap-2 mb-4">
                                <span className="px-4 py-1.5 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] text-white text-lg font-heading font-bold rounded-full">
                                    {activeItem.year}
                                </span>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">
                                {activeItem.title}
                            </h3>

                            <p className="font-body text-gray-600 text-base md:text-lg leading-relaxed">
                                {activeItem.description}
                            </p>

                            {/* Timeline Progress */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                    <span>{reversedTimeline[reversedTimeline.length - 1].year}</span>
                                    <span className="font-medium text-[#364fa1]">{activeItem.year}</span>
                                    <span>{reversedTimeline[0].year}</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] rounded-full transition-all duration-500"
                                        style={{
                                            width: `${((reversedTimeline.length - 1 - activeIndex) / (reversedTimeline.length - 1)) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Image Slider */}
                        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[400px] order-1 md:order-2 bg-gray-100">
                            {images.length > 0 && (
                                <>
                                    {/* Current Image */}
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={images[imageIndex]}
                                            alt={`${activeItem.title} - ${imageIndex + 1}`}
                                            fill
                                            className="object-cover transition-opacity duration-500"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>

                                    {/* Navigation Arrows */}
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all duration-300"
                                                aria-label="Previous image"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all duration-300"
                                                aria-label="Next image"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}

                                    {/* Dots Indicator */}
                                    {images.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setImageIndex(idx)}
                                                    className={`
                                                        w-2.5 h-2.5 rounded-full transition-all duration-300
                                                        ${imageIndex === idx
                                                            ? 'bg-white scale-125 shadow-lg'
                                                            : 'bg-white/50 hover:bg-white/75'
                                                        }
                                                    `}
                                                    aria-label={`Go to image ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Image Counter */}
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                        {imageIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Navigation Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {reversedTimeline.map((item, index) => (
                        <button
                            key={item.year}
                            onClick={() => handleYearClick(index)}
                            className={`
                                group relative w-3 h-3 rounded-full transition-all duration-300
                                ${activeIndex === index
                                    ? 'bg-[#364fa1] scale-125'
                                    : 'bg-gray-300 hover:bg-[#5a7ec9]'
                                }
                            `}
                            aria-label={`Go to year ${item.year}`}
                        >
                            {/* Tooltip */}
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {item.year}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}
