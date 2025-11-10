"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  const slides = ["/about-1.jpg", "/about-2.jpg"]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isAutoPlay) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isAutoPlay])

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
    <section className="relative w-full h-screen pt-20 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-animated opacity-20 pointer-events-none"></div>

      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide || "/placeholder.svg"}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all duration-300 backdrop-blur-md hover:scale-125 group border border-white/20 hover-glow"
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
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all duration-300 backdrop-blur-md hover:scale-125 group border border-white/20 hover-glow"
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

      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index)
              setIsAutoPlay(false)
              setTimeout(() => setIsAutoPlay(true), 10000)
            }}
            className={`h-1 rounded-full transition-all duration-500 backdrop-blur-md ${
              index === currentSlide
                ? "w-10 bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg shadow-blue-500/50 animate-glow-pulse"
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      <div className="absolute top-24 right-4 md:right-8 z-20 text-white/70 text-sm flex items-center gap-2 backdrop-blur-md bg-white/10 px-3 py-2 rounded-full border border-white/20">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="font-semibold">Tự động</span>
      </div>
    </section>
  )
}
