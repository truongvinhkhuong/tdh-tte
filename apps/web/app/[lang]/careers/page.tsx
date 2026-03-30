import type { Metadata } from "next"
import Link from "next/link"
import {
    Mail, Users, Shield, Star, Lightbulb, ShieldCheck, Target,
    DollarSign, Heart, GraduationCap, TrendingUp, Plane, Clock,
    Building2, ChevronRight, Home, Briefcase,
} from "lucide-react"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { vacancies } from "@/lib/data"
import { CareersJobList } from "@/components/careers/careers-job-list"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params
    return {
        title: lang === "vi" ? "Tuyển Dụng | Toàn Thắng Engineering" : "Careers | Toan Thang Engineering",
        description:
            lang === "vi"
                ? "Gia nhập đội ngũ hơn 100 kỹ sư và chuyên gia tại Toàn Thắng Engineering. Khám phá cơ hội nghề nghiệp trong ngành dầu khí & năng lượng."
                : "Join a team of 100+ engineers and specialists at Toan Thang Engineering. Explore career opportunities in the oil & gas and energy industry.",
    }
}

const valueIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    integrity: Shield,
    excellence: Star,
    innovation: Lightbulb,
    teamwork: Users,
    safety: ShieldCheck,
    ownership: Target,
}

const benefitIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    salary: DollarSign,
    health: Heart,
    training: GraduationCap,
    career: TrendingUp,
    travel: Plane,
    flexible: Clock,
}

const BG_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

export default async function CareersPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    const today = new Date()
    const activeVacancies = vacancies.filter((v) => new Date(v.deadline) >= today)

    return (
        <main className="pt-16 md:pt-20">
            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="relative py-14 md:py-20 bg-gradient-to-r from-[#2B54A7] to-[#1e3a75] overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: BG_PATTERN }} />
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
                        <ol className="flex items-center gap-2 text-sm text-white/70">
                            <li>
                                <Link href={`/${lang}`} className="flex items-center gap-1 hover:text-white transition-colors">
                                    <Home size={14} />
                                    <span>{lang === "vi" ? "Trang chủ" : "Home"}</span>
                                </Link>
                            </li>
                            <ChevronRight size={14} className="text-white/50" />
                            <li>
                                <span className="flex items-center gap-1 text-white font-svn-avo-bold">
                                    <Briefcase size={14} />
                                    {dict.careers.title}
                                </span>
                            </li>
                        </ol>
                    </nav>

                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-svn-avo-extra-bold text-white mb-4">
                            {dict.careers.title}
                        </h1>
                        <p className="text-base md:text-lg font-svn-avo-bold text-white/80 max-w-2xl mx-auto mb-8">
                            {dict.careers.subtitle}
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {[
                                { value: "30+", label: lang === "vi" ? "Năm kinh nghiệm" : "Years exp." },
                                { value: "100+", label: lang === "vi" ? "Kỹ sư & Chuyên gia" : "Engineers" },
                                { value: "3", label: lang === "vi" ? "Cơ sở làm việc" : "Locations" },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-white">
                                    <p className="text-2xl font-svn-avo-extra-bold">{stat.value}</p>
                                    <p className="text-xs font-svn-avo-bold text-white/70 mt-0.5">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── LIFE AT TTE ──────────────────────────────────── */}
            <section id="life-at-tte" className="scroll-mt-20 py-12 md:py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl font-svn-avo-extra-bold text-gray-900 mb-3">
                            {dict.careers.lifeAtTTE.title}
                        </h2>
                        <p className="text-base font-svn-avo-bold text-gray-500 max-w-2xl mx-auto">
                            {dict.careers.lifeAtTTE.subtitle}
                        </p>
                    </div>

                    {/* Purpose Banner */}
                    <div className="bg-gradient-to-r from-[#1e3a75] to-[#2B54A7] rounded-2xl p-6 md:p-10 mb-10">
                        <p className="text-xs font-svn-avo-bold text-white/60 uppercase tracking-widest mb-3">
                            {dict.careers.lifeAtTTE.purpose.label}
                        </p>
                        <h3 className="text-xl md:text-2xl font-svn-avo-extra-bold text-white mb-3 leading-snug">
                            {dict.careers.lifeAtTTE.purpose.title}
                        </h3>
                        <p className="text-base font-svn-avo-bold text-white/75 max-w-2xl">
                            {dict.careers.lifeAtTTE.purpose.body}
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="mb-10">
                        <p className="text-xs font-svn-avo-bold text-[#2B54A7] uppercase tracking-widest mb-5 text-center">
                            {dict.careers.lifeAtTTE.values.label}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {dict.careers.lifeAtTTE.values.items.map((item) => {
                                const Icon = valueIconMap[item.icon] ?? Shield
                                return (
                                    <div key={item.icon} className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 group">
                                        <div className="w-9 h-9 bg-[#2B54A7]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#2B54A7]/20 transition-all duration-300">
                                            <Icon size={18} className="text-[#2B54A7]" />
                                        </div>
                                        <h4 className="font-svn-avo-extra-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                                        <p className="text-xs font-svn-avo-bold text-gray-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* People + Women */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-10">
                        <div className="bg-[#2B54A7]/5 border border-[#2B54A7]/10 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-[#2B54A7] rounded-lg flex items-center justify-center shrink-0">
                                    <Users size={16} className="text-white" />
                                </div>
                                <h3 className="font-svn-avo-extra-bold text-gray-900">{dict.careers.lifeAtTTE.people.label}</h3>
                            </div>
                            <p className="text-sm font-svn-avo-bold text-gray-600 leading-relaxed">
                                {dict.careers.lifeAtTTE.people.body}
                            </p>
                        </div>
                        <div className="bg-pink-50 border border-pink-100 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center shrink-0">
                                    <Star size={16} className="text-white" />
                                </div>
                                <h3 className="font-svn-avo-extra-bold text-gray-900">{dict.careers.lifeAtTTE.women.label}</h3>
                            </div>
                            <p className="text-sm font-svn-avo-bold text-gray-600 leading-relaxed">
                                {dict.careers.lifeAtTTE.women.body}
                            </p>
                        </div>
                    </div>

                    {/* Testimonials — horizontal scroll on mobile */}
                    <div>
                        <p className="text-xs font-svn-avo-bold text-[#2B54A7] uppercase tracking-widest mb-5 text-center">
                            {lang === "vi" ? "Chia sẻ từ nhân viên" : "Employee Testimonials"}
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {dict.careers.lifeAtTTE.testimonials.map((t) => (
                                <div key={t.name} className="bg-gray-50 border-l-4 border-[#2B54A7] rounded-r-xl p-5">
                                    <p className="text-sm font-svn-avo-bold text-gray-700 italic mb-3 leading-relaxed">
                                        &ldquo;{t.quote}&rdquo;
                                    </p>
                                    <p className="font-svn-avo-extra-bold text-gray-900 text-sm">{t.name}</p>
                                    <p className="text-xs font-svn-avo-bold text-[#2B54A7] mt-0.5">{t.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WHY TTE ──────────────────────────────────────── */}
            <section id="why-tte" className="scroll-mt-20 py-12 md:py-16 bg-gradient-to-b from-[#2B54A7]/5 to-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl font-svn-avo-extra-bold text-gray-900 mb-3">
                            {dict.careers.whyTTE.title}
                        </h2>
                        <p className="text-base font-svn-avo-bold text-gray-500 max-w-xl mx-auto">
                            {dict.careers.whyTTE.subtitle}
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                        {dict.careers.whyTTE.benefits.map((b) => {
                            const Icon = benefitIconMap[b.icon] ?? DollarSign
                            return (
                                <div key={b.icon} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="w-9 h-9 bg-[#2B54A7]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#2B54A7]/20 transition-all duration-300">
                                        <Icon size={18} className="text-[#2B54A7]" />
                                    </div>
                                    <h4 className="font-svn-avo-extra-bold text-gray-900 text-sm mb-1">{b.title}</h4>
                                    <p className="text-xs font-svn-avo-bold text-gray-500 leading-relaxed">{b.desc}</p>
                                </div>
                            )
                        })}
                    </div>

                    {/* Culture Highlight */}
                    <div className="bg-white rounded-2xl border border-[#2B54A7]/10 p-6 md:p-8 text-center max-w-3xl mx-auto">
                        <span className="text-5xl font-serif text-[#2B54A7]/15 leading-none block -mb-3">&ldquo;</span>
                        <p className="text-lg md:text-xl font-svn-avo-bold text-gray-700 italic leading-relaxed">
                            {dict.careers.whyTTE.cultureHighlight}
                        </p>
                    </div>
                </div>
            </section>

            {/* ── JOIN US ───────────────────────────────────────── */}
            <section id="join-us" className="scroll-mt-20 py-12 md:py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl font-svn-avo-extra-bold text-gray-900 mb-3">
                            {dict.careers.joinUs.title}
                        </h2>
                        <p className="text-base font-svn-avo-bold text-gray-500 max-w-xl mx-auto">
                            {dict.careers.joinUs.subtitle}
                        </p>
                    </div>

                    {/* Meet Our Teams */}
                    <div className="mb-10">
                        <h3 className="text-base font-svn-avo-extra-bold text-gray-700 mb-4">
                            {dict.careers.joinUs.teams.label}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {dict.careers.joinUs.teams.items.map((team) => (
                                <div key={team.name} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                                    <h4 className="font-svn-avo-extra-bold text-gray-900 text-sm mb-1">{team.name}</h4>
                                    <span className="inline-block px-2 py-0.5 bg-[#2B54A7]/10 text-[#2B54A7] font-svn-avo-bold text-xs rounded-full mb-2">
                                        {team.count}
                                    </span>
                                    <p className="text-xs font-svn-avo-bold text-gray-500 leading-relaxed">{team.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="mb-10">
                        <h3 className="text-base font-svn-avo-extra-bold text-gray-700 mb-4">
                            {dict.careers.joinUs.locations.label}
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {dict.careers.joinUs.locations.items.map((loc) => (
                                <div key={loc.city} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-start gap-3">
                                    <div className="w-9 h-9 bg-[#2B54A7]/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                        <Building2 size={16} className="text-[#2B54A7]" />
                                    </div>
                                    <div>
                                        <h4 className="font-svn-avo-extra-bold text-gray-900 text-sm">{loc.city}</h4>
                                        <span className="inline-block px-2 py-0.5 bg-[#2B54A7] text-white font-svn-avo-bold text-xs rounded-full my-1">
                                            {loc.role}
                                        </span>
                                        <p className="text-xs font-svn-avo-bold text-gray-500">{loc.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Open Positions */}
                    <div id="open-positions" className="scroll-mt-20 mb-10">
                        <h3 className="text-base font-svn-avo-extra-bold text-gray-700 mb-4">
                            {dict.careers.joinUs.openRolesTitle}
                        </h3>
                        <CareersJobList vacancies={activeVacancies} lang={lang} dict={dict} />
                    </div>

                    {/* Hiring Process */}
                    <div className="mb-10">
                        <h3 className="text-base font-svn-avo-extra-bold text-gray-700 mb-6 text-center">
                            {dict.careers.joinUs.hiringProcess.label}
                        </h3>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                            {dict.careers.joinUs.hiringProcess.steps.map((step) => (
                                <div key={step.step} className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#2B54A7] to-[#1e3a75] rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                                        <span className="text-white font-svn-avo-extra-bold text-xs">{step.step}</span>
                                    </div>
                                    <h4 className="font-svn-avo-extra-bold text-gray-900 text-xs mb-1">{step.title}</h4>
                                    <p className="text-xs font-svn-avo-bold text-gray-500 leading-relaxed hidden sm:block">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* HR Contact CTA */}
                    <div className="bg-gradient-to-r from-[#2B54A7] to-[#1e3a75] rounded-2xl p-6 md:p-10 text-center">
                        <h3 className="text-xl md:text-2xl font-svn-avo-extra-bold text-white mb-2">
                            {dict.careers.joinUs.contactHR}
                        </h3>
                        <p className="font-svn-avo-bold text-white/75 mb-5 text-sm md:text-base">
                            {dict.careers.joinUs.contactHRDesc}
                        </p>
                        <a
                            href="mailto:hr@toanthang.vn"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2B54A7] font-svn-avo-bold rounded-xl hover:bg-gray-50 hover:shadow-xl transition-all duration-300"
                        >
                            <Mail size={18} />
                            {dict.careers.joinUs.contactHRButton}
                        </a>
                    </div>
                </div>
            </section>
        </main>
    )
}
