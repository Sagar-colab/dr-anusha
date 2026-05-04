import Anthropic from '@anthropic-ai/sdk';
import { ANUSHA_SYSTEM_PROMPT } from '@/lib/system-prompt';
import type { NextRequest } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type IncomingMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function POST(req: NextRequest) {
  // Validate API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'API key not configured. Add ANTHROPIC_API_KEY to .env.local',
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

    // Sanitize: strip any non-user/assistant roles, ensure content is string
    const cleanMessages = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role,
        content: String(m.content ?? ''),
      }));

    const stream = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: ANUSHA_SYSTEM_PROMPT,
      messages: cleanMessages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          console.error('Stream error:', err);
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
