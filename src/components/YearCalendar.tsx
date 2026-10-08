import { useEffect, useRef, useState } from 'react';
import { buildMonthGrid, monthLabel } from '../lib/dates';
import { CalendarTabs } from './CalendarTabs';
import { MonthCard } from './MonthCard';
import { MonthNav } from './MonthNav';

interface YearCalendarProps {
  year: number;
  onYearChange: (year: number) => void;
  getEmoji: (iso: string) => string | null;
  onDayClick: (iso: string) => void;
}

export function YearCalendar({ year, onYearChange, getEmoji, onDayClick }: YearCalendarProps) {
  const [activeMonth, setActiveMonth] = useState(0);
  const monthRefs = useRef<(HTMLElement | null)[]>([]);

  // Следим за видимым месяцем и подсвечиваем его в chip-навигации
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Берём тот, что ближе всего к верху viewport и при этом виден
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const m = Number((visible[0].target as HTMLElement).dataset.month);
          if (!Number.isNaN(m)) setActiveMonth(m);
        }
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0,
      },
    );
    monthRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [year]);

  function scrollToMonth(month: number) {
    setActiveMonth(month); // немедленно подсветить выбранный чип
    const el = monthRefs.current[month];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Считаем «заполненность» каждого месяца для микро-визуализации ритма года (опционально — отдадим наружу или используем позже)
  // Здесь оставим простой вариант: только счётчик событий показываем в карточке.
  // Подсчёт делаем через тот же getEmoji.
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

      <MonthNav year={year} activeMonth={activeMonth} onMonthSelect={scrollToMonth} />

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

      <div className="sr-only" aria-live="polite">
        {`Показан ${monthLabel(year, activeMonth)}`}
      </div>
    </div>
  );
}
