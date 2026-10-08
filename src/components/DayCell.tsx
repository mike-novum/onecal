interface DayCellProps {
  dayNumber: number;
  emoji: string | null;
  onClick: () => void;
  isToday: boolean;
  size?: 'sm' | 'md';
}

export function DayCell({ dayNumber, emoji, onClick, isToday, size = 'md' }: DayCellProps) {
  const isSm = size === 'sm';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`день ${dayNumber}`}
      aria-current={isToday ? 'date' : undefined}
      className={[
        'group relative flex items-center justify-center rounded-md border text-center tabular-nums transition',
        isSm ? 'h-9 text-[13px]' : 'aspect-square text-base',
        isToday
          ? 'border-transparent font-semibold text-white'
          : emoji
            ? 'border-transparent text-lg'
            : 'border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)]',
      ].join(' ')}
      style={isToday ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' } : undefined}
    >
      {emoji ? (
        <span className={isSm ? 'text-base leading-none' : 'text-2xl leading-none'}>{emoji}</span>
      ) : (
        <span className={isToday ? 'text-white' : ''}>{dayNumber}</span>
      )}
    </button>
  );
}
