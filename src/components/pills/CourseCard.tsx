import type { PillCourse } from '../../types';
import { formatDayTitle } from '../../lib/dates';

const INTAKE_LABELS: Record<string, string> = {
  before: 'до еды',
  during: 'во время еды',
  after: 'после еды',
};

interface CourseCardProps {
  course: PillCourse;
  onEdit: () => void;
  onDelete: () => void;
}

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  return (
    <div className="surface group rounded-2xl p-4 transition hover:border-[color:var(--border-strong)] sm:p-5">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-[color:var(--text-primary)]">{course.title}</h3>
          <div className="mt-0.5 text-xs tabular-nums text-[color:var(--text-muted)]">
            {formatDayTitle(course.startDate)} — {formatDayTitle(course.endDate)}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-[color:var(--border)] px-2.5 py-1 text-xs text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
          >
            Изменить
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-[color:var(--border)] px-2.5 py-1 text-xs text-[color:var(--text-muted)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
          >
            Удалить
          </button>
        </div>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-[color:var(--text-secondary)]">
        {course.medications.map((med, i) => (
          <li key={i} className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[color:var(--text-primary)]">{med.name}</span>
            {med.dosage && <span className="text-[color:var(--text-muted)]">· {med.dosage}</span>}
            <span className="text-[color:var(--text-muted)]">
              · {med.timesPerDay} раз(а) в день · {INTAKE_LABELS[med.intake]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
