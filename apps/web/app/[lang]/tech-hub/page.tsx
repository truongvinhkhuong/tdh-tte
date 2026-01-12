import type { Metadata } from "next"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"
import { TechHubListing } from "@/components/tech-hub/tech-hub-listing"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params

    return {
        title: lang === 'vi' ? 'Tech Hub - Trung tâm Kiến thức Kỹ thuật' : 'Tech Hub - Technical Knowledge Center',
        description: lang === 'vi'
            ? 'Giải pháp & ứng dụng, tài liệu kỹ thuật, và dự án tiêu biểu từ TTE - 32+ năm kinh nghiệm ngành dầu khí'
            : 'Solutions & applications, technical documents, and case studies from TTE - 32+ years in oil & gas industry',
    }
}

export default async function TechHubPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return (
        <main className="pt-20">
            {/* Hero Section */}
            <section className="py-20 md:py-28 bg-gradient-to-br from-[#2B54A7] via-[#1e3a75] to-[#152550] relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white/80 text-sm font-svn-avo-bold">
                            {lang === 'vi' ? '32+ năm kinh nghiệm' : '32+ years of experience'}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-svn-avo-extra-bold text-white mb-6 leading-tight">
                        {dict.techHub?.title || 'Tech Hub'}
                    </h1>

                    <p className="text-lg md:text-xl font-svn-avo-bold text-white/80 max-w-3xl mx-auto mb-8">
                        {lang === 'vi'
                            ? 'Trung tâm kiến thức kỹ thuật và giải pháp công nghệ - Nơi chia sẻ kinh nghiệm 32 năm hoạt động trong ngành dầu khí và năng lượng'
                            : 'Technical knowledge center and technology solutions - Sharing 32 years of experience in oil, gas, and energy industries'}
                    </p>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-10">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-svn-avo-extra-bold text-white">100+</div>
                            <div className="text-sm font-svn-avo-bold text-white/60">
                                {lang === 'vi' ? 'Giải pháp' : 'Solutions'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-svn-avo-extra-bold text-white">500+</div>
                            <div className="text-sm font-svn-avo-bold text-white/60">
                                {lang === 'vi' ? 'Tài liệu' : 'Documents'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-svn-avo-extra-bold text-white">50+</div>
                            <div className="text-sm font-svn-avo-bold text-white/60">
                                {lang === 'vi' ? 'Case Studies' : 'Case Studies'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <TechHubListing lang={lang} dict={dict} />
        </main>
    )
}
