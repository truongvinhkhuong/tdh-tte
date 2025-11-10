"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  const slides = [
    {
      title: "Giải Pháp Kỹ Thuật Hàng Đầu",
      description: "Cung cấp thiết bị và giải pháp công nghệ cho ngành Dầu khí, Lọc - Hóa dầu, Năng lượng",
      image: "/industrial-equipment-oil-gas-technology.jpg",
    },
    {
      title: "Công Nghệ Tiên Tiến",
      description: "Với kinh nghiệm hơn 20 năm trong ngành, chúng tôi mang đến những giải pháp tối ưu",
      image: "/advanced-technology-industrial-solutions.jpg",
    },
    {
      title: "Đội Ngũ Chuyên Nghiệp",
      description: "Các chuyên gia có chuyên môn cao sẽ đồng hành cùng bạn trong mỗi dự án",
      image: "/professional-team-engineering-services.jpg",
    },
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
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
            <div className="absolute inset-0 bg-radial-gradient opacity-30"></div>
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div
              key={`title-${currentSlide}`}
              className="animate-title-slide-in"
              style={{
                animationDuration: "0.8s",
                animationFillMode: "forwards",
              }}
            >
              <h1 className="text-5xl md:text-7xl font-black mb-6 text-balance leading-tight drop-shadow-2xl">
                {slides[currentSlide].title.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className="inline-block mr-3 md:mr-4"
                    style={{
                      animation: "wordReveal 0.6s ease-out forwards",
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </div>

            <div
              key={`desc-${currentSlide}`}
              className="opacity-0"
              style={{
                animation: "descriptionFadeIn 0.8s ease-out 0.3s forwards",
              }}
            >
              <p className="text-lg md:text-2xl text-gray-100 mb-10 text-balance leading-relaxed drop-shadow-lg">
                {slides[currentSlide].description}
              </p>
            </div>

            <div
              className="flex gap-4 justify-center flex-wrap"
              style={{
                animation: "descriptionFadeIn 0.8s ease-out 0.5s forwards",
                opacity: 0,
              }}
            >
              <button className="group relative px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20 text-base md:text-lg animate-button-glow overflow-hidden">
                <span className="relative z-10 flex items-center justify-center">
                  Khám Phá Ngay
                  <svg
                    className="inline-block w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </button>
              <button className="px-8 md:px-10 py-3 md:py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 hover:backdrop-blur-md hover:border-cyan-400 hover:text-cyan-200 transition-all duration-300 text-base md:text-lg">
                Tìm Hiểu Thêm
              </button>
            </div>
          </div>
        </div>
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
