"use client";

import { Loader2, Sparkles } from "lucide-react";

interface SuggestionChipsProps {
    suggestions: string[];
    isLoading: boolean;
    onSelect: (text: string) => void;
    disabled?: boolean;
    language: "vi" | "en";
}

export function SuggestionChips({
    suggestions,
    isLoading,
    onSelect,
    disabled = false,
    language,
}: SuggestionChipsProps) {
    if (!isLoading && suggestions.length === 0) return null;

    return (
        <div className="flex flex-col gap-2 px-6 pb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {isLoading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pl-14">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>
                        {language === "vi"
                            ? "Đang gợi ý câu hỏi..."
                            : "Generating suggestions..."}
                    </span>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2 pl-14">
                    {suggestions.map((text, i) => (
                        <button
                            key={i}
                            onClick={() => onSelect(text)}
                            disabled={disabled}
                            className="text-left px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-blue-100 text-[#4463b1] hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                            <Sparkles className="h-3 w-3 shrink-0 opacity-60" />
                            {text}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
