# Fouad Barkaoui — portfolio

**Live:** https://fouad-barkaoui.vercel.app

SOC analyst and fullstack developer from Morocco. Case studies for Kanz (live
product), Windows Field Manual (189-command Windows troubleshooting reference), Prompt Engine (prompt quality and security scanner), Resume Studio
(offline AI resume optimizer) and ASSAS (codebase security scanner), the
security learning path, the stack in context and every way to reach me. English and Arabic (full right-to-left), dark by default with
a light theme. Stickers you can peel off and move around, sections on rounded sheets that
rise over each other as you scroll, a scribble transition on menu clicks,
scroll reveals and a moving band of roles give it some life; all of it stands
still for visitors who prefer reduced motion.

## Stack

React 18 · TypeScript (strict) · Vite · Tailwind CSS v4 · Lenis (smooth scroll) ·
lucide-react · vite-imagetools (AVIF/WebP) · self-hosted fonts via Fontsource
(Source Sans 3, Unbounded, Caveat, JetBrains Mono, IBM Plex Sans Arabic) ·
SVG stickers from [Stick It Up](https://stickitupx.vercel.app/stickers) by Samiran De
(self-hosted, license in `src/assets/stickers/LICENSE.md`).

The page is prerendered at build time (`scripts/prerender.mjs`), so the first
paint needs no JavaScript; React then hydrates it.

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + build + prerender into dist/
npm run preview   # serve dist/
```

## Where things live

| What | Where |
| --- | --- |
| **All words, EN + AR** (identity, bio, projects, stack, socials, "soon" panels, UI strings) | `src/content/content.ts` |
| Sections | `src/components/` (Hero, About, Projects, SecurityCorner, Stack, Closing) |
| Styles and theme tokens | `src/styles/index.css` |
| Portrait | `src/assets/portrait/fouad.avif` |
| Screenshots | `src/assets/kanz/`, `src/assets/prompt/`, `src/assets/studio/`, `src/assets/assas/` |
| Official "Built with" logos (drop-in) | `src/assets/logos/` — see the README there |
| Social preview image | generated at build by `scripts/og.mjs` → `public/og-image.jpg` |
| Security headers (CSP, HSTS, …) | `vercel.json` |
| Stickers (files, credits, license) | `src/assets/stickers/` · component in `src/components/Sticker.tsx` |
| Scroll reveals | `src/lib/reveal.ts` (mark an element with `data-reveal="up"`, `pop`, `wipe`…) |
| Moving band of roles | `src/components/Marquee.tsx` |
| Crossing tape before Contact | `src/components/Tape.tsx` (both bands share `src/lib/useScrollMarquee.ts`) |
| Section sheets (rounded sheets that rise over each other) | `src/components/Sheet.tsx`, layout in `src/App.tsx`, styles under "Sheets" in `index.css` |
| Menu transition (lime scribble that covers, jumps, wipes off) | `src/lib/wipe.ts` + `src/components/Wipe.tsx`; used by the header menu and the scroll index |
| Mobile menu (folding card, rising links, two-line icon) | `src/components/Header.tsx`, styles under "Header" in `index.css` |

Change content only in `content.ts`; layout never needs touching.

If you edit the small inline script in `index.html`, the build stops and tells
you the new hash to put in the CSP in `vercel.json`.

## Deploy

Hosted on Vercel (framework preset: Vite, output `dist`). `vercel --prod`
from this folder, or connect the GitHub repo for automatic deploys.

## Still open (from the brief, section 6)

- Domain / site name, and whether it links back to Kanz
- Resume PDF (the Resume tile says "Soon")
- Experience entries and Recognition (certificates, courses)
- ASSAS architecture details to publish (the current diagram is labelled as a concept)
- Smaller project cards — Sentinel Ops Console, Hrbān, the CTI aggregation tool,
  the Resume Optimizer Studio, Spatial Notes — each needs a yes first
- Contact form backend (currently mailto only, by design)
- Official logo files for the "Built with" row (optional: Simple Icons marks stand in until then, and MITRE ATT&CK shows a text label)
