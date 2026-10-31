export type AccentKind = 'alcohol' | 'fastfood' | 'pills';

export interface AccentPalette {
  primary: string;
  secondary: string;
}

export const ACCENT_PALETTES: Record<AccentKind, AccentPalette> = {
  alcohol: { primary: '#5b8def', secondary: '#7b6df5' },
  fastfood: { primary: '#ff8a4c', secondary: '#ffb14c' },
  pills: { primary: '#f472b6', secondary: '#c084fc' },
};

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function applyAccentToDocument(kind: AccentKind) {
  const palette = ACCENT_PALETTES[kind];
  const root = document.documentElement;
  root.style.setProperty('--accent', palette.primary);
  root.style.setProperty('--accent-2', palette.secondary);
  const [r, g, b] = hexToRgb(palette.primary);
  root.style.setProperty('--accent-soft', `rgba(${r}, ${g}, ${b}, 0.16)`);
  root.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.32)`);
}

export function accentForPath(pathname: string): AccentKind {
  if (pathname.startsWith('/fastfood')) return 'fastfood';
  if (pathname.startsWith('/pills')) return 'pills';
  return 'alcohol';
}
