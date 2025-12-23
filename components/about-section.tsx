"use client"

import { useEffect, useRef, useState } from "react"
import { Settings, Headphones, Lightbulb, Target } from "lucide-react"

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
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
      Icon: Settings,
      title: "Thiết bị chất lượng",
      description: "Cung cấp các thiết bị hàng đầu thế giới với độ bền cao",
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      iconColor: "text-blue-600",
      shadowColor: "shadow-blue-500/50",
    },
    {
      Icon: Headphones,
      title: "Dịch vụ hỗ trợ",
      description: "Hỗ trợ kỹ thuật 24/7 để đảm bảo hiệu suất tối đa",
      gradient: "from-cyan-500 via-cyan-600 to-blue-500",
      iconColor: "text-cyan-600",
      shadowColor: "shadow-cyan-500/50",
    },
    {
      Icon: Lightbulb,
      title: "Giải pháp tùy chỉnh",
      description: "Thiết kế giải pháp phù hợp với nhu cầu cụ thể của bạn",
      gradient: "from-blue-600 via-indigo-600 to-purple-500",
      iconColor: "text-indigo-600",
      shadowColor: "shadow-indigo-500/50",
    },
    {
      Icon: Target,
      title: "Kinh nghiệm lâu năm",
      description: "Hơn 20 năm phục vụ các dự án lớn trong ngành công nghiệp",
      gradient: "from-purple-500 via-purple-600 to-cyan-500",
      iconColor: "text-purple-600",
      shadowColor: "shadow-purple-500/50",
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
              <h2 className="text-4xl md:text-5xl font-heading font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                VỀ CHÚNG TÔI
              </h2>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
            </div>
            <p className="text-lg font-body text-gray-600 max-w-2xl mx-auto mt-8 leading-relaxed">
              Công ty cổ phần Kỹ Thuật Toàn Thắng là nhà cung cấp hàng đầu các giải pháp công nghệ cho ngành dầu khí
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.Icon
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`group relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 hover:border-transparent shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 ${hoveredIndex === index ? feature.shadowColor : ''}`}
                  style={{
                    animation: isVisible ? `cardLift 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : "none",
                    animationDelay: `${index * 0.15}s`,
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  {/* Animated Border Glow */}
                  <div
                    className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${feature.gradient} p-[2px]`}
                    style={{
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                    }}
                  ></div>

                  {/* Floating Particles Effect */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    {/* Icon Container with Background */}
                    <div className={`relative inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[2px] transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                      <div className="flex items-center justify-center w-full h-full bg-white rounded-2xl">
                        <Icon 
                          className={`w-8 h-8 ${feature.iconColor} transition-all duration-500 group-hover:scale-110`}
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-heading font-bold text-lg text-gray-900 mb-3 transition-colors duration-300">
                      {feature.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm font-body text-gray-600 transition-colors leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Corner Accent */}
                    <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-bl-full`}></div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Sứ mệnh của chúng tôi</h3>
              <p className="font-body text-gray-600 leading-relaxed text-lg">
                Cung cấp các sản phẩm và dịch vụ chất lượng cao, giúp các đối tác nâng cao hiệu suất hoạt động và đạt
                được các mục tiêu kinh doanh của họ.
              </p>
              <p className="font-body text-gray-600 leading-relaxed text-lg">
                Chúng tôi cam kết đồng hành với các khách hàng trong mỗi bước của hành trình, từ tư vấn ban đầu đến bảo
                trì và hỗ trợ lâu dài.
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-heading font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover-glow">
                Tìm hiểu thêm
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "20+", label: "Năm kinh nghiệm" },
                { number: "500+", label: "Dự án thành công" },
                { number: "100+", label: "Nhân viên chuyên nghiệp" },
                { number: "98%", label: "Độ hài lòng khách hàng" },
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
                  <div className="text-3xl md:text-4xl font-heading font-black text-blue-600 mb-2">{stat.number}</div>
                  <p className="text-sm font-body text-gray-600 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
