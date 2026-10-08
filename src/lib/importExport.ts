import type { AppSnapshot } from '../store/useAppStore';
import type { Intake } from '../types';

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function exportSnapshot(s: AppSnapshot): string {
  return JSON.stringify(s, null, 2);
}

type ParseResult = { ok: true; data: AppSnapshot } | { ok: false; error: string };

function isDayLog(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const log = value as Record<string, unknown>;
  return Array.isArray(log.items) && log.items.every((i) => typeof i === 'string') && typeof log.wasBad === 'boolean';
}

function isIntake(value: unknown): value is Intake {
  return value === 'before' || value === 'during' || value === 'after';
}

function isMedication(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const med = value as Record<string, unknown>;
  return (
    typeof med.name === 'string' &&
    med.name.length > 0 &&
    typeof med.dosage === 'string' &&
    typeof med.timesPerDay === 'number' &&
    Number.isInteger(med.timesPerDay) &&
    med.timesPerDay >= 1 &&
    isIntake(med.intake)
  );
}

function isPillCourse(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const course = value as Record<string, unknown>;
  return (
    typeof course.id === 'string' &&
    course.id.length > 0 &&
    typeof course.title === 'string' &&
    typeof course.startDate === 'string' &&
    DATE_RE.test(course.startDate) &&
    typeof course.endDate === 'string' &&
    DATE_RE.test(course.endDate) &&
    course.endDate >= course.startDate &&
    Array.isArray(course.medications) &&
    course.medications.length > 0 &&
    course.medications.every(isMedication)
  );
}

function isTracker(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  return Object.values(value).every(isDayLog);
}

export function parseImport(json: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { ok: false, error: 'Файл не является валидным JSON' };
  }

  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, error: 'JSON должен быть объектом' };
  }
  const data = raw as Record<string, unknown>;

  if (!isTracker(data.alcohol)) return { ok: false, error: 'Поле alcohol невалидно' };
  if (!isTracker(data.fastfood)) return { ok: false, error: 'Поле fastfood невалидно' };
  if (!Array.isArray(data.pillCourses) || !data.pillCourses.every(isPillCourse)) {
    return { ok: false, error: 'Поле pillCourses невалидно' };
  }

  return {
    ok: true,
    data: {
      alcohol: data.alcohol as AppSnapshot['alcohol'],
      fastfood: data.fastfood as AppSnapshot['fastfood'],
      pillCourses: data.pillCourses as AppSnapshot['pillCourses'],
    },
  };
}
