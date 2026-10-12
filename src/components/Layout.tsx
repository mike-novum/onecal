import { memo, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { exportSnapshot, parseImport } from '../lib/importExport';
import { todayISO } from '../lib/dates';
import { useScrollOpacity } from '../lib/useScrollOpacity';
import { useAppStore } from '../store/useAppStore';
import { accentForPath, applyAccentToDocument } from '../theme';
import { ScrollBackdrop } from './ScrollBackdrop';

const TOOLBAR_BLEED_PX = 200;
const HEADER_SOLID_PX = 60;
const BACKDROP_FADE_PX = 140;

const backdropStyle = {
  marginBottom: -BACKDROP_FADE_PX,
  height: BACKDROP_FADE_PX,
  '--backdrop-solid': `${HEADER_SOLID_PX}px`,
} as CSSProperties;

const SiteHeader = memo(function SiteHeader({
  onExport,
  onImportFile,
}: {
  onExport: () => void;
  onImportFile: (file: File) => void;
}) {
  const opacity = useScrollOpacity();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3"
      style={{
        backgroundColor: `color-mix(in srgb, var(--bg-base) ${opacity * 100}%, transparent)`,
      }}
    >
      <span className="shrink-0 text-base font-bold tracking-tight gradient-text sm:text-lg">OneCal</span>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onExport}
          aria-label="Экспорт"
          title="Экспорт"
          className="flex h-9 items-center gap-1.5 rounded-xl border border-[color:var(--border)] px-3 text-sm text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
          style={{ background: 'var(--bg-elevated)' }}
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
          onClick={() => fileInputRef.current?.click()}
          aria-label="Импорт"
          title="Импорт"
          className="flex h-9 items-center gap-1.5 rounded-xl border border-[color:var(--border)] px-3 text-sm text-[color:var(--text-secondary)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--bg-elevated-2)] hover:text-[color:var(--text-primary)]"
          style={{ background: 'var(--bg-elevated)' }}
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
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          aria-label="Импорт"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportFile(file);
            e.target.value = '';
          }}
        />
      </div>
    </header>
  );
});

export const Layout = memo(function Layout() {
  const location = useLocation();
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
    <div className="flow-root min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none sticky z-[5]"
        style={{
          top: -TOOLBAR_BLEED_PX,
          height: TOOLBAR_BLEED_PX,
          marginTop: -TOOLBAR_BLEED_PX,
          backgroundColor: 'var(--bg-base)',
        }}
      />
      <div aria-hidden className="pointer-events-none sticky top-0 z-[5]" style={backdropStyle}>
        <ScrollBackdrop />
      </div>
      <SiteHeader onExport={handleExport} onImportFile={(file) => void handleImportFile(file)} />
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
});
