"use client"

import { useState } from "react"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/get-dictionary"
import { ServicesHero } from "./services-hero"
import { ServicesTrustIndicators } from "./services-trust-indicators"
import { ServicesNavigation } from "./services-navigation"
import { ServicesListing } from "./services-listing"
import { ServicesCapabilities } from "./services-capabilities"
import { ServicesProjectsSlider } from "./services-projects-slider"
import { ServicesLeadForm } from "./services-lead-form"

interface ServicesPageContentProps {
    lang: Locale
    dict: Dictionary
}

export function ServicesPageContent({ lang, dict }: ServicesPageContentProps) {
    const [activeCategory, setActiveCategory] = useState('all')

    return (
        <main className="pt-16 md:pt-20">
            {/* Section 1: Hero Section */}
            <ServicesHero lang={lang} dict={dict} />

            {/* Section 2: Trust Indicators */}
            <ServicesTrustIndicators lang={lang} />

            {/* Section 3: Sticky Navigation / Service Filter */}
            <ServicesNavigation
                lang={lang}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            {/* Section 4: Service Cards with Zig-zag Layout */}
            <ServicesListing lang={lang} activeCategory={activeCategory} />

            {/* Section 5: Capabilities & Facilities */}
            <ServicesCapabilities lang={lang} />

            {/* Section 6: Project Slider */}
            <ServicesProjectsSlider lang={lang} />

            {/* Section 7: Lead Form & Contact */}
            <ServicesLeadForm lang={lang} />
        </main>
    )
}
