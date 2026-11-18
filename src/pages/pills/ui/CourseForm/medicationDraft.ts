import { formatDosage, sortDayParts, type DayPart, type DoseUnit, type Intake, type Medication } from '@/shared/model';

export interface MedicationDraft {
  key: string;
  name: string;
  amount: string;
  unit: DoseUnit | '';
  customUnit: string;
  timesText: string;
  scheduleMode: 'count' | 'parts';
  dayParts: DayPart[];
  intake: Intake;
  ownDates: boolean;
  startDate: string;
  endDate: string;
}

export function emptyMedicationDraft(): MedicationDraft {
  return {
    key: crypto.randomUUID(),
    name: '',
    amount: '',
    unit: '',
    customUnit: '',
    timesText: '1',
    scheduleMode: 'count',
    dayParts: [],
    intake: 'none',
    ownDates: false,
    startDate: '',
    endDate: '',
  };
}

export function draftFromMedication(med: Medication): MedicationDraft {
  const dayParts = sortDayParts(med.dayParts ?? []);
  return {
    key: crypto.randomUUID(),
    name: med.name,
    amount: med.amount ?? med.dosage,
    unit: med.unit ?? '',
    customUnit: med.customUnit ?? '',
    timesText: String(med.timesPerDay),
    scheduleMode: dayParts.length > 0 ? 'parts' : 'count',
    dayParts,
    intake: med.intake,
    ownDates: Boolean(med.startDate && med.endDate),
    startDate: med.startDate ?? '',
    endDate: med.endDate ?? '',
  };
}

export function toMedication(draft: MedicationDraft): Medication {
  const dayParts = sortDayParts(draft.dayParts);
  const timesPerDay = draft.scheduleMode === 'parts' ? dayParts.length : Number(draft.timesText);
  const med: Medication = {
    name: draft.name.trim(),
    dosage: formatDosage(draft.amount, draft.unit, draft.customUnit),
    timesPerDay,
    intake: draft.intake,
  };
  if (draft.unit) {
    med.amount = draft.amount.trim();
    med.unit = draft.unit;
    if (draft.unit === 'custom') med.customUnit = draft.customUnit.trim();
  }
  if (draft.scheduleMode === 'parts') med.dayParts = dayParts;
  if (draft.ownDates) {
    med.startDate = draft.startDate;
    med.endDate = draft.endDate;
  }
  return med;
}
