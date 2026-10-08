import { beforeEach, expect, test } from 'vitest';
import type { PillCourse } from '../types';
import { useAppStore } from './useAppStore';

const course: PillCourse = {
  id: 'c1',
  title: 'Антибиотик',
  startDate: '2026-10-01',
  endDate: '2026-10-07',
  medications: [{ name: 'Амоксициллин', dosage: '500 мг', timesPerDay: 3, intake: 'after' }],
};

beforeEach(() => {
  useAppStore.getState().resetAll();
});

test('начальный state пустой', () => {
  const s = useAppStore.getState();
  expect(s.alcohol).toEqual({});
  expect(s.fastfood).toEqual({});
  expect(s.pillCourses).toEqual([]);
});

test('setDayLog добавляет и удаляет запись', () => {
  useAppStore.getState().setDayLog('alcohol', '2026-10-05', { items: ['beer'], wasBad: false });
  expect(useAppStore.getState().alcohol['2026-10-05']).toEqual({ items: ['beer'], wasBad: false });

  useAppStore.getState().setDayLog('alcohol', '2026-10-05', null);
  expect(useAppStore.getState().alcohol['2026-10-05']).toBeUndefined();
});

test('запись в fastfood не трогает alcohol', () => {
  useAppStore.getState().setDayLog('alcohol', '2026-10-05', { items: ['beer'], wasBad: false });
  useAppStore.getState().setDayLog('fastfood', '2026-10-05', { items: ['burger'], wasBad: true });
  const s = useAppStore.getState();
  expect(s.alcohol['2026-10-05'].items).toEqual(['beer']);
  expect(s.fastfood['2026-10-05'].items).toEqual(['burger']);
  expect(s.alcohol['2026-10-05'].wasBad).toBe(false);
});

test('addCourse добавляет курс', () => {
  useAppStore.getState().addCourse(course);
  expect(useAppStore.getState().pillCourses).toHaveLength(1);
  expect(useAppStore.getState().pillCourses[0]).toEqual(course);
});

test('updateCourse меняет поля курса по id', () => {
  useAppStore.getState().addCourse(course);
  useAppStore.getState().updateCourse({ ...course, title: 'Витамины', endDate: '2026-10-14' });
  const updated = useAppStore.getState().pillCourses[0];
  expect(updated.title).toBe('Витамины');
  expect(updated.endDate).toBe('2026-10-14');
  expect(useAppStore.getState().pillCourses).toHaveLength(1);
});

test('deleteCourse удаляет курс по id', () => {
  useAppStore.getState().addCourse(course);
  useAppStore.getState().deleteCourse('c1');
  expect(useAppStore.getState().pillCourses).toEqual([]);
});

test('importData заменяет весь снапшот', () => {
  useAppStore.getState().addCourse(course);
  useAppStore.getState().importData({
    alcohol: { '2026-10-01': { items: ['wine'], wasBad: true } },
    fastfood: {},
    pillCourses: [],
  });
  const s = useAppStore.getState();
  expect(s.pillCourses).toEqual([]);
  expect(s.alcohol['2026-10-01']).toEqual({ items: ['wine'], wasBad: true });
});
