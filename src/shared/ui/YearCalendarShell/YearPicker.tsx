import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface YearPickerProps {
  year: number;
  onSelect: (year: number) => void;
  onClose: () => void;
}

const PAST_YEARS = 30;
const FUTURE_YEARS = 5;

export function YearPicker({ year, onSelect, onClose }: YearPickerProps) {
  const [currentYear] = useState(() => new Date().getFullYear());
  const years: number[] = [];
  for (let y = currentYear + FUTURE_YEARS; y >= currentYear - PAST_YEARS; y -= 1) {
    years.push(y);
  }

  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useLayoutEffect(() => {
    const list = listRef.current;
    const selected = selectedRef.current;
    if (!list || !selected) return;
    list.scrollTop = Math.max(
      0,
      selected.offsetTop - list.clientHeight / 2 + selected.clientHeight / 2,
    );
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      onClick={onClose}
      style={{
        background: 'var(--bg-overlay)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Выбор года"
        className="flex max-h-[min(32rem,80vh)] w-full max-w-sm flex-col rounded-t-3xl border border-[color:var(--border)] p-5 sm:rounded-2xl"
        style={{ background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-lg), var(--shadow-inset)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">Год</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--text-muted)] transition hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>
        <div ref={listRef} className="relative grid grid-cols-3 gap-2 overflow-y-auto pr-1">
          {years.map((y) => {
            const selected = y === year;
            const today = y === currentYear;
            return (
              <button
                key={y}
                ref={selected ? selectedRef : undefined}
                type="button"
                autoFocus={selected}
                aria-pressed={selected}
                onClick={() => onSelect(y)}
                className={[
                  'flex h-14 flex-col items-center justify-center rounded-xl border text-sm font-semibold tabular-nums transition',
                  selected
                    ? 'border-transparent text-white'
                    : 'border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]',
                ].join(' ')}
                style={
                  selected
                    ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }
                    : undefined
                }
              >
                {y}
                {today && (
                  <span
                    className={[
                      'text-[10px] font-medium uppercase tracking-wider',
                      selected ? 'text-white/80' : 'text-[color:var(--text-muted)]',
                    ].join(' ')}
                  >
                    сейчас
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
