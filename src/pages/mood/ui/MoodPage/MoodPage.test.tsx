import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useAppStore } from '@/shared/model';
import { MoodPage } from './MoodPage';

beforeEach(() => {
  useAppStore.getState().resetAll();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 5)); // 5 октября 2026
});

afterEach(() => {
  vi.useRealTimers();
});

test('клик по дню открывает модалку настроения, сохранение обновляет store', () => {
  render(
    <MemoryRouter>
      <MoodPage />
    </MemoryRouter>,
  );

  const october = document.getElementById('mood-month-9')!;
  fireEvent.click(within(october).getByRole('button', { name: 'день 5' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Радость/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

  expect(useAppStore.getState().mood['2026-10-05']).toEqual({ emotions: ['joy'] });
});

test('переключатель года меняет текущий отображаемый год', () => {
  render(
    <MemoryRouter>
      <MoodPage />
    </MemoryRouter>,
  );

  expect(screen.getByText('2026')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Следующий год' }));
  expect(screen.getByText('2027')).toBeInTheDocument();
});
