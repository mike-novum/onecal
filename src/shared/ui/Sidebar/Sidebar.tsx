import { memo } from 'react';
import { MenuItem } from '../MenuItem';

const NAV_ITEMS = [
  { to: '/alcohol', icon: '🍷', label: 'Алкоголь' },
  { to: '/fastfood', icon: '🍔', label: 'Фастфуд' },
  { to: '/pills', icon: '💊', label: 'Таблетки' },
  { to: '/mood', icon: '🌈', label: 'Настроение' },
];

interface SidebarProps {
  onExport: () => void;
  onImport: () => void;
  onNavClick?: () => void;
}

export const Sidebar = memo(function Sidebar({ onExport, onImport, onNavClick }: SidebarProps) {
  return (
    <aside
      className="flex h-screen w-[220px] shrink-0 flex-col border-r border-[color:var(--border)] px-3 py-4"
      style={{ background: 'var(--bg-elevated)' }}
    >
      <div className="mb-6 flex items-baseline gap-1.5 px-3">
        <span className="text-base font-bold tracking-tight gradient-text">OneCal</span>
        <span className="text-xs text-[color:var(--text-muted)]">v{__APP_VERSION__}</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5" aria-label="Основная навигация">
        {NAV_ITEMS.map((item) => (
          <MenuItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            onClick={onNavClick}
          />
        ))}
      </nav>

      <div className="mt-4 flex flex-col gap-1.5 border-t border-[color:var(--border)] pt-4">
        <button
          type="button"
          onClick={onExport}
          aria-label="Экспорт"
          title="Экспорт"
          className="flex h-9 items-center gap-1.5 rounded-xl border border-[color:var(--border)] px-3 text-sm text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
        >
          <svg
            aria-hidden
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Экспорт</span>
        </button>
        <button
          type="button"
          onClick={onImport}
          aria-label="Импорт"
          title="Импорт"
          className="flex h-9 items-center gap-1.5 rounded-xl border border-[color:var(--border)] px-3 text-sm text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
        >
          <svg
            aria-hidden
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Импорт</span>
        </button>
      </div>
    </aside>
  );
});
