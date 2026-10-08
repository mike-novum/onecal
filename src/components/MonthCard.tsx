import { forwardRef, memo } from 'react';
import { buildMonthGrid, MONTHS_RU, todayISO } from '../lib/dates';
import { DayCell } from './DayCell';

interface MonthCardProps {
  year: number;
  month: number;
  getEmoji: (iso: string) => string | null;
  onDayClick: (iso: string) => void;
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const MonthCard = memo(forwardRef<HTMLElement, MonthCardProps>(function MonthCard(
  { year, month, getEmoji, onDayClick },
  ref,
) {
  const grid = buildMonthGrid(year, month);
  const today = todayISO();
  const currentYear = Number(today.slice(0, 4));
  const currentMonth = Number(today.slice(5, 7)) - 1;
  const isCurrentMonth = currentYear === year && currentMonth === month;
  const title = MONTHS_RU[month];

  return (
    <section
      ref={ref}
      id={`month-${month}`}
      data-month={month}
      aria-label={`${title} ${year}`}
      className="surface scroll-mt-32 rounded-2xl p-4 sm:p-5"
    >
      <header className="mb-3 flex items-baseline gap-3">
        <h3 className="text-base font-semibold text-[color:var(--text-primary)]">
          {title}
          {isCurrentMonth && (
            <span
              className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white"
              style={{ backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
            >
              сейчас
            </span>
          )}
        </h3>
      </header>
      <div className="mb-1.5 grid grid-cols-7 gap-1 text-[10px] uppercase tracking-wider text-[color:var(--text-muted)]">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {grid.map((week, wi) =>
          week.map((iso, di) =>
            iso ? (
              <DayCell
                key={iso}
                dayNumber={Number(iso.slice(8))}
                emoji={getEmoji(iso)}
                isToday={iso === today}
                onClick={() => onDayClick(iso)}
                size="sm"
              />
            ) : (
              <div key={`${wi}-${di}`} aria-hidden className="h-9" />
            ),
          ),
        )}
      </div>
    </section>
  );
}));
