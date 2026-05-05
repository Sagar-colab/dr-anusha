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
        style={{ width: 320, height: 70 }}
      >
        <svg
          viewBox="0 0 320 70"
          width="320"
          height="70"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'hidden' }}
        >
          <defs>
            {/* Edge fade — softens both sides so peaks don't pop in/out abruptly */}
            <linearGradient id="ecgEdgeFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="15%" stopColor="white" stopOpacity="1" />
              <stop offset="85%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="ecgMask">
              <rect x="0" y="0" width="320" height="70" fill="url(#ecgEdgeFade)" />
            </mask>

            <filter id="ecgGlow" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Faint baseline grid hint */}
          <line
            x1="0"
            y1="35"
            x2="320"
            y2="35"
            stroke="var(--color-sage)"
            strokeOpacity="0.18"
            strokeWidth="1"
          />

          {/* Continuous waveform — long path with repeating heartbeats, scrolls left */}
          <g mask="url(#ecgMask)">
            <g style={{ animation: 'ecgScroll 4s linear infinite' }}>
              {/* Two copies of the same pattern, offset, so it loops seamlessly.
                  Each "beat" is 80 units wide. The pattern repeats every 80 units.
                  We render 8 beats (640 units) and animate translation by 80 units.
                  When the animation resets, the next beat is in the same position. */}
              <path
                d="M 0 35
                   L 10 35 L 14 31 L 18 35
                   L 24 35 L 30 12 L 36 58 L 40 28 L 46 35
                   L 60 35 L 64 38 L 68 35
                   L 80 35
                   L 90 35 L 94 31 L 98 35
                   L 104 35 L 110 12 L 116 58 L 120 28 L 126 35
                   L 140 35 L 144 38 L 148 35
                   L 160 35
                   L 170 35 L 174 31 L 178 35
                   L 184 35 L 190 12 L 196 58 L 200 28 L 206 35
                   L 220 35 L 224 38 L 228 35
                   L 240 35
                   L 250 35 L 254 31 L 258 35
                   L 264 35 L 270 12 L 276 58 L 280 28 L 286 35
                   L 300 35 L 304 38 L 308 35
                   L 320 35
                   L 330 35 L 334 31 L 338 35
                   L 344 35 L 350 12 L 356 58 L 360 28 L 366 35
                   L 380 35 L 384 38 L 388 35
                   L 400 35
                   L 410 35 L 414 31 L 418 35
                   L 424 35 L 430 12 L 436 58 L 440 28 L 446 35
                   L 460 35 L 464 38 L 468 35
                   L 480 35
                   L 490 35 L 494 31 L 498 35
                   L 504 35 L 510 12 L 516 58 L 520 28 L 526 35
                   L 540 35 L 544 38 L 548 35
                   L 560 35
                   L 570 35 L 574 31 L 578 35
                   L 584 35 L 590 12 L 596 58 L 600 28 L 606 35
                   L 620 35 L 624 38 L 628 35
                   L 640 35"
                fill="none"
                stroke="var(--color-terracotta)"
                strokeOpacity="0.85"
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
