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

      <div
        className="relative z-10 mb-12 flex items-center justify-center overflow-hidden"
        style={{ width: 360, height: 80 }}
      >
        <svg
          viewBox="0 0 360 80"
          width="360"
          height="80"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'hidden' }}
        >
          <defs>
            <linearGradient id="ecgEdgeFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="12%" stopColor="white" stopOpacity="1" />
              <stop offset="88%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="ecgMask">
              <rect x="0" y="0" width="360" height="80" fill="url(#ecgEdgeFade)" />
            </mask>
            <filter id="ecgGlow" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Faint baseline */}
          <line
            x1="0"
            y1="40"
            x2="360"
            y2="40"
            stroke="var(--color-sage)"
            strokeOpacity="0.2"
            strokeWidth="1"
          />

          {/* Heartbeat — moves LEFT TO RIGHT.
              Pattern repeats every 180 units. Each beat:
              - Long flat baseline (rest period)
              - Small P wave (atrial bump)
              - Tiny Q dip
              - Sharp tall R spike (ventricular contraction)
              - Sharp S dip
              - Small T bump (relaxation)
              - Back to baseline
              Two copies of the pattern, animation translates +180 to loop seamlessly. */}
          <g mask="url(#ecgMask)">
            <g style={{ animation: 'ecgPulse 1.4s linear infinite' }}>
              <path
                d="M -360 40
                   L -280 40
                   L -270 40 L -266 36 L -262 40
                   L -255 40
                   L -252 42 L -250 40
                   L -248 16 L -246 64 L -244 40
                   L -238 40 L -234 38 L -230 40
                   L -180 40
                   L -100 40
                   L -90 40 L -86 36 L -82 40
                   L -75 40
                   L -72 42 L -70 40
                   L -68 16 L -66 64 L -64 40
                   L -58 40 L -54 38 L -50 40
                   L 0 40
                   L 80 40
                   L 90 40 L 94 36 L 98 40
                   L 105 40
                   L 108 42 L 110 40
                   L 112 16 L 114 64 L 116 40
                   L 122 40 L 126 38 L 130 40
                   L 180 40
                   L 260 40
                   L 270 40 L 274 36 L 278 40
                   L 285 40
                   L 288 42 L 290 40
                   L 292 16 L 294 64 L 296 40
                   L 302 40 L 306 38 L 310 40
                   L 360 40"
                fill="none"
                stroke="var(--color-terracotta)"
                strokeOpacity="0.9"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#ecgGlow)"
              />
            </g>
          </g>
        </svg>
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
