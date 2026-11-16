import { diffDays, todayISO } from './dates';
import type { DayLog, MoodLog, IntimateLog } from '../model';
import { getMoodLevel, type MoodLevel } from '@/pages/mood/lib/moodLevel';

export const MONTHS_RU_PREP = [
  'январе',
  'феврале',
  'марте',
  'апреле',
  'мае',
  'июне',
  'июле',
  'августе',
  'сентябре',
  'октябре',
  'ноябре',
  'декабре',
];

export function pluralize(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const rem = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (rem > 1 && rem < 5) return few;
  if (rem === 1) return one;
  return many;
}

export function hasHabitMark(log: DayLog | undefined): boolean {
  if (!log) return false;
  return log.items.length > 0 || Boolean(log.wasBad);
}

export function calculateHabitStreak(
  records: Record<string, DayLog>,
  today: string = todayISO(),
): number {
  if (hasHabitMark(records[today])) {
    return 0;
  }

  const markDates = Object.keys(records)
    .filter((date) => date <= today && hasHabitMark(records[date]))
    .sort();

  if (markDates.length === 0) {
    return 0;
  }

  const lastMarkDate = markDates[markDates.length - 1];
  return Math.max(0, diffDays(lastMarkDate, today));
}

export function getStreakEmoji(streak: number): string {
  return streak >= 3 ? '🔥' : '🌱';
}

export function calculateHabitMonthMarks(
  records: Record<string, DayLog>,
  year: number,
  month: number,
): number {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  return Object.keys(records).filter(
    (date) => date.startsWith(prefix) && hasHabitMark(records[date]),
  ).length;
}

export interface MoodMonthStats {
  count: number;
  predominant: MoodLevel | null;
}

export function calculateMoodMonthStats(
  records: Record<string, MoodLog>,
  year: number,
  month: number,
): MoodMonthStats {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  let count = 0;
  const counts: Record<NonNullable<MoodLevel>, number> = {
    good: 0,
    warning: 0,
    bad: 0,
    critical: 0,
  };

  for (const [date, log] of Object.entries(records)) {
    if (!date.startsWith(prefix)) continue;
    const level = getMoodLevel(log);
    if (level) {
      count++;
      counts[level]++;
    }
  }

  if (count === 0) {
    return { count: 0, predominant: null };
  }

  const levels: NonNullable<MoodLevel>[] = ['good', 'warning', 'bad', 'critical'];
  let maxCount = -1;
  let predominant: MoodLevel = null;

  for (const lvl of levels) {
    if (counts[lvl] > maxCount) {
      maxCount = counts[lvl];
      predominant = lvl;
    }
  }

  return { count, predominant };
}

export function getMoodPredominantInfo(level: MoodLevel | null): { emoji: string; text: string } {
  switch (level) {
    case 'good':
      return { emoji: '😊', text: 'Всё хорошо' };
    case 'warning':
      return { emoji: '😐', text: 'Есть сложности' };
    case 'bad':
      return { emoji: '🙁', text: 'Много негатива' };
    case 'critical':
      return { emoji: '😫', text: 'Очень тяжело' };
    default:
      return { emoji: '—', text: 'Нет отметок' };
  }
}

export interface IntimateMonthStats {
  total: number;
  sex: number;
  masturbation: number;
  activeDays: number;
}

export function calculateIntimateMonthStats(
  records: Record<string, IntimateLog>,
  year: number,
  month: number,
): IntimateMonthStats {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  let total = 0;
  let sex = 0;
  let masturbation = 0;
  let activeDays = 0;

  for (const [date, log] of Object.entries(records)) {
    if (!date.startsWith(prefix) || !log) continue;
    const s = log.sex ?? 0;
    const m = log.masturbation ?? 0;
    if (s > 0 || m > 0) {
      activeDays++;
      sex += s;
      masturbation += m;
      total += s + m;
    }
  }

  return { total, sex, masturbation, activeDays };
}
