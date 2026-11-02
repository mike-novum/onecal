import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useAppStore } from '@/shared/model';
import { IntimatePage } from './IntimatePage';

beforeEach(() => {
  useAppStore.getState().resetAll();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 5));
});

afterEach(() => {
  vi.useRealTimers();
});

test('клик по дню открывает модалку интима, сохранение обновляет store', () => {
  render(
    <MemoryRouter>
      <IntimatePage />
    </MemoryRouter>,
  );

  const october = document.getElementById('intimate-month-9')!;
  fireEvent.click(within(october).getByRole('button', { name: 'день 5' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('sex-increment'));
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

  expect(useAppStore.getState().intimate['2026-10-05']).toEqual({ sex: 1, masturbation: 0 });
});

test('переключатель года меняет текущий отображаемый год', () => {
  render(
    <MemoryRouter>
      <IntimatePage />
    </MemoryRouter>,
  );

  expect(screen.getByText('2026')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Следующий год' }));
  expect(screen.getByText('2027')).toBeInTheDocument();
});

test('ячейка календаря отображает эмодзи в зависимости от активности', () => {
  useAppStore.setState({
    intimate: {
      '2026-10-01': { sex: 1, masturbation: 0 },
      '2026-10-02': { sex: 0, masturbation: 2 },
      '2026-10-03': { sex: 1, masturbation: 1 },
    },
  });

  render(
    <MemoryRouter>
      <IntimatePage />
    </MemoryRouter>,
  );

  const october = document.getElementById('intimate-month-9')!;
  expect(within(october).getByRole('button', { name: 'день 1' })).toHaveTextContent('❤️');
  expect(within(october).getByRole('button', { name: 'день 2' })).toHaveTextContent('💦');
  expect(within(october).getByRole('button', { name: 'день 3' })).toHaveTextContent('🔥');
});
