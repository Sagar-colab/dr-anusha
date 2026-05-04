# Project Documentation

A warm AI health companion chatbot — a kind doctor persona offering general health and wellness guidance. Never diagnoses, never prescribes medication, gently directs users to real doctors when appropriate.

## Stack

- Frontend: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- Fonts: Fraunces (display) + Inter (body) via next/font
- AI provider: Google Gemini (gemini-2.5-flash, free tier — 1500 requests/day)
- Hosting: Vercel
- Repo host: GitHub (private)

## Architecture

- `src/app/page.tsx` — renders the main Chat client component
- `src/components/Chat.tsx` — chat client with mood detection, ambient background, breathing companion modal
- `src/components/BreathingCompanion.tsx` — guided 4-7-8 breathing modal that appears when distress is detected
- `src/lib/mood.ts` — keyword-based mood detection (concerned, gentle, warm, thoughtful, listening)
- `src/lib/system-prompt.ts` — full persona system prompt (warm, no-diagnosis, no-prescription rules)
- `src/app/api/chat/route.ts` — streaming API route, Gemini SDK, conversation history mapping
- `src/types/chat.ts` — TypeScript types for messages and moods

## Build phases

The project was built in 5 phases:

| Phase | What it did |
|---|---|
| 01 | Scaffold: Next.js + TypeScript + Tailwind project, fonts, design tokens, placeholder homepage |
| 02 | Chat UI: components, message bubbles, mood-aware presence indicator, breathing modal |
| 03 | Real AI streaming via /api/chat |
| 04 | GitHub push, Vercel deploy, production env vars |
| 05 | Switch AI provider to Google Gemini (free tier) |

## Persona safeguards

The system prompt enforces:
- Never diagnose — uses phrases like "this could be..." instead
- Never prescribe medication or dosages — redirects to a real doctor
- Emergency situations (chest pain, suicidal thoughts, severe injury) — direct user to local emergency services
- Mental health distress — encourage professional or trusted-person support

## Future work

- Rate limiting on /api/chat
- Medical disclaimer modal on first visit
- Custom domain
- Voice input/output
- Multi-language support
- Conversation persistence
