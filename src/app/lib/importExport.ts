import type { AppSnapshot, Intake } from '@/shared/model';

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

function isStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.every((i) => typeof i === 'string');
}

function isOptionalStringArray(log: Record<string, unknown>, key: string): boolean {
  return !(key in log) || log[key] === undefined || isStringArray(log[key]);
}

function isMoodLog(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const log = value as Record<string, unknown>;
  if (!isStringArray(log.emotions)) return false;
  if (!isOptionalStringArray(log, 'negativeReasons')) return false;
  if (!isOptionalStringArray(log, 'positiveReasons')) return false;
  if ('note' in log && log.note !== undefined && typeof log.note !== 'string') return false;
  return true;
}

function isMoodTracker(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  return Object.values(value).every(isMoodLog);
}

function isIntimateLog(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const log = value as Record<string, unknown>;
  return (
    typeof log.sex === 'number' &&
    Number.isInteger(log.sex) &&
    log.sex >= 0 &&
    typeof log.masturbation === 'number' &&
    Number.isInteger(log.masturbation) &&
    log.masturbation >= 0
  );
}

function isIntimateTracker(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  return Object.values(value).every(isIntimateLog);
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
  const moodRaw = data.mood ?? {};
  if (!isMoodTracker(moodRaw)) return { ok: false, error: 'Поле mood невалидно' };
  const intimateRaw = data.intimate ?? {};
  if (!isIntimateTracker(intimateRaw)) return { ok: false, error: 'Поле intimate невалидно' };

  return {
    ok: true,
    data: {
      alcohol: data.alcohol as AppSnapshot['alcohol'],
      fastfood: data.fastfood as AppSnapshot['fastfood'],
      pillCourses: data.pillCourses as AppSnapshot['pillCourses'],
      mood: moodRaw as AppSnapshot['mood'],
      intimate: intimateRaw as AppSnapshot['intimate'],
    },
  };
}
