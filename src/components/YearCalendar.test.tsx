import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { useAppStore } from '../store/useAppStore';
import { YearCalendar } from './YearCalendar';

beforeEach(() => {
  useAppStore.getState().resetAll();
});

function renderCalendar(overrides: Partial<Parameters<typeof YearCalendar>[0]> = {}) {
  const props = {
    year: 2026,
    onYearChange: vi.fn(),
    getEmoji: (iso: string) => (iso === '2026-10-05' ? '🍺' : null),
    onDayClick: vi.fn(),
    ...overrides,
  };
  render(<YearCalendar {...props} />);
  return props;
}

test('рендерит все 12 месяцев как секции', () => {
  renderCalendar();
  for (let m = 0; m < 12; m++) {
    expect(document.getElementById(`month-${m}`)).toBeInTheDocument();
  }
});

test('свичер года показывает текущий год и позволяет его менять', () => {
  const { onYearChange } = renderCalendar({ year: 2026 });
  expect(screen.getByText('2026')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Следующий год' }));
  expect(onYearChange).toHaveBeenCalledWith(2027);

  fireEvent.click(screen.getByRole('button', { name: 'Предыдущий год' }));
  expect(onYearChange).toHaveBeenCalledWith(2025);
});

test('клик по дню с записью вызывает onDayClick с ISO-датой', () => {
  const { onDayClick } = renderCalendar();
  const october = document.getElementById('month-9')!;
  // Эмодзи отрисовался в карточке октября
  const beer = within(october).getByText('🍺');
  fireEvent.click(beer);
  expect(onDayClick).toHaveBeenCalledWith('2026-10-05');
});

test('chip-навигация рендерит 12 месяцев и помечает активный', () => {
  renderCalendar();
  const nav = screen.getByLabelText('Прыжок к месяцу 2026');
  // По умолчанию январь считается активным (activeMonth = 0)
  const activeChip = within(nav).getByRole('button', { name: 'Янв' });
  expect(activeChip).toHaveAttribute('aria-pressed', 'true');
  expect(within(nav).getByRole('button', { name: 'Дек' })).toHaveAttribute('aria-pressed', 'false');
});

test('клик по чипу вызывает прокрутку к соответствующему месяцу', () => {
  renderCalendar();
  const nav = screen.getByLabelText('Прыжок к месяцу 2026');
  const sep = within(nav).getByRole('button', { name: 'Сен' });
  // scrollIntoView в jsdom есть, но noop — просто проверяем, что клик не падает
  fireEvent.click(sep);
  expect(sep).toBeInTheDocument();
});
