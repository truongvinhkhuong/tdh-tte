import { Metadata } from "next";
import { TechnicalChat } from "@/components/chat";
import { normalizeLocale } from "@/i18n/config";

export const metadata: Metadata = {
    title: "Tư vấn Kỹ thuật | TTE",
    description:
        "Trợ lý AI tư vấn kỹ thuật về thiết bị công nghiệp dầu khí, hóa dầu của Toàn Thắng Engineering",
};

interface PageProps {
    params: Promise<{ lang: string }>;
}

export default async function ChatPage({ params }: PageProps) {
    const { lang: rawLang } = await params
    const lang = normalizeLocale(rawLang);
    const language = lang === "en" ? "en" : "vi";

    return (
        <div className="container mx-auto py-12 px-4 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-4">
                        {language === "vi"
                            ? "Trợ lý Kỹ thuật AI"
                            : "AI Technical Assistant"}
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {language === "vi"
                            ? "Hỏi đáp nhanh về thông số kỹ thuật, sản phẩm và giải pháp của TTE. Được hỗ trợ bởi AI với dữ liệu từ catalog và datasheet chính thức."
                            : "Quick Q&A about TTE's technical specifications, products and solutions. Powered by AI with data from official catalogs and datasheets."}
                    </p>
                </div>

                {/* Chat Component */}
                <TechnicalChat
                    language={language as "vi" | "en"}
                    className="shadow-lg"
                />

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground text-center mt-6">
                    {language === "vi"
                        ? "Thông tin từ trợ lý AI chỉ mang tính tham khảo. Vui lòng liên hệ đội ngũ kỹ thuật để được tư vấn chi tiết."
                        : "Information from AI assistant is for reference only. Please contact our technical team for detailed consultation."}
                </p>
            </div>
        </div>
    );
}
