import type { Metadata } from "next"
import { normalizeLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { NewsHero } from "@/components/news/news-hero"
import { NewsListing } from "@/components/news/news-listing"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>
}): Promise<Metadata> {
    const { lang: rawLang } = await params
    const lang = normalizeLocale(rawLang)

    return {
        title: lang === 'vi' ? 'Tin Tức & Sự Kiện' : 'News & Events',
        description: lang === 'vi'
            ? 'Cập nhật tin tức hoạt động TTE, đối tác và xu hướng ngành công nghiệp'
            : 'TTE activities, partner updates and industry trends',
    }
}

export default async function NewsPage({
    params,
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang: rawLang } = await params
    const lang = normalizeLocale(rawLang)
    const dict = await getDictionary(lang)

    return (
        <main className="pt-16 md:pt-20">
            <NewsHero lang={lang} dict={dict} />
            <NewsListing lang={lang} dict={dict} />
        </main>
    )
}
