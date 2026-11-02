import { useState } from 'react';
import { useAppStore } from '@/shared/model';
import { formatDayTitle } from '@/shared/lib';
import { MoodYearCalendar } from '../MoodYearCalendar';
import { MoodDayModal } from '../MoodDayModal';
import { getMoodLevel } from '../../lib/moodLevel';

export function MoodPage() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [selected, setSelected] = useState<string | null>(null);

  const mood = useAppStore((s) => s.mood);
  const setMoodLog = useAppStore((s) => s.setMoodLog);

  return (
    <>
      <MoodYearCalendar
        year={year}
        onYearChange={setYear}
        getMoodLevel={(iso) => getMoodLevel(mood[iso])}
        onDayClick={setSelected}
      />
      {selected && (
        <MoodDayModal
          title={formatDayTitle(selected)}
          initial={mood[selected]}
          onSave={(log) => {
            setMoodLog(selected, log);
            setSelected(null);
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
