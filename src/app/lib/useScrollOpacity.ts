import { useEffect, useState } from 'react';

/**
 * Возвращает число от 0 до 1, растущее пропорционально `window.scrollY`.
 * Используется, чтобы плавно «проявлять» подложку под sticky-элементами
 * (шапка, переключатель месяца) при прокрутке страницы.
 *
 * @param maxScroll расстояние в пикселях, на котором opacity доходит до 1
 */
export function useScrollOpacity(
  maxScroll = 60,
  targetRef?: React.RefObject<HTMLElement | null>,
): number {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let frame = 0;
    const target = targetRef?.current;

    function update() {
      frame = 0;
      const y = target ? target.scrollTop : window.scrollY;
      const next = Math.max(0, Math.min(1, y / maxScroll));
      setOpacity(next);
    }

    function onScroll() {
      // Throttle до одного обновления на кадр — избегаем лишних ререндеров
      // при активной прокрутке.
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    update();
    const eventTarget = target ?? window;
    eventTarget.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      eventTarget.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [maxScroll, targetRef]);

  return opacity;
}
