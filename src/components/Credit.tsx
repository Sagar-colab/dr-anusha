'use client';

export default function Credit() {
  return (
    <p
      className="fixed bottom-3 left-1/2 -translate-x-1/2 text-xs pointer-events-none select-none z-20"
      style={{
        color: 'var(--color-burnt)',
        opacity: 0.4,
        fontFamily: 'var(--font-inter), sans-serif',
        letterSpacing: '0.08em',
      }}
    >
      Created by sagar 🩷 🧸
    </p>
  );
}
