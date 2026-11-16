import { useState } from 'react';
import { useAppStore } from '@/shared/model';
import {
  calculateMoodMonthStats,
  formatDayTitle,
  getMoodPredominantInfo,
  MONTHS_RU_PREP,
  pluralize,
} from '@/shared/lib';
import { CalendarStatsWidget } from '@/shared/ui';
import { MoodYearCalendar } from '../MoodYearCalendar';
import { MoodDayModal } from '../MoodDayModal';
import { getMoodLevel } from '../../lib/moodLevel';

export function MoodPage() {
  const [{ currentYear, currentMonth }] = useState(() => {
    const now = new Date();
    return { currentYear: now.getFullYear(), currentMonth: now.getMonth() };
  });
  const [year, setYear] = useState(currentYear);
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
        renderStats={(activeMonth) => {
          const stats = calculateMoodMonthStats(mood, year, activeMonth);
          const isCurrent = year === currentYear && activeMonth === currentMonth;
          const monthTitle = isCurrent ? 'В этом месяце' : `В ${MONTHS_RU_PREP[activeMonth]}`;
          const moodInfo = getMoodPredominantInfo(stats.predominant);

          return (
            <CalendarStatsWidget
              items={[
                {
                  icon: '📝',
                  label: monthTitle,
                  value: `${stats.count} ${pluralize(stats.count, 'отметка', 'отметки', 'отметок')}`,
                },
                {
                  icon: moodInfo.emoji,
                  label: 'Преобладающее',
                  value: moodInfo.text,
                },
              ]}
            />
          );
        }}
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
