import type React from "react"
import type { Metadata } from "next"
import { i18n, type Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OrganizationSchema, LocalBusinessSchema } from "@/components/seo/json-ld"
import { ChatWidget } from "@/components/chat"
import "@/styles/globals.css"

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }))
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toanthang.vn'

    const titles = {
        vi: "TTE - Công Ty Cổ Phần Kỹ Thuật Toàn Thắng",
        en: "TTE - Toan Thang Engineering Joint Stock Company",
    }

    const descriptions = {
        vi: "Cung cấp thiết bị, giải pháp công nghệ cho ngành Dầu khí, Lọc - Hóa dầu, Năng lượng",
        en: "Providing equipment and technology solutions for Oil & Gas, Petrochemical, and Energy industries",
    }

    return {
        metadataBase: new URL(BASE_URL),
        title: {
            default: titles[lang],
            template: `%s | ${titles[lang]}`,
        },
        description: descriptions[lang],
        keywords: lang === 'vi'
            ? ['thiết bị công nghiệp', 'dầu khí', 'Toàn Thắng', 'van công nghiệp', 'máy bơm', 'Emerson', 'Flowserve']
            : ['industrial equipment', 'oil gas', 'Toan Thang', 'industrial valves', 'pumps', 'Emerson', 'Flowserve'],
        authors: [{ name: 'Toan Thang Engineering', url: BASE_URL }],
        creator: 'Toan Thang Engineering',
        publisher: 'Toan Thang Engineering',
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        alternates: {
            canonical: `${BASE_URL}/${lang}`,
            languages: {
                'vi': `${BASE_URL}/vi`,
                'en': `${BASE_URL}/en`,
                'x-default': `${BASE_URL}/vi`,
            },
        },
        openGraph: {
            title: titles[lang],
            description: descriptions[lang],
            url: `${BASE_URL}/${lang}`,
            siteName: 'Toan Thang Engineering',
            locale: lang === 'vi' ? 'vi_VN' : 'en_US',
            alternateLocale: lang === 'vi' ? 'en_US' : 'vi_VN',
            type: 'website',
            images: [
                {
                    url: '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: titles[lang],
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: titles[lang],
            description: descriptions[lang],
            images: ['/og-image.jpg'],
        },
        verification: {
            google: process.env.GOOGLE_SITE_VERIFICATION || '',
        },
    }
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return (
        <html lang={lang}>
            <body className="antialiased">
                <OrganizationSchema lang={lang} />
                <LocalBusinessSchema lang={lang} />
                <Header lang={lang} dict={dict} />
                {children}
                <Footer lang={lang} dict={dict} />
                {/* AI Chat Widget - Floating button */}
                <ChatWidget language={lang as "vi" | "en"} position="bottom-right" />
            </body>
        </html>
    )
}
