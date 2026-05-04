import type { Mood } from '@/types/chat';

export const detectMood = (text: string): Mood => {
  const t = text.toLowerCase();
  if (/\b(anxious|anxiety|panic|overwhelm|scared|afraid|fear|worried|nervous)\b/.test(t)) return 'concerned';
  if (/\b(sad|depressed|lonely|cry|crying|hurt|down|low|hopeless|empty)\b/.test(t)) return 'gentle';
  if (/\b(pain|ache|sick|fever|nausea|dizzy|sore|tired|exhausted)\b/.test(t)) return 'concerned';
  if (/\b(thanks|thank you|better|good|happy|nice|grateful|appreciate)\b/.test(t)) return 'warm';
  if (/\b(help|don'?t know|confused|unsure|what should)\b/.test(t)) return 'thoughtful';
  return 'listening';
};

export const shouldOfferBreathing = (text: string): boolean => {
  const t = text.toLowerCase();
  return /\b(anxious|anxiety|panic|overwhelm|stress|stressed|can'?t sleep|racing|tense)\b/.test(t);
};
