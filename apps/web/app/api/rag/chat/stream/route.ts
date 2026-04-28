import { createTextStreamResponse } from "ai";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4002";

export async function POST(req: Request) {
    const body = await req.json();
    const { messages, ...options } = body;
    const lastMessage = messages?.[messages.length - 1];

    // Extract text from v6 UIMessage format (parts array) or legacy content
    const question =
        lastMessage?.content ||
        lastMessage?.parts?.find((p: any) => p.type === "text")?.text;

    if (!question) {
        return new Response(JSON.stringify({ error: "No message content" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const backendResponse = await fetch(`${BACKEND_URL}/api/rag/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            question,
            language: options.language || "vi",
            conversationId: options.conversationId,
            sessionId: options.sessionId,
        }),
    });

    if (!backendResponse.ok || !backendResponse.body) {
        return new Response(
            JSON.stringify({ error: "Backend stream failed" }),
            { status: 502, headers: { "Content-Type": "application/json" } }
        );
    }

    // Transform backend SSE → plain text stream for TextStreamChatTransport.
    const textStream = new ReadableStream<string>({
        async start(controller) {
            const reader = backendResponse.body!.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const parts = buffer.split("\n\n");
                    buffer = parts.pop() || "";

                    for (const part of parts) {
                        const line = part.trim();
                        if (!line.startsWith("data: ")) continue;

                        try {
                            const json = JSON.parse(line.slice(6));

                            if (json.type === "chunk") {
                                controller.enqueue(json.data);
                            }
                        } catch {
                            // Skip malformed JSON
                        }
                    }
                }
            } catch {
                // Stream error — close gracefully
            } finally {
                controller.close();
            }
        },
    });

    return createTextStreamResponse({ textStream });
}
