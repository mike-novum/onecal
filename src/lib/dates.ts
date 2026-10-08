export const MONTHS_RU = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const MONTHS_RU_SHORT = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
];



export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, n: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function diffDays(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const start = parseISO(a);
  const end = parseISO(b);
  // Оба полночь локального времени — деление на сутки точно.
  return Math.round((end.getTime() - start.getTime()) / msPerDay);
}

export function monthLabel(year: number, month: number): string {
  return `${MONTHS_RU[month]} ${year}`;
}

const MONTHS_RU_GEN = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

export function formatDayTitle(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS_RU_GEN[m - 1]} ${y}`;
}

export function buildMonthGrid(year: number, month: number): (string | null)[][] {
  const first = new Date(year, month, 1);
  // 0 = вс, 1 = пн, ... 6 = сб → сдвиг к понедельнику
  const leadOffset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - leadOffset);

  const weeks: (string | null)[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: (string | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d);
      week.push(date.getMonth() === month ? toISODate(date) : null);
    }
    weeks.push(week);
  }
  return weeks;
}
