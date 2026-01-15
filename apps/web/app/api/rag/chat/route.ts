import { NextRequest, NextResponse } from "next/server";

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:4003";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Call AI Engine directly (or via NestJS backend)
        const response = await fetch(`${AI_ENGINE_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: body.question,
                language: body.language || "vi",
                conversation_id: body.conversationId,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            return NextResponse.json(
                { success: false, error: error.detail || "Chat request failed" },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            data: {
                answer: data.answer,
                citations: data.citations || [],
                confidence: data.confidence,
                conversation_id: data.conversation_id,
                sources_count: data.sources_count || 0,
            },
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
