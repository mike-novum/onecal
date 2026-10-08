import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { exportSnapshot, parseImport } from '../lib/importExport';
import { todayISO } from '../lib/dates';
import { useAppStore } from '../store/useAppStore';
import { accentForPath, applyAccentToDocument } from '../theme';

const TABS = [
  { to: '/alcohol', label: 'Алкоголь' },
  { to: '/pills', label: 'Таблетки' },
  { to: '/fastfood', label: 'Фастфуд' },
];

export function Layout() {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const alcohol = useAppStore((s) => s.alcohol);
  const fastfood = useAppStore((s) => s.fastfood);
  const pillCourses = useAppStore((s) => s.pillCourses);
  const importData = useAppStore((s) => s.importData);

  useEffect(() => {
    applyAccentToDocument(accentForPath(location.pathname));
  }, [location.pathname]);

  function handleExport() {
    const blob = new Blob([exportSnapshot({ alcohol, fastfood, pillCourses })], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onecal-export-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage(null);
  }

  async function handleImportFile(file: File) {
    const result = parseImport(await file.text());
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    if (!window.confirm('Текущие данные будут перезаписаны. Продолжить?')) {
      setMessage(null);
      return;
    }
    importData(result.data);
    setMessage('Данные импортированы');
  }

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-30 flex items-center gap-2 border-b border-[color:var(--border)] px-3 py-2 sm:gap-4 sm:px-6 sm:py-3"
        style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <span className="shrink-0 text-base font-bold tracking-tight gradient-text sm:text-lg">OneCal</span>
        <nav className="flex min-w-0 items-center gap-1 rounded-2xl border border-[color:var(--border)] p-1 surface">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                [
                  'rounded-lg px-2 py-1 text-xs font-medium transition sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-sm',
                  isActive
                    ? 'text-white'
                    : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]',
                ].join(' ')
              }
              style={({ isActive }) =>
                isActive ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' } : undefined
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleExport}
            aria-label="Экспорт"
            title="Экспорт"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[color:var(--border)] text-sm text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)] sm:h-auto sm:w-auto sm:px-3 sm:py-1.5"
          >
            <span aria-hidden>↓</span>
            <span className="sr-only sm:hidden">Экспорт</span>
            <span className="hidden sm:inline">Экспорт</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Импорт"
            title="Импорт"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[color:var(--border)] text-sm text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)] sm:h-auto sm:w-auto sm:px-3 sm:py-1.5"
          >
            <span aria-hidden>↑</span>
            <span className="sr-only sm:hidden">Импорт</span>
            <span className="hidden sm:inline">Импорт</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            aria-label="Импорт"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImportFile(file);
              e.target.value = '';
            }}
          />
        </div>
      </header>
      {message && (
        <div
          role="status"
          className="border-b border-[color:var(--border)] px-4 py-2 text-sm text-[color:var(--text-secondary)] sm:px-6"
        >
          {message}
        </div>
      )}
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
