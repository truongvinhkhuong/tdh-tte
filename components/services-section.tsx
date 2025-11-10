"use client"

import { useEffect, useRef, useState } from "react"
import { Lightbulb, Package, Wrench, Settings, Users, Headphones } from "lucide-react"

export function ServicesSection() {
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

  const services = [
    {
      title: "Tư Vấn Kỹ Thuật",
      description: "Cung cấp tư vấn chuyên sâu về công nghệ và giải pháp tối ưu cho doanh nghiệp",
      icon: Lightbulb,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Cung Cấp Thiết Bị",
      description: "Cung cấp các thiết bị công nghiệp chất lượng cao từ các hãng sản xuất hàng đầu",
      icon: Package,
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      title: "Lắp Đặt & Vận Hành",
      description: "Đội ngũ kỹ sư giàu kinh nghiệm giúp lắp đặt và vận hành thiết bị",
      icon: Wrench,
      gradient: "from-blue-600 to-purple-500",
    },
    {
      title: "Bảo Trì & Sửa Chữa",
      description: "Dịch vụ bảo trì định kỳ và sửa chữa khẩn cấp 24/7",
      icon: Settings,
      gradient: "from-purple-500 to-cyan-500",
    },
    {
      title: "Đào Tạo Nhân Sự",
      description: "Cung cấp khóa đào tạo chuyên nghiệp cho đội ngũ kỹ thuật của bạn",
      icon: Users,
      gradient: "from-blue-500 to-purple-500",
    },
    {
      title: "Hỗ Trợ Kỹ Thuật",
      description: "Hỗ trợ kỹ thuật 24/7 để giải quyết các vấn đề kỹ thuật",
      icon: Headphones,
      gradient: "from-cyan-500 to-purple-500",
    },
  ]

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"></div>
      <div
        className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="text-center mb-20">
            <div className="inline-block relative">
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Dịch Vụ Của Chúng Tôi
              </h2>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-8 leading-relaxed">
              Chúng tôi cung cấp một loạt các dịch vụ toàn diện để đáp ứng mọi nhu cầu của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div
                  key={index}
                  className="group relative p-8 bg-white rounded-2xl border border-gray-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  style={{
                    animation: isVisible ? `cardLift 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : "none",
                    animationDelay: `${index * 0.1}s`,
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
                    <div className="text-5xl mb-4 transition-all duration-300 group-hover:scale-125 inline-block text-blue-600 group-hover:text-cyan-500">
                      <IconComponent size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                      {service.description}
                    </p>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
