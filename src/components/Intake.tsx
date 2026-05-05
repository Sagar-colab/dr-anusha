'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { saveIntake } from '@/lib/intake-storage';
import type { FeelingTone } from '@/types/chat';

const FEELINGS: { tone: FeelingTone; label: string }[] = [
  { tone: 'okay', label: 'okay, just curious' },
  { tone: 'tired', label: 'tired or run down' },
  { tone: 'anxious', label: 'anxious or worried' },
  { tone: 'low', label: 'a bit low' },
  { tone: 'unsure', label: 'not sure how to describe it' },
];

export default function Intake() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [name, setName] = useState('');
  const [concern, setConcern] = useState('');
  const [feeling, setFeeling] = useState<FeelingTone | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHasMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const next = () => setStep((s) => (s < 2 ? ((s + 1) as 0 | 1 | 2) : s));
  const back = () => setStep((s) => (s > 0 ? ((s - 1) as 0 | 1 | 2) : s));

  const canAdvance =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && concern.trim().length > 0) ||
    (step === 2 && feeling !== null);

  const handleFinish = () => {
    if (!feeling) return;
    saveIntake({
      name: name.trim(),
      concern: concern.trim(),
      feeling,
    });
    setIsExiting(true);
    setTimeout(() => router.push('/chat'), 600);
  };

  return (
    <main
      className="grain relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden"
      style={{
        opacity: isExiting ? 0 : hasMounted ? 1 : 0,
        transition: 'opacity 600ms ease',
      }}
    >
      {/* Ambient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-20%',
          left: '-10%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(217,166,116,0.16) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Step indicator — three dots */}
      <div className="relative z-10 flex items-center gap-2 mb-16">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === step ? 24 : 6,
              height: 6,
              background:
                i === step
                  ? 'var(--color-terracotta)'
                  : i < step
                    ? 'rgba(178,107,82,0.5)'
                    : 'rgba(178,107,82,0.18)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Step 0 — Name */}
        {step === 0 && (
          <div
            style={{ animation: 'msgRise 0.5s cubic-bezier(0.4,0,0.2,1) both' }}
          >
            <p
              className="text-xs uppercase tracking-[0.32em] mb-4 text-center"
              style={{ color: 'var(--color-burnt)', opacity: 0.5 }}
            >
              before we begin
            </p>
            <h2
              className="text-center mb-12"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontWeight: 400,
                fontStyle: 'italic',
                fontSize: 'clamp(26px, 4vw, 36px)',
                color: 'var(--color-cocoa)',
                lineHeight: 1.3,
              }}
            >
              what should I call you?
            </h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && canAdvance) next();
              }}
              autoFocus
              placeholder="your first name"
              className="w-full px-6 py-4 bg-transparent outline-none text-center"
              style={{
                color: 'var(--color-cocoa)',
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: 22,
                fontWeight: 300,
                borderBottom: '1px solid rgba(178,107,82,0.25)',
              }}
            />
          </div>
        )}

        {/* Step 1 — Concern */}
        {step === 1 && (
          <div
            style={{ animation: 'msgRise 0.5s cubic-bezier(0.4,0,0.2,1) both' }}
          >
            <p
              className="text-xs uppercase tracking-[0.32em] mb-4 text-center"
              style={{ color: 'var(--color-burnt)', opacity: 0.5 }}
            >
              hi, {name.trim()}
            </p>
            <h2
              className="text-center mb-12"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontWeight: 400,
                fontStyle: 'italic',
                fontSize: 'clamp(26px, 4vw, 36px)',
                color: 'var(--color-cocoa)',
                lineHeight: 1.3,
              }}
            >
              what brings you here today?
            </h2>
            <textarea
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && canAdvance) {
                  e.preventDefault();
                  next();
                }
              }}
              autoFocus
              placeholder="a few words is enough — you can say more once we start talking"
              rows={3}
              className="w-full px-6 py-4 bg-transparent outline-none text-center resize-none"
              style={{
                color: 'var(--color-cocoa)',
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: 18,
                fontWeight: 300,
                lineHeight: 1.6,
                borderBottom: '1px solid rgba(178,107,82,0.25)',
              }}
            />
          </div>
        )}

        {/* Step 2 — Feeling */}
        {step === 2 && (
          <div
            style={{ animation: 'msgRise 0.5s cubic-bezier(0.4,0,0.2,1) both' }}
          >
            <p
              className="text-xs uppercase tracking-[0.32em] mb-4 text-center"
              style={{ color: 'var(--color-burnt)', opacity: 0.5 }}
            >
              one more
            </p>
            <h2
              className="text-center mb-12"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontWeight: 400,
                fontStyle: 'italic',
                fontSize: 'clamp(26px, 4vw, 36px)',
                color: 'var(--color-cocoa)',
                lineHeight: 1.3,
              }}
            >
              how are you feeling, in this moment?
            </h2>
            <div className="flex flex-col gap-3">
              {FEELINGS.map((f) => (
                <button
                  key={f.tone}
                  onClick={() => setFeeling(f.tone)}
                  className="px-6 py-3.5 rounded-full transition hover:scale-[1.01]"
                  style={{
                    background:
                      feeling === f.tone
                        ? 'rgba(178,107,82,0.15)'
                        : 'rgba(255,250,240,0.55)',
                    border:
                      feeling === f.tone
                        ? '1px solid rgba(178,107,82,0.5)'
                        : '1px solid rgba(178,107,82,0.18)',
                    color:
                      feeling === f.tone
                        ? 'var(--color-cocoa)'
                        : 'var(--color-burnt)',
                    fontFamily: 'var(--font-fraunces), serif',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: 16,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="relative z-10 mt-16 flex items-center gap-4">
        {step > 0 && (
          <button
            onClick={back}
            className="text-sm transition hover:opacity-80"
            style={{
              color: 'var(--color-burnt)',
              opacity: 0.6,
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            ← back
          </button>
        )}
        {step < 2 && (
          <button
            onClick={next}
            disabled={!canAdvance}
            className="px-8 py-3 rounded-full transition hover:opacity-90 active:scale-[0.98] disabled:opacity-30"
            style={{
              background: 'var(--color-terracotta)',
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: '0.04em',
              boxShadow: '0 8px 24px rgba(178,107,82,0.2)',
            }}
          >
            continue
          </button>
        )}
        {step === 2 && (
          <button
            onClick={handleFinish}
            disabled={!canAdvance}
            className="px-10 py-3.5 rounded-full transition hover:opacity-90 active:scale-[0.98] disabled:opacity-30"
            style={{
              background: 'var(--color-terracotta)',
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 500,
              fontSize: 15,
              letterSpacing: '0.04em',
              boxShadow: '0 8px 24px rgba(178,107,82,0.25)',
            }}
          >
            begin
          </button>
        )}
      </div>
    </main>
  );
}
