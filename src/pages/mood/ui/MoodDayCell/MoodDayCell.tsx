import { memo } from 'react';
import type { MoodLevel } from '../../lib/moodLevel';
import { MOOD_LEVEL_BORDER_COLORS, MOOD_LEVEL_COLORS } from '../../lib/moodLevel';

interface MoodDayCellProps {
  dayNumber: number;
  moodLevel: MoodLevel;
  onClick: () => void;
  isToday: boolean;
}

export const MoodDayCell = memo(function MoodDayCell({
  dayNumber,
  moodLevel,
  onClick,
  isToday,
}: MoodDayCellProps) {
  const hasMood = moodLevel !== null;

  const bgColor = hasMood ? MOOD_LEVEL_COLORS[moodLevel] : undefined;
  const borderColor = hasMood ? MOOD_LEVEL_BORDER_COLORS[moodLevel] : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`день ${dayNumber}`}
      aria-current={isToday ? 'date' : undefined}
      className={[
        'group relative flex h-9 w-9 items-center justify-center rounded-md border text-center text-[13px] tabular-nums transition',
        isToday && !hasMood
          ? 'border-transparent font-semibold text-white'
          : isToday && hasMood
            ? 'font-bold ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--bg-base)]'
            : hasMood
              ? 'font-medium'
              : 'border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)]',
      ].join(' ')}
      style={
        isToday && !hasMood
          ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }
          : hasMood
            ? { backgroundColor: bgColor, borderColor: borderColor, color: 'var(--text-primary)' }
            : undefined
      }
    >
      <span className={isToday && !hasMood ? 'text-white' : ''}>{dayNumber}</span>
      {isToday && hasMood && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0.5 h-1 w-1 rounded-full"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
        />
      )}
    </button>
  );
});
