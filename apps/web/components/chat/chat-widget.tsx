"use client";

import { useState } from "react";
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";
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

    const positionClasses = {
        "bottom-right": "right-4 bottom-4",
        "bottom-left": "left-4 bottom-4",
    };

    return (
        <div className={cn("fixed z-50", positionClasses[position])}>
            {/* Chat Window */}
            {isOpen && (
                <div
                    className={cn(
                        "mb-4 transition-all duration-300 ease-in-out",
                        isMinimized ? "h-14 w-72" : "h-[600px] w-[400px]"
                    )}
                >
                    {isMinimized ? (
                        // Minimized Header
                        <div className="h-full bg-background border rounded-lg shadow-lg flex items-center justify-between px-4">
                            <div className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-blue-600" />
                                <span className="font-medium">
                                    {language === "vi" ? "Tư vấn Kỹ thuật" : "Technical Support"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setIsMinimized(false)}
                                >
                                    <Maximize2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Full Chat Window
                        <div className="relative h-full bg-background rounded-lg shadow-xl border overflow-hidden">
                            {/* Window Controls */}
                            <div className="absolute top-3 right-3 z-10 flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => setIsMinimized(true)}
                                >
                                    <Minimize2 className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>

                            <TechnicalChat
                                language={language}
                                apiUrl={process.env.NEXT_PUBLIC_BACKEND_URL
                                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rag/chat`
                                    : "/api/rag/chat"}
                                className="h-full border-0 shadow-none"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
}

export default ChatWidget;
