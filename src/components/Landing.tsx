'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Landing() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Trigger fade-in after mount
    const t = setTimeout(() => setHasMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleBegin = () => {
    setIsExiting(true);
    setTimeout(() => router.push('/intake'), 600);
  };

  return (
    <main
      className="grain relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden"
      style={{
        opacity: isExiting ? 0 : hasMounted ? 1 : 0,
        transition: 'opacity 600ms ease',
      }}
    >
      {/* Soft ambient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-15%',
          right: '-10%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(217,166,116,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-20%',
          left: '-15%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(122,139,126,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Pulsing dot */}
      <div
        className="relative z-10 mb-12 flex items-center justify-center"
        style={{ width: 64, height: 64 }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 64,
            height: 64,
            background: 'rgba(122,139,126,0.1)',
            animation: 'haloPulse 4s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 36,
            height: 36,
            background: 'rgba(178,107,82,0.14)',
            animation: 'haloPulse 4s ease-in-out infinite 0.6s',
          }}
        />
        <div
          className="rounded-full"
          style={{
            width: 14,
            height: 14,
            background: '#7a8b7e',
            boxShadow: '0 0 14px rgba(122,139,126,0.5)',
            animation: 'shimmerCue 3s ease-in-out infinite',
          }}
        />
      </div>

      {/* Single sentence — the hero */}
      <h1
        className="relative z-10 text-center max-w-2xl"
        style={{
          fontFamily: 'var(--font-fraunces), serif',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(28px, 5vw, 44px)',
          lineHeight: 1.3,
          color: 'var(--color-cocoa)',
          letterSpacing: '-0.005em',
        }}
      >
        a quiet space, for whatever you&rsquo;re carrying today.
      </h1>

      {/* Subtle subtitle */}
      <p
        className="relative z-10 mt-6 text-sm md:text-base text-center max-w-md"
        style={{
          color: 'var(--color-burnt)',
          opacity: 0.55,
          fontFamily: 'var(--font-inter), sans-serif',
          fontWeight: 400,
          letterSpacing: '0.01em',
        }}
      >
        Take a breath. Talk to Dr. Anusha when you&rsquo;re ready.
      </p>

      {/* CTA */}
      <button
        onClick={handleBegin}
        disabled={isExiting}
        className="relative z-10 mt-16 px-10 py-3.5 rounded-full transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
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
        Begin your visit
      </button>

      <p
        className="relative z-10 mt-12 text-xs uppercase tracking-[0.3em]"
        style={{ color: 'var(--color-burnt)', opacity: 0.4 }}
      >
        confidential · supportive · not a substitute for a real doctor
      </p>
    </main>
  );
}
