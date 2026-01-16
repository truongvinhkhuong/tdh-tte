"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Minimize2, Maximize2, ChevronUp, Bot, Expand, Shrink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TechnicalChat } from "./technical-chat";

interface ChatWidgetProps {
    language?: "vi" | "en";
    position?: "bottom-right" | "bottom-left";
}

export function ChatWidget({
    language = "vi",
    position = "bottom-right",
}: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [showPulse, setShowPulse] = useState(true);

    // Prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
        // Stop pulse after 10s
        const timer = setTimeout(() => setShowPulse(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    if (!isMounted) return null;

    const positionClasses = {
        "bottom-right": "right-4 bottom-4 md:right-6 md:bottom-6",
        "bottom-left": "left-4 bottom-4 md:left-6 md:bottom-6",
    };

    return (
        <div className={cn("fixed z-[9999]", positionClasses[position])}>
            {/* Chat Window */}
            <div
                className={cn(
                    "transition-all duration-300 ease-out origin-bottom-right",
                    isOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-10 pointer-events-none absolute bottom-0 right-0"
                )}
            >
                <div
                    className={cn(
                        "bg-background/95 backdrop-blur-sm rounded-2xl shadow-2xl border transition-all duration-300 overflow-hidden flex flex-col",
                        isMinimized
                            ? "h-14 w-72"
                            : isFullscreen
                                ? "h-[95vh] w-[95vw] md:w-[900px] lg:w-[1000px] max-h-none"
                                : "h-[80vh] md:h-[85vh] max-h-[700px] w-[calc(100vw-32px)] md:w-[600px] lg:w-[650px]"
                    )}
                >
                    {isMinimized ? (
                        // Minimized Header
                        <div
                            className="h-full flex items-center justify-between px-4 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => setIsMinimized(false)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="font-semibold text-sm">
                                    {language === "vi" ? "Trợ lý Kỹ thuật TTE" : "TTE Technical Assistant"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-slate-200 rounded-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMinimized(false);
                                    }}
                                >
                                    <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-slate-200 rounded-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsOpen(false);
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Full Chat Window
                        <div className="relative h-full flex flex-col">
                            {/* Window Controls Overlay */}
                            <div className="absolute top-0 left-0 w-full h-14 z-20 pointer-events-none flex justify-end items-center pr-2">
                                <div className="flex gap-1 pointer-events-auto bg-black/10 backdrop-blur-sm rounded-full p-1 m-2 border border-white/10 shadow-sm">
                                    {/* Fullscreen toggle - only on desktop */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hidden md:flex h-6 w-6 text-white hover:bg-white/20 rounded-full"
                                        onClick={() => setIsFullscreen(!isFullscreen)}
                                        title={isFullscreen ? (language === "vi" ? "Thu nhỏ" : "Exit fullscreen") : (language === "vi" ? "Toàn màn hình" : "Fullscreen")}
                                    >
                                        {isFullscreen ? (
                                            <Shrink className="h-3.5 w-3.5" />
                                        ) : (
                                            <Expand className="h-3.5 w-3.5" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-white hover:bg-white/20 rounded-full"
                                        onClick={() => setIsMinimized(true)}
                                    >
                                        <Minimize2 className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-white hover:bg-white/20 hover:text-red-200 rounded-full"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>

                            <TechnicalChat
                                language={language}
                                apiUrl={process.env.NEXT_PUBLIC_BACKEND_URL
                                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rag/chat`
                                    : "/api/rag/chat"}
                                className="h-full border-0 shadow-none rounded-none"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Button */}
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out absolute bottom-0 right-0",
                    isOpen ? "opacity-0 scale-50 pointer-events-none" : "opacity-100 scale-100 z-50",
                    "flex flex-col items-end gap-4"
                )}
            >
                {/* Enhanced Callout Tooltip - Always visible initially or on hover */}
                <div
                    className={cn(
                        "mr-2 relative bg-white py-2.5 px-4 rounded-xl shadow-xl border border-blue-100/50 text-sm font-bold text-[#4463b1] animate-in fade-in slide-in-from-right-4 duration-700 delay-300 whitespace-nowrap",
                        "after:content-[''] after:absolute after:right-6 after:-bottom-2 after:w-4 after:h-4 after:bg-white after:border-r after:border-b after:border-blue-100/50 after:rotate-45"
                    )}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {language === "vi" ? "Tư vấn ở đây!" : "Chat with AI!"}
                        <span className=""></span>
                    </span>
                </div>

                <div className="relative group mr-1 mb-1">
                    {showPulse && !isOpen && (
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#4463b1] opacity-20 animate-ping"></span>
                    )}

                    <Button
                        onClick={() => setIsOpen(true)}
                        className="h-[60px] w-[60px] md:h-[70px] md:w-[70px] rounded-full shadow-2xl shadow-blue-600/40 bg-[#4463b1] hover:bg-[#354e8d] hover:scale-105 transition-all duration-300 flex items-center justify-center border-[3px] border-white ring-4 ring-blue-50"
                        size="icon"
                        aria-label="Open chat"
                    >
                        <div className="relative flex items-center justify-center w-full h-full">
                            <Bot className="h-8 w-8 md:h-10 md:w-10 text-white transition-transform duration-300 group-hover:rotate-12" />
                            <div className="absolute top-0 right-0 translate-x-1 -translate-y-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                                1
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ChatWidget;
