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
    <div className="mx-auto w-full max-w-[1340px] pb-8">
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

      {/* На мобиле карточки прилипают к краям экрана: отрицательный марджн
          компенсирует боковые отступы родительского <main>, чтобы ширины
          точно хватило для фиксированной сетки 276px (7 × 36 + 6 × 4).
          На md+ используем minmax(0, 20rem), чтобы колонки не растягивались
          шире 320px и не оставляли лишних «кармонов» воздуха по бокам от
          карточек внутри ячейки грида. Кастомный брейкпойнт 3xl (1400px)
          задан в src/index.css через @theme. */}
      <div className="-mx-4 grid justify-center grid-cols-1 gap-4 md:mx-0 md:grid-cols-[repeat(2,minmax(0,20rem))] md:gap-3 lg:grid-cols-[repeat(3,minmax(0,20rem))] lg:gap-4 xl:grid-cols-[repeat(4,minmax(0,20rem))] xl:gap-5">
        {Array.from({ length: 12 }, (_, month) => (
          <div key={month} className="relative mx-auto w-full max-w-[320px]">
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
