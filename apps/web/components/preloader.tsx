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
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* Subtle animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#2B54A7 1px, transparent 1px), linear-gradient(90deg, #2B54A7 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          animation: 'gridSlide 20s linear infinite'
        }} />
      </div>

      {/* Calibration Gauge */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Animated glow rings */}
        <div className="absolute w-full h-full flex items-center justify-center">
          <div
            className="absolute w-64 h-64 rounded-full border-2 border-blue-400 opacity-20"
            style={{
              animation: 'pulse-ring 3s ease-in-out infinite',
            }}
          />
          <div
            className="absolute w-72 h-72 rounded-full border border-blue-300 opacity-10"
            style={{
              animation: 'pulse-ring 3s ease-in-out infinite 1s',
            }}
          />
        </div>

        {/* Main gauge SVG */}
        <svg className="absolute w-full h-full" viewBox="0 0 240 240" style={{ filter: 'drop-shadow(0 4px 12px rgba(43, 84, 167, 0.15))' }}>
          <defs>
            {/* Gradient for outer circle */}
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2B54A7" />
              <stop offset="100%" stopColor="#1e3a7a" />
            </linearGradient>

            {/* Glow filter for needle */}
            <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Shadow filter */}
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Outer circle with gradient */}
          <circle
            cx="120"
            cy="120"
            r="100"
            fill="none"
            stroke="url(#circleGradient)"
            strokeWidth="8"
            opacity="0.9"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0 628; 628 0; 0 628"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Inner ring with pulse */}
          <circle
            cx="120"
            cy="120"
            r="85"
            fill="none"
            stroke="#2B54A7"
            strokeWidth="2"
            opacity="0.3"
          >
            <animate
              attributeName="r"
              values="85;87;85"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Precision tick marks */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15 - 135) * (Math.PI / 180)
            const innerRadius = i % 2 === 0 ? 78 : 81
            const outerRadius = 85
            const x1 = 120 + innerRadius * Math.cos(angle)
            const y1 = 120 + innerRadius * Math.sin(angle)
            const x2 = 120 + outerRadius * Math.cos(angle)
            const y2 = 120 + outerRadius * Math.sin(angle)
            const isMainTick = i % 6 === 0
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#2B54A7"
                strokeWidth={isMainTick ? "2" : "1"}
                opacity={isMainTick ? "0.7" : "0.4"}
                strokeLinecap="round"
              />
            )
          })}

          {/* Center glow circle */}
          <circle cx="120" cy="120" r="8" fill="#2B54A7" opacity="0.2">
            <animate
              attributeName="r"
              values="8;12;8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.2;0.4;0.2"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Center pivot point */}
          <circle cx="120" cy="120" r="5" fill="#2B54A7" filter="url(#shadow)" />

          {/* Animated needle - sweeping calibration motion */}
          <g>
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              values="-135 120 120; 135 120 120; -135 120 120"
              dur="3s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
              keyTimes="0; 0.5; 1"
            />

            {/* Needle shadow/base */}
            <path
              d="M 120 120 L 118 120 L 118 35 L 120 30 L 122 35 L 122 120 Z"
              fill="#1e3a7a"
              opacity="0.3"
            />

            {/* Main needle body */}
            <path
              d="M 120 120 L 118 120 L 118 35 L 120 30 L 122 35 L 122 120 Z"
              fill="url(#needleGradient)"
              filter="url(#needleGlow)"
            />

            {/* Needle edge highlight */}
            <line
              x1="119"
              y1="120"
              x2="119"
              y2="32"
              stroke="#ffffff"
              strokeWidth="1"
              opacity="0.5"
              strokeLinecap="round"
            />

            {/* Glowing tip */}
            <circle
              cx="120"
              cy="30"
              r="4"
              fill="#0ea5e9"
              filter="url(#needleGlow)"
            >
              <animate
                attributeName="r"
                values="4;5;4"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>

            <circle
              cx="120"
              cy="30"
              r="2"
              fill="#ffffff"
            >
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* Needle gradient definition */}
          <defs>
            <linearGradient id="needleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>

        {/* Corner accent lines */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-blue-400 opacity-30" />
        <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-blue-400 opacity-30" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-blue-400 opacity-30" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-blue-400 opacity-30" />
      </div>

      {/* Loading text with enhanced design */}
      <div className="flex flex-col items-center gap-4 mt-12">
        {/* Company Name with Gradient and Effects */}
        <div className="relative flex flex-col items-center gap-2">
          {/* Main company name */}
          <div className="relative">
            {/* Glow background effect */}
            <div
              className="absolute inset-0 blur-2xl opacity-40"
              style={{
                background: 'linear-gradient(90deg, #2B54A7, #3b82f6, #2B54A7)',
                animation: 'shimmer 3s ease-in-out infinite',
              }}
            />

            {/* Main text with gradient */}
            <h1
              className="relative text-4xl font-bold tracking-wide flex gap-4"
              style={{
                background: 'linear-gradient(135deg, #1e3a7a 0%, #2B54A7 25%, #3b82f6 50%, #2B54A7 75%, #1e3a7a 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientSlide 4s ease-in-out infinite',
                textShadow: '0 0 30px rgba(43, 84, 167, 0.3)',
                letterSpacing: '0.15em',
              }}
            >
              {["TOAN", "THANG"].map((word, wordIndex) => (
                <span key={wordIndex} className="flex">
                  {word.split('').map((letter, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-block',
                        animation: 'letterFloat 3s ease-in-out infinite',
                        animationDelay: `${(wordIndex * 5 + i) * 0.1}s`,
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
          </div>

          {/* Subtitle with elegant styling */}
          <div className="relative">
            <p
              className="text-sm font-medium tracking-[0.3em] uppercase"
              style={{
                background: 'linear-gradient(90deg, #64748b, #2B54A7, #64748b)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientSlide 3s ease-in-out infinite reverse',
              }}
            >
              Engineering Corporation
            </p>
          </div>

          {/* Decorative line with animation */}
          <div className="flex items-center gap-2 mt-2">
            <div
              className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
              style={{
                width: '80px',
                animation: 'expandLine 2s ease-in-out infinite',
              }}
            />
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #2B54A7, #60a5fa)',
                    animation: 'dotPulseAnim 1.4s ease-in-out infinite',
                    animationDelay: `${i * 0.35}s`,
                    boxShadow: '0 0 10px rgba(43, 84, 167, 0.5)',
                  }}
                />
              ))}
            </div>
            <div
              className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
              style={{
                width: '80px',
                animation: 'expandLine 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>


      </div>

      <style jsx global>{`
        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
        }
        
        @keyframes gridSlide {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(40px, 40px);
          }
        }
        
        @keyframes dotPulseAnim {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
        
        @keyframes gradientSlide {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes shimmer {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        
        @keyframes letterFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        
        @keyframes expandLine {
          0%, 100% {
            width: 60px;
            opacity: 0.5;
          }
          50% {
            width: 100px;
            opacity: 1;
          }
        }
        
        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
