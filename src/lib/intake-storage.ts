'use client';

import type { IntakeData } from '@/types/chat';

const KEY = 'dr-anusha-intake';

export function saveIntake(data: IntakeData): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // sessionStorage might be disabled (private browsing in some browsers)
  }
}

export function loadIntake(): IntakeData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.name === 'string' &&
      typeof parsed.concern === 'string' &&
      typeof parsed.feeling === 'string'
    ) {
      return parsed as IntakeData;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearIntake(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
