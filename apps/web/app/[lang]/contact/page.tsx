import type { Metadata } from "next"
import { normalizeLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { ContactSection } from "@/components/home/contact-section"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>
}): Promise<Metadata> {
    const { lang: rawLang } = await params
    const lang = normalizeLocale(rawLang)

    return {
        title: lang === 'vi' ? 'Liên Hệ' : 'Contact',
        description: lang === 'vi'
            ? 'Liên hệ với Toàn Thắng Engineering để được tư vấn'
            : 'Contact Toan Thang Engineering for consultation',
    }
}

export default async function ContactPage({
    params,
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang: rawLang } = await params
    const lang = normalizeLocale(rawLang)
    const dict = await getDictionary(lang)

    return (
        <main className="pt-20">
            <ContactSection lang={lang} dict={dict} />
        </main>
    )
}
