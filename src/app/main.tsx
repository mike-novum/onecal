import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import './styles/index.css';
import { router } from './router.tsx';

registerSW({ immediate: true });

const rootElement = document.getElementById('root')!;

function dismissSplash() {
  document.getElementById('splash')?.remove();
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

const splash = document.getElementById('splash');
if (splash && getComputedStyle(splash).display === 'none') {
  dismissSplash();
} else if (splash && document.readyState === 'complete') {
  requestAnimationFrame(dismissSplash);
} else if (splash) {
  window.addEventListener('load', () => requestAnimationFrame(dismissSplash), { once: true });
}
