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
  const [{ year: currentYear, month: currentMonth }] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const monthRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeMonthRef = useRef(0);
  const programmaticRef = useRef(false);
  const lockTimerRef = useRef<number | null>(null);
  const pendingScrollRef = useRef<number | null>(null);
  const topBarRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(readIsMobile);
  const [activeMonth, setActiveMonth] = useState(() => currentMonth);
  const [yearOpen, setYearOpen] = useState(false);
  const [cardBox, setCardBox] = useState({ height: 0, width: 0 });
  const [isCurrentMonthVisible, setIsCurrentMonthVisible] = useState(true);
  const [topBarVisible, setTopBarVisible] = useState(true);

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

  useLayoutEffect(() => {
    if (!isMobile) return;
    const el = scrollerRef.current;
    if (!el) return;
    const measure = () => {
      const slot = el.querySelector<HTMLElement>('[data-month]');
      if (!slot) return;
      setCardBox({ height: el.offsetHeight, width: slot.offsetWidth });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, year, activeMonth]);

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

  useEffect(() => {
    if (isMobile) return;
    const targetEl = monthRefs.current[currentMonth];
    if (!targetEl || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCurrentMonthVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(targetEl);
    return () => observer.disconnect();
  }, [isMobile, year, currentMonth]);

  useEffect(() => {
    if (isMobile) return;
    const barEl = topBarRef.current;
    if (!barEl || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setTopBarVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(barEl);
    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => {
    if (pendingScrollRef.current !== null && year === currentYear) {
      const target = pendingScrollRef.current;
      pendingScrollRef.current = null;
      if (isMobile) {
        scrollToMonth(target, 'smooth');
      } else {
        monthRefs.current[target]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [year, isMobile, currentYear]);

  function handleGoToToday() {
    if (isMobile) {
      if (year !== currentYear) {
        pendingScrollRef.current = currentMonth;
        setActiveMonth(currentMonth);
        onYearChange(currentYear);
      } else {
        selectMonth(currentMonth);
      }
    } else {
      if (year !== currentYear) {
        pendingScrollRef.current = currentMonth;
        onYearChange(currentYear);
      } else {
        monthRefs.current[currentMonth]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  const isMobileTodayInView = year === currentYear && activeMonth === currentMonth;
  const showMobileToday = !isMobileTodayInView;

  const isDesktopTodayInView = year === currentYear && isCurrentMonthVisible;
  const showDesktopToday = !isDesktopTodayInView;

  const rememberMonth: RefCallback<HTMLElement> = (el) => {
    if (!el) return;
    const month = Number(el.dataset.month);
    if (Number.isNaN(month)) return;
    monthRefs.current[month] = el;
  };

  return (
    <div className={isMobile ? undefined : 'mx-auto w-full max-w-[1340px] pb-8'}>
      {!isMobile && (
        <div ref={topBarRef} className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:mb-8">
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
          {showDesktopToday && (
            <button
              type="button"
              onClick={handleGoToToday}
              aria-label="Перейти к сегодняшней дате"
              className="flex h-11 items-center gap-1.5 rounded-2xl border border-[color:var(--border)] px-4 text-sm font-medium text-[color:var(--text-primary)] surface transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] active:scale-95"
            >
              <CalendarIcon size={16} />
              Сегодня
            </button>
          )}
        </div>
      )}

      {!isMobile && <MonthNav year={year} monthRefs={monthRefs} />}

      {!isMobile && showDesktopToday && !topBarVisible && (
        <button
          type="button"
          onClick={handleGoToToday}
          aria-label="Перейти к сегодняшней дате"
          className="fixed bottom-6 right-6 z-30 flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-4 py-2.5 text-sm font-semibold text-[color:var(--text-primary)] surface shadow-xl transition hover:bg-[color:var(--bg-elevated-2)] active:scale-95"
        >
          <CalendarIcon size={16} />
          Сегодня
        </button>
      )}

      {isMobile ? (
        <div className="pointer-events-none fixed inset-0 z-20">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`Выбрать год, сейчас ${year}`}
            onClick={() => setYearOpen(true)}
            className="surface pointer-events-auto absolute left-1/2 flex h-14 min-w-[8.5rem] items-center justify-center gap-1.5 rounded-2xl border border-[color:var(--border)] px-5 text-xl font-semibold tabular-nums text-[color:var(--text-primary)]"
            style={{ top: '50%', transform: `translate(-50%, calc(-100% - ${cardBox.height / 2 + 10}px))` }}
          >
            {year}
            <Chevron direction="down" size={20} />
          </button>

          <button
            type="button"
            aria-label="Предыдущий месяц"
            disabled={activeMonth === 0}
            onClick={() => selectMonth(activeMonth - 1)}
            className="pointer-events-auto absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
            style={{ left: `max(0px, calc(50% - ${cardBox.width / 2 + 48}px))` }}
          >
            <Chevron direction="left" size={26} />
          </button>
          <button
            type="button"
            aria-label="Следующий месяц"
            disabled={activeMonth === 11}
            onClick={() => selectMonth(activeMonth + 1)}
            className="pointer-events-auto absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
            style={{ right: `max(0px, calc(50% - ${cardBox.width / 2 + 48}px))` }}
          >
            <Chevron direction="right" size={26} />
          </button>

          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            onPointerDown={() => {
              programmaticRef.current = false;
            }}
            className="scrollbar-hide pointer-events-auto absolute inset-x-0 top-1/2 flex -translate-y-1/2 snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
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
          <p className="sr-only" aria-live="polite">
            {MONTHS_RU[activeMonth]}
          </p>

          {showMobileToday && cardBox.height > 0 && (
            <button
              type="button"
              onClick={handleGoToToday}
              aria-label="Перейти к сегодняшней дате"
              className="surface pointer-events-auto absolute left-1/2 flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-medium text-[color:var(--text-primary)] shadow-lg transition active:scale-95"
              style={{ top: '50%', transform: `translate(-50%, ${cardBox.height / 2 + 14}px)` }}
            >
              <CalendarIcon size={16} />
              Сегодня
            </button>
          )}
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
      className="relative mx-auto w-fit max-w-[320px] scroll-mt-32"
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

function Chevron({ direction, size = 18 }: { direction: 'left' | 'right' | 'down'; size?: number }) {
  const points =
    direction === 'left' ? '15 18 9 12 15 6' : direction === 'right' ? '9 18 15 12 9 6' : '6 9 12 15 18 9';
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
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

function CalendarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
