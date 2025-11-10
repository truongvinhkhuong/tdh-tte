"use client"

import { useEffect, useState } from "react"

export function Preloader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="preloader-container">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="particle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Spinner with enhanced animation */}
      <div className="spinner relative z-10">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-dot"></div>
      </div>

      <div className="preloader-text">TTE</div>
      <div className="preloader-subtext">Công Ty Cổ Phần Kỹ Thuật Toàn Thắng</div>

      <div className="mt-8 w-32 h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
        <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full animate-loading-bar shadow-lg shadow-blue-500/50"></div>
      </div>
    </div>
  )
}
