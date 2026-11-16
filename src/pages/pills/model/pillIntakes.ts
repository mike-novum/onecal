import { useState } from 'react';
import type { Medication, PillCourse } from '@/shared/model';
import { todayISO, triggerHaptic } from '@/shared/lib';

export const PILL_INTAKES_STORAGE_KEY = 'onecal-pill-intakes';

export interface PillIntakesState {
  [date: string]: {
    [intakeKey: string]: boolean;
  };
}

export interface ActiveMedicationItem {
  courseId: string;
  courseTitle: string;
  medication: Medication;
  intakeKey: string;
}

export function loadPillIntakes(): PillIntakesState {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(PILL_INTAKES_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PillIntakesState;
  } catch {
    return {};
  }
}

export function savePillIntakes(state: PillIntakesState): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(PILL_INTAKES_STORAGE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
}

export function isPillTaken(
  state: PillIntakesState,
  date: string,
  intakeKey: string,
): boolean {
  return Boolean(state[date]?.[intakeKey]);
}

export function togglePillTaken(
  state: PillIntakesState,
  date: string,
  intakeKey: string,
): PillIntakesState {
  const current = Boolean(state[date]?.[intakeKey]);
  return {
    ...state,
    [date]: {
      ...state[date],
      [intakeKey]: !current,
    },
  };
}

export function getActiveMedications(
  courses: PillCourse[],
  date: string = todayISO(),
): ActiveMedicationItem[] {
  const activeCourses = courses.filter(
    (c) => date >= c.startDate && date <= c.endDate,
  );

  const items: ActiveMedicationItem[] = [];
  for (const course of activeCourses) {
    course.medications.forEach((med, index) => {
      items.push({
        courseId: course.id,
        courseTitle: course.title,
        medication: med,
        intakeKey: `${course.id}:${med.name}:${index}`,
      });
    });
  }

  return items;
}

export function usePillIntakes(date: string = todayISO()) {
  const [intakes, setIntakes] = useState<PillIntakesState>(loadPillIntakes);

  function toggle(intakeKey: string) {
    triggerHaptic('light');
    setIntakes((prev) => {
      const updated = togglePillTaken(prev, date, intakeKey);
      savePillIntakes(updated);
      return updated;
    });
  }

  function isTaken(intakeKey: string): boolean {
    return isPillTaken(intakes, date, intakeKey);
  }

  return { intakes, isTaken, toggle };
}
