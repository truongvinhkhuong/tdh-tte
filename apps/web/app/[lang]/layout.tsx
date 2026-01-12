import type React from "react"
import type { Metadata } from "next"
import { i18n, type Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
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

    const titles = {
        vi: "TTE - Công Ty Cổ Phần Kỹ Thuật Toàn Thắng",
        en: "TTE - Toan Thang Engineering Joint Stock Company",
    }

    const descriptions = {
        vi: "Cung cấp thiết bị, giải pháp công nghệ cho ngành Dầu khí, Lọc - Hóa dầu, Năng lượng",
        en: "Providing equipment and technology solutions for Oil & Gas, Petrochemical, and Energy industries",
    }

    return {
        title: {
            default: titles[lang],
            template: `%s | ${titles[lang]}`,
        },
        description: descriptions[lang],
        keywords: lang === 'vi'
            ? ['thiết bị công nghiệp', 'dầu khí', 'Toàn Thắng', 'van công nghiệp', 'máy bơm']
            : ['industrial equipment', 'oil gas', 'Toan Thang', 'industrial valves', 'pumps'],
        authors: [{ name: 'Toan Thang Engineering' }],
        openGraph: {
            title: titles[lang],
            description: descriptions[lang],
            locale: lang === 'vi' ? 'vi_VN' : 'en_US',
            type: 'website',
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
                <Header lang={lang} dict={dict} />
                {children}
                <Footer lang={lang} dict={dict} />
            </body>
        </html>
    )
}
