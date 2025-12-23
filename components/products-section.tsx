"use client"

import { useEffect, useRef, useState } from "react"

export function ProductsSection() {
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

  const products = [
    {
      name: "Hệ Thống Xử Lý Khí",
      category: "Gas Processing",
      image: "/gas-processing-system-industrial-equipment.jpg",
      price: "Liên hệ",
    },
    {
      name: "Bộ Lọc Dầu",
      category: "Oil Filtration",
      image: "/oil-filtration-system-equipment.jpg",
      price: "Liên hệ",
    },
    {
      name: "Máy Nén Khí",
      category: "Air Compressor",
      image: "/industrial-air-compressor-equipment.jpg",
      price: "Liên hệ",
    },
    {
      name: "Hệ Thống Điều Khiển",
      category: "Control System",
      image: "/industrial-control-system-panel.jpg",
      price: "Liên hệ",
    },
    {
      name: "Nồi Hơi Công Nghiệp",
      category: "Industrial Boiler",
      image: "/industrial-boiler-equipment.jpg",
      price: "Liên hệ",
    },
    {
      name: "Máy Bơm Công Nghiệp",
      category: "Industrial Pump",
      image: "/industrial-pump-equipment.jpg",
      price: "Liên hệ",
    },
  ]

  return (
    <section
      id="products"
      className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floating"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="text-center mb-20">
            <div className="inline-block relative">
              <h2 className="text-4xl md:text-5xl font-heading font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Sản Phẩm Nổi Bật
              </h2>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
            </div>
            <p className="text-lg font-body text-gray-600 max-w-2xl mx-auto mt-8">
              Khám phá bộ sưu tập các sản phẩm chất lượng cao của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-300"
                style={{
                  animation: isVisible ? `cardLift 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : "none",
                  animationDelay: `${index * 0.1}s`,
                  opacity: isVisible ? 1 : 0,
                }}
              >
                <div className="relative h-56 bg-gray-300 overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-heading font-bold rounded-full mb-3">
                    {product.category}
                  </div>
                  <h3 className="text-lg font-heading font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-gray-600 font-semibold">{product.price}</span>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-heading font-semibold rounded-lg hover:shadow-lg hover:scale-110 transition-all duration-300 group-hover:from-cyan-500 group-hover:to-blue-600">
                      Chi Tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
