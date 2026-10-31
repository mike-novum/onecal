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
