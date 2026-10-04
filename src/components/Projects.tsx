import { ArrowUpRight, Check, Maximize2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import arabicRtl from '@/assets/kanz/arabic-rtl.avif?w=600;1000;1600&format=avif;webp&as=picture';
import newsDark from '@/assets/kanz/news-dark.avif?w=800;1400;2400&format=avif;webp&as=picture';
import salaryLight from '@/assets/kanz/salary-light.avif?w=600;1000;1600&format=avif;webp&as=picture';
import startHere from '@/assets/kanz/start-here.avif?w=600;1000;1600&format=avif;webp&as=picture';
import createReport from '@/assets/assas/create-report.avif?w=600;1000;1600&format=avif;webp&as=picture';
import offlineInstall from '@/assets/assas/offline-install.avif?w=600;1040&format=avif;webp&as=picture';
import repoMap from '@/assets/assas/repo-map.avif?w=600;1000;1472&format=avif;webp&as=picture';
import reportSummary from '@/assets/assas/report-summary.avif?w=800;1472&format=avif;webp&as=picture';
import scanSweep from '@/assets/assas/scan-sweep.avif?w=800;1472&format=avif;webp&as=picture';
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

type ShotId = (typeof kanzScreens)[number]['id'] | (typeof assasScreens)[number]['id'] | (typeof studioScreens)[number]['id'];

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
  'studio-compare': studioCompare,
  'studio-home': studioHome,
  'studio-parse': studioParse,
  'studio-keywords': studioKeywords,
  'studio-xyz': studioXyz,
};

/** Real screenshots per case study, and the heading above them. */
const SCREENS: Record<Project['id'], { title: L; list: readonly (Screen & { id: ShotId })[] }> = {
  kanz: { title: ui.project.screens, list: kanzScreens },
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

function CaseStudy({ p, index }: { p: Project; index: number }): JSX.Element {
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
            {formatMonth(p.start)} — <span aria-label={t(ui.project.present)}>∞</span>
          </span>
          {now ? <span>{formatDuration(p.start, now, lang)}</span> : null}
        </p>
        {p.url ? (
          <a className="btn btn-ghost btn-sm" href={p.url} target="_blank" rel="noopener noreferrer">
            {t(ui.project.visit)}
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
            <span>—</span> {t(shots.title)}
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
    </article>
  );
}

export function Projects(): JSX.Element {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <SectionHead id="work-title" note={ui.notes.building} title={ui.section.projects} count={projects.length} />
      <div className="cases">
        {projects.map((p, i) => (
          <CaseStudy key={p.id} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}
