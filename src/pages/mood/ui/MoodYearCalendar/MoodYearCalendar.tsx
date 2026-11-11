import { memo } from 'react';
import { buildMonthGrid } from '@/shared/lib';
import { YearCalendarShell } from '@/shared/ui';
import { MoodMonthCard } from '../MoodMonthCard';
import type { MoodLevel } from '../../lib/moodLevel';

interface MoodYearCalendarProps {
  year: number;
  onYearChange: (year: number) => void;
  getMoodLevel: (iso: string) => MoodLevel;
  onDayClick: (iso: string) => void;
}

export const MoodYearCalendar = memo(function MoodYearCalendar({
  year,
  onYearChange,
  getMoodLevel,
  onDayClick,
}: MoodYearCalendarProps) {
  function countForMonth(m: number): number {
    const grid = buildMonthGrid(year, m);
    return grid.flat().filter((iso) => iso && getMoodLevel(iso) !== null).length;
  }

  return (
    <YearCalendarShell
      year={year}
      onYearChange={onYearChange}
      hasMark={(month) => countForMonth(month) > 0}
      renderMonth={(month) => (
        <MoodMonthCard year={year} month={month} getMoodLevel={getMoodLevel} onDayClick={onDayClick} />
      )}
    />
  );
});
