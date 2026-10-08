import { memo } from 'react';
import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/alcohol', label: 'Алкоголь' },
  { to: '/pills', label: 'Таблетки' },
  { to: '/fastfood', label: 'Фастфуд' },
];

export const CalendarTabs = memo(function CalendarTabs() {
  return (
    <nav
      className="flex min-w-0 items-center gap-1 rounded-2xl border border-[color:var(--border)] p-1 surface"
      aria-label="Раздел календаря"
    >
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            [
              'flex h-9 items-center rounded-xl px-3 text-sm font-medium transition',
              isActive
                ? 'text-white'
                : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]',
            ].join(' ')
          }
          style={({ isActive }) =>
            isActive
              ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }
              : undefined
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
});
