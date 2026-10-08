import { useState } from 'react';
import { GanttChart } from '../components/gantt/GanttChart';
import { CourseCard } from '../components/pills/CourseCard';
import { CourseForm } from '../components/pills/CourseForm';
import { useAppStore } from '../store/useAppStore';
import type { PillCourse } from '../types';

type Mode = 'list' | 'gantt';

export function PillsPage() {
  const pillCourses = useAppStore((s) => s.pillCourses);
  const addCourse = useAppStore((s) => s.addCourse);
  const updateCourse = useAppStore((s) => s.updateCourse);
  const deleteCourse = useAppStore((s) => s.deleteCourse);

  const [mode, setMode] = useState<Mode>('list');
  const [editing, setEditing] = useState<PillCourse | 'new' | null>(null);

  function handleSubmit(course: PillCourse) {
    if (editing === 'new') {
      addCourse(course);
    } else {
      updateCourse(course);
    }
    setEditing(null);
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Режим отображения"
          className="flex gap-1 rounded-2xl border border-[color:var(--border)] p-1 surface"
        >
          {(['list', 'gantt'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={[
                'rounded-xl px-3 py-1.5 text-sm font-medium transition',
                mode === m
                  ? 'text-white'
                  : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]',
              ].join(' ')}
              style={
                mode === m
                  ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }
                  : undefined
              }
            >
              {m === 'list' ? 'Список' : 'Гантт'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setEditing('new')}
          className="rounded-xl px-4 py-1.5 text-sm font-semibold text-white transition active:scale-[0.98]"
          style={{
            backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          Новый курс
        </button>
      </div>

      {pillCourses.length === 0 && (
        <div className="surface rounded-2xl border-dashed p-10 text-center text-[color:var(--text-secondary)]">
          Нет курсов. Нажмите «Новый курс», чтобы добавить.
        </div>
      )}

      {mode === 'list' && pillCourses.length > 0 && (
        <div className="flex flex-col gap-3">
          {pillCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => setEditing(course)}
              onDelete={() => deleteCourse(course.id)}
            />
          ))}
        </div>
      )}

      {mode === 'gantt' && <GanttChart courses={pillCourses} />}

      {editing && (
        <CourseForm
          initial={editing === 'new' ? null : editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
