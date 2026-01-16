"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
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

function ChatMessageItem({ message, language }: { message: ChatMessage; language: "vi" | "en" }) {
    const isUser = message.role === "user";
    const roleName = isUser
        ? (language === "vi" ? "Bạn" : "You")
        : (language === "vi" ? "Trợ lý TTE" : "TTE Assistant");

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
                    <Bot className="h-6 w-6 text-[#4463b1] animate-pulse-slow" />
                )}
            </div>

            {/* Message Content - Improved typography & spacing */}
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
                            : "bg-white border text-foreground rounded-tl-none prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:font-black prose-headings:text-[#4463b1] prose-ul:my-2 prose-li:my-0.5"
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
            </div>
        </div>
    );
}

// ===========================================
// Markdown Formatter (Stateful Parser)
// ===========================================

function formatMarkdown(text: string): string {
    const lines = text.split('\n');
    let output = '';
    let inTable = false;
    let tableBuffer = '';

    const processLine = (line: string) => {
        // Bold
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong class='text-[#4463b1] font-extrabold'>$1</strong>");
        // Italic
        line = line.replace(/\*(.*?)\*/g, "<em class='text-[#4463b1] font-bold'>$1</em>");
        // Code
        line = line.replace(/`([^`]+)`/g, "<code class='bg-slate-100 text-[#4463b1] px-1.5 py-0.5 rounded text-xs font-mono font-bold border border-slate-200'>$1</code>");
        // Headers
        line = line.replace(/^### (.*$)/, '<h3 class="text-base font-extrabold text-[#4463b1] mt-4 mb-2 border-b border-blue-100 pb-1">$1</h3>');
        line = line.replace(/^## (.*$)/, '<h2 class="text-lg font-extrabold text-[#4463b1] mt-5 mb-3">$1</h2>');

        // Lists
        line = line.replace(/^- (.*)/, '<li class="ml-4 list-disc marker:text-[#4463b1] pl-1 mb-1 font-medium">$1</li>');
        line = line.replace(/^\d+\. (.*)/, '<li class="ml-4 list-decimal marker:text-[#4463b1] pl-1 mb-1 font-medium">$1</li>');

        return line;
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('|')) {
            if (!inTable) {
                inTable = true;
                tableBuffer = '<div class="overflow-x-auto my-3 rounded-lg border border-slate-200 shadow-sm"><table class="w-full border-collapse text-sm bg-white">';
            }

            const isHeaderSeparator = line.includes('---');
            if (isHeaderSeparator) continue;

            const cells = line.split('|').filter(c => c.trim().length > 0 || c === ' ');

            const rowContent = cells.map(c => {
                return `<td class="p-3 border-b border-r last:border-r-0 border-slate-100 align-top font-semibold text-slate-700 min-w-[120px]">${processLine(c.trim())}</td>`;
            }).join('');

            tableBuffer += `<tr class="hover:bg-slate-50 transition-colors">${rowContent}</tr>`;

        } else {
            if (inTable) {
                inTable = false;
                tableBuffer += '</table></div>';
                output += tableBuffer;
                tableBuffer = '';
            }

            if (line === '') {
                output += '<br/>';
            } else {
                let processed = processLine(line);
                if (!processed.startsWith('<h') && !processed.startsWith('<li')) {
                    output += `<p class="mb-2 font-semibold text-slate-800 leading-relaxed">${processed}</p>`;
                } else if (processed.startsWith('<li')) {
                    output += processed;
                } else {
                    output += processed;
                }
            }
        }
    }

    if (inTable) {
        output += tableBuffer + '</table></div>';
    }

    return output;
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
    const [sessionId, setSessionId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollViewportRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Initialize session ID from localStorage or create new one
    useEffect(() => {
        const STORAGE_KEY = "tte_chat_session_id";
        const MESSAGES_KEY = "tte_chat_messages";

        // Load session ID
        let storedId = localStorage.getItem(STORAGE_KEY);
        if (!storedId) {
            storedId = uuidv4();
            localStorage.setItem(STORAGE_KEY, storedId);
        }
        setSessionId(storedId);

        // Load saved messages from localStorage
        try {
            const savedMessages = localStorage.getItem(MESSAGES_KEY);
            if (savedMessages) {
                const parsed = JSON.parse(savedMessages);
                // Restore timestamps as Date objects
                const restored = parsed.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                setMessages(restored);
            }
        } catch (e) {
            console.warn("Failed to load chat history:", e);
        }
    }, []);

    // Helper function to scroll to bottom
    const scrollToBottom = (smooth = true) => {
        // ScrollArea uses Radix UI which creates a viewport element
        // We need to find the actual scrollable element
        if (scrollRef.current) {
            const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            const scrollElement = viewport || scrollViewportRef.current;

            if (scrollElement) {
                requestAnimationFrame(() => {
                    scrollElement.scrollTo({
                        top: scrollElement.scrollHeight,
                        behavior: smooth ? "smooth" : "instant"
                    });
                });
            }
        }
    };

    // Auto-scroll to bottom when messages change or loading state changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Persist messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            const MESSAGES_KEY = "tte_chat_messages";
            // Limit to last 20 messages to avoid localStorage bloat
            const toSave = messages.slice(-20);
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(toSave));
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

        // Scroll immediately when sending (instant for better UX)
        setTimeout(() => scrollToBottom(false), 50);
        setIsLoading(true);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question,
                    language,
                    conversationId,
                    sessionId, // For session tracking & rate limiting
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

    // Translations
    const t = {
        vi: {
            userRole: "Bạn",
            aiRole: "Trợ lý TTE",
            greeting: "Xin chào!",
            intro: "Tôi có thể giúp bạn tra cứu thông tin sản phẩm và thông số kỹ thuật từ thư viện tài liệu của TTE.",
            thinking: "Đang suy nghĩ...",
            placeholders: "Ví dụ: Van bướm Fisher có thông số áp suất ntn?",
            sug1: "Van Fisher HP ratings?",
            sug1_query: "Van Fisher HP có thông số áp suất bao nhiêu?",
            sug2: "Danh mục sản phẩm TTE?",
            sug2_query: "Liệt kê các danh mục sản phẩm của TTE?",
        },
        en: {
            userRole: "You",
            aiRole: "TTE Assistant",
            greeting: "Hello there!",
            intro: "I can help you look up product info and technical specs from TTE's document library.",
            thinking: "Thinking...",
            placeholders: "Ex: What are the pressure ratings for Fisher butterfly valves?",
            sug1: "Fisher HP valve ratings?",
            sug1_query: "What are the pressure ratings for Fisher HP?",
            sug2: "TTE Product portfolio?",
            sug2_query: "List TTE's product categories?",
        }
    };
    const strings = t[language as keyof typeof t] || t.vi;

    return (
        <Card className={cn(
            "flex flex-col h-full w-full border-0 shadow-2xl overflow-hidden bg-slate-50/50 backdrop-blur-sm ring-1 ring-black/5",
            className
        )}>
            {/* Header - Brand Color #4463b1 */}
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
                    {/* Access internal viewport for scrolling control */}
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
                                        onClick={() => setInput(strings.sug1_query)}
                                    />
                                    <SuggestionButton
                                        text={strings.sug2}
                                        onClick={() => setInput(strings.sug2_query)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 space-y-6">
                                {messages.map((message) => (
                                    <ChatMessageItem key={message.id} message={message} language={language} /> // Role translation handled in item? No, passing raw role. Need to update item too? 
                                    // ChatMessageItem handles display logic. I should pass 't' to it or it should derive it? 
                                    // ChatMessageItem is defined outside. I will need to update it to accept language or translation strings.
                                    // For now, let's keep ChatMessageItem simple or update it in a separate step if needed. 
                                    // BUT: ChatMessageItem has hardcoded "Bạn"/"Trợ lý TTE". 
                                    // I must update ChatMessageItem to accept 'language' prop.
                                ))}
                                {isLoading && (
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
                                {/* Spacer to prevent content being hidden behind sticky input */}
                                <div className="h-4" />
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input Area - Adjusted styles for visibility */}
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
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className={cn(
                                "h-12 w-12 rounded-xl shrink-0 mb-0.5 transition-all shadow-md active:scale-95",
                                input.trim() ? "bg-[#4463b1] hover:bg-[#354e8d] hover:shadow-lg hover:shadow-blue-200" : "bg-slate-200 text-slate-400 hover:bg-slate-200 shadow-none"
                            )}
                        >
                            <Send className="h-5 w-5 ml-0.5" />
                        </Button>
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
    )
}

export default TechnicalChat;
