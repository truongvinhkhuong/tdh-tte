import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4002";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/api/rag/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: body.question,
                language: body.language || "vi",
                conversationId: body.conversationId,
                sessionId: body.sessionId,
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
            data: data.data,
            cached: data.cached || false,
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
