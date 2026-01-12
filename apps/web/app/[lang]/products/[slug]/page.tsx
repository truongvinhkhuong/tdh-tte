import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { products } from "@/lib/data"
import { ProductDetail } from "@/components/products/product-detail"

export async function generateStaticParams() {
    return products.map((product) => ({
        slug: product.slug,
    }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}): Promise<Metadata> {
    const { lang, slug } = await params
    const product = products.find((p) => p.slug === slug)

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
    params: Promise<{ lang: Locale; slug: string }>
}) {
    const { lang, slug } = await params
    const dict = await getDictionary(lang)
    const product = products.find((p) => p.slug === slug)

    if (!product) {
        notFound()
    }

    return (
        <main className="pt-20">
            <ProductDetail lang={lang} dict={dict} product={product} />
        </main>
    )
}
