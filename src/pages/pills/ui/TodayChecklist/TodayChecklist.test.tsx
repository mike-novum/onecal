import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { PillCourse } from '@/shared/model';
import { TodayChecklist } from './TodayChecklist';
import { PILL_INTAKES_STORAGE_KEY } from '../../model/pillIntakes';

const mockCourse: PillCourse = {
  id: 'c1',
  title: 'Курс витаминов',
  startDate: '2026-10-01',
  endDate: '2026-10-10',
  medications: [
    {
      name: 'Витамин D',
      dosage: '2000 ME',
      timesPerDay: 1,
      intake: 'during',
    },
    {
      name: 'Омега-3',
      dosage: '1000 мг',
      timesPerDay: 2,
      intake: 'after',
    },
  ],
};

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('TodayChecklist', () => {
  test('отображает дружелюбный статус, когда курсов нет', () => {
    render(<TodayChecklist courses={[]} date="2026-10-05" />);

    expect(screen.getByText('На сегодня приёмов нет')).toBeInTheDocument();
    expect(screen.getByTestId('today-checklist-empty')).toBeInTheDocument();
  });

  test('отображает «На сегодня приёмов нет», когда курс не активен на указанную дату', () => {
    render(<TodayChecklist courses={[mockCourse]} date="2026-10-15" />);

    expect(screen.getByText('На сегодня приёмов нет')).toBeInTheDocument();
    expect(screen.queryByText('Витамин D')).not.toBeInTheDocument();
  });

  test('отображает список препаратов, если курс активен сегодня', () => {
    render(<TodayChecklist courses={[mockCourse]} date="2026-10-05" />);

    expect(screen.getByTestId('today-checklist')).toBeInTheDocument();
    expect(screen.getByText('Приём сегодня')).toBeInTheDocument();
    expect(screen.getByText('Витамин D')).toBeInTheDocument();
    expect(screen.getByText('2000 ME')).toBeInTheDocument();
    expect(screen.getByText('во время еды')).toBeInTheDocument();
    expect(screen.getAllByText('Омега-3')).toHaveLength(2);
    expect(screen.getAllByText('1000 мг')).toHaveLength(2);
    expect(screen.getAllByText('после еды')).toHaveLength(2);
    expect(screen.getByText('1-й приём')).toBeInTheDocument();
    expect(screen.getByText('2-й приём')).toBeInTheDocument();
    expect(screen.getByText('0 из 3 принято')).toBeInTheDocument();
  });

  test('отметка чекбокса переключает статус и сохраняет в localStorage', () => {
    const vibrate = vi.fn().mockReturnValue(true);
    vi.stubGlobal('navigator', { vibrate });

    render(<TodayChecklist courses={[mockCourse]} date="2026-10-05" />);

    const itemBtn = screen.getByRole('checkbox', { name: /Витамин D/ });
    expect(itemBtn).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(itemBtn);

    expect(itemBtn).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('1 из 3 принято')).toBeInTheDocument();
    expect(vibrate).toHaveBeenCalledWith(10);

    const stored = JSON.parse(localStorage.getItem(PILL_INTAKES_STORAGE_KEY) || '{}');
    expect(stored['2026-10-05']['c1:Витамин D:0']).toBe(true);

    fireEvent.click(itemBtn);
    expect(itemBtn).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText('0 из 3 принято')).toBeInTheDocument();

    const storedAfter = JSON.parse(localStorage.getItem(PILL_INTAKES_STORAGE_KEY) || '{}');
    expect(storedAfter['2026-10-05']['c1:Витамин D:0']).toBe(false);
  });

  test('восстанавливает ранее сохраненное состояние из localStorage', () => {
    localStorage.setItem(
      PILL_INTAKES_STORAGE_KEY,
      JSON.stringify({
        '2026-10-05': {
          'c1:Витамин D:0': true,
        },
      }),
    );

    render(<TodayChecklist courses={[mockCourse]} date="2026-10-05" />);

    const itemBtn = screen.getByRole('checkbox', { name: /Витамин D/ });
    expect(itemBtn).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('1 из 3 принято')).toBeInTheDocument();
  });
});
