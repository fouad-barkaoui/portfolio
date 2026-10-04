import { StrictMode, startTransition } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/source-sans-3';
import '@fontsource-variable/unbounded';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource/caveat/latin-500.css';
import '@fontsource/anton/latin-400.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-400.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-600.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-700.css';
import './styles/index.css';
import { App } from './App';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The HTML is prerendered in English: hydrate it once the first paint is
// done (it is already readable), or render fresh for Arabic.
const start = (): void => {
  // A transition lets React hydrate in small slices instead of one long task.
  if (container.hasChildNodes() && document.documentElement.lang !== 'ar') startTransition(() => void hydrateRoot(container, app));
  else createRoot(container).render(app);
};
if (document.documentElement.lang === 'ar' || !container.hasChildNodes()) start();
else if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(start, { timeout: 1200 });
else window.setTimeout(start, 200);

// The intro plays once; later re-mounts (e.g. a language switch) stay still.
window.setTimeout(() => document.documentElement.classList.remove('intro'), 2600);
