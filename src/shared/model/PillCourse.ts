export type Intake = 'none' | 'before' | 'during' | 'after';

export type DoseUnit = 'tablet' | 'capsule' | 'mg' | 'g' | 'ml' | 'drop' | 'application' | 'custom';

export type DayPart = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Medication {
  name: string;
  dosage: string;
  timesPerDay: number;
  intake: Intake;
  amount?: string;
  unit?: DoseUnit;
  customUnit?: string;
  dayParts?: DayPart[];
  startDate?: string;
  endDate?: string;
}

export interface PillCourse {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  medications: Medication[];
}
