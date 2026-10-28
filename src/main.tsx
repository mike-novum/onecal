import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import { router } from './router.tsx';

registerSW({ immediate: true });

const rootElement = document.getElementById('root')!;

function dismissSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  if (
    getComputedStyle(splash).display === 'none' ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    splash.remove();
    return;
  }
  splash.setAttribute('data-hide', '');
  const remove = () => splash.remove();
  splash.addEventListener('transitionend', remove, { once: true });
  window.setTimeout(remove, 400);
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

const splash = document.getElementById('splash');
if (splash) {
  const observer = new MutationObserver(() => {
    if (rootElement.childElementCount === 0) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (rootElement.childElementCount === 0) return;
        observer.disconnect();
        dismissSplash();
      }),
    );
  });
  observer.observe(rootElement, { childList: true });
}
