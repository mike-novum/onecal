import type { MoodLog } from '@/shared/model';
import { EMOTIONS } from '../config/emotions';

export type MoodLevel = 'good' | 'warning' | 'bad' | 'critical' | null;

export function getMoodLevel(log: MoodLog | undefined): MoodLevel {
  if (!log || log.emotions.length === 0) return null;

  const totalWeight = log.emotions.reduce((sum, id) => {
    const emotion = EMOTIONS.find((e) => e.id === id);
    return sum + (emotion ? emotion.weight : 0);
  }, 0);

  const avgWeight = totalWeight / log.emotions.length;

  if (avgWeight <= 1) return 'good';
  if (avgWeight <= 3) return 'warning';
  if (avgWeight <= 5) return 'bad';
  return 'critical';
}

export const MOOD_LEVEL_COLORS: Record<NonNullable<MoodLevel>, string> = {
  good: 'rgba(34, 197, 94, 0.35)',
  warning: 'rgba(234, 179, 8, 0.35)',
  bad: 'rgba(249, 115, 22, 0.35)',
  critical: 'rgba(239, 68, 68, 0.35)',
};

export const MOOD_LEVEL_BORDER_COLORS: Record<NonNullable<MoodLevel>, string> = {
  good: 'rgba(34, 197, 94, 0.6)',
  warning: 'rgba(234, 179, 8, 0.6)',
  bad: 'rgba(249, 115, 22, 0.6)',
  critical: 'rgba(239, 68, 68, 0.6)',
};
