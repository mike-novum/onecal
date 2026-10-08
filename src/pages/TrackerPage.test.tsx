import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useAppStore } from '../store/useAppStore';
import { AlcoholPage } from './AlcoholPage';

beforeEach(() => {
  useAppStore.getState().resetAll();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 5)); // 5 октября 2026
});

afterEach(() => {
  vi.useRealTimers();
});

test('ячейка с записью показывает эмодзи позиции', () => {
  useAppStore.setState({ alcohol: { '2026-10-05': { items: ['beer'], wasBad: false } } });
  render(
    <MemoryRouter>
      <AlcoholPage />
    </MemoryRouter>,
  );
  expect(screen.getByText('🍺')).toBeInTheDocument();
});

test('клик по дню открывает модалку, сохранение пишет в store', () => {
  render(
    <MemoryRouter>
      <AlcoholPage />
    </MemoryRouter>,
  );
  // В октябре 2026 находим день 5 (5 октября) и кликаем
  const october = document.getElementById('month-9')!;
  fireEvent.click(within(october).getByRole('button', { name: 'день 5' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Пиво/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(useAppStore.getState().alcohol['2026-10-05']).toEqual({ items: ['beer'], wasBad: false });
});

test('свичер года переключает год', () => {
  vi.setSystemTime(new Date(2026, 0, 15));
  render(
    <MemoryRouter>
      <AlcoholPage />
    </MemoryRouter>,
  );
  expect(screen.getByText('2026')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Предыдущий год' }));
  expect(screen.getByText('2025')).toBeInTheDocument();
});
