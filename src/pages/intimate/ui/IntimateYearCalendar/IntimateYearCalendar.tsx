import { memo } from 'react';
import { buildMonthGrid } from '@/shared/lib';
import { YearCalendarShell } from '@/shared/ui';
import { IntimateMonthCard } from '../IntimateMonthCard';

interface IntimateYearCalendarProps {
  year: number;
  onYearChange: (year: number) => void;
  getEmoji: (iso: string) => string | null;
  onDayClick: (iso: string) => void;
}

export const IntimateYearCalendar = memo(function IntimateYearCalendar({
  year,
  onYearChange,
  getEmoji,
  onDayClick,
}: IntimateYearCalendarProps) {
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
        <IntimateMonthCard year={year} month={month} getEmoji={getEmoji} onDayClick={onDayClick} />
      )}
    />
  );
});
