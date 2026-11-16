import { useState } from 'react';
import { DayModal } from '../DayModal';
import { YearCalendar } from '../YearCalendar';
import { ALCOHOL_ITEMS, FASTFOOD_ITEMS } from '../../config/catalogs';
import { getCellEmoji } from '../../lib/cellEmoji';
import {
  calculateHabitMonthMarks,
  calculateHabitStreak,
  formatDayTitle,
  getStreakEmoji,
  MONTHS_RU_PREP,
  pluralize,
} from '@/shared/lib';
import { useAppStore, type TrackerKind } from '@/shared/model';
import { CalendarStatsWidget } from '@/shared/ui';

interface TrackerPageProps {
  kind: TrackerKind;
  badLabel: string;
}

export function TrackerPage({ kind, badLabel }: TrackerPageProps) {
  const [{ currentYear, currentMonth }] = useState(() => {
    const now = new Date();
    return { currentYear: now.getFullYear(), currentMonth: now.getMonth() };
  });
  const [year, setYear] = useState(currentYear);
  const [selected, setSelected] = useState<string | null>(null);

  const tracker = useAppStore((s) => s[kind]);
  const setDayLog = useAppStore((s) => s.setDayLog);
  const catalog = kind === 'alcohol' ? ALCOHOL_ITEMS : FASTFOOD_ITEMS;

  const streak = calculateHabitStreak(tracker);
  const streakEmoji = getStreakEmoji(streak);

  return (
    <>
      <YearCalendar
        year={year}
        onYearChange={setYear}
        getEmoji={(iso) => getCellEmoji(tracker[iso], catalog)}
        onDayClick={setSelected}
        renderStats={(activeMonth) => {
          const monthMarks = calculateHabitMonthMarks(tracker, year, activeMonth);
          const isCurrent = year === currentYear && activeMonth === currentMonth;
          const monthTitle = isCurrent ? 'В этом месяце' : `В ${MONTHS_RU_PREP[activeMonth]}`;
          const kindEmoji = kind === 'alcohol' ? '🍷' : '🍔';

          return (
            <CalendarStatsWidget
              items={[
                {
                  icon: streakEmoji,
                  label: 'Серия чистых дней',
                  value: `${streak} ${pluralize(streak, 'день', 'дня', 'дней')}`,
                },
                {
                  icon: kindEmoji,
                  label: monthTitle,
                  value: `${monthMarks} ${pluralize(monthMarks, 'отметка', 'отметки', 'отметок')}`,
                },
              ]}
            />
          );
        }}
      />
      {selected && (
        <DayModal
          dateISO={selected}
          title={formatDayTitle(selected)}
          catalog={catalog}
          initial={tracker[selected]}
          badLabel={badLabel}
          onSave={(log) => {
            setDayLog(kind, selected, log);
            setSelected(null);
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
