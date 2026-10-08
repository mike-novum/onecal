import { addDays, diffDays } from '../../lib/dates';
import type { PillCourse } from '../../types';

interface GanttChartProps {
  courses: PillCourse[];
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

  return (
    <div className="surface overflow-x-auto rounded-2xl p-4">
      <div aria-label={`Шкала с ${min} по ${max}`} style={{ minWidth: totalDays * 28 }}>
        <div className="grid" style={{ gridTemplateColumns: template }}>
          {days.map((d) => (
            <div
              key={d}
              className="text-center text-[10px] tabular-nums text-[color:var(--text-muted)]"
            >
              {Number(d.slice(8))}
            </div>
          ))}
        </div>
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
