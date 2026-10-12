import { useEffect, useState } from 'react';

export function useFixedTopGap(): number {
  const [gap, setGap] = useState(0);

  useEffect(() => {
    const probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText =
      'position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;visibility:hidden';
    document.body.appendChild(probe);

    let frame = 0;

    function update() {
      frame = 0;
      const next = Math.max(0, Math.round(probe.getBoundingClientRect().top));
      setGap((prev) => (prev === next ? prev : next));
    }

    function schedule() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    update();
    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', schedule);
    viewport?.addEventListener('scroll', schedule);
    window.addEventListener('resize', schedule);

    return () => {
      probe.remove();
      viewport?.removeEventListener('resize', schedule);
      viewport?.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return gap;
}
