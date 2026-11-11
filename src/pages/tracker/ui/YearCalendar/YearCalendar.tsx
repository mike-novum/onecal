import { memo } from 'react';
import { buildMonthGrid } from '@/shared/lib';
import { YearCalendarShell } from '@/shared/ui';
import { MonthCard } from '../MonthCard';

interface YearCalendarProps {
  year: number;
  onYearChange: (year: number) => void;
  getEmoji: (iso: string) => string | null;
  onDayClick: (iso: string) => void;
}

export const YearCalendar = memo(function YearCalendar({
  year,
  onYearChange,
  getEmoji,
  onDayClick,
}: YearCalendarProps) {
  function countForMonth(m: number): number {
    const grid = buildMonthGrid(year, m);
    return grid.flat().filter((iso) => iso && getEmoji(iso) !== null).length;
  }

  return (
    <YearCalendarShell
      year={year}
      onYearChange={onYearChange}
      hasMark={(month) => countForMonth(month) > 0}
      renderMonth={(month) => (
        <MonthCard year={year} month={month} getEmoji={getEmoji} onDayClick={onDayClick} />
      )}
    />
  );
});
