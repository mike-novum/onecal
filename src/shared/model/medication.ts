import type { DayPart, DoseUnit, Intake, Medication } from './PillCourse';

export const INTAKE_OPTIONS: { value: Intake; label: string }[] = [
  { value: 'none', label: 'не привязано к еде' },
  { value: 'before', label: 'до еды' },
  { value: 'during', label: 'во время еды' },
  { value: 'after', label: 'после еды' },
];

export const INTAKE_LABELS: Record<Intake, string> = {
  none: 'не привязано к еде',
  before: 'до еды',
  during: 'во время еды',
  after: 'после еды',
};

export const DAY_PART_ORDER: DayPart[] = ['morning', 'afternoon', 'evening', 'night'];

export const DAY_PART_LABELS: Record<DayPart, string> = {
  morning: 'Утро',
  afternoon: 'День',
  evening: 'Вечер',
  night: 'Ночь',
};

export const DOSE_UNIT_GROUPS: { label: string; units: { value: DoseUnit; label: string }[] }[] = [
  {
    label: 'Поштучно',
    units: [
      { value: 'tablet', label: 'таблетки' },
      { value: 'capsule', label: 'капсулы' },
      { value: 'drop', label: 'капли' },
      { value: 'application', label: 'нанесение' },
    ],
  },
  {
    label: 'Вес и объём',
    units: [
      { value: 'mg', label: 'мг' },
      { value: 'g', label: 'г' },
      { value: 'ml', label: 'мл' },
    ],
  },
  {
    label: 'Своё',
    units: [{ value: 'custom', label: 'своя единица' }],
  },
];

const UNIT_FORMS: Record<Exclude<DoseUnit, 'custom'>, readonly [string, string, string]> = {
  tablet: ['таблетка', 'таблетки', 'таблеток'],
  capsule: ['капсула', 'капсулы', 'капсул'],
  mg: ['мг', 'мг', 'мг'],
  g: ['г', 'г', 'г'],
  ml: ['мл', 'мл', 'мл'],
  drop: ['капля', 'капли', 'капель'],
  application: ['нанесение', 'нанесения', 'нанесений'],
};

const UNIT_CATEGORY: Record<DoseUnit, string> = {
  tablet: 'таблетки',
  capsule: 'капсулы',
  mg: 'мг',
  g: 'г',
  ml: 'мл',
  drop: 'капли',
  application: 'нанесение',
  custom: 'своя единица',
};

const UNIT_SUFFIXES = [
  'таблеток',
  'таблетки',
  'таблетка',
  'капсул',
  'капсулы',
  'капсула',
  'капель',
  'капли',
  'капля',
  'нанесений',
  'нанесения',
  'нанесение',
  'мг',
  'мл',
  'г',
];

export function isIntakeValue(value: unknown): value is Intake {
  return value === 'none' || value === 'before' || value === 'during' || value === 'after';
}

export function isDoseUnit(value: unknown): value is DoseUnit {
  return (
    value === 'tablet' ||
    value === 'capsule' ||
    value === 'mg' ||
    value === 'g' ||
    value === 'ml' ||
    value === 'drop' ||
    value === 'application' ||
    value === 'custom'
  );
}

export function isDayPart(value: unknown): value is DayPart {
  return value === 'morning' || value === 'afternoon' || value === 'evening' || value === 'night';
}

export function isDayPartList(value: unknown): value is DayPart[] {
  return Array.isArray(value) && value.every(isDayPart);
}

export function sortDayParts(parts: DayPart[]): DayPart[] {
  return DAY_PART_ORDER.filter((part) => parts.includes(part));
}

export function formatDayParts(parts: DayPart[]): string {
  const labels = sortDayParts(parts).map((part) => DAY_PART_LABELS[part].toLowerCase());
  if (labels.length <= 1) return labels[0] ?? '';
  return `${labels.slice(0, -1).join(', ')} и ${labels[labels.length - 1]}`;
}

export function timesPerDayLabel(times: number): string {
  const mod100 = Math.abs(times) % 100;
  const mod10 = mod100 % 10;
  let word = 'раз';
  if (!(mod100 >= 11 && mod100 <= 14) && mod10 >= 2 && mod10 <= 4) word = 'раза';
  return `${times} ${word} в день`;
}

export function mealLabel(intake: Intake): string | null {
  if (intake === 'none') return null;
  return INTAKE_LABELS[intake];
}

export function describeSchedule(med: Medication): string {
  if (med.dayParts && med.dayParts.length > 0) return formatDayParts(med.dayParts);
  return timesPerDayLabel(med.timesPerDay);
}

export function stripTrailingUnit(amount: string): string {
  const rest = amount.trim();
  const lower = rest.toLowerCase();
  for (const suffix of UNIT_SUFFIXES) {
    if (!lower.endsWith(suffix)) continue;
    const cut = rest.length - suffix.length;
    if (cut === 0) return '';
    const before = rest[cut - 1];
    const glued = suffix === 'мг' || suffix === 'мл' || suffix === 'г';
    if (before === ' ' || (glued && /\d/.test(before))) return rest.slice(0, cut).trim();
  }
  return rest;
}

function isQuantity(amount: string): boolean {
  const compact = amount.trim().replace(/\s/g, '').replace(',', '.');
  return /^\d+([./]\d+)?$/.test(compact);
}

function pluralIndex(amount: string): 0 | 1 | 2 {
  const compact = amount.trim().replace(/\s/g, '').replace(',', '.');
  if (compact.includes('/') || compact.includes('.')) return 1;
  if (!/^\d+$/.test(compact)) return 1;
  const n = Number(compact);
  const mod100 = n % 100;
  const mod10 = mod100 % 10;
  if (mod100 >= 11 && mod100 <= 14) return 2;
  if (mod10 === 1) return 0;
  if (mod10 >= 2 && mod10 <= 4) return 1;
  return 2;
}

export function formatDosage(amount: string, unit: DoseUnit | '', customUnit: string): string {
  const qty = amount.trim();
  if (!unit) return qty;
  if (unit === 'custom') return [qty, customUnit.trim()].filter(Boolean).join(' ');
  const word = UNIT_FORMS[unit][qty ? pluralIndex(qty) : 0];
  if (!qty) return word;
  if (!isQuantity(qty)) return `${qty} (${UNIT_CATEGORY[unit]})`;
  return `${qty} ${word}`;
}

export function medicationInterval(
  course: { startDate: string; endDate: string },
  med: Medication,
): { start: string; end: string } {
  if (med.startDate && med.endDate) return { start: med.startDate, end: med.endDate };
  return { start: course.startDate, end: course.endDate };
}

export function hasCustomMedicationSpan(
  course: { startDate: string; endDate: string },
  med: Medication,
): boolean {
  if (!med.startDate || !med.endDate) return false;
  return med.startDate !== course.startDate || med.endDate !== course.endDate;
}
