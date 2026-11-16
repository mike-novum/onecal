import { addDays, diffDays, MONTHS_RU, todayISO } from '@/shared/lib';
import type { PillCourse } from '@/shared/model';

interface GanttChartProps {
  courses: PillCourse[];
}

interface MonthSpan {
  key: string;
  label: string;
  startCol: number;
  span: number;
}

export function GanttChart({ courses }: GanttChartProps) {
  if (courses.length === 0) {
    return (
      <div className="surface rounded-2xl border-dashed p-10 text-center text-[color:var(--text-secondary)]">
        Нет курсов для отображения
      </div>
    );
  }

  const min = courses.map((c) => c.startDate).sort()[0];
  const max = courses.map((c) => c.endDate).sort().slice(-1)[0];
  const totalDays = diffDays(min, max) + 1;
  const template = `repeat(${totalDays}, minmax(28px, 1fr))`;

  const days: string[] = [];
  for (let i = 0; i < totalDays; i++) {
    days.push(addDays(min, i));
  }

  const monthSpans: MonthSpan[] = [];
  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    const key = d.slice(0, 7);
    const last = monthSpans[monthSpans.length - 1];
    if (last && last.key === key) {
      last.span += 1;
    } else {
      const [yStr, mStr] = key.split('-');
      const m = Number(mStr) - 1;
      monthSpans.push({
        key,
        label: `${MONTHS_RU[m]} ${yStr}`,
        startCol: i + 1,
        span: 1,
      });
    }
  }

  const today = todayISO();
  const todayIndex = days.indexOf(today);

  return (
    <div className="surface overflow-x-auto rounded-2xl p-4">
      <div className="relative" aria-label={`Шкала с ${min} по ${max}`} style={{ minWidth: totalDays * 28 }}>
        <div className="mb-1 grid border-b border-[color:var(--border)] pb-1" style={{ gridTemplateColumns: template }}>
          {monthSpans.map((span) => (
            <div
              key={span.key}
              className="truncate px-1 text-xs font-semibold text-[color:var(--text-secondary)]"
              style={{
                gridColumnStart: span.startCol,
                gridColumnEnd: `span ${span.span}`,
              }}
            >
              {span.label}
            </div>
          ))}
        </div>
        <div className="mb-2 grid" style={{ gridTemplateColumns: template }}>
          {days.map((d) => {
            const isToday = d === today;
            return (
              <div
                key={d}
                className="flex items-center justify-center text-center text-[10px] tabular-nums"
              >
                {isToday ? (
                  <span
                    title="Сегодня"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--accent)] font-semibold text-white shadow-xs"
                  >
                    {Number(d.slice(8))}
                  </span>
                ) : (
                  <span className="text-[color:var(--text-muted)]">{Number(d.slice(8))}</span>
                )}
              </div>
            );
          })}
        </div>
        {todayIndex !== -1 && (
          <div
            data-testid="gantt-today-line"
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 top-12 z-10 flex -translate-x-1/2 flex-col items-center"
            style={{
              left: `${((todayIndex + 0.5) / totalDays) * 100}%`,
            }}
          >
            <div className="h-full w-0.5 bg-[color:var(--accent)] opacity-85 shadow-xs" />
          </div>
        )}
        {courses.map((course) => {
          const offset = diffDays(min, course.startDate);
          const width = diffDays(course.startDate, course.endDate) + 1;
          return (
            <div key={course.id} className="grid py-1" style={{ gridTemplateColumns: template }}>
              <div
                title={`${course.title} (${course.startDate} — ${course.endDate})`}
                className="truncate rounded-md px-1.5 text-xs font-medium text-white"
                style={{
                  gridColumnStart: offset + 1,
                  gridColumnEnd: `span ${width}`,
                  backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset',
                }}
              >
                {course.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
