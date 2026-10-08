import { expect, test } from 'vitest';
import type { AppSnapshot } from '../store/useAppStore';
import { exportSnapshot, parseImport } from './importExport';

const validSnapshot: AppSnapshot = {
  alcohol: { '2026-10-05': { items: ['beer'], wasBad: false } },
  fastfood: {},
  pillCourses: [
    {
      id: 'c1',
      title: 'Курс',
      startDate: '2026-10-01',
      endDate: '2026-10-07',
      medications: [{ name: 'Амоксициллин', dosage: '500 мг', timesPerDay: 3, intake: 'after' }],
    },
  ],
};

test('валидный снапшот проходит roundtrip', () => {
  const result = parseImport(exportSnapshot(validSnapshot));
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.data).toEqual(validSnapshot);
});

test('битый JSON отклоняется с ошибкой', () => {
  const result = parseImport('{oops');
  expect(result.ok).toBe(false);
});

test('отсутствие pillCourses отклоняется', () => {
  const result = parseImport(JSON.stringify({ alcohol: {}, fastfood: {} }));
  expect(result.ok).toBe(false);
});

test('DayLog с не-массивом items отклоняется', () => {
  const result = parseImport(
    JSON.stringify({ alcohol: { '2026-10-05': { items: 'beer', wasBad: false } }, fastfood: {}, pillCourses: [] }),
  );
  expect(result.ok).toBe(false);
});

test('курс с endDate раньше startDate отклоняется', () => {
  const bad = {
    ...validSnapshot,
    pillCourses: [{ ...validSnapshot.pillCourses[0], startDate: '2026-10-07', endDate: '2026-10-01' }],
  };
  const result = parseImport(JSON.stringify(bad));
  expect(result.ok).toBe(false);
});

test('лишние поля в JSON не мешают импорту', () => {
  const withExtra = { ...validSnapshot, version: 3, junk: [1, 2] };
  const result = parseImport(JSON.stringify(withExtra));
  expect(result.ok).toBe(true);
});
