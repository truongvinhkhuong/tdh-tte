"use client";

import { useState, useCallback } from "react";

interface UseSmartSuggestionsOptions {
    language: "vi" | "en";
    enabled?: boolean;
}

interface SmartSuggestionsReturn {
    suggestions: string[];
    isLoading: boolean;
    fetchSuggestions: (question: string, answer: string) => void;
    clearSuggestions: () => void;
}

export function useSmartSuggestions({
    language,
    enabled = true,
}: UseSmartSuggestionsOptions): SmartSuggestionsReturn {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSuggestions = useCallback(
        async (question: string, answer: string) => {
            if (!enabled) return;

            // Skip if answer is too short (likely an error or empty)
            if (answer.length < 20) return;

            setSuggestions([]);
            setIsLoading(true);

            try {
                const res = await fetch("/api/rag/chat/suggestions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question, answer, language }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data.suggestions || []);
                }
            } catch {
                // Silent fail — suggestions are non-critical
            } finally {
                setIsLoading(false);
            }
        },
        [language, enabled]
    );

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
        setIsLoading(false);
    }, []);

    return { suggestions, isLoading, fetchSuggestions, clearSuggestions };
}
