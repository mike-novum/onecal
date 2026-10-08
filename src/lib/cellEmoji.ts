import type { CatalogItem, DayLog } from '../types';

export function getCellEmoji(log: DayLog | undefined, catalog: CatalogItem[]): string | null {
  if (!log) return null;
  if (log.wasBad) return '🤮';
  if (log.items.length === 0) return null;
  if (log.items.length === 1) {
    const item = catalog.find((c) => c.id === log.items[0]);
    return item ? item.emoji : '🎉';
  }
  return '🎉';
}
