import { useState } from 'react';
import { useAppStore } from '@/shared/model';
import {
  calculateIntimateMonthStats,
  formatDayTitle,
  MONTHS_RU_PREP,
  pluralize,
} from '@/shared/lib';
import { CalendarStatsWidget } from '@/shared/ui';
import { IntimateYearCalendar } from '../IntimateYearCalendar';
import { IntimateDayModal } from '../IntimateDayModal';
import { getIntimateEmoji } from '../../lib/intimateEmoji';

export function IntimatePage() {
  const [{ currentYear, currentMonth }] = useState(() => {
    const now = new Date();
    return { currentYear: now.getFullYear(), currentMonth: now.getMonth() };
  });
  const [year, setYear] = useState(currentYear);
  const [selected, setSelected] = useState<string | null>(null);

  const intimate = useAppStore((s) => s.intimate);
  const setIntimateLog = useAppStore((s) => s.setIntimateLog);

  return (
    <>
      <IntimateYearCalendar
        year={year}
        onYearChange={setYear}
        getEmoji={(iso) => getIntimateEmoji(intimate[iso])}
        onDayClick={setSelected}
        renderStats={(activeMonth) => {
          const stats = calculateIntimateMonthStats(intimate, year, activeMonth);
          const isCurrent = year === currentYear && activeMonth === currentMonth;
          const monthTitle = isCurrent ? 'В этом месяце' : `В ${MONTHS_RU_PREP[activeMonth]}`;

          return (
            <CalendarStatsWidget
              items={[
                {
                  icon: '❤️',
                  label: monthTitle,
                  value: `${stats.total} ${pluralize(stats.total, 'событие', 'события', 'событий')}`,
                },
                {
                  icon: '✨',
                  label: 'Детализация',
                  value: `секс: ${stats.sex} · мастурбация: ${stats.masturbation}`,
                },
              ]}
            />
          );
        }}
      />
      {selected && (
        <IntimateDayModal
          title={formatDayTitle(selected)}
          initial={intimate[selected]}
          onSave={(log) => {
            setIntimateLog(selected, log);
            setSelected(null);
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
