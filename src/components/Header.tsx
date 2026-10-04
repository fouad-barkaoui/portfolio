import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';
import { ui } from '@/content/content';
import { useLang } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { scrollToId } from '@/lib/scroll';
import { Logo } from './Logo';

const LINKS = [
  { id: 'about', label: ui.nav.about },
  { id: 'work', label: ui.nav.work },
  { id: 'security', label: ui.nav.security },
  { id: 'stack', label: ui.nav.stack },
  { id: 'contact', label: ui.nav.contact },
] as const;

export function Header(): JSX.Element {
  const { t, toggle: toggleLang, lang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="site-header" data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <div className="site-header-inner">
        <a href="#top" className="brand" onClick={go('top')} aria-label={t(ui.home)}>
          <Logo size={36} />
        </a>

        <nav className="nav" aria-label={lang === 'ar' ? 'التنقّل الرئيسي' : 'Main'}>
          <ul id="site-nav">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={go(l.id)}>
                  {t(l.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-tools">
          <button type="button" className="lang-btn" onClick={toggleLang} title={t(ui.langSwitchAria)}>
            <span lang={lang === 'en' ? 'ar' : 'en'}>{t(ui.langSwitch)}</span>
            <span className="sr-only"> — {t(ui.langSwitchAria)}</span>
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t(ui.themeToLight) : t(ui.themeToDark)}
            title={theme === 'dark' ? t(ui.themeToLight) : t(ui.themeToDark)}
          >
            {theme === 'dark' ? <Sun size={16} strokeWidth={1.8} aria-hidden /> : <Moon size={16} strokeWidth={1.8} aria-hidden />}
          </button>
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? t(ui.close) : t(ui.menu)}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={17} strokeWidth={1.8} aria-hidden /> : <Menu size={17} strokeWidth={1.8} aria-hidden />}
          </button>
        </div>
      </div>
    </header>
  );
}
