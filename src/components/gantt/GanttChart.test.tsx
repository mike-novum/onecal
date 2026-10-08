import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import type { PillCourse } from '../../types';
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
