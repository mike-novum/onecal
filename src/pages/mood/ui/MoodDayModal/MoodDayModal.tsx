import { useEffect, useState } from 'react';
import type { MoodLog } from '@/shared/model';
import { EMOTIONS } from '../../config/emotions';
import { NEGATIVE_REASONS, POSITIVE_REASONS } from '../../config/reasons';
import { getMoodLevel, MOOD_LEVEL_COLORS, MOOD_LEVEL_BORDER_COLORS } from '../../lib/moodLevel';

interface MoodDayModalProps {
  title: string;
  initial: MoodLog | undefined;
  onSave: (log: MoodLog | null) => void;
  onClose: () => void;
}

interface TagOption {
  id: string;
  label: string;
  emoji: string;
}

function toggleId(prev: string[], id: string): string[] {
  return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
}

function toSavedLog(
  emotions: string[],
  negativeReasons: string[],
  positiveReasons: string[],
  note: string,
): MoodLog | null {
  const trimmedNote = note.trim();
  if (
    emotions.length === 0 &&
    negativeReasons.length === 0 &&
    positiveReasons.length === 0 &&
    trimmedNote.length === 0
  ) {
    return null;
  }

  const log: MoodLog = { emotions };
  if (negativeReasons.length > 0) log.negativeReasons = negativeReasons;
  if (positiveReasons.length > 0) log.positiveReasons = positiveReasons;
  if (trimmedNote.length > 0) log.note = trimmedNote;
  return log;
}

function TagGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: TagOption[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="mb-5">
      <p className="mb-3 text-sm text-[color:var(--text-secondary)]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(item.id)}
              className={[
                'rounded-full border px-3 py-1.5 text-sm transition',
                isSelected
                  ? 'scale-[1.02] border-transparent text-white'
                  : 'border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]',
              ].join(' ')}
              style={isSelected ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' } : undefined}
            >
              <span className="mr-1.5" aria-hidden>{item.emoji}</span>
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MoodDayModal({ title, initial, onSave, onClose }: MoodDayModalProps) {
  const [emotions, setEmotions] = useState<string[]>(initial?.emotions ?? []);
  const [negativeReasons, setNegativeReasons] = useState<string[]>(initial?.negativeReasons ?? []);
  const [positiveReasons, setPositiveReasons] = useState<string[]>(initial?.positiveReasons ?? []);
  const [note, setNote] = useState(initial?.note ?? '');

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function save() {
    onSave(toSavedLog(emotions, negativeReasons, positiveReasons, note));
  }

  const level = getMoodLevel({ emotions });

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
        className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-[color:var(--border)] sm:rounded-2xl"
        style={{ background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-lg), var(--shadow-inset)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
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

        <div className="min-h-0 flex-1 overflow-y-auto px-5">
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

          <TagGroup
            label="Как вы себя чувствуете?"
            options={EMOTIONS}
            selected={emotions}
            onToggle={(id) => setEmotions((prev) => toggleId(prev, id))}
          />
          <TagGroup
            label="Причины негативных эмоций"
            options={NEGATIVE_REASONS}
            selected={negativeReasons}
            onToggle={(id) => setNegativeReasons((prev) => toggleId(prev, id))}
          />
          <TagGroup
            label="Причины положительных эмоций"
            options={POSITIVE_REASONS}
            selected={positiveReasons}
            onToggle={(id) => setPositiveReasons((prev) => toggleId(prev, id))}
          />

          <label className="mb-5 flex flex-col gap-2 text-sm text-[color:var(--text-secondary)]">
            Заметка
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Кратко, как прошёл день"
              className="w-full resize-y rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated-2)] px-3 py-2 text-sm text-[color:var(--text-primary)] outline-none transition placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--accent)] focus:bg-[color:var(--bg-elevated)]"
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-2 px-5 py-4">
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
