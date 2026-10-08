import { useEffect, useState } from 'react';
import type { CatalogItem, DayLog } from '../types';
import { ToggleSwitch } from './ToggleSwitch';

interface DayModalProps {
  dateISO: string;
  title: string;
  catalog: CatalogItem[];
  initial: DayLog | undefined;
  badLabel: string;
  onSave: (log: DayLog | null) => void;
  onClose: () => void;
}

export function DayModal({ title, catalog, initial, badLabel, onSave, onClose }: DayModalProps) {
  const [items, setItems] = useState<string[]>(initial?.items ?? []);
  const [wasBad, setWasBad] = useState(initial?.wasBad ?? false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function toggleItem(id: string) {
    setItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  function save() {
    onSave(items.length === 0 && !wasBad ? null : { items, wasBad });
  }

  return (
    <div
      data-testid="modal-overlay"
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
        <div className="mb-4 flex flex-wrap gap-2">
          {catalog.map((item) => {
            const selected = items.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleItem(item.id)}
                className={[
                  'rounded-full border px-3 py-1.5 text-sm transition',
                  selected
                    ? 'scale-[1.02] border-transparent text-white'
                    : 'border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]',
                ].join(' ')}
                style={selected ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' } : undefined}
              >
                <span className="mr-1.5" aria-hidden>{item.emoji}</span>
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="mb-5">
          <ToggleSwitch checked={wasBad} onChange={setWasBad} label={badLabel} />
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
