'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Wind } from 'lucide-react';
import BreathingCompanion from './BreathingCompanion';
import { detectMood, shouldOfferBreathing } from '@/lib/mood';
import type { Message, Mood } from '@/types/chat';

const STARTER_PROMPTS = [
  "I've been feeling anxious lately",
  'I have a headache',
  "I can't sleep well",
  'I feel a bit low today',
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi, I'm Anusha, your friendly doctor. Tell me what's on your mind today. I'm here for you.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [mood, setMood] = useState<Mood>('idle');
  const [showBreathing, setShowBreathing] = useState(false);
  const [offerBreathing, setOfferBreathing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const sendMessage = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || isThinking) return;

    const userMsg: Message = { role: 'user', content: text };
    const detectedMood = detectMood(text);
    setMood(detectedMood);
    setOfferBreathing(shouldOfferBreathing(text));

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let messageStarted = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        if (!messageStarted) {
          messageStarted = true;
          setIsThinking(false);
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: assistantContent },
          ]);
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'assistant',
              content: assistantContent,
            };
            return updated;
          });
        }
      }

      // Settle mood after reply completes
      const replyMood: Mood =
        detectedMood === 'concerned' || detectedMood === 'gentle'
          ? 'gentle'
          : detectedMood === 'warm'
            ? 'warm'
            : 'listening';
      setMood(replyMood);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm having a little trouble connecting right now. Could you try sending that again in a moment? I'm still here.",
        },
      ]);
      setMood('gentle');
      setIsThinking(false);
    }
  };

  const ambientBg =
    mood === 'concerned' || mood === 'gentle'
      ? 'radial-gradient(ellipse at top, #f0dfc6 0%, #e8d4b8 45%, #d9bfa0 100%)'
      : mood === 'warm'
        ? 'radial-gradient(ellipse at top, #f9ecd1 0%, #f0d9b5 45%, #e0bd92 100%)'
        : 'radial-gradient(ellipse at top, #f4ece0 0%, #ebdfc9 45%, #dcc9ad 100%)';

  return (
    <div
      className="grain relative min-h-screen w-full overflow-hidden"
      style={{
        background: ambientBg,
        transition: 'background 2s ease',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '-5%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,166,116,0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-15%',
          right: '-10%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(122,139,126,0.18) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-8 md:py-10 flex flex-col min-h-screen">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                background: '#7a8b7e',
                animation: 'shimmerCue 2.5s ease-in-out infinite',
              }}
            />
            <p
              className="text-xs uppercase tracking-[0.32em]"
              style={{ color: '#7a3826', opacity: 0.7 }}
            >
              In session
            </p>
          </div>
          <p
            className="text-xs uppercase tracking-[0.32em]"
            style={{ color: '#7a3826', opacity: 0.5 }}
          >
            Anusha · gentle care
          </p>
        </div>

        <div className="flex flex-col items-center text-center pt-12 pb-6">
          <div
            className="relative mb-8 flex items-center justify-center"
            style={{ width: 56, height: 56 }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 56,
                height: 56,
                background: 'rgba(122,139,126,0.08)',
                animation: 'haloPulse 3s ease-in-out infinite',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 32,
                height: 32,
                background: 'rgba(178,107,82,0.12)',
                animation: 'haloPulse 3s ease-in-out infinite 0.5s',
              }}
            />
            <div
              className="rounded-full"
              style={{
                width: 12,
                height: 12,
                background: isThinking ? '#b26b52' : '#7a8b7e',
                boxShadow: isThinking
                  ? '0 0 12px rgba(178,107,82,0.6)'
                  : '0 0 10px rgba(122,139,126,0.4)',
                animation: 'shimmerCue 2s ease-in-out infinite',
                transition: 'background 0.6s, box-shadow 0.6s',
              }}
            />
          </div>

          <h1
            className="text-5xl md:text-6xl"
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontWeight: 400,
              color: '#3a2e26',
              letterSpacing: '-0.015em',
              lineHeight: 1.05,
            }}
          >
            Dr.{' '}
            <em
              style={{ fontStyle: 'italic', color: '#b26b52', fontWeight: 400 }}
            >
              Anusha
            </em>
          </h1>
          <p
            className="mt-4 text-sm md:text-base max-w-md"
            style={{
              color: '#7a3826',
              opacity: 0.7,
              fontFamily: 'var(--font-fraunces), serif',
              fontStyle: 'italic',
              fontWeight: 300,
            }}
          >
            {isThinking
              ? 'thinking with you...'
              : mood === 'concerned'
                ? "I'm listening. Take your time."
                : mood === 'gentle'
                  ? "I'm right here with you."
                  : mood === 'warm'
                    ? "I'm so glad you're here."
                    : 'a quiet space to talk.'}
          </p>
        </div>

        <div
          ref={scrollRef}
          className="scrollbar-soft flex-1 overflow-y-auto px-2 md:px-6 py-6 space-y-5"
          style={{ minHeight: 200 }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animation: 'msgRise 0.6s cubic-bezier(0.4, 0, 0.2, 1) both' }}
            >
              <div
                className="max-w-[85%] md:max-w-[75%] px-5 py-3.5"
                style={{
                  background:
                    m.role === 'user'
                      ? 'rgba(58, 46, 38, 0.92)'
                      : 'rgba(255, 250, 240, 0.85)',
                  color: m.role === 'user' ? '#f4ece0' : '#2a211b',
                  borderRadius:
                    m.role === 'user'
                      ? '22px 22px 6px 22px'
                      : '6px 22px 22px 22px',
                  fontFamily:
                    m.role === 'assistant'
                      ? 'var(--font-fraunces), serif'
                      : 'var(--font-inter), sans-serif',
                  fontWeight: 400,
                  fontSize: m.role === 'assistant' ? '17px' : '15px',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-wrap',
                  boxShadow:
                    m.role === 'assistant' ? '0 2px 12px rgba(58,46,38,0.06)' : 'none',
                  backdropFilter: m.role === 'assistant' ? 'blur(8px)' : 'none',
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isThinking && (
            <div
              className="flex justify-start"
              style={{ animation: 'msgRise 0.6s cubic-bezier(0.4, 0, 0.2, 1) both' }}
            >
              <div
                className="px-5 py-4 flex items-center gap-2"
                style={{
                  background: 'rgba(255, 250, 240, 0.7)',
                  borderRadius: '6px 22px 22px 22px',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: '#b26b52',
                    animation: 'floatDot 1.2s ease-in-out infinite',
                  }}
                />
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: '#b26b52',
                    animation: 'floatDot 1.2s ease-in-out infinite 0.2s',
                  }}
                />
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: '#b26b52',
                    animation: 'floatDot 1.2s ease-in-out infinite 0.4s',
                  }}
                />
              </div>
            </div>
          )}

          {offerBreathing && !showBreathing && !isThinking && (
            <div
              className="flex justify-start"
              style={{ animation: 'msgRise 0.6s cubic-bezier(0.4, 0, 0.2, 1) both' }}
            >
              <button
                onClick={() => setShowBreathing(true)}
                className="flex items-center gap-3 px-5 py-3.5 transition hover:opacity-90"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(217,166,116,0.25), rgba(122,139,126,0.18))',
                  border: '1px solid rgba(178,107,82,0.25)',
                  borderRadius: '6px 22px 22px 22px',
                  color: '#3a2e26',
                }}
              >
                <Wind size={16} style={{ color: '#b26b52' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-fraunces), serif',
                    fontStyle: 'italic',
                    fontSize: 15,
                  }}
                >
                  take a slow breath with me
                </span>
              </button>
            </div>
          )}

          {messages.length === 1 && !isThinking && (
            <div className="pt-4 flex flex-wrap gap-2 justify-center">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="px-4 py-2 text-sm rounded-full transition hover:scale-[1.02]"
                  style={{
                    background: 'rgba(255, 250, 240, 0.6)',
                    border: '1px solid rgba(178,107,82,0.25)',
                    color: '#7a3826',
                    backdropFilter: 'blur(8px)',
                    fontFamily: 'var(--font-fraunces), serif',
                    fontStyle: 'italic',
                    fontWeight: 300,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 pb-2">
          <div
            className="flex items-center gap-2 p-2 rounded-full"
            style={{
              background: 'rgba(255, 250, 240, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(178,107,82,0.18)',
              boxShadow: '0 4px 24px rgba(58,46,38,0.06)',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="say what is on your mind..."
              className="flex-1 px-5 py-2.5 bg-transparent outline-none"
              style={{
                color: '#2a211b',
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: 16,
                fontWeight: 300,
              }}
            />
            <button
              onClick={() => setShowBreathing(true)}
              className="p-3 rounded-full transition hover:bg-black/5"
              style={{ color: '#7a3826' }}
              title="Breathe with me"
              aria-label="Open breathing exercise"
            >
              <Wind size={18} />
            </button>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isThinking}
              className="p-3 rounded-full transition disabled:opacity-40"
              style={{
                background:
                  input.trim() && !isThinking ? '#b26b52' : 'rgba(178,107,82,0.3)',
                color: '#f4ece0',
              }}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          <p
            className="text-center text-xs mt-3"
            style={{
              color: '#7a3826',
              opacity: 0.5,
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            for emergencies, please call your local emergency services. anusha is here to support, not replace, in-person care.
          </p>
        </div>
      </div>

      {showBreathing && <BreathingCompanion onClose={() => setShowBreathing(false)} />}
    </div>
  );
}
