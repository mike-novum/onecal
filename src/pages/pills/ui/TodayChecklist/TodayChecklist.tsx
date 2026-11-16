import { memo } from 'react';
import type { PillCourse } from '@/shared/model';
import { todayISO } from '@/shared/lib';
import { getActiveMedications, usePillIntakes } from '../../model/pillIntakes';

const INTAKE_LABELS: Record<string, string> = {
  before: 'до еды',
  during: 'во время еды',
  after: 'после еды',
};

interface TodayChecklistProps {
  courses: PillCourse[];
  date?: string;
}

export const TodayChecklist = memo(function TodayChecklist({
  courses,
  date,
}: TodayChecklistProps) {
  const currentDate = date ?? todayISO();
  const activeItems = getActiveMedications(courses, currentDate);
  const { isTaken, toggle } = usePillIntakes(currentDate);

  if (activeItems.length === 0) {
    return (
      <div
        data-testid="today-checklist-empty"
        className="surface mb-6 rounded-2xl p-5 text-center transition"
      >
        <span className="mb-1 block text-2xl" aria-hidden="true">
          🌱
        </span>
        <h3 className="text-sm font-semibold text-[color:var(--text-primary)] sm:text-base">
          На сегодня приёмов нет
        </h3>
        <p className="mt-0.5 text-xs text-[color:var(--text-muted)]">
          Активных курсов на текущую дату не найдено
        </p>
      </div>
    );
  }

  const takenCount = activeItems.filter((item) => isTaken(item.intakeKey)).length;

  return (
    <div
      data-testid="today-checklist"
      className="surface mb-6 rounded-2xl p-4 transition sm:p-5"
    >
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            💊
          </span>
          <h2 className="text-sm font-semibold text-[color:var(--text-primary)] sm:text-base">
            Приём сегодня
          </h2>
        </div>
        <span className="text-xs font-medium tabular-nums text-[color:var(--text-muted)]">
          {takenCount} из {activeItems.length} принято
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {activeItems.map(({ courseTitle, medication, intakeKey }) => {
          const taken = isTaken(intakeKey);
          return (
            <button
              key={intakeKey}
              type="button"
              role="checkbox"
              aria-checked={taken}
              aria-label={`${medication.name}, ${medication.dosage}, ${INTAKE_LABELS[medication.intake] || medication.intake}`}
              onClick={() => toggle(intakeKey)}
              className={[
                'group flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition select-none',
                taken
                  ? 'border-[color:var(--border)] bg-[color:var(--bg-elevated-2)] opacity-75'
                  : 'border-[color:var(--border)] bg-[color:var(--bg-base)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)]',
              ].join(' ')}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className={[
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition',
                    taken
                      ? 'border-transparent text-white'
                      : 'border-[color:var(--border-strong)] text-transparent group-hover:border-[color:var(--border-focus)]',
                  ].join(' ')}
                  style={
                    taken
                      ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }
                      : undefined
                  }
                >
                  ✓
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={[
                        'text-sm font-semibold transition',
                        taken
                          ? 'text-[color:var(--text-muted)] line-through'
                          : 'text-[color:var(--text-primary)]',
                      ].join(' ')}
                    >
                      {medication.name}
                    </span>
                    {medication.dosage && (
                      <span className="text-xs text-[color:var(--text-muted)]">
                        {medication.dosage}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-[color:var(--text-secondary)]">
                    <span className="rounded-md bg-[color:var(--bg-elevated-2)] px-1.5 py-0.5 text-[11px] text-[color:var(--text-secondary)]">
                      {INTAKE_LABELS[medication.intake] || medication.intake}
                    </span>
                    <span className="text-[color:var(--text-muted)]">·</span>
                    <span className="text-[color:var(--text-muted)]">{courseTitle}</span>
                    {medication.timesPerDay > 1 && (
                      <>
                        <span className="text-[color:var(--text-muted)]">·</span>
                        <span className="text-[color:var(--text-muted)]">
                          {medication.timesPerDay} раз(а) в день
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <span
                className={[
                  'shrink-0 text-xs font-medium transition',
                  taken
                    ? 'text-emerald-400'
                    : 'text-[color:var(--text-muted)] group-hover:text-[color:var(--text-secondary)]',
                ].join(' ')}
              >
                {taken ? 'Принято' : 'Отметить'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
