import type { Metadata } from "next"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { ProductsListing } from "@/components/products/products-listing"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params

    return {
        title: lang === 'vi' ? 'Sản Phẩm' : 'Products',
        description: lang === 'vi'
            ? 'Khám phá các sản phẩm thiết bị công nghiệp chất lượng cao từ Toàn Thắng Engineering'
            : 'Discover high-quality industrial equipment products from Toan Thang Engineering',
    }
}

export default async function ProductsPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return (
        <main className="pt-20">
            <ProductsListing lang={lang} dict={dict} />
        </main>
    )
}
