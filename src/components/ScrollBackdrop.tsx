import { memo } from 'react';
import { useScrollOpacity } from '../lib/useScrollOpacity';

interface ScrollBackdropProps {
  /**
   * Расстояние в пикселях, на котором opacity доходит до 1.
   * По умолчанию 60 — хватает, чтобы фон проявился за пару строк контента.
   */
  maxScroll?: number;
}

/**
 * Абсолютно позиционированная подложка с градиентом от `var(--bg-base)`
 * к прозрачному. Должна быть первым ребёнком элемента с `position: sticky`,
 * чтобы «притенять» контент, который прокручивается под шапкой или
 * переключателем месяца. Не блокирует клики и невидима для скринридеров.
 */
export const ScrollBackdrop = memo(function ScrollBackdrop({ maxScroll = 60 }: ScrollBackdropProps) {
  const opacity = useScrollOpacity(maxScroll);

  return (
    <div
      aria-hidden
      data-scroll-opacity={opacity.toFixed(3)}
      className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-200 ease-out"
      style={{
        opacity,
        background: 'linear-gradient(to bottom, var(--bg-base), transparent)',
      }}
    />
  );
});
