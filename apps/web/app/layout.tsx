import type React from "react"
import { Preloader } from "@/components/preloader"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TTE - Công Ty Cổ Phần Kỹ Thuật Toàn Thắng",
  description: "Cung cấp thiết bị, giải pháp công nghệ cho ngành Dầu khí, Lọc - Hóa dầu, Năng lượng",
  generator: 'Next.js',
  icons: {
    icon: '/logo-tte.ico',
    shortcut: '/logo-tte.ico',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
