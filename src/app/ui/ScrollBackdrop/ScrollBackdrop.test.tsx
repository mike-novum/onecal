import { render } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { ScrollBackdrop } from './ScrollBackdrop';

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value, writable: true });
  window.dispatchEvent(new Event('scroll'));
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

test('рендерится как скрытый от скринридера абсолютный слой', () => {
  const { container } = render(
    <div style={{ position: 'sticky' }}>
      <ScrollBackdrop />
    </div>,
  );
  const backdrop = container.querySelector('[data-scroll-opacity]') as HTMLElement | null;
  expect(backdrop).not.toBeNull();
  expect(backdrop!.getAttribute('aria-hidden')).toBe('true');
  expect(backdrop!.className).toContain('pointer-events-none');
  expect(backdrop!.className).toContain('absolute');
  expect(backdrop!.className).toContain('inset-0');
});

test('на вершине страницы data-scroll-opacity равен 0', () => {
  setScrollY(0);
  const { container } = render(
    <div>
      <ScrollBackdrop maxScroll={60} />
    </div>,
  );
  const backdrop = container.querySelector('[data-scroll-opacity]') as HTMLElement | null;
  expect(backdrop!.getAttribute('data-scroll-opacity')).toBe('0.000');
});
