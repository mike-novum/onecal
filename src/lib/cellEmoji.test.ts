import { expect, test } from 'vitest';
import { ALCOHOL_ITEMS } from '../data/catalogs';
import { getCellEmoji } from './cellEmoji';

const catalog = ALCOHOL_ITEMS;

test('нет записи — null', () => {
  expect(getCellEmoji(undefined, catalog)).toBe(null);
});

test('пустой лог без wasBad — null', () => {
  expect(getCellEmoji({ items: [], wasBad: false }, catalog)).toBe(null);
});

test('одна позиция — эмодзи позиции', () => {
  expect(getCellEmoji({ items: ['beer'], wasBad: false }, catalog)).toBe('🍺');
});

test('несколько позиций — 🎉', () => {
  expect(getCellEmoji({ items: ['beer', 'wine'], wasBad: false }, catalog)).toBe('🎉');
});

test('wasBad с пустым списком — 🤮', () => {
  expect(getCellEmoji({ items: [], wasBad: true }, catalog)).toBe('🤮');
});

test('wasBad имеет приоритет над эмодзи позиций', () => {
  expect(getCellEmoji({ items: ['beer'], wasBad: true }, catalog)).toBe('🤮');
});

test('неизвестный id позиции — безопасный фолбэк 🎉', () => {
  expect(getCellEmoji({ items: ['unknown-id'], wasBad: false }, catalog)).toBe('🎉');
});
