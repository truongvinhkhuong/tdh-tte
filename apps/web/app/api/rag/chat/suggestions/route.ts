import { NextRequest, NextResponse } from "next/server";

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:4003";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const res = await fetch(`${AI_ENGINE_URL}/api/chat/suggestions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: body.question,
                answer: body.answer,
                language: body.language || "vi",
            }),
        });

        if (!res.ok) {
            return NextResponse.json({ suggestions: [] });
        }

        const data = await res.json();
        return NextResponse.json({ suggestions: data.suggestions || [] });
    } catch {
        return NextResponse.json({ suggestions: [] });
    }
}
