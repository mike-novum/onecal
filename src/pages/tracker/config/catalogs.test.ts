import { expect, test } from 'vitest';
import { ALCOHOL_ITEMS, FASTFOOD_ITEMS } from './catalogs';

test('id позиций уникальны в каждом справочнике', () => {
  for (const catalog of [ALCOHOL_ITEMS, FASTFOOD_ITEMS]) {
    const ids = catalog.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  }
});

test('у каждой позиции непустые emoji и label', () => {
  for (const catalog of [ALCOHOL_ITEMS, FASTFOOD_ITEMS]) {
    for (const item of catalog) {
      expect(item.emoji.length).toBeGreaterThan(0);
      expect(item.label.length).toBeGreaterThan(0);
    }
  }
});

test('в ALCOHOL_ITEMS есть beer с эмодзи 🍺', () => {
  expect(ALCOHOL_ITEMS.find((item) => item.id === 'beer')?.emoji).toBe('🍺');
});

test('в FASTFOOD_ITEMS есть pizza с эмодзи 🧀 (замена: в Unicode нет эмодзи пиццы)', () => {
  expect(FASTFOOD_ITEMS.find((item) => item.id === 'pizza')?.emoji).toBe('🧀');
});
