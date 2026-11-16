import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { triggerHaptic } from './haptic';

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('вызывает navigator.vibrate(10) для light', () => {
  const vibrate = vi.fn().mockReturnValue(true);
  vi.stubGlobal('navigator', { vibrate });

  triggerHaptic('light');

  expect(vibrate).toHaveBeenCalledTimes(1);
  expect(vibrate).toHaveBeenCalledWith(10);
});

test('вызывает navigator.vibrate([10, 30, 15]) для success', () => {
  const vibrate = vi.fn().mockReturnValue(true);
  vi.stubGlobal('navigator', { vibrate });

  triggerHaptic('success');

  expect(vibrate).toHaveBeenCalledTimes(1);
  expect(vibrate).toHaveBeenCalledWith([10, 30, 15]);
});

test('по умолчанию использует light', () => {
  const vibrate = vi.fn().mockReturnValue(true);
  vi.stubGlobal('navigator', { vibrate });

  triggerHaptic();

  expect(vibrate).toHaveBeenCalledWith(10);
});

test('безопасно завершается, если navigator.vibrate отсутствует', () => {
  vi.stubGlobal('navigator', {});

  expect(() => triggerHaptic('light')).not.toThrow();
});

test('безопасно перехватывает ошибку, если navigator.vibrate бросает исключение', () => {
  const vibrate = vi.fn().mockImplementation(() => {
    throw new Error('Not allowed');
  });
  vi.stubGlobal('navigator', { vibrate });

  expect(() => triggerHaptic('light')).not.toThrow();
});
