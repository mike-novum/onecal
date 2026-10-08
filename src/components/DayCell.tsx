import { memo } from 'react';

interface DayCellProps {
  dayNumber: number;
  emoji: string | null;
  onClick: () => void;
  isToday: boolean;
  size?: 'sm' | 'md';
}

export const DayCell = memo(function DayCell({ dayNumber, emoji, onClick, isToday, size = 'md' }: DayCellProps) {
  const isSm = size === 'sm';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`день ${dayNumber}`}
      aria-current={isToday ? 'date' : undefined}
      className={[
        'group relative flex items-center justify-center rounded-md border text-center tabular-nums transition',
        // Кнопки фиксированно квадратные: 32px на телефонах, 48px на остальных экранах.
        // justify-self-center нужен, чтобы при более широких ячейках грида кнопка
        // не растягивалась на всю ширину, а оставалась по центру.
        'h-8 w-8 justify-self-center self-center sm:h-12 sm:w-12',
        isSm ? 'text-[13px]' : 'text-base',
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
});
