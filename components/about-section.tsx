"use client"

import { useEffect, useRef, useState } from "react"

export function AboutSection() {
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

  const features = [
    {
      icon: "⚙️",
      title: "Thiết Bị Chất Lượng",
      description: "Cung cấp các thiết bị hàng đầu thế giới với độ bền cao",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "🔧",
      title: "Dịch Vụ Hỗ Trợ",
      description: "Hỗ trợ kỹ thuật 24/7 để đảm bảo hiệu suất tối đa",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: "💡",
      title: "Giải Pháp Tùy Chỉnh",
      description: "Thiết kế giải pháp phù hợp với nhu cầu cụ thể của bạn",
      gradient: "from-blue-600 to-purple-500",
    },
    {
      icon: "🎯",
      title: "Kinh Nghiệm Lâu Năm",
      description: "Hơn 20 năm phục vụ các dự án lớn trong ngành công nghiệp",
      gradient: "from-purple-500 to-cyan-500",
    },
  ]

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="text-center mb-20">
            <div className="inline-block relative">
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Về Chúng Tôi
              </h2>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-8 leading-relaxed">
              Công ty cổ phần Kỹ Thuật Toàn Thắng là nhà cung cấp hàng đầu các giải pháp công nghệ cho ngành dầu khí
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                style={{
                  animation: isVisible ? `cardLift 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : "none",
                  animationDelay: `${index * 0.15}s`,
                  opacity: isVisible ? 1 : 0,
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                <div className="relative z-10">
                  <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:animate-icon-rotate inline-block">
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Sứ Mệnh Của Chúng Tôi</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Cung cấp các sản phẩm và dịch vụ chất lượng cao, giúp các đối tác nâng cao hiệu suất hoạt động và đạt
                được các mục tiêu kinh doanh của họ.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Chúng tôi cam kết đồng hành với các khách hàng trong mỗi bước của hành trình, từ tư vấn ban đầu đến bảo
                trì và hỗ trợ lâu dài.
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover-glow">
                Tìm Hiểu Thêm
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "20+", label: "Năm Kinh Nghiệm" },
                { number: "500+", label: "Dự Án Thành Công" },
                { number: "100+", label: "Nhân Viên Chuyên Nghiệp" },
                { number: "98%", label: "Độ Hài Lòng Khách Hàng" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl text-center border border-blue-100 hover:border-blue-300 transition-all duration-300"
                  style={{
                    animation: isVisible ? `cardLift 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : "none",
                    animationDelay: `${index * 0.15 + 0.6}s`,
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">{stat.number}</div>
                  <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
