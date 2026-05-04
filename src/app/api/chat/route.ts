import { GoogleGenerativeAI } from '@google/generative-ai';
import { ANUSHA_SYSTEM_PROMPT } from '@/lib/system-prompt';
import type { NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

type IncomingMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function POST(req: NextRequest) {
  // Validate API key is configured
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'API key not configured. Add GEMINI_API_KEY to .env.local',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const messages: IncomingMessage[] = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Gemini uses 'user' and 'model' roles, not 'user' and 'assistant'.
    // Convert from our internal format. Also: Gemini requires the conversation
    // to start with a user message — strip any leading assistant message.
    const cleaned = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role,
        content: String(m.content ?? ''),
      }));

    // Drop any leading assistant messages (the opening greeting from our UI)
    let firstUserIdx = cleaned.findIndex((m) => m.role === 'user');
    if (firstUserIdx === -1) {
      return new Response(
        JSON.stringify({ error: 'No user message in conversation' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const trimmed = cleaned.slice(firstUserIdx);

    // The latest user message is sent separately; everything before is history
    const history = trimmed.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const latest = trimmed[trimmed.length - 1];

    if (latest.role !== 'user') {
      return new Response(
        JSON.stringify({ error: 'Last message must be from user' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: ANUSHA_SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1024,
      },
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(latest.content);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          console.error('Gemini stream error:', err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate response',
        detail: error instanceof Error ? error.message : 'unknown',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
