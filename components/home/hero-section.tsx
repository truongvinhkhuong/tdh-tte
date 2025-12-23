"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"

interface HeroSectionProps {
    lang: Locale
    dict: Dictionary
}

export function HeroSection({ lang, dict }: HeroSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlay, setIsAutoPlay] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false)

    const slides = [
        "/offshore-oil-platform-vietnam.jpg",
        "/industrial-equipment-oil-gas-facility.jpg",
        "/petrochemical-plant-industrial-project.jpg"
    ]

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (!isAutoPlay) return
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [isAutoPlay, slides.length])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setIsAutoPlay(false)
        setTimeout(() => setIsAutoPlay(true), 10000)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        setIsAutoPlay(false)
        setTimeout(() => setIsAutoPlay(true), 10000)
    }

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-animated opacity-20 pointer-events-none z-10"></div>

            {/* Slides */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Image
                            src={slide}
                            alt={`Slide ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className={`absolute inset-0 flex items-center z-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-svn-avo-extra-bold text-white mb-4 leading-tight">
                            {dict.hero.title}
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4f6db3] to-[#7b93d1] font-svn-avo-extra-bold">
                                {dict.hero.subtitle}
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl font-utm-avo text-gray-200 mb-8 leading-relaxed">
                            {dict.hero.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href={`/${lang}/products`}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2B54A7] to-[#1e3a75] text-white font-svn-avo-extra-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                            >
                                {dict.hero.cta}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href={`/${lang}/contact`}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-svn-avo-extra-bold rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                            >
                                {dict.hero.ctaSecondary}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all duration-300 backdrop-blur-md hover:scale-125 group border border-white/20"
                aria-label="Previous slide"
            >
                <svg
                    className="w-6 h-6 group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all duration-300 backdrop-blur-md hover:scale-125 group border border-white/20"
                aria-label="Next slide"
            >
                <svg
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentSlide(index)
                            setIsAutoPlay(false)
                            setTimeout(() => setIsAutoPlay(true), 10000)
                        }}
                        className={`h-1 rounded-full transition-all duration-500 backdrop-blur-md ${index === currentSlide
                            ? "w-10 bg-gradient-to-r from-[#364fa1] to-[#5a7ec9] shadow-lg shadow-[#364fa1]/50"
                            : "w-2 bg-white/40 hover:bg-white/70"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Auto-play indicator */}
            <div className="absolute top-24 right-4 md:right-8 z-20 text-white/70 text-sm flex items-center gap-2 backdrop-blur-md bg-white/10 px-3 py-2 rounded-full border border-white/20">
                <div className={`w-2 h-2 rounded-full ${isAutoPlay ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="font-svn-avo-extra-bold">
                    {isAutoPlay ? (lang === 'vi' ? 'Tự động' : 'Auto') : (lang === 'vi' ? 'Dừng' : 'Paused')}
                </span>
            </div>
        </section>
    )
}
