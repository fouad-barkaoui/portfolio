// Injects the server-rendered English page into dist/index.html so the first
// paint needs no JavaScript. Arabic visitors get a client render on top.
import { createHash } from 'node:crypto';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const dist = resolve('dist');
const ssrDir = resolve('dist-ssr');
const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);

let html = await readFile(resolve(dist, 'index.html'), 'utf8');
const app = render();
if (!html.includes('<div id="root"></div>')) throw new Error('root container not found in dist/index.html');
html = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`);

// Inline the stylesheet (one less render-blocking request) and preload the
// two Latin fonts the hero paints with.
const link = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
if (link) {
  const css = await readFile(resolve(dist, link[1].slice(1)), 'utf8');
  const fonts = [...css.matchAll(/url\((\/assets\/(?:unbounded|source-sans-3)-latin-wght-normal-[^)]+\.woff2)\)/g)].map((m) => m[1]);
  const preloads = [...new Set(fonts)]
    .map((f) => `<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`)
    .join('');
  html = html.replace(link[0], `${preloads}<style>${css}</style>`);
}
// The CSP in vercel.json allows inline scripts only by hash — fail the build
// if an inline script changed without updating it.
const csp = await readFile(resolve('vercel.json'), 'utf8');
for (const [, body] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
  const hash = `sha256-${createHash('sha256').update(body).digest('base64')}`;
  if (!csp.includes(hash)) throw new Error(`Inline script hash ${hash} is missing from the CSP in vercel.json`);
}

await writeFile(resolve(dist, 'index.html'), html);
await rm(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${(app.length / 1024).toFixed(1)} kB of HTML`);
