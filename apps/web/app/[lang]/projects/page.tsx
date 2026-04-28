import type { Metadata } from "next"
import { normalizeLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { ProjectsHero } from "@/components/projects/projects-hero"
import { ProjectsListing } from "@/components/projects/projects-listing"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>
}): Promise<Metadata> {
    const { lang: rawLang } = await params
    const lang = normalizeLocale(rawLang)

    return {
        title: lang === 'vi' ? 'Dự Án' : 'Projects',
        description: lang === 'vi'
            ? 'Các dự án tiêu biểu đã được Toàn Thắng Engineering thực hiện thành công'
            : 'Notable projects successfully completed by Toan Thang Engineering',
    }
}

export default async function ProjectsPage({
    params,
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang: rawLang } = await params
    const lang = normalizeLocale(rawLang)
    const dict = await getDictionary(lang)

    return (
        <main className="pt-16 md:pt-20">
            <ProjectsHero lang={lang} dict={dict} />
            <ProjectsListing lang={lang} dict={dict} />
        </main>
    )
}
