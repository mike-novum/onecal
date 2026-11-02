import { useEffect, useState } from 'react';
import type { MoodLog } from '@/shared/model';
import { EMOTIONS } from '../../config/emotions';
import { getMoodLevel, MOOD_LEVEL_COLORS, MOOD_LEVEL_BORDER_COLORS } from '../../lib/moodLevel';

interface MoodDayModalProps {
  title: string;
  initial: MoodLog | undefined;
  onSave: (log: MoodLog | null) => void;
  onClose: () => void;
}

export function MoodDayModal({ title, initial, onSave, onClose }: MoodDayModalProps) {
  const [emotions, setEmotions] = useState<string[]>(initial?.emotions ?? []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function toggleEmotion(id: string) {
    setEmotions((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  function save() {
    onSave(emotions.length === 0 ? null : { emotions });
  }

  const currentLog: MoodLog = { emotions };
  const level = getMoodLevel(currentLog);

  const levelLabels = {
    good: 'Всё хорошо',
    warning: 'Есть сложности',
    bad: 'Много негатива',
    critical: 'Очень тяжело',
  };

  return (
    <div
      data-testid="mood-modal-overlay"
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

        {level && (
          <div
            className="mb-4 rounded-xl px-3 py-2 text-sm font-medium"
            style={{
              backgroundColor: MOOD_LEVEL_COLORS[level],
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: MOOD_LEVEL_BORDER_COLORS[level],
              color: 'var(--text-primary)',
            }}
          >
            {levelLabels[level]}
          </div>
        )}

        <p className="mb-3 text-sm text-[color:var(--text-secondary)]">Как вы себя чувствуете?</p>

        <div className="mb-5 flex flex-wrap gap-2">
          {EMOTIONS.map((item) => {
            const selected = emotions.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleEmotion(item.id)}
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
