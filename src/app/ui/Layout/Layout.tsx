import { memo, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { exportSnapshot, parseImport } from '../../lib/importExport';
import { todayISO } from '@/shared/lib';
import { useAppStore } from '@/shared/model';
import { accentForPath, applyAccentToDocument } from '../../lib/theme';
import { useScrollOpacity } from '../../lib/useScrollOpacity';
import { ScrollBackdrop } from '../ScrollBackdrop';
import { Sidebar } from '@/shared/ui/Sidebar';

const BACKDROP_BLEED_PX = 140;
const BACKDROP_FADE_PX = 100;

export const Layout = memo(function Layout() {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const alcohol = useAppStore((s) => s.alcohol);
  const fastfood = useAppStore((s) => s.fastfood);
  const pillCourses = useAppStore((s) => s.pillCourses);
  const mood = useAppStore((s) => s.mood);
  const importData = useAppStore((s) => s.importData);
  const scrollOpacity = useScrollOpacity();
  const backdropOpacity = Math.min(scrollOpacity, 0.99);

  useEffect(() => {
    applyAccentToDocument(accentForPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  function handleExport() {
    const blob = new Blob([exportSnapshot({ alcohol, fastfood, pillCourses, mood })], {
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

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block sticky top-0 h-screen">
        <Sidebar onExport={handleExport} onImport={handleImportClick} />
      </div>

      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'var(--bg-overlay)' }}
        onClick={closeMobileMenu}
      />

      <div
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          boxShadow: mobileMenuOpen ? 'var(--shadow-lg)' : 'none',
        }}
      >
        <Sidebar
          onExport={() => {
            handleExport();
            closeMobileMenu();
          }}
          onImport={() => {
            handleImportClick();
            closeMobileMenu();
          }}
          onNavClick={closeMobileMenu}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-30 flex items-center gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3 lg:hidden">
          <button
            type="button"
            aria-label="Открыть меню"
            aria-expanded={mobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)] text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
            style={{ background: 'var(--bg-elevated)' }}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <svg
              aria-hidden
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex shrink-0 items-baseline gap-1.5">
            <span className="text-base font-bold tracking-tight gradient-text">OneCal</span>
            <span className="text-xs text-[color:var(--text-muted)]">v{__APP_VERSION__}</span>
          </div>

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
        </header>

        {message && (
          <div
            role="status"
            className="border-b border-[color:var(--border)] px-4 py-2 text-sm text-[color:var(--text-secondary)] sm:px-6"
          >
            {message}
          </div>
        )}

        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 z-[5] transition-opacity duration-200 ease-out"
          style={{
            top: -BACKDROP_BLEED_PX,
            height: BACKDROP_BLEED_PX + BACKDROP_FADE_PX,
            opacity: backdropOpacity,
          }}
        >
          <div
            className="absolute inset-x-0 top-0"
            style={{ height: BACKDROP_BLEED_PX, background: 'var(--bg-base)' }}
          />
          <div className="absolute inset-x-0 bottom-0" style={{ height: BACKDROP_FADE_PX }}>
            <ScrollBackdrop opacity={1} />
          </div>
        </div>

        <main className="px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
});
