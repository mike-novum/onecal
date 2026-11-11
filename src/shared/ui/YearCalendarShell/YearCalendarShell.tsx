import { memo, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefCallback } from 'react';
import { MONTHS_RU } from '@/shared/lib';
import { MonthNav } from '../MonthNav';
import { YearPicker } from './YearPicker';

const MOBILE_QUERY = '(max-width: 767px)';

function readIsMobile() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(MOBILE_QUERY).matches;
}

interface YearCalendarShellProps {
  year: number;
  onYearChange: (year: number) => void;
  hasMark: (month: number) => boolean;
  renderMonth: (month: number) => ReactNode;
}

export const YearCalendarShell = memo(function YearCalendarShell({
  year,
  onYearChange,
  hasMark,
  renderMonth,
}: YearCalendarShellProps) {
  const monthRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeMonthRef = useRef(0);
  const programmaticRef = useRef(false);
  const lockTimerRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(readIsMobile);
  const [activeMonth, setActiveMonth] = useState(() => new Date().getMonth());
  const [yearOpen, setYearOpen] = useState(false);

  useLayoutEffect(() => {
    activeMonthRef.current = activeMonth;
  }, [activeMonth]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    return () => {
      if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
    };
  }, []);

  function scrollToMonth(month: number, behavior: ScrollBehavior) {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    programmaticRef.current = true;
    el.scrollTo({ left: month * el.clientWidth, behavior });
    if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
    if (behavior === 'auto') {
      programmaticRef.current = false;
      lockTimerRef.current = null;
      return;
    }
    lockTimerRef.current = window.setTimeout(() => {
      programmaticRef.current = false;
      lockTimerRef.current = null;
    }, 480);
  }

  useLayoutEffect(() => {
    if (!isMobile) return;
    scrollToMonth(activeMonthRef.current, 'auto');
  }, [isMobile, year]);

  useEffect(() => {
    if (!isMobile) return;
    const el = scrollerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (programmaticRef.current || el.clientWidth === 0) return;
      const left = activeMonthRef.current * el.clientWidth;
      if (Math.abs(el.scrollLeft - left) <= 1) return;
      programmaticRef.current = true;
      el.scrollTo({ left, behavior: 'auto' });
      programmaticRef.current = false;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile]);

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el || programmaticRef.current || el.clientWidth === 0) return;
    const index = Math.min(11, Math.max(0, Math.round(el.scrollLeft / el.clientWidth)));
    setActiveMonth((prev) => (prev === index ? prev : index));
  }

  function selectMonth(month: number) {
    const next = Math.min(11, Math.max(0, month));
    setActiveMonth(next);
    scrollToMonth(next, 'smooth');
  }

  const rememberMonth: RefCallback<HTMLElement> = (el) => {
    if (!el) return;
    const month = Number(el.dataset.month);
    if (Number.isNaN(month)) return;
    monthRefs.current[month] = el;
  };

  return (
    <div className={`mx-auto w-full max-w-[1340px] ${isMobile ? 'pb-28' : 'pb-8'}`}>
      {!isMobile && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:mb-8">
          <div className="flex items-center gap-1 rounded-2xl border border-[color:var(--border)] p-1 surface">
            <button
              type="button"
              onClick={() => onYearChange(year - 1)}
              aria-label="Предыдущий год"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--text-secondary)] transition hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
            >
              <Chevron direction="left" />
            </button>
            <div className="flex h-9 min-w-[6rem] items-center justify-center px-3">
              <span className="text-base font-semibold tabular-nums text-[color:var(--text-primary)]">
                {year}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onYearChange(year + 1)}
              aria-label="Следующий год"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--text-secondary)] transition hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
            >
              <Chevron direction="right" />
            </button>
          </div>
        </div>
      )}

      {!isMobile && <MonthNav year={year} monthRefs={monthRefs} />}

      {isMobile ? (
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          onPointerDown={() => {
            programmaticRef.current = false;
          }}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          aria-label={`Месяцы ${year}`}
        >
          {Array.from({ length: 12 }, (_, month) => (
            <div key={month} className="basis-full shrink-0 snap-center snap-always px-4 py-1">
              <MonthSlot month={month} onElement={rememberMonth} hasMark={hasMark(month)}>
                {renderMonth(month)}
              </MonthSlot>
            </div>
          ))}
        </div>
      ) : (
        <div className="-mx-4 grid justify-center grid-cols-1 gap-4 md:mx-0 md:grid-cols-[repeat(2,minmax(0,20rem))] md:gap-3 xl:grid-cols-[repeat(3,minmax(0,20rem))] xl:gap-4 2xl:grid-cols-[repeat(4,minmax(0,20rem))] 2xl:gap-5">
          {Array.from({ length: 12 }, (_, month) => (
            <MonthSlot key={month} month={month} onElement={rememberMonth} hasMark={hasMark(month)}>
              {renderMonth(month)}
            </MonthSlot>
          ))}
        </div>
      )}

      {isMobile && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-[color:var(--border)] px-4 pt-3"
          style={{
            background: 'var(--bg-elevated)',
            paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
          }}
        >
          <p
            aria-live="polite"
            className="mb-2 text-center text-sm font-medium text-[color:var(--text-secondary)]"
          >
            {MONTHS_RU[activeMonth]}
          </p>
          <div className="mx-auto flex max-w-md items-center justify-between gap-3">
            <button
              type="button"
              aria-label="Предыдущий месяц"
              disabled={activeMonth === 0}
              onClick={() => selectMonth(activeMonth - 1)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--border)] text-[color:var(--text-secondary)] transition hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`Выбрать год, сейчас ${year}`}
              onClick={() => setYearOpen(true)}
              className="flex h-11 min-w-[7.5rem] items-center justify-center gap-1.5 rounded-xl border border-[color:var(--border)] px-4 text-base font-semibold tabular-nums text-[color:var(--text-primary)]"
              style={{ background: 'var(--bg-elevated-2)' }}
            >
              {year}
              <Chevron direction="down" />
            </button>
            <button
              type="button"
              aria-label="Следующий месяц"
              disabled={activeMonth === 11}
              onClick={() => selectMonth(activeMonth + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--border)] text-[color:var(--text-secondary)] transition hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
            >
              <Chevron direction="right" />
            </button>
          </div>
        </div>
      )}

      {yearOpen && (
        <YearPicker
          year={year}
          onClose={() => setYearOpen(false)}
          onSelect={(next) => {
            onYearChange(next);
            setYearOpen(false);
          }}
        />
      )}
    </div>
  );
});

function MonthSlot({
  month,
  onElement,
  hasMark,
  children,
}: {
  month: number;
  onElement: RefCallback<HTMLElement>;
  hasMark: boolean;
  children: ReactNode;
}) {
  return (
    <div
      ref={onElement}
      data-month={month}
      className="relative mx-auto w-full max-w-[320px] scroll-mt-32"
    >
      {children}
      {hasMark && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
        />
      )}
    </div>
  );
}

function Chevron({ direction }: { direction: 'left' | 'right' | 'down' }) {
  const points =
    direction === 'left' ? '15 18 9 12 15 6' : direction === 'right' ? '9 18 15 12 9 6' : '6 9 12 15 18 9';
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={points} />
    </svg>
  );
}
