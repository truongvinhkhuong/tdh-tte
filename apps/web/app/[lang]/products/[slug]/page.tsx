import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { normalizeLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { getProducts, getProduct } from "@/lib/payload"
import { ProductDetail } from "@/components/products/product-detail"

export async function generateStaticParams() {
    const products = await getProducts()
    return products.map((product) => ({
        slug: product.slug,
    }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
    const { lang: rawLang, slug } = await params
    const lang = normalizeLocale(rawLang)
    const product = await getProduct(slug, lang)

    if (!product) {
        return {
            title: 'Product Not Found',
        }
    }

    return {
        title: product.name,
        description: product.shortDescription,
    }
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>
}) {
    const { lang: rawLang, slug } = await params
    const lang = normalizeLocale(rawLang)
    const dict = await getDictionary(lang)
    const product = await getProduct(slug, lang)

    if (!product) {
        notFound()
    }

    return (
        <main className="pt-20">
            <ProductDetail lang={lang} dict={dict} product={product} />
        </main>
    )
}
