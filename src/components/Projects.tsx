import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Maximize2, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import arabicRtl from '@/assets/kanz/arabic-rtl.avif?w=600;1000;1600&format=avif;webp&as=picture';
import newsDark from '@/assets/kanz/news-dark.avif?w=800;1400;2400&format=avif;webp&as=picture';
import salaryLight from '@/assets/kanz/salary-light.avif?w=600;1000;1600&format=avif;webp&as=picture';
import startHere from '@/assets/kanz/start-here.avif?w=600;1000;1600&format=avif;webp&as=picture';
import createReport from '@/assets/assas/create-report.avif?w=600;1000;1600&format=avif;webp&as=picture';
import offlineInstall from '@/assets/assas/offline-install.avif?w=600;1040&format=avif;webp&as=picture';
import repoMap from '@/assets/assas/repo-map.avif?w=600;1000;1472&format=avif;webp&as=picture';
import reportSummary from '@/assets/assas/report-summary.avif?w=800;1472&format=avif;webp&as=picture';
import scanSweep from '@/assets/assas/scan-sweep.avif?w=800;1472&format=avif;webp&as=picture';
import promptCrawl from '@/assets/prompt/crawl.avif?w=800;1400;2400&format=avif;webp&as=picture';
import promptFlow from '@/assets/prompt/flow.avif?w=600;1000;1800&format=avif;webp&as=picture';
import promptPaste from '@/assets/prompt/paste.avif?w=600;1000;1800&format=avif;webp&as=picture';
import promptReport from '@/assets/prompt/report.avif?w=600;1000;1800&format=avif;webp&as=picture';
import studioCompare from '@/assets/studio/compare.avif?w=800;1400;2400&format=avif;webp&as=picture';
import studioHome from '@/assets/studio/home.avif?w=800;1400;2400&format=avif;webp&as=picture';
import studioKeywords from '@/assets/studio/keyword-scan.avif?w=600;1000;1800&format=avif;webp&as=picture';
import studioParse from '@/assets/studio/parse-check.avif?w=600;1000;1800&format=avif;webp&as=picture';
import studioXyz from '@/assets/studio/xyz-rewrite.avif?w=600;1000;1800&format=avif;webp&as=picture';
import {
  assasScreens,
  diagrams,
  kanzScreens,
  projects,
  promptScreens,
  studioScreens,
  tagLabels,
  ui,
  type L,
  type Project,
  type Screen,
} from '@/content/content';
import { useLang } from '@/lib/i18n';
import { formatDuration, formatMonth, useNow } from '@/lib/time';
import { Diagram } from './Diagram';
import { Lightbox, type LightboxShot } from './Lightbox';
import { Picture } from './Picture';
import { SectionHead, Status } from './primitives';

type ShotId =
  | (typeof kanzScreens)[number]['id']
  | (typeof assasScreens)[number]['id']
  | (typeof studioScreens)[number]['id']
  | (typeof promptScreens)[number]['id'];

const SHOT_PICS: Record<ShotId, ImagetoolsPicture> = {
  'news-dark': newsDark,
  'arabic-rtl': arabicRtl,
  'salary-light': salaryLight,
  'start-here': startHere,
  'report-summary': reportSummary,
  'scan-sweep': scanSweep,
  'repo-map': repoMap,
  'create-report': createReport,
  'offline-install': offlineInstall,
  'prompt-crawl': promptCrawl,
  'prompt-paste': promptPaste,
  'prompt-report': promptReport,
  'prompt-flow': promptFlow,
  'studio-compare': studioCompare,
  'studio-home': studioHome,
  'studio-parse': studioParse,
  'studio-keywords': studioKeywords,
  'studio-xyz': studioXyz,
};

/** Real screenshots per case study, and the heading above them. */
const SCREENS: Record<Project['id'], { title: L; list: readonly (Screen & { id: ShotId })[] }> = {
  kanz: { title: ui.project.screens, list: kanzScreens },
  prompt: { title: ui.project.screens, list: promptScreens },
  studio: { title: ui.project.screensSample, list: studioScreens },
  assas: { title: ui.project.screensScan, list: assasScreens },
};

const STATUS_LABEL: Record<Project['status'], L> = {
  live: ui.project.statusLive,
  local: ui.project.statusLocal,
  dev: ui.project.statusDev,
};

function tagText(tag: string, t: (s: L) => string): string {
  const label = tagLabels[tag];
  return label ? t(label) : tag;
}

function CaseStudy({ p, index, onNext }: { p: Project; index: number; onNext: () => void }): JSX.Element {
  const { t, lang } = useLang();
  const now = useNow(3_600_000);
  const concept = p.status === 'dev';
  const shots = SCREENS[p.id];
  const [zoom, setZoom] = useState<number | null>(null);
  const gallery: LightboxShot[] = shots.list.map((s) => ({ pic: SHOT_PICS[s.id], alt: t(s.alt), caption: t(s.caption) }));

  return (
    <article className="case" aria-labelledby={`case-${p.id}`}>
      <header className="case-head">
        <div className="case-title-row">
          <span className="case-index mono" aria-hidden>
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 id={`case-${p.id}`} className="case-name">
            {p.name}
          </h3>
          <Status tone={p.status === 'dev' ? 'dev' : 'live'}>{t(STATUS_LABEL[p.status])}</Status>
        </div>
        <p className="case-role">{t(p.role)}</p>
        <p className="case-meta mono">
          <span>{t(p.kind)}</span>
          <span>{t(p.where)}</span>
          <span dir="ltr">
            {formatMonth(p.start)} – {t(ui.project.present)}
          </span>
          {now ? <span>{formatDuration(p.start, now, lang)}</span> : null}
        </p>
        {p.url ? (
          <a className="btn btn-ghost btn-sm" href={p.url} target="_blank" rel="noopener noreferrer">
            {t(ui.project.visit)} {p.name}
            <span className="mono url">{p.url.replace(/^https?:\/\//, '')}</span>
            <ArrowUpRight className="flip-rtl" size={15} strokeWidth={1.9} aria-hidden />
          </a>
        ) : null}
      </header>

      <div className="case-grid">
        <section className="case-block span-2">
          <h4 className="block-title mono">
            <span>A</span> {t(ui.project.problem)}
          </h4>
          <p className="lead">{t(p.problem)}</p>
        </section>

        <section className="case-block split-start">
          <h4 className="block-title mono">
            <span>B</span> {t(ui.project.does)}
          </h4>
          <ul className="points">
            {p.does.map((d) => (
              <li key={d.en}>{t(d)}</li>
            ))}
          </ul>
        </section>

        <section className="case-block">
          <h4 className="block-title mono">
            <span>C</span> {t(ui.project.built)}
          </h4>
          <p>{t(p.built)}</p>
          <ul className="tags" aria-label="Tags">
            {p.tags.map((tag) => (
              <li key={tag} className="tag mono">
                {tagText(tag, t)}
              </li>
            ))}
          </ul>
        </section>

        <div className="case-block span-2 flush">
          <Diagram
            data={diagrams[p.id]}
            label={concept ? t(ui.project.concept) : t(ui.project.architecture)}
            concept={concept}
          />
        </div>

        <section className="case-block span-2 flush" aria-label={t(shots.title)}>
          <h4 className="block-title mono">
            <span>↳</span> {t(shots.title)}
          </h4>
          <ul className="shots">
            {shots.list.map((s, i) => (
              <li key={s.caption.en} className="shot" data-wide={s.wide || undefined}>
                <figure>
                  <button type="button" className="shot-frame" onClick={() => setZoom(i)} aria-haspopup="dialog">
                    <span className="shot-dots" aria-hidden>
                      <i />
                      <i />
                      <i />
                      <span className="shot-zoom">
                        <Maximize2 size={12} strokeWidth={2.2} />
                      </span>
                    </span>
                    <Picture
                      pic={SHOT_PICS[s.id]}
                      alt={t(s.alt)}
                      sizes={s.wide ? '(min-width: 1100px) 1000px, 92vw' : '(min-width: 1100px) 330px, (min-width: 700px) 30vw, 92vw'}
                    />
                    <span className="sr-only">{t(ui.project.zoom)}</span>
                  </button>
                  <figcaption className="mono">{t(s.caption)}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          {zoom !== null ? <Lightbox shots={gallery} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} /> : null}
        </section>

        <section className="case-block split-start">
          <h4 className="block-title mono">
            <span>D</span> {t(ui.project.security)}
          </h4>
          <ul className="checks">
            {p.security.map((s) => (
              <li key={s.en}>
                <ShieldCheck size={16} strokeWidth={1.8} aria-hidden />
                <span>{t(s)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="case-block">
          <h4 className="block-title mono">
            <span>E</span> {t(ui.project.status)}
          </h4>
          <p>{t(p.statusNote)}</p>
          {p.shipped ? (
            <>
              <p className="sub-title">{t(p.status === 'live' ? ui.project.shipped : ui.project.working)}</p>
              <ul className="shipped">
                {p.shipped.map((s) => (
                  <li key={s.en}>
                    <Check size={14} strokeWidth={2.2} aria-hidden />
                    <span>{t(s)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>
      <NextCase index={index} onNext={onNext} />
    </article>
  );
}

/** End-of-slide link to the next case study (wraps to the first). */
function NextCase({ index, onNext }: { index: number; onNext: () => void }): JSX.Element {
  const { t } = useLang();
  const next = projects[(index + 1) % projects.length]!;
  return (
    <button type="button" className="case-next" onClick={onNext}>
      <span className="case-next-label mono">{t(ui.project.nextProject)}</span>
      <span className="case-next-name">{next.name}</span>
      <ArrowRight className="flip-rtl" size={20} strokeWidth={2} aria-hidden />
    </button>
  );
}

/**
 * The case studies as a swipeable carousel: native scroll-snap does the
 * swiping (touch, trackpad, shift+wheel), tabs and arrows drive it too, and
 * the track takes the height of the slide on screen so short slides don't
 * leave a gap. Slides off screen are inert, so focus never lands in them.
 */
export function Projects(): JSX.Element {
  const { t, lang } = useLang();
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const frame = useRef(0);

  const show = useCallback((i: number, smooth = true) => {
    const tr = track.current;
    const el = slides.current[i];
    if (!tr || !el) return;
    const delta = el.getBoundingClientRect().left - tr.getBoundingClientRect().left;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    tr.scrollBy({ left: delta, behavior: smooth && !reduce ? 'smooth' : 'auto' });
    setActive(i);
  }, []);

  // Which slide is on screen, from the track's scroll position.
  useEffect(() => {
    const tr = track.current;
    if (!tr) return;
    const onScroll = (): void => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const left = tr.getBoundingClientRect().left;
        let best = 0;
        let dist = Infinity;
        slides.current.forEach((el, i) => {
          if (!el) return;
          const d = Math.abs(el.getBoundingClientRect().left - left);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    tr.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      tr.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  // Track height follows the visible slide; the others are inert.
  useEffect(() => {
    const el = slides.current[active];
    slides.current.forEach((s, i) => {
      if (s) s.inert = i !== active;
    });
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    setHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, [active]);

  // Keep the slide in place when the layout direction or width changes.
  useEffect(() => {
    const onResize = (): void => show(active, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active, show]);
  useEffect(() => {
    show(active, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Links elsewhere on the page (index, recruiter card) ask for a case by id.
  useEffect(() => {
    const onCase = (e: Event): void => {
      const id = (e as CustomEvent<string>).detail;
      const i = projects.findIndex((p) => `case-${p.id}` === id);
      if (i >= 0) show(i, false);
    };
    window.addEventListener('fb:case', onCase);
    return () => window.removeEventListener('fb:case', onCase);
  }, [show]);

  const goTo = (i: number, toTop = false): void => {
    const n = (i + projects.length) % projects.length;
    show(n);
    if (toTop && bar.current && bar.current.getBoundingClientRect().top < 0) {
      bar.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const onTabsKey = (e: React.KeyboardEvent): void => {
    const fwd = lang === 'ar' ? 'ArrowLeft' : 'ArrowRight';
    const back = lang === 'ar' ? 'ArrowRight' : 'ArrowLeft';
    let n = -1;
    if (e.key === fwd) n = (active + 1) % projects.length;
    else if (e.key === back) n = (active - 1 + projects.length) % projects.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = projects.length - 1;
    if (n < 0) return;
    e.preventDefault();
    goTo(n);
    document.getElementById(`case-tab-${projects[n]!.id}`)?.focus();
  };

  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <SectionHead id="work-title" note={ui.notes.building} title={ui.section.projects} count={projects.length} />
      <div className="carousel" aria-roledescription={t(ui.project.carousel)}>
        <div ref={bar} className="carousel-bar">
          <div className="carousel-tabs" role="tablist" aria-label={t(ui.section.projects)} onKeyDown={onTabsKey}>
            {projects.map((p, i) => (
              <button
                key={p.id}
                id={`case-tab-${p.id}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls={`case-slide-${p.id}`}
                tabIndex={i === active ? 0 : -1}
                className="carousel-tab"
                onClick={() => goTo(i)}
              >
                <span className="mono" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {p.name}
                <i className="carousel-tab-dot" data-tone={p.status === 'dev' ? 'dev' : 'live'} aria-hidden />
              </button>
            ))}
          </div>
          <div className="carousel-nav">
            <span className="carousel-count mono" dir="ltr" aria-hidden>
              <b>{String(active + 1).padStart(2, '0')}</b> / {String(projects.length).padStart(2, '0')}
            </span>
            <button type="button" className="icon-btn carousel-arrow" onClick={() => goTo(active - 1)} aria-label={t(ui.project.prevProject)}>
              <ArrowLeft className="flip-rtl" size={17} strokeWidth={2} aria-hidden />
            </button>
            <button type="button" className="icon-btn carousel-arrow" onClick={() => goTo(active + 1)} aria-label={t(ui.project.nextProjectAria)}>
              <ArrowRight className="flip-rtl" size={17} strokeWidth={2} aria-hidden />
            </button>
          </div>
          <span className="carousel-progress" aria-hidden>
            <i style={{ width: `${((active + 1) / projects.length) * 100}%` }} />
          </span>
        </div>
        <p className="carousel-hint mono" aria-hidden>
          {t(ui.project.swipe)}
        </p>
        <div ref={track} className="carousel-track" style={height ? { height } : undefined}>
          {projects.map((p, i) => (
            <div
              key={p.id}
              id={`case-slide-${p.id}`}
              ref={(el) => {
                slides.current[i] = el;
              }}
              className="carousel-slide"
              role="tabpanel"
              aria-labelledby={`case-tab-${p.id}`}
              aria-roledescription={t(ui.project.slide)}
              data-active={i === active || undefined}
            >
              <CaseStudy p={p} index={i} onNext={() => goTo(i + 1, true)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
