import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import type { PillCourse } from '@/shared/model';
import { GanttChart } from './GanttChart';

function course(id: string, title: string, startDate: string, endDate: string): PillCourse {
  return {
    id,
    title,
    startDate,
    endDate,
    medications: [{ name: 'Амоксициллин', dosage: '500 мг', timesPerDay: 3, intake: 'after' }],
  };
}

test('пустой список показывает заглушку', () => {
  render(<GanttChart courses={[]} />);
  expect(screen.getByText('Нет курсов для отображения')).toBeInTheDocument();
});

test('полосы курсов позиционируются по датам шкалы', () => {
  render(
    <GanttChart
      courses={[
        course('c1', 'Курс А', '2026-10-01', '2026-10-10'),
        course('c2', 'Курс Б', '2026-10-05', '2026-10-15'),
      ]}
    />,
  );
  expect(screen.getByLabelText('Шкала с 2026-10-01 по 2026-10-15')).toBeInTheDocument();

  const barA = screen.getByText('Курс А');
  expect(barA.style.gridColumnStart).toBe('1');
  expect(barA.style.gridColumnEnd).toBe('span 10');

  const barB = screen.getByText('Курс Б');
  expect(barB.style.gridColumnStart).toBe('5');
  expect(barB.style.gridColumnEnd).toBe('span 11');
});

test('курс из одного дня имеет ширину не меньше одного дня', () => {
  render(<GanttChart courses={[course('c1', 'Один день', '2026-10-03', '2026-10-03')]} />);
  const bar = screen.getByText('Один день');
  expect(bar.style.gridColumnEnd).toBe('span 1');
});

test('отображает названия месяцев над шкалой дней', () => {
  render(
    <GanttChart
      courses={[
        course('c1', 'Курс 1', '2026-09-29', '2026-10-03'),
      ]}
    />,
  );
  expect(screen.getByText('Сентябрь 2026')).toBeInTheDocument();
  expect(screen.getByText('Октябрь 2026')).toBeInTheDocument();
});

test('отображает маркер «Сегодня» когда дата попадает в шкалу', () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const todayStr = `${y}-${m}-${d}`;

  render(
    <GanttChart
      courses={[
        course('c1', 'Текущий курс', todayStr, todayStr),
      ]}
    />,
  );
  expect(screen.getByTestId('gantt-today-line')).toBeInTheDocument();
});

test('не отображает маркер «Сегодня» когда дата не попадает в шкалу', () => {
  render(
    <GanttChart
      courses={[
        course('c1', 'Прошлый курс', '2020-01-01', '2020-01-05'),
      ]}
    />,
  );
  expect(screen.queryByTestId('gantt-today-line')).not.toBeInTheDocument();
});
