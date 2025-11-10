import type React from "react"
import { Preloader } from "@/components/preloader"
import "@/styles/globals.css" // Import globals.css at the top of the file
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TTE - Công Ty Cổ Phần Kỹ Thuật Toàn Thắng",
  description: "Cung cấp thiết bị, giải pháp công nghệ cho ngành Dầu khí, Lọc - Hóa dầu, Năng lượng",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <Preloader />
        {children}
      </body>
    </html>
  )
}
