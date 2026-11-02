import type { IntimateLog } from '@/shared/model';

export function getIntimateEmoji(log?: IntimateLog | null): string | null {
  if (!log) return null;
  const hasSex = (log.sex ?? 0) > 0;
  const hasMasturbation = (log.masturbation ?? 0) > 0;
  if (hasSex && hasMasturbation) return '🔥';
  if (hasSex) return '❤️';
  if (hasMasturbation) return '💦';
  return null;
}
