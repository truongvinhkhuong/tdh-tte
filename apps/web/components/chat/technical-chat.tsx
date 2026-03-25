"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Send, Bot, User, Loader2, MessageSquare, Sparkles, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ===========================================
// Markdown Components
// ===========================================

const markdownComponents = {
    strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="text-[#4463b1] font-extrabold">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
        <em className="text-[#4463b1] font-bold">{children}</em>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-lg font-extrabold text-[#4463b1] mt-5 mb-3">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-base font-extrabold text-[#4463b1] mt-4 mb-2 border-b border-blue-100 pb-1">{children}</h3>
    ),
    table: ({ children }: { children?: React.ReactNode }) => (
        <div className="overflow-x-auto my-3 rounded-lg border border-slate-200 shadow-sm">
            <table className="w-full border-collapse text-sm bg-white">{children}</table>
        </div>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
        <th className="p-3 bg-slate-50 border-b border-slate-200 text-left font-bold text-slate-700">{children}</th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
        <td className="p-3 border-b border-slate-100 text-slate-700">{children}</td>
    ),
    tr: ({ children }: { children?: React.ReactNode }) => (
        <tr className="hover:bg-slate-50 transition-colors">{children}</tr>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
        <code className="bg-slate-100 text-[#4463b1] px-1.5 py-0.5 rounded text-xs font-mono font-bold border border-slate-200">{children}</code>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="ml-4 list-disc marker:text-[#4463b1] space-y-1">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="ml-4 list-decimal marker:text-[#4463b1] space-y-1">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
        <li className="font-medium">{children}</li>
    ),
    p: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-2 font-semibold text-slate-800 leading-relaxed">{children}</p>
    ),
};

// ===========================================
// Helper: extract text from UIMessage
// ===========================================

function getMessageText(message: UIMessage): string {
    if (!message.parts?.length) {
        // Fallback for old messages loaded from localStorage (pre-AI SDK format)
        return (message as any).content || "";
    }
    return message.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("");
}

// ===========================================
// Chat Message Component
// ===========================================

function ChatMessageItem({
    message,
    language,
}: {
    message: UIMessage;
    language: "vi" | "en";
}) {
    const isUser = message.role === "user";
    const roleName = isUser
        ? (language === "vi" ? "Bạn" : "You")
        : (language === "vi" ? "Trợ lý TTE" : "TTE Assistant");
    const content = getMessageText(message);

    return (
        <div
            className={cn(
                "flex gap-4 py-6 px-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            <div
                className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
                    isUser
                        ? "bg-[#4463b1] shadow-blue-200"
                        : "bg-white border text-[#4463b1] shadow-sm"
                )}
            >
                {isUser ? (
                    <User className="h-5 w-5 text-white" />
                ) : (
                    <Bot className="h-6 w-6 text-[#4463b1] animate-pulse-slow" />
                )}
            </div>

            <div className={cn(
                "flex flex-col gap-1.5 max-w-[72%] md:max-w-[75%]",
                isUser ? "items-end" : "items-start"
            )}>
                <span className="text-[11px] font-bold text-muted-foreground px-1 uppercase tracking-wider">
                    {roleName}
                </span>

                <div
                    className={cn(
                        "rounded-2xl px-5 py-4 shadow-sm text-[15px] leading-relaxed font-semibold",
                        isUser
                            ? "bg-[#4463b1] text-white rounded-tr-none"
                            : "bg-white border text-foreground rounded-tl-none"
                    )}
                >
                    {isUser ? (
                        <p className="whitespace-pre-wrap break-words">{content}</p>
                    ) : (
                        <div className="markdown-content prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:font-black prose-headings:text-[#4463b1] prose-ul:my-2 prose-li:my-0.5 prose-table:my-3 prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3 prose-table:border prose-table:rounded-lg overflow-x-auto">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={markdownComponents as any}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ===========================================
// Main Chat Component
// ===========================================

interface TechnicalChatProps {
    apiUrl?: string;
    language?: "vi" | "en";
    className?: string;
}

export function TechnicalChat({
    language = "vi",
    className,
}: TechnicalChatProps) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollViewportRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);

    // Memoize transport to avoid re-creating on every render
    const [transport] = useState(
        () => new TextStreamChatTransport({
            api: "/api/rag/chat/stream",
            body: { language },
        })
    );

    const {
        messages,
        sendMessage,
        stop,
        status,
        setMessages,
    } = useChat({
        transport,
        onFinish: () => {
            setTimeout(() => inputRef.current?.focus(), 100);
        },
        onError: () => {
            setTimeout(() => inputRef.current?.focus(), 100);
        },
    });

    const isLoading = status === "submitted" || status === "streaming";

    // Initialize session ID
    useEffect(() => {
        const STORAGE_KEY = "tte_chat_session_id";
        let storedId = localStorage.getItem(STORAGE_KEY);
        if (!storedId) {
            storedId = uuidv4();
            localStorage.setItem(STORAGE_KEY, storedId);
        }
        setSessionId(storedId);
    }, []);

    // Load saved messages from localStorage
    useEffect(() => {
        if (initialMessagesLoaded) return;
        const MESSAGES_KEY = "tte_chat_messages";
        try {
            const saved = localStorage.getItem(MESSAGES_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                const restored = parsed.map((msg: any) => ({
                    ...msg,
                    createdAt: new Date(msg.createdAt || msg.timestamp),
                }));
                setMessages(restored);
            }
        } catch (e) {
            console.warn("Failed to load chat history:", e);
        }
        setInitialMessagesLoaded(true);
    }, [initialMessagesLoaded, setMessages]);

    // Persist messages to localStorage
    useEffect(() => {
        if (!initialMessagesLoaded || messages.length === 0) return;
        const MESSAGES_KEY = "tte_chat_messages";
        const toSave = messages.slice(-20);
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(toSave));
    }, [messages, initialMessagesLoaded]);

    // Scroll helper
    const scrollToBottom = useCallback((smooth = true) => {
        if (scrollRef.current) {
            const viewport = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
            const scrollElement = viewport || scrollViewportRef.current;
            if (scrollElement) {
                requestAnimationFrame(() => {
                    scrollElement.scrollTo({
                        top: scrollElement.scrollHeight,
                        behavior: smooth ? "smooth" : "instant",
                    });
                });
            }
        }
    }, []);

    // Auto-scroll on message changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, status, scrollToBottom]);

    // Send message
    const handleSend = () => {
        const question = input.trim();
        if (!question || isLoading) return;
        sendMessage({ text: question });
        setInput("");
        setTimeout(() => scrollToBottom(false), 50);
    };

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Handle suggestion click
    const handleSuggestion = (query: string) => {
        if (isLoading) return;
        sendMessage({ text: query });
    };

    // Translations
    const t = {
        vi: {
            greeting: "Xin chào!",
            intro: "Tôi có thể giúp bạn tra cứu thông tin sản phẩm và thông số kỹ thuật từ thư viện tài liệu của TTE.",
            thinking: "Đang suy nghĩ...",
            placeholders: "Ví dụ: Van bướm Fisher có thông số áp suất ntn?",
            sug1: "Van Fisher HP ratings?",
            sug1_query: "Van Fisher HP có thông số áp suất bao nhiêu?",
            sug2: "Danh mục sản phẩm TTE?",
            sug2_query: "Liệt kê các danh mục sản phẩm của TTE?",
            stop: "Dừng",
        },
        en: {
            greeting: "Hello there!",
            intro: "I can help you look up product info and technical specs from TTE's document library.",
            thinking: "Thinking...",
            placeholders: "Ex: What are the pressure ratings for Fisher butterfly valves?",
            sug1: "Fisher HP valve ratings?",
            sug1_query: "What are the pressure ratings for Fisher HP?",
            sug2: "TTE Product portfolio?",
            sug2_query: "List TTE's product categories?",
            stop: "Stop",
        },
    };
    const strings = t[language as keyof typeof t] || t.vi;

    return (
        <Card className={cn(
            "flex flex-col h-full w-full border-0 shadow-2xl overflow-hidden bg-slate-50/50 backdrop-blur-sm ring-1 ring-black/5",
            className
        )}>
            {/* Header */}
            <div className="relative overflow-hidden bg-[#4463b1] p-5 shrink-0 transition-colors duration-300 shadow-md z-20">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Bot className="w-24 h-24 text-white -rotate-12 translate-x-8 -translate-y-8" />
                </div>
                <div className="relative z-10 flex items-center gap-3 text-white">
                    <div className="h-11 w-11 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                        <Sparkles className="h-6 w-6 text-yellow-300" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-[19px] leading-tight tracking-tight">
                            {language === "vi" ? "Trợ lý Kỹ thuật AI" : "AI Technical Assistant"}
                        </h3>
                        <p className="text-[13px] text-white/90 font-bold tracking-wide opacity-90">
                            {language === "vi" ? "Hỗ trợ tra cứu thông số & giải pháp" : "Specs & solutions support"}
                        </p>
                    </div>
                </div>
            </div>

            <CardContent className="flex-1 flex flex-col min-h-0 p-0 overflow-hidden relative bg-slate-50/50">
                {/* Messages Area */}
                <ScrollArea className="flex-1 min-h-0" ref={scrollRef}>
                    <div ref={scrollViewportRef} className="h-full w-full px-4 pb-4">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
                                <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-card border border-blue-50">
                                    <MessageSquare className="h-12 w-12 text-[#4463b1]" />
                                </div>
                                <h4 className="text-2xl font-black text-[#4463b1] mb-3 tracking-tight">
                                    {strings.greeting}
                                </h4>
                                <p className="text-[15px] font-bold text-slate-500 max-w-xs leading-relaxed mb-8">
                                    {strings.intro}
                                </p>
                                <div className="grid gap-3 w-full max-w-sm">
                                    <SuggestionButton
                                        text={strings.sug1}
                                        onClick={() => handleSuggestion(strings.sug1_query)}
                                    />
                                    <SuggestionButton
                                        text={strings.sug2}
                                        onClick={() => handleSuggestion(strings.sug2_query)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 space-y-6">
                                {messages.map((message) => (
                                    <ChatMessageItem
                                        key={message.id}
                                        message={message}
                                        language={language}
                                    />
                                ))}
                                {status === "submitted" && (
                                    <div className="flex gap-4 py-2 px-2 animate-in fade-in duration-300">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-blue-100 shadow-sm">
                                            <Loader2 className="h-5 w-5 text-[#4463b1] animate-spin" />
                                        </div>
                                        <div className="flex items-center gap-3 text-muted-foreground bg-white px-5 py-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                                            <div className="flex gap-1.5 pt-1">
                                                <span className="h-2 w-2 rounded-full bg-[#4463b1] animate-bounce delay-0"></span>
                                                <span className="h-2 w-2 rounded-full bg-[#4463b1] animate-bounce delay-150"></span>
                                                <span className="h-2 w-2 rounded-full bg-[#4463b1] animate-bounce delay-300"></span>
                                            </div>
                                            <span className="text-sm font-bold text-[#4463b1]">{strings.thinking}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="h-4" />
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100 shrink-0 z-20 shadow-[0_-5px_25px_-5px_rgba(0,0,0,0.05)]">
                    <div className="relative flex gap-3 items-end bg-slate-50/80 p-2.5 rounded-2xl border-2 border-slate-100 focus-within:border-[#4463b1] focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-300">
                        <Textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={strings.placeholders}
                            className="min-h-[52px] max-h-[140px] resize-none border-0 bg-transparent focus-visible:ring-0 py-3 px-3 text-[16px] font-semibold text-slate-800 leading-relaxed placeholder:text-slate-400 placeholder:font-medium"
                            disabled={isLoading}
                        />
                        {isLoading ? (
                            <Button
                                type="button"
                                onClick={() => stop()}
                                size="icon"
                                className="h-12 w-12 rounded-xl shrink-0 mb-0.5 bg-red-500 hover:bg-red-600 shadow-md active:scale-95 transition-all"
                            >
                                <Square className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleSend}
                                disabled={!input.trim()}
                                size="icon"
                                className={cn(
                                    "h-12 w-12 rounded-xl shrink-0 mb-0.5 transition-all shadow-md active:scale-95",
                                    input.trim() ? "bg-[#4463b1] hover:bg-[#354e8d] hover:shadow-lg hover:shadow-blue-200" : "bg-slate-200 text-slate-400 hover:bg-slate-200 shadow-none"
                                )}
                            >
                                <Send className="h-5 w-5 ml-0.5" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function SuggestionButton({ text, onClick }: { text: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transition-all text-sm font-semibold text-foreground/80 hover:text-[#4463b1] flex items-center justify-between group"
        >
            <span>{text}</span>
            <Send className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#4463b1]" />
        </button>
    );
}

export default TechnicalChat;
