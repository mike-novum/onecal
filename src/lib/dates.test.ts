import { expect, test } from 'vitest';
import { addDays, buildMonthGrid, diffDays, formatDayTitle, monthLabel, toISODate } from './dates';

test('toISODate форматирует дату в YYYY-MM-DD по локальному времени', () => {
  expect(toISODate(new Date(2026, 9, 5))).toBe('2026-10-05');
});

test('addDays переходит через границу месяца и года', () => {
  expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
  expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
});

test('diffDays считает разницу в днях', () => {
  expect(diffDays('2026-10-01', '2026-10-05')).toBe(4);
  expect(diffDays('2026-10-05', '2026-10-01')).toBe(-4);
});

test('monthLabel возвращает русское название месяца и год', () => {
  expect(monthLabel(2026, 9)).toBe('Октябрь 2026');
  expect(monthLabel(2026, 0)).toBe('Январь 2026');
});

test('formatDayTitle форматирует дату русскими названиями', () => {
  expect(formatDayTitle('2026-10-05')).toBe('5 октября 2026');
});

test('buildMonthGrid: 6 недель пн-вс, padding null, день месяца встречается один раз', () => {
  const grid = buildMonthGrid(2026, 9); // октябрь 2026, 1-е — четверг
  expect(grid).toHaveLength(6);
  for (const week of grid) {
    expect(week).toHaveLength(7);
  }
  // первая неделя: пн-ср — null, чт 01.10 — первая дата
  expect(grid[0].slice(0, 3)).toEqual([null, null, null]);
  expect(grid[0][3]).toBe('2026-10-01');
  // последняя неделя: вс 01.11 — null
  expect(grid[5][6]).toBe(null);
  // каждая дата октября встречается ровно один раз
  const flat = grid.flat().filter((d): d is string => d !== null);
  expect(new Set(flat).size).toBe(flat.length);
  expect(flat).toContain('2026-10-31');
  expect(flat.filter((d) => d === '2026-10-01')).toHaveLength(1);
});
