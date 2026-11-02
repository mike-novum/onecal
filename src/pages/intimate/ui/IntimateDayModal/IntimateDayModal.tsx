import { useEffect, useState } from 'react';
import type { IntimateLog } from '@/shared/model';

interface IntimateDayModalProps {
  title: string;
  initial: IntimateLog | undefined;
  onSave: (log: IntimateLog | null) => void;
  onClose: () => void;
}

export function IntimateDayModal({ title, initial, onSave, onClose }: IntimateDayModalProps) {
  const [sex, setSex] = useState<number>(initial?.sex ?? 0);
  const [masturbation, setMasturbation] = useState<number>(initial?.masturbation ?? 0);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function handleCounterClick(
    e: React.MouseEvent<HTMLButtonElement>,
    setCount: React.Dispatch<React.SetStateAction<number>>,
  ) {
    const target = e.target as HTMLElement;
    if (target.closest('[data-action="decrement"]')) {
      setCount((c) => Math.max(0, c - 1));
      return;
    }
    if (target.closest('[data-action="increment"]')) {
      setCount((c) => c + 1);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width || e.currentTarget.clientWidth || 200;
    const clickX = e.clientX;
    const isLeft = clickX - rect.left < width / 2;
    if (isLeft) {
      setCount((c) => Math.max(0, c - 1));
    } else {
      setCount((c) => c + 1);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    setCount: React.Dispatch<React.SetStateAction<number>>,
  ) {
    if (e.key === 'ArrowLeft' || e.key === '-') {
      e.preventDefault();
      setCount((c) => Math.max(0, c - 1));
    } else if (e.key === 'ArrowRight' || e.key === '+' || e.key === '=') {
      e.preventDefault();
      setCount((c) => c + 1);
    }
  }

  function save() {
    if (sex === 0 && masturbation === 0) {
      onSave(null);
    } else {
      onSave({ sex, masturbation });
    }
  }

  return (
    <div
      data-testid="intimate-modal-overlay"
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      onClick={onClose}
      style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <div
        role="dialog"
        aria-label={title}
        className="w-full max-w-md rounded-t-3xl border border-[color:var(--border)] p-5 sm:rounded-2xl"
        style={{ background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-lg), var(--shadow-inset)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            autoFocus
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--text-muted)] transition hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>

        <p className="mb-3 text-sm text-[color:var(--text-secondary)]">
          Нажмите слева для уменьшения, справа — для увеличения
        </p>

        <div className="mb-5 flex flex-col gap-3">
          <button
            type="button"
            aria-label={`Секс: ${sex}`}
            onClick={(e) => handleCounterClick(e, setSex)}
            onKeyDown={(e) => handleKeyDown(e, setSex)}
            className="group relative flex h-16 w-full items-center justify-between overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated-2)] transition select-none hover:border-[color:var(--border-strong)]"
          >
            <div
              data-action="decrement"
              data-testid="sex-decrement"
              aria-hidden="true"
              className="absolute inset-y-0 left-0 flex w-1/2 items-center justify-start pl-4 transition hover:bg-white/5 active:bg-white/10"
            >
              <span
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-xl border border-[color:var(--border)] text-lg font-bold transition',
                  sex === 0 ? 'text-[color:var(--text-muted)] opacity-30' : 'text-[color:var(--text-secondary)]',
                ].join(' ')}
              >
                −
              </span>
            </div>

            <div className="pointer-events-none relative z-10 mx-auto flex items-center gap-2.5">
              <span className="text-xl" aria-hidden="true">❤️</span>
              <span className="text-base font-semibold text-[color:var(--text-primary)]">Секс</span>
              <span
                className={[
                  'flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-sm font-bold tabular-nums transition',
                  sex > 0 ? 'text-white' : 'border border-[color:var(--border)] text-[color:var(--text-muted)]',
                ].join(' ')}
                style={sex > 0 ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' } : undefined}
              >
                {sex}
              </span>
            </div>

            <div
              data-action="increment"
              data-testid="sex-increment"
              aria-hidden="true"
              className="absolute inset-y-0 right-0 flex w-1/2 items-center justify-end pr-4 transition hover:bg-white/5 active:bg-white/10"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[color:var(--border)] text-lg font-bold text-[color:var(--text-secondary)] transition">
                +
              </span>
            </div>
          </button>

          <button
            type="button"
            aria-label={`Мастурбация: ${masturbation}`}
            onClick={(e) => handleCounterClick(e, setMasturbation)}
            onKeyDown={(e) => handleKeyDown(e, setMasturbation)}
            className="group relative flex h-16 w-full items-center justify-between overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated-2)] transition select-none hover:border-[color:var(--border-strong)]"
          >
            <div
              data-action="decrement"
              data-testid="masturbation-decrement"
              aria-hidden="true"
              className="absolute inset-y-0 left-0 flex w-1/2 items-center justify-start pl-4 transition hover:bg-white/5 active:bg-white/10"
            >
              <span
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-xl border border-[color:var(--border)] text-lg font-bold transition',
                  masturbation === 0 ? 'text-[color:var(--text-muted)] opacity-30' : 'text-[color:var(--text-secondary)]',
                ].join(' ')}
              >
                −
              </span>
            </div>

            <div className="pointer-events-none relative z-10 mx-auto flex items-center gap-2.5">
              <span className="text-xl" aria-hidden="true">💦</span>
              <span className="text-base font-semibold text-[color:var(--text-primary)]">Мастурбация</span>
              <span
                className={[
                  'flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-sm font-bold tabular-nums transition',
                  masturbation > 0 ? 'text-white' : 'border border-[color:var(--border)] text-[color:var(--text-muted)]',
                ].join(' ')}
                style={masturbation > 0 ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' } : undefined}
              >
                {masturbation}
              </span>
            </div>

            <div
              data-action="increment"
              data-testid="masturbation-increment"
              aria-hidden="true"
              className="absolute inset-y-0 right-0 flex w-1/2 items-center justify-end pr-4 transition hover:bg-white/5 active:bg-white/10"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[color:var(--border)] text-lg font-bold text-[color:var(--text-secondary)] transition">
                +
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onSave(null)}
            className="rounded-xl border border-[color:var(--border)] px-3 py-1.5 text-sm text-[color:var(--text-muted)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
          >
            Очистить день
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-xl px-4 py-1.5 text-sm font-semibold text-white transition active:scale-[0.98]"
            style={{ backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))', boxShadow: 'var(--shadow-md)' }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
