import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
const STORAGE_KEY = 'fb.theme';

function current(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/** Dark by default; the pre-paint script in index.html applies a saved choice. */
export function useTheme(): { theme: Theme; shown: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(current);
  // The prerendered page is dark, so the first client render must match it;
  // anything drawn from the saved theme waits until after hydration.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#fbfbfa' : '#06070b');
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, shown: hydrated ? theme : 'dark', toggle };
}
