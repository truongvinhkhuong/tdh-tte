import type { Metadata } from "next"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { ProjectsListing } from "@/components/projects/projects-listing"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params

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
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return (
        <main className="pt-20">
            <ProjectsListing lang={lang} dict={dict} />
        </main>
    )
}
