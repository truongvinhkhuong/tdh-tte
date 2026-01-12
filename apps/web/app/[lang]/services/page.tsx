import type { Metadata } from "next"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { ServicesPageContent } from "@/components/services/services-page-content"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params

    return {
        title: lang === 'vi'
            ? 'Dịch Vụ Kỹ Thuật & Bảo Dưỡng Công Nghiệp | TTE'
            : 'Technical & Industrial Maintenance Services | TTE',
        description: lang === 'vi'
            ? 'Dịch vụ kỹ thuật và bảo dưỡng công nghiệp toàn diện. Đối tác ủy quyền của Emerson & Flowserve tại Việt Nam. Van, Bơm, Máy nén khí, Seal cơ khí, Skid.'
            : 'Comprehensive technical and industrial maintenance services. Authorized partner of Emerson & Flowserve in Vietnam. Valves, Pumps, Compressors, Mechanical Seals, Skid.',
        keywords: lang === 'vi'
            ? 'dịch vụ van, dịch vụ bơm, máy nén khí, seal cơ khí, skid, Emerson, Flowserve, bảo trì công nghiệp, đại tu thiết bị'
            : 'valve services, pump services, compressor, mechanical seals, skid fabrication, Emerson, Flowserve, industrial maintenance, equipment overhaul',
    }
}

export default async function ServicesPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return <ServicesPageContent lang={lang} dict={dict} />
}
