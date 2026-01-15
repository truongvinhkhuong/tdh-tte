"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText, Loader2, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// ===========================================
// Types
// ===========================================

interface Citation {
    source: string;
    page: string;
    doc_type: string;
    content_preview: string;
    relevance_score: number;
}

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    citations?: Citation[];
    confidence?: number;
    timestamp: Date;
}

interface ChatResponse {
    answer: string;
    citations: Citation[];
    confidence: number;
    conversation_id: string;
    sources_count: number;
}

// ===========================================
// Chat Message Component
// ===========================================

function ChatMessageItem({ message }: { message: ChatMessage }) {
    const isUser = message.role === "user";

    return (
        <div
            className={cn(
                "flex gap-4 py-6 px-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar - Updated style */}
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
                    <Sparkles className="h-5 w-5 text-[#4463b1] animate-pulse-slow" />
                )}
            </div>

            {/* Message Content - Improved typography & spacing */}
            <div className={cn(
                "flex flex-col gap-1.5 max-w-[85%] md:max-w-[75%]",
                isUser ? "items-end" : "items-start"
            )}>
                <span className="text-[11px] font-bold text-muted-foreground px-1 uppercase tracking-wider">
                    {isUser ? "Bạn" : "Trợ lý TTE"}
                </span>

                <div
                    className={cn(
                        "rounded-2xl px-5 py-4 shadow-sm text-[15px] leading-relaxed font-medium",
                        isUser
                            ? "bg-[#4463b1] text-white rounded-tr-none"
                            : "bg-white border text-foreground rounded-tl-none prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:font-bold prose-headings:text-[#4463b1] prose-ul:my-2 prose-li:my-0.5"
                    )}
                >
                    {isUser ? (
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    ) : (
                        <div
                            className="whitespace-pre-wrap break-words overflow-x-auto"
                            dangerouslySetInnerHTML={{
                                __html: formatMarkdown(message.content),
                            }}
                        />
                    )}
                </div>

                {/* Citations - Better visual hierarchy */}
                {message.citations && message.citations.length > 0 && (
                    <div className="flex flex-col gap-2 mt-1 w-full animate-in fade-in zoom-in-95 duration-500 delay-100">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nguồn tham khảo</span>
                            <div className="h-px bg-border flex-1 opacity-50"></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {message.citations.slice(0, 3).map((citation, idx) => (
                                <TooltipProvider key={idx}>
                                    <Tooltip delayDuration={300}>
                                        <TooltipTrigger asChild>
                                            <Badge
                                                variant="secondary"
                                                className="cursor-help py-1.5 px-3 hover:bg-blue-50 hover:text-[#4463b1] transition-colors border border-transparent hover:border-blue-200 font-semibold"
                                            >
                                                <FileText className="h-3.5 w-3.5 mr-1.5 text-[#4463b1]" />
                                                <span className="truncate max-w-[120px]">{citation.source.replace('.pdf', '')}</span>
                                                <span className="text-muted-foreground/70 ml-1.5 border-l pl-1.5 border-foreground/10 text-[10px]">
                                                    Tr.{citation.page}
                                                </span>
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-xs p-3 shadow-xl border-blue-100">
                                            <p className="font-bold text-[#4463b1] text-sm mb-1">{citation.source}</p>
                                            <p className="text-xs text-muted-foreground mb-2 flex justify-between">
                                                <span>Trang {citation.page}</span>
                                                <span className="font-bold text-green-600">{Math.round(citation.relevance_score * 100)}% match</span>
                                            </p>
                                            <p className="text-xs bg-muted/50 p-2 rounded italic text-muted-foreground line-clamp-4 border-l-2 border-[#4463b1] font-medium">
                                                "{citation.content_preview}"
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                            {message.citations.length > 3 && (
                                <Badge variant="outline" className="text-xs bg-muted/30 font-bold">
                                    +{message.citations.length - 3}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ===========================================
// Markdown Formatter (Enhanced)
// ===========================================

function formatMarkdown(text: string): string {
    return text
        // Bold
        .replace(/\*\*(.*?)\*\*/g, "<strong class='text-[#4463b1] font-extrabold'>$1</strong>")
        // Italic
        .replace(/\*(.*?)\*/g, "<em class='text-[#4463b1] font-semibold'>$1</em>")
        // Code
        .replace(/`(.*?)`/g, "<code class='bg-slate-100 text-[#4463b1] px-1.5 py-0.5 rounded text-xs font-mono font-bold border border-slate-200'>$1</code>")
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-base font-extrabold text-[#4463b1] mt-4 mb-2 border-b border-blue-100 pb-1">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-lg font-extrabold text-[#4463b1] mt-5 mb-3">$1</h2>')
        // Tables - Enhanced styling with horizontal scroll container
        .replace(/\|(.+)\|/g, (match, content) => {
            const cells = match.split("|").filter(Boolean);
            const isHeader = match.includes("---");
            if (isHeader) return ""; // Skip separator lines

            // Check if this row looks like a header (bold text often used in headers)
            // Or if it's the first row in a block of table rows (simplified logic here)
            return `<tr class="border-b last:border-0 hover:bg-slate-50 transition-colors">${cells.map(c =>
                `<td class="p-3 align-top border-r last:border-0 text-sm font-medium">${c.trim()}</td>`
            ).join("")}</tr>`;
        });

    // Note: A real markdown parser would be better, but for this simpler regex approach:
    // We need to wrap table rows in a table tag. This is a simple hack.
    // In production, use `react-markdown` or `remark`.
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
    apiUrl = "/api/rag/chat",
    language = "vi",
    className,
}: TechnicalChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollViewportRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom with behavior
    useEffect(() => {
        if (scrollViewportRef.current) {
            const scrollElement = scrollViewportRef.current;
            scrollElement.scrollTo({
                top: scrollElement.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, isLoading]);

    // Send message
    const handleSend = async () => {
        const question = input.trim();
        if (!question || isLoading) return;

        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: question,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question,
                    language,
                    conversationId,
                }),
            });

            if (!response.ok) {
                throw new Error("Không thể kết nối đến server");
            }

            const data = await response.json();
            const chatData: ChatResponse = data.data || data;

            const assistantMessage: ChatMessage = {
                id: Date.now().toString(),
                role: "assistant",
                content: chatData.answer,
                citations: chatData.citations,
                confidence: chatData.confidence,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setConversationId(chatData.conversation_id);
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: Date.now().toString(),
                role: "assistant",
                content: "Xin lỗi, đã có lỗi kết nối. Vui lòng kiểm tra lại mạng hoặc thử lại sau.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            // Focus back to input after slight delay to allow UI update
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const placeholders = {
        vi: "Ví dụ: Van bướm Fisher có thông số áp suất ntn?",
        en: "Ex: What are the pressure ratings for Fisher butterfly valves?",
    };

    return (
        <Card className={cn(
            "flex flex-col h-[600px] w-full border-0 shadow-2xl overflow-hidden bg-slate-50/50 backdrop-blur-sm",
            className
        )}>
            {/* Header - Brand Color #4463b1 */}
            <div className="relative overflow-hidden bg-[#4463b1] p-4 shrink-0 transition-colors duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Bot className="w-24 h-24 text-white -rotate-12 translate-x-8 -translate-y-8" />
                </div>

                <div className="relative z-10 flex items-center gap-3 text-white">
                    <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                        <Sparkles className="h-5 w-5 text-yellow-300" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-lg leading-tight">
                            {language === "vi" ? "Trợ lý Kỹ thuật AI" : "AI Technical Assistant"}
                        </h3>
                        <p className="text-xs text-white/80 font-semibold tracking-wide">
                            {language === "vi" ? "Hỗ trợ tra cứu thông số & giải pháp" : "Specs & solutions support"}
                        </p>
                    </div>
                </div>
            </div>

            <CardContent className="flex-1 flex flex-col min-h-0 p-0 overflow-hidden relative">
                {/* Messages Area */}
                <ScrollArea className="flex-1 min-h-0" ref={scrollRef}>
                    {/* Access internal viewport for scrolling control */}
                    <div ref={scrollViewportRef} className="h-full w-full px-4 pb-4">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
                                <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                                    <MessageSquare className="h-10 w-10 text-[#4463b1]" />
                                </div>
                                <h4 className="text-2xl font-extrabold text-[#4463b1] mb-3">
                                    {language === "vi" ? "Xin chào!" : "Hello there!"}
                                </h4>
                                <p className="text-base font-medium text-muted-foreground max-w-xs leading-relaxed">
                                    {language === "vi"
                                        ? "Tôi có thể giúp bạn tra cứu thông tin sản phẩm và thông số kỹ thuật từ thư viện tài liệu của TTE."
                                        : "I can help you look up product info and technical specs from TTE's document library."}
                                </p>

                                <div className="mt-8 grid gap-3 w-full max-w-xs">
                                    <SuggestionButton
                                        text={language === "vi" ? "Van Fisher HP ratings?" : "Fisher HP valve ratings?"}
                                        onClick={() => setInput(language === "vi" ? "Van Fisher HP có thông số áp suất bao nhiêu?" : "What are the pressure ratings for Fisher HP?")}
                                    />
                                    <SuggestionButton
                                        text={language === "vi" ? "Danh mục sản phẩm TTE?" : "TTE Product portfolio?"}
                                        onClick={() => setInput(language === "vi" ? "Liệt kê các danh mục sản phẩm của TTE?" : "List TTE's product categories?")}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="py-4 space-y-4">
                                {messages.map((message) => (
                                    <ChatMessageItem key={message.id} message={message} />
                                ))}
                                {isLoading && (
                                    <div className="flex gap-4 py-6 px-2 animate-in fade-in duration-300">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border shadow-sm">
                                            <Loader2 className="h-5 w-5 text-[#4463b1] animate-spin" />
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground bg-slate-100/50 px-4 py-3 rounded-2xl rounded-tl-none">
                                            <span className="flex gap-1.5">
                                                <span className="h-2 w-2 rounded-full bg-[#4463b1]/60 animate-bounce delay-0"></span>
                                                <span className="h-2 w-2 rounded-full bg-[#4463b1]/60 animate-bounce delay-150"></span>
                                                <span className="h-2 w-2 rounded-full bg-[#4463b1]/60 animate-bounce delay-300"></span>
                                            </span>
                                            <span className="text-sm font-semibold ml-2 text-[#4463b1]">Đang suy nghĩ...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input Area - Adjusted styles for visibility */}
                <div className="p-4 bg-white border-t shrink-0 z-20 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
                    <div className="relative flex gap-3 items-end bg-slate-50 p-2 rounded-2xl border-2 border-slate-100 focus-within:border-[#4463b1] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <Textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholders[language]}
                            className="min-h-[48px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 py-2.5 px-3 text-[15px] font-medium leading-relaxed placeholder:text-muted-foreground/70"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className={cn(
                                "h-11 w-11 rounded-xl shrink-0 mb-0.5 transition-all shadow-sm",
                                input.trim() ? "bg-[#4463b1] hover:bg-[#354e8d] hover:scale-105 hover:shadow-md" : "bg-slate-200 text-slate-400 hover:bg-slate-200"
                            )}
                        >
                            <Send className="h-5 w-5 ml-0.5" />
                        </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2.5 text-center font-semibold opacity-70">
                        {language === "vi"
                            ? "AI có thể mắc lỗi. Vui lòng kiểm tra lại thông tin quan trọng."
                            : "AI can make mistakes. Please verify important information."}
                    </p>
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
    )
}

export default TechnicalChat;
