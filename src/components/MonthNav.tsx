import { memo, useEffect, useRef, useState } from 'react';
import { MONTHS_RU_SHORT, monthLabel } from '../lib/dates';

interface MonthNavProps {
  year: number;
  // Refs на карточки месяцев в родительской сетке. Передаются снаружи,
  // потому что DOM-узлы живут в `YearCalendar`, но сам стейт активного
  // месяца и весь связанный с ним observer-цикл спрятаны здесь, чтобы
  // каждое срабатывание IntersectionObserver'а при скролле не вызывало
  // ререндер всей годовой сетки из 12 MonthCard.
  monthRefs: React.MutableRefObject<(HTMLElement | null)[]>;
}

export const MonthNav = memo(function MonthNav({ year, monthRefs }: MonthNavProps) {
  const [activeMonth, setActiveMonth] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Пока идёт программная прокрутка к чипу, observer не должен перезаписывать activeMonth —
  // иначе во время smooth-scroll активный чип «прыгает» по соседним месяцам.
  const programmaticScrollRef = useRef(false);
  const lockReleaseTimeoutRef = useRef<number | null>(null);

  // Следим за видимым месяцем и подсвечиваем его в chip-навигации
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Не мешаем программной прокрутке: пока она идёт, чип уже подсвечен
        // явно из scrollToMonth, а промежуточные срабатывания observer'а
        // привели бы к «дёрганью» активного состояния.
        if (programmaticScrollRef.current) return;
        // Из видимых берём ту, чей top максимален — это ближайшая к началу
        // observation-зоны карточка, та, к которой пользователь только что
        // проскроллил. Сортировка по возрастанию выбирала бы карточку,
        // уже уехавшую за верх экрана (top < 0), и активной становилась
        // бы соседняя, а не целевая.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);
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
  }, [monthRefs]);

  // Чистим таймаут-фолбэк при размонтировании, чтобы не уехать писать в ref мёртвого компонента
  useEffect(() => {
    return () => {
      if (lockReleaseTimeoutRef.current !== null) {
        window.clearTimeout(lockReleaseTimeoutRef.current);
        lockReleaseTimeoutRef.current = null;
      }
    };
  }, []);

  // Горизонтальный скролл к активному чипу внутри панели
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

  function scrollToMonth(month: number) {
    setActiveMonth(month); // немедленно подсветить выбранный чип
    programmaticScrollRef.current = true;

    // Сбрасываем предыдущий фолбэк-таймаут, если пользователь быстро кликает по разным чипам
    if (lockReleaseTimeoutRef.current !== null) {
      window.clearTimeout(lockReleaseTimeoutRef.current);
      lockReleaseTimeoutRef.current = null;
    }

    const el = monthRefs.current[month];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Снимаем замок, когда плавная прокрутка завершилась.
    // scrollend — точный сигнал, поддерживается в Chrome 114+, Firefox 109+, Safari 17.4+.
    // Параллельно держим таймаут-фолбэк: он же выручит в браузерах без scrollend,
    // и подстрахует, если прокрутка была прервана пользователем до её завершения.
    const release = () => {
      programmaticScrollRef.current = false;
      if (lockReleaseTimeoutRef.current !== null) {
        window.clearTimeout(lockReleaseTimeoutRef.current);
        lockReleaseTimeoutRef.current = null;
      }
    };

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', release, { once: true });
    }
    lockReleaseTimeoutRef.current = window.setTimeout(release, 1000);
  }

  return (
    <div className="sticky top-[52px] z-10 -mx-3 mb-4 px-3 sm:mx-0 sm:px-0 sm:top-[60px] lg:hidden">
      <div
        className="mx-auto flex w-fit max-w-full overflow-hidden rounded-2xl border border-[color:var(--border-strong)] py-1.5"
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
            const isFirst = i === 0;
            const isLast = i === MONTHS_RU_SHORT.length - 1;
            return (
              <button
                key={m}
                type="button"
                data-month-chip={i}
                aria-pressed={isActive}
                onClick={() => scrollToMonth(i)}
                className={[
                  'relative shrink-0 rounded-xl px-3 py-1.5 text-sm font-medium',
                  'transition-all duration-200 ease-out',
                  // Боковые отступы у скролл-контейнера убраны (py-1.5 вместо p-1.5),
                  // чтобы чипы могли докручиваться до самого края панели.
                  // Визуальный отступ от рамки панели дают margin у крайних чипов.
                  isFirst && 'ml-1.5',
                  isLast && 'mr-1.5',
                  isActive
                    ? 'text-white'
                    : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]',
                ].filter(Boolean).join(' ')}
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
      <div className="sr-only" aria-live="polite">
        {`Показан ${monthLabel(year, activeMonth)}`}
      </div>
    </div>
  );
});
