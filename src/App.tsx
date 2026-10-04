import { lazy, Suspense, useEffect, useState } from 'react';
import { ui } from '@/content/content';
import { LanguageProvider, useLang } from '@/lib/i18n';
import { startSmoothScroll } from '@/lib/scroll';
import { About } from './components/About';
import { Contact, Footer, Motto, SoonPanels } from './components/Closing';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Hatch, Rule } from './components/primitives';
import { Projects } from './components/Projects';
import { ScrollIndex } from './components/ScrollIndex';
import { SecurityCorner } from './components/SecurityCorner';
import { BuiltWith, Stack } from './components/Stack';

const BriefForm = lazy(() => import('./components/BriefForm'));

/** Mounts the project brief on demand (menu, buttons, or a #brief link). */
function BriefHost(): JSX.Element | null {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = (): void => setOpen(true);
    if (window.location.hash === '#brief') show();
    const onHash = (): void => {
      if (window.location.hash === '#brief') show();
    };
    window.addEventListener('fb:brief', show);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('fb:brief', show);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);
  if (!open) return null;
  return (
    <Suspense fallback={null}>
      <BriefForm
        onClose={() => {
          setOpen(false);
          if (window.location.hash === '#brief') history.replaceState(null, '', window.location.pathname + window.location.search);
        }}
      />
    </Suspense>
  );
}

function Page(): JSX.Element {
  const { t } = useLang();

  useEffect(() => {
    let stop: (() => void) | undefined;
    void startSmoothScroll().then((s) => (stop = s));
    return () => stop?.();
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        {t(ui.skip)}
      </a>
      <Header />
      <ScrollIndex />
      <BriefHost />
      <main id="main" className="page">
        <div className="frame">
          <Hero />
          <Rule />
          <About />
          <Hatch />
          <Projects />
          <Hatch />
          <SecurityCorner />
          <Rule />
          <Stack />
          <Hatch />
          <BuiltWith />
          <Hatch />
          <SoonPanels />
          <Hatch />
          <Motto />
          <Rule />
          <Contact />
          <Rule />
          <Footer />
        </div>
      </main>
    </>
  );
}

export function App(): JSX.Element {
  return (
    <LanguageProvider>
      <Page />
    </LanguageProvider>
  );
}
