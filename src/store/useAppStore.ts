import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DayLog, PillCourse, TrackerKind } from '../types';

export interface AppSnapshot {
  alcohol: Record<string, DayLog>;
  fastfood: Record<string, DayLog>;
  pillCourses: PillCourse[];
}

export interface AppState extends AppSnapshot {
  setDayLog: (kind: TrackerKind, date: string, log: DayLog | null) => void;
  addCourse: (course: PillCourse) => void;
  updateCourse: (course: PillCourse) => void;
  deleteCourse: (id: string) => void;
  importData: (data: AppSnapshot) => void;
  resetAll: () => void;
}

const EMPTY_SNAPSHOT: AppSnapshot = { alcohol: {}, fastfood: {}, pillCourses: [] };

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
      partialize: ({ alcohol, fastfood, pillCourses }) => ({ alcohol, fastfood, pillCourses }),
    },
  ),
);
