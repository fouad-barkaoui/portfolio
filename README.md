# Fouad Barkaoui — extended portfolio

The standalone, extended version of the "Meet the Founder" page in Kanz: case
studies for each project, the security learning path, the stack in context and
every way to reach Fouad. English and Arabic (full right-to-left), dark by
default with a light theme.

Built from `extended-portfolio-prompt.md` (the build brief in this folder).

## Stack

React 18 · TypeScript (strict) · Vite · Tailwind CSS v4 · Lenis (smooth scroll) ·
lucide-react · vite-imagetools (AVIF/WebP) · self-hosted fonts via Fontsource
(Source Sans 3, Unbounded, Caveat, JetBrains Mono, IBM Plex Sans Arabic).

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
| Real Kanz screenshots | `src/assets/kanz/` |
| Official "Built with" logos (drop-in) | `src/assets/logos/` — see the README there |
| Social preview image | generated at build by `scripts/og.mjs` → `public/og-image.jpg` |
| Security headers (CSP, HSTS, …) | `vercel.json` |

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
- Official logo files for the "Built with" wall (names show as text until then)
