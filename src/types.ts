export type Intake = 'before' | 'during' | 'after';

export interface Medication {
  name: string;
  dosage: string;
  timesPerDay: number;
  intake: Intake;
}

export interface PillCourse {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  medications: Medication[];
}

export interface DayLog {
  items: string[];
  wasBad: boolean;
}

export type TrackerKind = 'alcohol' | 'fastfood';

export interface CatalogItem {
  id: string;
  label: string;
  emoji: string;
}
