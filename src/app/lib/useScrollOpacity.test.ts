import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useScrollOpacity } from './useScrollOpacity';

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value, writable: true });
  window.dispatchEvent(new Event('scroll'));
}

function flushRaf() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

beforeEach(() => {
  setScrollY(0);
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('на вершине страницы opacity равен 0', () => {
  setScrollY(0);
  const { result } = renderHook(() => useScrollOpacity(60));
  expect(result.current).toBe(0);
});

test('opacity растёт пропорционально scrollY и ограничен 1', async () => {
  setScrollY(0);
  const { result } = renderHook(() => useScrollOpacity(60));

  await act(async () => {
    setScrollY(30);
    await flushRaf();
  });
  expect(result.current).toBeCloseTo(0.5, 5);

  await act(async () => {
    setScrollY(60);
    await flushRaf();
  });
  expect(result.current).toBe(1);

  await act(async () => {
    setScrollY(1000);
    await flushRaf();
  });
  expect(result.current).toBe(1);
});

test('throttle через requestAnimationFrame не вызывает лишних обновлений', async () => {
  const { result } = renderHook(() => useScrollOpacity(60));

  await act(async () => {
    setScrollY(10);
    setScrollY(20);
    setScrollY(30);
    await flushRaf();
  });

  expect(result.current).toBeCloseTo(30 / 60, 5);
});
