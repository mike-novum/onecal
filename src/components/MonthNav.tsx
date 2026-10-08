import { useEffect, useRef } from 'react';
import { MONTHS_RU_SHORT } from '../lib/dates';

interface MonthNavProps {
  year: number;
  activeMonth: number;
  onMonthSelect: (month: number) => void;
}

export function MonthNav({ year, activeMonth, onMonthSelect }: MonthNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Горизонтальный скролл к активному чипу
  useEffect(() => {
    const el = scrollRef.current?.querySelector<HTMLButtonElement>(
      `[data-month-chip="${activeMonth}"]`,
    );
    if (el && scrollRef.current) {
      const container = scrollRef.current;
      const targetLeft = el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }
  }, [activeMonth]);

  return (
    <div className="sticky top-[52px] z-10 -mx-3 mb-4 px-3 sm:mx-0 sm:px-0 sm:top-[60px] lg:hidden">
      <div
        className="mx-auto flex w-fit max-w-full rounded-2xl border border-[color:var(--border-strong)] p-1.5"
        style={{
          background: 'var(--bg-elevated)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-1 overflow-x-auto"
          aria-label={`Прыжок к месяцу ${year}`}
        >
          {MONTHS_RU_SHORT.map((m, i) => {
            const isActive = i === activeMonth;
            return (
              <button
                key={m}
                type="button"
                data-month-chip={i}
                aria-pressed={isActive}
                onClick={() => onMonthSelect(i)}
                className={[
                  'relative shrink-0 rounded-xl px-3 py-1.5 text-sm font-medium',
                  'transition-all duration-200 ease-out',
                  isActive
                    ? 'text-white'
                    : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]',
                ].join(' ')}
                style={isActive ? { boxShadow: 'var(--shadow-md)' } : undefined}
              >
                {/* Градиент активного состояния — отдельный overlay, чтобы opacity
                    плавно анимировался. На самой кнопке background-image не
                    интерполируется между «нет» и градиентом в большинстве браузеров. */}
                <span
                  aria-hidden
                  className={[
                    'pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-200 ease-out',
                    isActive ? 'opacity-100' : 'opacity-0',
                  ].join(' ')}
                  style={{ backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
                />
                <span className="relative">{m}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
