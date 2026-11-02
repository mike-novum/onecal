import { useState } from 'react';
import { useAppStore } from '@/shared/model';
import { formatDayTitle } from '@/shared/lib';
import { IntimateYearCalendar } from '../IntimateYearCalendar';
import { IntimateDayModal } from '../IntimateDayModal';
import { getIntimateEmoji } from '../../lib/intimateEmoji';

export function IntimatePage() {
  const [year, setYear] = useState(() => new Date().getFullYear());
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
