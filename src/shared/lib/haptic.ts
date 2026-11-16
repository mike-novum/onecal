export type HapticType = 'light' | 'success';

export function triggerHaptic(type: HapticType = 'light'): void {
  try {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
      return;
    }
    if (type === 'success') {
      navigator.vibrate([10, 30, 15]);
    } else {
      navigator.vibrate(10);
    }
  } catch {
    return;
  }
}
