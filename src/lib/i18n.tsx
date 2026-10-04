import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ui, type L, type Lang } from '@/content/content';

const STORAGE_KEY = 'fb.lang';

function initialLang(): Lang {
  if (typeof document === 'undefined') return 'en';
  // The pre-paint script in index.html already resolved ?lang= and storage.
  return document.documentElement.lang === 'ar' ? 'ar' : 'en';
}

interface LangCtx {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  t: (s: L) => string;
  toggle: () => void;
}

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = ui.meta.title[lang];
    document.querySelector('meta[name="description"]')?.setAttribute('content', ui.meta.description[lang]);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage can be blocked — the choice just won't be remembered */
    }
    const url = new URL(window.location.href);
    if (lang === 'ar') url.searchParams.set('lang', 'ar');
    else url.searchParams.delete('lang');
    window.history.replaceState(null, '', url);
  }, [lang]);

  const t = useCallback((s: L) => s[lang], [lang]);
  const toggle = useCallback(() => setLang((p) => (p === 'en' ? 'ar' : 'en')), []);
  const value = useMemo<LangCtx>(() => ({ lang, dir: lang === 'ar' ? 'rtl' : 'ltr', t, toggle }), [lang, t, toggle]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLang must be used inside <LanguageProvider>');
  return v;
}

/** Renders a phrase, turning its <b>…</b> parts into <strong>. */
export function Rich({ text }: { text: string }): JSX.Element {
  return (
    <>
      {text.split(/<b>(.*?)<\/b>/).map((part, k) => (k % 2 ? <strong key={k}>{part}</strong> : <Fragment key={k}>{part}</Fragment>))}
    </>
  );
}
