import {
  DAY_PART_LABELS,
  DAY_PART_ORDER,
  DOSE_UNIT_GROUPS,
  INTAKE_OPTIONS,
  formatDosage,
  isDoseUnit,
  isIntakeValue,
  sortDayParts,
  stripTrailingUnit,
  type DayPart,
} from '@/shared/model';
import type { MedicationDraft } from './medicationDraft';

const inputClass =
  'w-full min-w-0 max-w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1.5 text-sm text-[color:var(--text-primary)] outline-none transition placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--accent)]';
const subLabelClass = 'flex flex-col gap-1.5 text-xs text-[color:var(--text-muted)]';

function chipClass(active: boolean): string {
  return [
    'rounded-lg px-2.5 py-1.5 text-xs font-medium transition',
    active
      ? 'text-white'
      : 'border border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]',
  ].join(' ');
}

function chipStyle(active: boolean): { backgroundImage: string } | undefined {
  return active ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' } : undefined;
}

interface MedicationFieldsProps {
  index: number;
  draft: MedicationDraft;
  courseStart: string;
  courseEnd: string;
  onChange: (patch: Partial<MedicationDraft>) => void;
  onRemove: () => void;
}

export function MedicationFields({ index, draft, courseStart, courseEnd, onChange, onRemove }: MedicationFieldsProps) {
  const timesId = `med-times-${draft.key}`;

  function changeUnit(value: string) {
    const next = isDoseUnit(value) ? value : '';
    if (next === draft.unit) return;
    if (next === '' && draft.unit) {
      onChange({
        unit: '',
        customUnit: '',
        amount: formatDosage(draft.amount, draft.unit, draft.customUnit),
      });
      return;
    }
    if (draft.unit === '' && next) {
      onChange({ unit: next, amount: stripTrailingUnit(draft.amount) });
      return;
    }
    onChange({ unit: next });
  }

  function changeTimes(value: string) {
    if (value === '' || /^\d{1,2}$/.test(value)) onChange({ timesText: value });
  }

  function stepTimes(delta: number) {
    const current = Number(draft.timesText);
    const base = Number.isInteger(current) && current >= 1 ? current : 1;
    onChange({ timesText: String(Math.min(24, Math.max(1, base + delta))) });
  }

  function togglePart(part: DayPart) {
    const next = draft.dayParts.includes(part)
      ? draft.dayParts.filter((item) => item !== part)
      : [...draft.dayParts, part];
    const sorted = sortDayParts(next);
    onChange({
      dayParts: sorted,
      timesText: sorted.length > 0 ? String(sorted.length) : draft.timesText,
    });
  }

  function enableOwnDates() {
    onChange({
      ownDates: true,
      startDate: draft.startDate || courseStart,
      endDate: draft.endDate || courseEnd,
    });
  }

  return (
    <div className="mb-2 min-w-0 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated-2)] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[color:var(--text-secondary)]">Препарат {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg border border-[color:var(--border)] px-2.5 py-1 text-xs text-[color:var(--text-muted)] transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
        >
          Удалить
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className={subLabelClass}>
          Название препарата
          <input
            value={draft.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className={inputClass}
            autoComplete="off"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className={`${subLabelClass} min-w-0`}>
            Дозировка
            <input
              value={draft.amount}
              onChange={(e) => onChange({ amount: e.target.value })}
              placeholder="1 или слой"
              className={inputClass}
              autoComplete="off"
            />
          </label>
          <label className={`${subLabelClass} min-w-0`}>
            Единица
            <select value={draft.unit} onChange={(e) => changeUnit(e.target.value)} className={inputClass}>
              <option value="">без единицы</option>
              {DOSE_UNIT_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        </div>

        {draft.unit === 'custom' && (
          <label className={subLabelClass}>
            Своя единица
            <input
              value={draft.customUnit}
              onChange={(e) => onChange({ customUnit: e.target.value })}
              placeholder="МЕ, ложка, горошина"
              className={inputClass}
              autoComplete="off"
            />
          </label>
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[color:var(--text-muted)]">Как часто</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Как часто">
            <button
              type="button"
              aria-pressed={draft.scheduleMode === 'count'}
              onClick={() => onChange({ scheduleMode: 'count' })}
              className={chipClass(draft.scheduleMode === 'count')}
              style={chipStyle(draft.scheduleMode === 'count')}
            >
              Сколько раз
            </button>
            <button
              type="button"
              aria-pressed={draft.scheduleMode === 'parts'}
              onClick={() => onChange({ scheduleMode: 'parts' })}
              className={chipClass(draft.scheduleMode === 'parts')}
              style={chipStyle(draft.scheduleMode === 'parts')}
            >
              Время суток
            </button>
          </div>

          {draft.scheduleMode === 'count' ? (
            <div className={subLabelClass}>
              <label htmlFor={timesId}>Раз в день</label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Уменьшить кратность"
                  onClick={() => stepTimes(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-base text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
                >
                  −
                </button>
                <input
                  id={timesId}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={draft.timesText}
                  onChange={(e) => changeTimes(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className={`${inputClass} w-14 text-center tabular-nums`}
                />
                <button
                  type="button"
                  aria-label="Увеличить кратность"
                  onClick={() => stepTimes(1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-base text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Время суток">
                {DAY_PART_ORDER.map((part) => {
                  const active = draft.dayParts.includes(part);
                  return (
                    <button
                      key={part}
                      type="button"
                      aria-pressed={active}
                      onClick={() => togglePart(part)}
                      className={chipClass(active)}
                      style={chipStyle(active)}
                    >
                      {DAY_PART_LABELS[part]}
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] text-[color:var(--text-muted)]">
                Каждый выбранный приём отмечается отдельно
              </span>
            </div>
          )}
        </div>

        <label className={subLabelClass}>
          Приём
          <select
            value={draft.intake}
            onChange={(e) => {
              if (isIntakeValue(e.target.value)) onChange({ intake: e.target.value });
            }}
            className={inputClass}
          >
            {INTAKE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[color:var(--text-muted)]">Срок</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Срок препарата">
            <button
              type="button"
              aria-pressed={!draft.ownDates}
              onClick={() => onChange({ ownDates: false })}
              className={chipClass(!draft.ownDates)}
              style={chipStyle(!draft.ownDates)}
            >
              Весь курс
            </button>
            <button
              type="button"
              aria-pressed={draft.ownDates}
              onClick={enableOwnDates}
              className={chipClass(draft.ownDates)}
              style={chipStyle(draft.ownDates)}
            >
              Свой срок
            </button>
          </div>
          {draft.ownDates && (
            <>
              <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
                <label className={`${subLabelClass} w-full min-w-0`}>
                  С
                  <input
                    type="date"
                    value={draft.startDate}
                    onChange={(e) => onChange({ startDate: e.target.value })}
                    className={inputClass}
                  />
                </label>
                <label className={`${subLabelClass} w-full min-w-0`}>
                  По
                  <input
                    type="date"
                    value={draft.endDate}
                    onChange={(e) => onChange({ endDate: e.target.value })}
                    className={inputClass}
                  />
                </label>
              </div>
              <span className="text-[11px] text-[color:var(--text-muted)]">
                Если этот препарат нужно закончить раньше остальных
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
