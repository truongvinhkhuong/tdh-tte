"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText, Loader2, MessageSquare } from "lucide-react";
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
                "flex gap-3 py-4",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    isUser ? "bg-primary" : "bg-blue-600"
                )}
            >
                {isUser ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                ) : (
                    <Bot className="h-4 w-4 text-white" />
                )}
            </div>

            {/* Message Content */}
            <div className={cn("flex flex-col gap-2", isUser ? "items-end" : "items-start")}>
                <div
                    className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3",
                        isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted prose prose-sm dark:prose-invert"
                    )}
                >
                    {isUser ? (
                        <p>{message.content}</p>
                    ) : (
                        <div
                            className="whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{
                                __html: formatMarkdown(message.content),
                            }}
                        />
                    )}
                </div>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {message.citations.slice(0, 3).map((citation, idx) => (
                            <TooltipProvider key={idx}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge
                                            variant="outline"
                                            className="cursor-help text-xs flex items-center gap-1"
                                        >
                                            <FileText className="h-3 w-3" />
                                            {citation.source.substring(0, 20)}...
                                            <span className="text-muted-foreground">
                                                Tr.{citation.page}
                                            </span>
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-sm">
                                        <p className="font-semibold">{citation.source}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Trang {citation.page} • Độ liên quan:{" "}
                                            {Math.round(citation.relevance_score * 100)}%
                                        </p>
                                        <p className="text-xs mt-2 line-clamp-3">
                                            {citation.content_preview}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                        {message.citations.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{message.citations.length - 3} nguồn khác
                            </Badge>
                        )}
                    </div>
                )}

                {/* Confidence */}
                {message.confidence !== undefined && (
                    <span className="text-xs text-muted-foreground">
                        Độ tin cậy: {Math.round(message.confidence)}%
                    </span>
                )}
            </div>
        </div>
    );
}

// ===========================================
// Markdown Formatter (Simple)
// ===========================================

function formatMarkdown(text: string): string {
    // Basic markdown to HTML conversion
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/\n/g, "<br />")
        .replace(/\|(.*?)\|/g, (match) => {
            // Simple table row handling
            const cells = match.split("|").filter(Boolean);
            return `<tr>${cells.map((c) => `<td class="border px-2 py-1">${c.trim()}</td>`).join("")}</tr>`;
        });
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
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

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

            // Handle nested response (NestJS wraps in { success, data })
            const chatData: ChatResponse = data.data || data;

            // Add assistant message
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
            // Add error message
            const errorMessage: ChatMessage = {
                id: Date.now().toString(),
                role: "assistant",
                content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const placeholders = {
        vi: "Hỏi về thông số kỹ thuật, sản phẩm, giải pháp...",
        en: "Ask about technical specs, products, solutions...",
    };

    return (
        <Card className={cn("flex flex-col h-[600px]", className)}>
            <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    {language === "vi" ? "Tư vấn Kỹ thuật" : "Technical Consulting"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    {language === "vi"
                        ? "Hỏi đáp về thiết bị công nghiệp dầu khí, hóa dầu"
                        : "Q&A about oil & gas, petrochemical equipment"}
                </p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Messages Area */}
                <ScrollArea className="flex-1 px-4" ref={scrollRef}>
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                {language === "vi"
                                    ? "Xin chào! Tôi là trợ lý kỹ thuật của TTE."
                                    : "Hello! I'm TTE's technical assistant."}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                {language === "vi"
                                    ? "Hãy đặt câu hỏi về sản phẩm và thông số kỹ thuật."
                                    : "Ask me about products and technical specifications."}
                            </p>
                        </div>
                    ) : (
                        <div className="py-4">
                            {messages.map((message) => (
                                <ChatMessageItem key={message.id} message={message} />
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 py-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                                        <Bot className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm">Đang tìm kiếm...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4">
                    <div className="flex gap-2">
                        <Textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholders[language]}
                            className="min-h-[44px] max-h-[120px] resize-none"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className="shrink-0"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        {language === "vi"
                            ? "Nhấn Enter để gửi, Shift+Enter để xuống dòng"
                            : "Press Enter to send, Shift+Enter for new line"}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default TechnicalChat;
