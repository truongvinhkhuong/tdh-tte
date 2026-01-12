import type { Metadata } from "next"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { TechHubHero } from "@/components/tech-hub/tech-hub-hero"
import { TechHubListing } from "@/components/tech-hub/tech-hub-listing"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params

    return {
        title: lang === 'vi' ? 'Tech Hub - Trung tâm Kiến thức Kỹ thuật' : 'Tech Hub - Technical Knowledge Center',
        description: lang === 'vi'
            ? 'Giải pháp & ứng dụng, tài liệu kỹ thuật, và dự án tiêu biểu từ TTE - 32+ năm kinh nghiệm ngành dầu khí'
            : 'Solutions & applications, technical documents, and case studies from TTE - 32+ years in oil & gas industry',
    }
}

export default async function TechHubPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return (
        <main className="pt-16 md:pt-20">
            <TechHubHero lang={lang} dict={dict} />
            <TechHubListing lang={lang} dict={dict} />
        </main>
    )
}
