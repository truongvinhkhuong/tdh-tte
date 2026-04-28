import type { Metadata } from "next"
import { normalizeLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { AboutHero } from "@/components/about/about-hero"
import { CompanyIntro } from "@/components/about/company-intro"
import { HistoryTimeline } from "@/components/about/history-timeline"
import { CustomersSection } from "@/components/shared/customers-section"
import { CertificatesSection } from "@/components/about/certificates-section"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>
}): Promise<Metadata> {
    const { lang: rawLang } = await params
    const lang = normalizeLocale(rawLang)

    return {
        title: lang === 'vi' ? 'Về Chúng Tôi' : 'About Us',
        description: lang === 'vi'
            ? 'Tìm hiểu về Công ty Cổ phần Kỹ thuật Toàn Thắng - Hơn 30 năm kinh nghiệm trong ngành dầu khí'
            : 'Learn about Toan Thang Engineering - Over 30 years of experience in the oil and gas industry',
    }
}

export default async function AboutPage({
    params,
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang: rawLang } = await params
    const lang = normalizeLocale(rawLang)
    const dict = await getDictionary(lang)

    return (
        <main className="pt-20">
            <AboutHero lang={lang} dict={dict} />
            <CompanyIntro lang={lang} dict={dict} />
            <HistoryTimeline lang={lang} dict={dict} />
            <CustomersSection lang={lang} dict={dict} variant="about" />
            <CertificatesSection lang={lang} dict={dict} />
        </main>
    )
}
