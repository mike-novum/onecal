import { useEffect, useState } from 'react';
import { sortDayParts, type PillCourse } from '@/shared/model';
import { MedicationFields } from './MedicationFields';
import { draftFromMedication, emptyMedicationDraft, toMedication, type MedicationDraft } from './medicationDraft';

interface CourseFormProps {
  initial: PillCourse | null;
  onSubmit: (course: PillCourse) => void;
  onCancel: () => void;
}

const inputClass =
  'w-full min-w-0 max-w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated-2)] px-3 py-1.5 text-sm text-[color:var(--text-primary)] outline-none transition focus:border-[color:var(--accent)] focus:bg-[color:var(--bg-elevated)]';
const labelClass = 'flex flex-col gap-1.5 text-sm text-[color:var(--text-secondary)]';

export function CourseForm({ initial, onSubmit, onCancel }: CourseFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [startDate, setStartDate] = useState(initial?.startDate ?? '');
  const [endDate, setEndDate] = useState(initial?.endDate ?? '');
  const [medications, setMedications] = useState<MedicationDraft[]>(
    initial?.medications.map(draftFromMedication) ?? [emptyMedicationDraft()],
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  function updateMed(index: number, patch: Partial<MedicationDraft>) {
    setMedications((prev) => prev.map((med, i) => (i === index ? { ...med, ...patch } : med)));
  }

  function changeCourseStart(value: string) {
    setStartDate(value);
    setMedications((prev) => prev.map((med) => (med.ownDates && med.startDate === '' ? { ...med, startDate: value } : med)));
  }

  function changeCourseEnd(value: string) {
    setEndDate(value);
    setMedications((prev) => prev.map((med) => (med.ownDates && med.endDate === '' ? { ...med, endDate: value } : med)));
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
    if (medications.some((med) => med.name.trim() === '')) {
      setError('Название препарата обязательно');
      return;
    }
    if (
      medications.some((med) => {
        if (med.scheduleMode === 'parts') return sortDayParts(med.dayParts).length < 1;
        if (!/^\d+$/.test(med.timesText)) return true;
        const times = Number(med.timesText);
        return !Number.isInteger(times) || times < 1;
      })
    ) {
      const missingPart = medications.some((med) => med.scheduleMode === 'parts' && sortDayParts(med.dayParts).length < 1);
      setError(missingPart ? 'Выберите время суток' : 'Кратность приёма должна быть целым числом не меньше 1');
      return;
    }
    if (medications.some((med) => med.unit === 'custom' && med.customUnit.trim() === '')) {
      setError('Укажите свою единицу');
      return;
    }
    if (medications.some((med) => med.ownDates && (med.startDate === '' || med.endDate === ''))) {
      setError('Укажите срок препарата');
      return;
    }
    if (medications.some((med) => med.ownDates && med.endDate < med.startDate)) {
      setError('Дата окончания препарата раньше даты начала');
      return;
    }
    if (medications.some((med) => med.ownDates && (med.startDate < startDate || med.endDate > endDate))) {
      setError('Срок препарата должен быть внутри дат курса');
      return;
    }
    setError(null);
    onSubmit({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      startDate,
      endDate,
      medications: medications.map(toMedication),
    });
  }

  return (
    <div
      data-testid="modal-overlay"
      className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden p-0 sm:items-center sm:p-4"
      onClick={onCancel}
      style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <div
        role="dialog"
        aria-label={initial ? 'Редактировать курс' : 'Новый курс'}
        className="max-h-[92vh] w-full min-w-0 max-w-xl overflow-x-hidden overflow-y-auto rounded-t-3xl border border-[color:var(--border)] p-5 sm:rounded-2xl"
        style={{ background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-lg), var(--shadow-inset)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold text-[color:var(--text-primary)]">
          {initial ? 'Редактировать курс' : 'Новый курс'}
        </h3>
        <div className="mb-4 flex flex-col gap-3">
          <label className={labelClass}>
            Название курса
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </label>
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <label className={`${labelClass} w-full min-w-0`}>
              Начало
              <input type="date" value={startDate} onChange={(e) => changeCourseStart(e.target.value)} className={inputClass} />
            </label>
            <label className={`${labelClass} w-full min-w-0`}>
              Окончание
              <input type="date" value={endDate} onChange={(e) => changeCourseEnd(e.target.value)} className={inputClass} />
            </label>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-[color:var(--text-secondary)]">Препараты</div>
          {medications.map((med, i) => (
            <MedicationFields
              key={med.key}
              index={i}
              draft={med}
              courseStart={startDate}
              courseEnd={endDate}
              onChange={(patch) => updateMed(i, patch)}
              onRemove={() => setMedications((prev) => prev.filter((_, j) => j !== i))}
            />
          ))}
          <button
            type="button"
            onClick={() => setMedications((prev) => [...prev, emptyMedicationDraft()])}
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
