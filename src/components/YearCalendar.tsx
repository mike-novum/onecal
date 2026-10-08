import { memo, useRef } from 'react';
import { buildMonthGrid } from '../lib/dates';
import { CalendarTabs } from './CalendarTabs';
import { MonthCard } from './MonthCard';
import { MonthNav } from './MonthNav';

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
  const monthRefs = useRef<(HTMLElement | null)[]>([]);

  // Считаем «заполненность» каждого месяца для микро-визуализации ритма года
  function countForMonth(m: number): number {
    const grid = buildMonthGrid(year, m);
    return grid.flat().filter((iso) => iso && getEmoji(iso) !== null).length;
  }

  return (
    <div className="mx-auto w-full max-w-6xl pb-[60vh]">
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:mb-8">
        <CalendarTabs />
        <div className="flex items-center gap-1 rounded-2xl border border-[color:var(--border)] p-1 surface">
          <button
            type="button"
            onClick={() => onYearChange(year - 1)}
            aria-label="Предыдущий год"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--text-secondary)] transition hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
          >
            <span aria-hidden className="text-2xl leading-none">‹</span>
          </button>
          <div className="flex h-9 min-w-[6rem] items-center justify-center px-3">
            <span className="text-2xl font-semibold tabular-nums text-[color:var(--text-primary)]">
              {year}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onYearChange(year + 1)}
            aria-label="Следующий год"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--text-secondary)] transition hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
          >
            <span aria-hidden className="text-2xl leading-none">›</span>
          </button>
        </div>
      </div>

      <MonthNav year={year} monthRefs={monthRefs} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }, (_, month) => (
          <div key={month} className="relative">
            <MonthCard
              ref={(el) => {
                monthRefs.current[month] = el;
              }}
              year={year}
              month={month}
              getEmoji={getEmoji}
              onDayClick={onDayClick}
            />
            {countForMonth(month) > 0 && (
              <div
                aria-hidden
                className="pointer-events-none absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full"
                style={{ backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
