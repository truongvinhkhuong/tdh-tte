"use client"

import { useEffect, useRef, useState } from "react"

export function ProjectsSection() {
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

  const projects = [
    {
      title: "Dự Án Lọc Dầu Ngành",
      description: "Cung cấp hệ thống xử lý dầu toàn bộ với công suất 50,000 bbl/ngày",
      image: "/oil-refinery-project-industrial.jpg",
      year: "2023",
    },
    {
      title: "Nhà Máy Hóa Dầu",
      description: "Lắp đặt hệ thống điều khiển tự động cho nhà máy hóa dầu",
      image: "/petrochemical-plant-industrial-project.jpg",
      year: "2022",
    },
    {
      title: "Trạm Khí Tự Nhiên",
      description: "Cung cấp thiết bị xử lý khí tự nhiên cho trạm trung chuyển",
      image: "/natural-gas-station-industrial.jpg",
      year: "2023",
    },
  ]

  return (
    <section id="projects" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-20 right-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"></div>
      <div
        className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="text-center mb-20">
            <div className="inline-block relative">
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Dự Án Nổi Bật
              </h2>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-8">
              Một số dự án tiêu biểu mà chúng tôi đã thực hiện thành công
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-300 h-80"
                style={{
                  animation: isVisible ? `cardLift 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : "none",
                  animationDelay: `${index * 0.1}s`,
                  opacity: isVisible ? 1 : 0,
                }}
              >
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 group-hover:brightness-125"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="transform transition-all duration-300 group-hover:translate-y-0">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full mb-3">
                      {project.year}
                    </span>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-100 group-hover:text-white transition-colors line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform rotate-45 translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
