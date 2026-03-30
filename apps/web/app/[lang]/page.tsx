import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { getProducts } from "@/lib/payload"
import { HeroSection } from "@/components/home/hero-section"
import { AboutSection } from "@/components/home/about-section"
import { ServicesSection } from "@/components/home/services-section"
import { ProductsSection } from "@/components/home/products-section"
import { ProjectsSection } from "@/components/home/projects-section"
import { CustomersSection } from "@/components/shared/customers-section"
import { PartnersSection } from "@/components/home/partners-section"
import { NewsSection } from "@/components/home/news-section"
import { CareerCtaSection } from "@/components/home/career-cta-section"
import { ContactSection } from "@/components/home/contact-section"

export default async function HomePage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const [dict, products] = await Promise.all([
        getDictionary(lang),
        getProducts(lang),
    ])

    return (
        <main className="overflow-x-hidden">
            <HeroSection lang={lang} dict={dict} />
            <AboutSection lang={lang} dict={dict} />
            <ServicesSection lang={lang} dict={dict} />
            <ProductsSection lang={lang} dict={dict} products={products} />
            <ProjectsSection lang={lang} dict={dict} />
            <CustomersSection lang={lang} dict={dict} variant="home" />
            <PartnersSection lang={lang} dict={dict} />
            <NewsSection lang={lang} dict={dict} />
            <CareerCtaSection lang={lang} dict={dict} />
            <ContactSection lang={lang} dict={dict} />
        </main>
    )
}
