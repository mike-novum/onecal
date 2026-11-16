import { memo } from 'react';

export interface StatItem {
  icon: string;
  label: string;
  value: string;
}

export interface CalendarStatsWidgetProps {
  items: StatItem[];
}

export const CalendarStatsWidget = memo(function CalendarStatsWidget({
  items,
}: CalendarStatsWidgetProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" data-testid="stats-widget">
      {items.map((item, index) => (
        <div
          key={index}
          className="surface flex items-center gap-2.5 rounded-2xl px-3 py-1.5 transition sm:px-3.5 sm:py-2 select-none"
        >
          <span
            aria-hidden="true"
            className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-[color:var(--bg-elevated-2)] text-base"
          >
            {item.icon}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-[10px] sm:text-[11px] font-medium text-[color:var(--text-muted)] leading-tight">
              {item.label}
            </span>
            <span className="truncate text-xs sm:text-sm font-semibold text-[color:var(--text-primary)] leading-snug">
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
});
