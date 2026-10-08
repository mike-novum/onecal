import { useEffect, useState } from 'react';
import type { Intake, Medication, PillCourse } from '../../types';

interface CourseFormProps {
  initial: PillCourse | null;
  onSubmit: (course: PillCourse) => void;
  onCancel: () => void;
}

const INTAKE_OPTIONS: { value: Intake; label: string }[] = [
  { value: 'before', label: 'до еды' },
  { value: 'during', label: 'во время еды' },
  { value: 'after', label: 'после еды' },
];

const EMPTY_MED: Medication = { name: '', dosage: '', timesPerDay: 1, intake: 'after' };

const inputClass =
  'rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated-2)] px-3 py-1.5 text-sm text-[color:var(--text-primary)] outline-none transition focus:border-[color:var(--accent)] focus:bg-[color:var(--bg-elevated)]';
const labelClass = 'flex flex-col gap-1.5 text-sm text-[color:var(--text-secondary)]';
const subLabelClass = 'flex flex-col gap-1.5 text-xs text-[color:var(--text-muted)]';

export function CourseForm({ initial, onSubmit, onCancel }: CourseFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [startDate, setStartDate] = useState(initial?.startDate ?? '');
  const [endDate, setEndDate] = useState(initial?.endDate ?? '');
  const [medications, setMedications] = useState<Medication[]>(initial?.medications ?? [{ ...EMPTY_MED }]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  function updateMed(index: number, patch: Partial<Medication>) {
    setMedications((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  function submit() {
    if (title.trim() === '') {
      setError('Название курса обязательно');
      return;
    }
    if (startDate === '' || endDate === '') {
      setError('Укажите даты начала и окончания');
      return;
    }
    if (endDate < startDate) {
      setError('Дата окончания раньше даты начала');
      return;
    }
    if (medications.length === 0) {
      setError('Добавьте хотя бы один препарат');
      return;
    }
    if (medications.some((m) => m.name.trim() === '')) {
      setError('Название препарата обязательно');
      return;
    }
    if (medications.some((m) => !Number.isInteger(m.timesPerDay) || m.timesPerDay < 1)) {
      setError('Кратность приёма должна быть целым числом не меньше 1');
      return;
    }
    setError(null);
    onSubmit({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      startDate,
      endDate,
      medications: medications.map((m) => ({ ...m, name: m.name.trim() })),
    });
  }

  return (
    <div
      data-testid="modal-overlay"
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      onClick={onCancel}
      style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <div
        role="dialog"
        aria-label={initial ? 'Редактировать курс' : 'Новый курс'}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-[color:var(--border)] p-5 sm:rounded-2xl"
        style={{ background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-lg), var(--shadow-inset)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold text-[color:var(--text-primary)]">
          {initial ? 'Редактировать курс' : 'Новый курс'}
        </h3>
        <div className="mb-4 flex flex-col gap-3">
          <label className={labelClass}>
            Название курса
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </label>
          <div className="flex gap-3">
            <label className={`${labelClass} flex-1`}>
              Начало
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className={`${labelClass} flex-1`}>
              Окончание
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-[color:var(--text-secondary)]">Препараты</div>
          {medications.map((med, i) => (
            <div
              key={i}
              className="mb-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated-2)] p-3"
            >
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <label className={`${subLabelClass} flex-1`}>
                    Название препарата
                    <input
                      value={med.name}
                      onChange={(e) => updateMed(i, { name: e.target.value })}
                      className={inputClass}
                    />
                  </label>
                  <label className={`${subLabelClass} flex-1`}>
                    Дозировка
                    <input
                      value={med.dosage}
                      onChange={(e) => updateMed(i, { dosage: e.target.value })}
                      className={inputClass}
                    />
                  </label>
                </div>
                <div className="flex items-end gap-2">
                  <label className={`${subLabelClass} w-24`}>
                    Раз в день
                    <input
                      type="number"
                      min={1}
                      value={med.timesPerDay}
                      onChange={(e) => updateMed(i, { timesPerDay: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </label>
                  <label className={`${subLabelClass} flex-1`}>
                    Приём
                    <select
                      value={med.intake}
                      onChange={(e) => updateMed(i, { intake: e.target.value as Intake })}
                      className={inputClass}
                    >
                      {INTAKE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => setMedications((prev) => prev.filter((_, j) => j !== i))}
                    className="shrink-0 rounded-lg border border-[color:var(--border)] px-2.5 py-1.5 text-xs text-[color:var(--text-muted)] transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setMedications((prev) => [...prev, { ...EMPTY_MED }])}
            className="rounded-lg border border-dashed border-[color:var(--border)] px-3 py-1.5 text-xs text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
          >
            + Добавить препарат
          </button>
        </div>

        {error && <div className="mb-3 text-sm text-[#f87171]">{error}</div>}

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[color:var(--border)] px-3 py-1.5 text-sm text-[color:var(--text-muted)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={submit}
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
