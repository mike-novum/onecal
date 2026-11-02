import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PillCourse } from './PillCourse';
import type { DayLog, TrackerKind } from './Tracker';
import type { MoodLog } from './MoodLog';
import type { IntimateLog } from './IntimateLog';

export interface AppSnapshot {
  alcohol: Record<string, DayLog>;
  fastfood: Record<string, DayLog>;
  pillCourses: PillCourse[];
  mood: Record<string, MoodLog>;
  intimate: Record<string, IntimateLog>;
}

export interface AppState extends AppSnapshot {
  setDayLog: (kind: TrackerKind, date: string, log: DayLog | null) => void;
  setMoodLog: (date: string, log: MoodLog | null) => void;
  setIntimateLog: (date: string, log: IntimateLog | null) => void;
  addCourse: (course: PillCourse) => void;
  updateCourse: (course: PillCourse) => void;
  deleteCourse: (id: string) => void;
  importData: (data: AppSnapshot) => void;
  resetAll: () => void;
}

const EMPTY_SNAPSHOT: AppSnapshot = { alcohol: {}, fastfood: {}, pillCourses: [], mood: {}, intimate: {} };

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

      setIntimateLog: (date, log) =>
        set((state) => {
          const intimate = { ...state.intimate };
          if (log === null || (log.sex === 0 && log.masturbation === 0)) {
            delete intimate[date];
          } else {
            intimate[date] = log;
          }
          return { intimate };
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
      partialize: ({ alcohol, fastfood, pillCourses, mood, intimate }) => ({
        alcohol,
        fastfood,
        pillCourses,
        mood,
        intimate,
      }),
    },
  ),
);
