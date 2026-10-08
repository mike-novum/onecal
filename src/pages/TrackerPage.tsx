import { useState } from 'react';
import { DayModal } from '../components/DayModal';
import { YearCalendar } from '../components/YearCalendar';
import { ALCOHOL_ITEMS, FASTFOOD_ITEMS } from '../data/catalogs';
import { getCellEmoji } from '../lib/cellEmoji';
import { formatDayTitle } from '../lib/dates';
import { useAppStore } from '../store/useAppStore';
import type { TrackerKind } from '../types';

interface TrackerPageProps {
  kind: TrackerKind;
  badLabel: string;
}

export function TrackerPage({ kind, badLabel }: TrackerPageProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState<string | null>(null);

  const tracker = useAppStore((s) => s[kind]);
  const setDayLog = useAppStore((s) => s.setDayLog);
  const catalog = kind === 'alcohol' ? ALCOHOL_ITEMS : FASTFOOD_ITEMS;

  return (
    <>
      <YearCalendar
        year={year}
        onYearChange={setYear}
        getEmoji={(iso) => getCellEmoji(tracker[iso], catalog)}
        onDayClick={setSelected}
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
