import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PillCourse } from './PillCourse';
import type { DayLog, TrackerKind } from './Tracker';
import type { MoodLog } from './MoodLog';

export interface AppSnapshot {
  alcohol: Record<string, DayLog>;
  fastfood: Record<string, DayLog>;
  pillCourses: PillCourse[];
  mood: Record<string, MoodLog>;
}

export interface AppState extends AppSnapshot {
  setDayLog: (kind: TrackerKind, date: string, log: DayLog | null) => void;
  setMoodLog: (date: string, log: MoodLog | null) => void;
  addCourse: (course: PillCourse) => void;
  updateCourse: (course: PillCourse) => void;
  deleteCourse: (id: string) => void;
  importData: (data: AppSnapshot) => void;
  resetAll: () => void;
}

const EMPTY_SNAPSHOT: AppSnapshot = { alcohol: {}, fastfood: {}, pillCourses: [], mood: {} };

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...EMPTY_SNAPSHOT,

      setDayLog: (kind, date, log) =>
        set((state) => {
          const tracker = { ...state[kind] };
          if (log === null) {
            delete tracker[date];
          } else {
            tracker[date] = log;
          }
          return { [kind]: tracker };
        }),

      setMoodLog: (date, log) =>
        set((state) => {
          const mood = { ...state.mood };
          if (log === null) {
            delete mood[date];
          } else {
            mood[date] = log;
          }
          return { mood };
        }),

      addCourse: (course) => set((state) => ({ pillCourses: [...state.pillCourses, course] })),

      updateCourse: (course) =>
        set((state) => ({
          pillCourses: state.pillCourses.map((c) => (c.id === course.id ? course : c)),
        })),

      deleteCourse: (id) =>
        set((state) => ({ pillCourses: state.pillCourses.filter((c) => c.id !== id) })),

      importData: (data) => set({ ...data }),

      resetAll: () => set({ ...EMPTY_SNAPSHOT }),
    }),
    {
      name: 'onecal-storage',
      partialize: ({ alcohol, fastfood, pillCourses, mood }) => ({ alcohol, fastfood, pillCourses, mood }),
    },
  ),
);
