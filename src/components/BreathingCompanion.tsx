'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type Phase = 'ready' | 'inhale' | 'hold' | 'exhale';

type Props = {
  onClose: () => void;
};

export default function BreathingCompanion({ onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (phase === 'ready') return;

    const phaseDurations: Record<Exclude<Phase, 'ready'>, number> = {
      inhale: 4,
      hold: 7,
      exhale: 8,
    };
    const next: Record<Exclude<Phase, 'ready'>, Exclude<Phase, 'ready'>> = {
      inhale: 'hold',
      hold: 'exhale',
      exhale: 'inhale',
    };

    const interval = setInterval(() => {
      setCount((c) => {
        if (c + 1 >= phaseDurations[phase as Exclude<Phase, 'ready'>]) {
          if (phase === 'exhale') setCycles((cc) => cc + 1);
          setPhase(next[phase as Exclude<Phase, 'ready'>]);
          return 0;
        }
        return c + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  const phaseLabel: Record<Phase, string> = {
    ready: 'When you are ready',
    inhale: 'Breathe in...',
    hold: 'Hold gently',
    exhale: 'Slowly out...',
  };

  const scale =
    phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : phase === 'exhale' ? 0.85 : 1;

  const transition =
    phase === 'inhale'
      ? 'transform 4s ease-in-out'
      : phase === 'exhale'
        ? 'transform 8s ease-in-out'
        : phase === 'hold'
          ? 'transform 7s linear'
          : 'transform 0.5s';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(31, 22, 18, 0.75)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="relative max-w-md w-full rounded-3xl p-10 text-center"
        style={{ background: '#f4ece0', boxShadow: '0 30px 80px rgba(31,22,18,0.4)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 transition"
          style={{ color: '#7a3826' }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <p
          className="text-xs uppercase tracking-[0.3em] mb-2"
          style={{ color: '#b26b52', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          A moment together
        </p>
        <h2
          className="text-3xl mb-10"
          style={{
            color: '#3a2e26',
            fontFamily: 'var(--font-fraunces), serif',
            fontWeight: 400,
            fontStyle: 'italic',
          }}
        >
          Breathe with me
        </h2>

        <div className="relative h-64 flex items-center justify-center mb-8">
          <div
            className="absolute rounded-full"
            style={{
              width: 220,
              height: 220,
              border: '1px solid rgba(178,107,82,0.2)',
              transform: `scale(${scale * 0.95})`,
              transition,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 180,
              height: 180,
              background: 'radial-gradient(circle, rgba(217,166,116,0.5) 0%, rgba(217,166,116,0.1) 100%)',
              transform: `scale(${scale})`,
              transition,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 100,
              height: 100,
              background: 'radial-gradient(circle, #d9a674 0%, #b26b52 100%)',
              transform: `scale(${scale})`,
              transition,
              boxShadow: '0 0 40px rgba(217,166,116,0.4)',
            }}
          />
          <div
            className="relative z-10 text-white"
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontSize: 18,
              fontStyle: 'italic',
            }}
          >
            {phase !== 'ready' && count + 1}
          </div>
        </div>

        <p
          className="text-lg mb-2"
          style={{
            color: '#3a2e26',
            fontFamily: 'var(--font-fraunces), serif',
            fontStyle: 'italic',
          }}
        >
          {phaseLabel[phase]}
        </p>
        <p
          className="text-sm mb-8"
          style={{
            color: '#7a3826',
            opacity: 0.6,
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          {cycles > 0 && `${cycles} breath${cycles > 1 ? 's' : ''} together`}
        </p>

        {phase === 'ready' ? (
          <button
            onClick={() => setPhase('inhale')}
            className="px-8 py-3 rounded-full text-white transition hover:opacity-90"
            style={{
              background: '#b26b52',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 500,
              letterSpacing: '0.05em',
            }}
          >
            Begin
          </button>
        ) : (
          <button
            onClick={onClose}
            className="text-sm underline"
            style={{
              color: '#7a3826',
              opacity: 0.7,
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            I feel calmer now
          </button>
        )}
      </div>
    </div>
  );
}
