import { useState } from 'react';
import { formatDayTitle } from '@/shared/lib';
import { describeSchedule, hasCustomMedicationSpan, mealLabel, type PillCourse } from '@/shared/model';

interface CourseCardProps {
  course: PillCourse;
  onEdit: () => void;
  onDelete: () => void;
}

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="surface group rounded-2xl p-4 transition hover:border-[color:var(--border-strong)] sm:p-5">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-[color:var(--text-primary)]">{course.title}</h3>
          <div className="mt-0.5 text-xs tabular-nums text-[color:var(--text-muted)]">
            {formatDayTitle(course.startDate)} — {formatDayTitle(course.endDate)}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-red-500">Удалить курс?</span>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  onDelete();
                }}
                className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-red-700 active:scale-95"
              >
                Да, удалить
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-[color:var(--border)] px-2.5 py-1 text-xs text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
              >
                Отмена
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="rounded-lg border border-[color:var(--border)] px-2.5 py-1 text-xs text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
              >
                Изменить
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="rounded-lg border border-[color:var(--border)] px-2.5 py-1 text-xs text-[color:var(--text-muted)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
              >
                Удалить
              </button>
            </>
          )}
        </div>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-[color:var(--text-secondary)]">
        {course.medications.map((med, i) => {
          const meal = mealLabel(med.intake);
          return (
            <li key={i} className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-[color:var(--text-primary)]">{med.name}</span>
              {med.dosage && <span className="text-[color:var(--text-muted)]">· {med.dosage}</span>}
              <span className="text-[color:var(--text-muted)]">
                · {describeSchedule(med)}
                {meal ? ` · ${meal}` : ''}
              </span>
              {hasCustomMedicationSpan(course, med) && med.startDate && med.endDate && (
                <span className="text-[color:var(--text-muted)]">
                  · {formatDayTitle(med.startDate)} — {formatDayTitle(med.endDate)}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
