import { Moon, Sun, FilePenLine } from 'lucide-react';
import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react';
import { briefUi } from '@/content/brief';
import { ui } from '@/content/content';
import { openBrief } from '@/lib/brief';
import { useLang } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { lockScroll } from '@/lib/scroll';
import { navigateTo } from '@/lib/wipe';
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
  const { shown: theme, toggle: toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Header glass once the page moves, and which section is under the header.
  useEffect(() => {
    let frame = 0;
    const update = (): void => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      let current: string | null = null;
      for (const l of LINKS) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top <= 140) current = l.id;
      }
      setActive(current);
    };
    const onScroll = (): void => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // The open menu holds the page still.
  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

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
    void navigateTo(id);
  };

  return (
    <>
    <div className="nav-overlay" data-open={open || undefined} onClick={() => setOpen(false)} aria-hidden />
    <header className="site-header" data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <div className="site-header-inner">
        <a href="#top" className="brand" onClick={go('top')} aria-label={t(ui.home)}>
          <Logo size={36} />
        </a>

        <nav className="nav" aria-label={lang === 'ar' ? 'التنقّل الرئيسي' : 'Main'}>
          <ul id="site-nav">
            {LINKS.map((l, i) => (
              <li key={l.id} style={{ '--i': i } as CSSProperties}>
                <a href={`#${l.id}`} onClick={go(l.id)} data-active={active === l.id || undefined} aria-current={active === l.id ? 'location' : undefined}>
                  <span className="roll">
                    <span>{t(l.label)}</span>
                    <span aria-hidden>{t(l.label)}</span>
                  </span>
                </a>
              </li>
            ))}
            <li className="nav-brief" style={{ '--i': LINKS.length } as CSSProperties}>
              <a
                href="#brief"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  openBrief();
                }}
              >
                <FilePenLine size={17} strokeWidth={1.9} aria-hidden />
                {t(briefUi.menu)}
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-tools">
          <a
            href="#brief"
            className="brief-btn"
            onClick={(e) => {
              e.preventDefault();
              openBrief();
            }}
          >
            <FilePenLine size={15} strokeWidth={2} aria-hidden />
            {t(briefUi.menu)}
          </a>
          <button type="button" className="lang-btn" onClick={toggleLang} title={t(ui.langSwitchAria)}>
            <span lang={lang === 'en' ? 'ar' : 'en'}>{t(ui.langSwitch)}</span>
            <span className="sr-only">: {t(ui.langSwitchAria)}</span>
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
            <span className="burger" aria-hidden>
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>
    </header>
    </>
  );
}
