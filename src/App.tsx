import { useEffect } from 'react';
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
