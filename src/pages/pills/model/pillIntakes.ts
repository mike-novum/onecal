import { useState } from 'react';
import { medicationInterval, sortDayParts, type DayPart, type Medication, type PillCourse } from '@/shared/model';
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
  dayPart?: DayPart;
  dose?: number;
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
  const items: ActiveMedicationItem[] = [];
  for (const course of courses) {
    if (date < course.startDate || date > course.endDate) continue;
    course.medications.forEach((med, index) => {
      const interval = medicationInterval(course, med);
      if (date < interval.start || date > interval.end) return;
      const parts = sortDayParts(med.dayParts ?? []);
      if (parts.length > 0) {
        for (const part of parts) {
          items.push({
            courseId: course.id,
            courseTitle: course.title,
            medication: med,
            intakeKey: `${course.id}:${med.name}:${index}:${part}`,
            dayPart: part,
          });
        }
        return;
      }
      const times = med.timesPerDay >= 1 ? med.timesPerDay : 1;
      for (let dose = 1; dose <= times; dose += 1) {
        items.push({
          courseId: course.id,
          courseTitle: course.title,
          medication: med,
          intakeKey: times === 1 ? `${course.id}:${med.name}:${index}` : `${course.id}:${med.name}:${index}:dose:${dose}`,
          dose: times === 1 ? undefined : dose,
        });
      }
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
