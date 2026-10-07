// Builds public/og-image.jpg (1200×630) and public/apple-touch-icon.png at
// build time from the portrait, the FB mark and the site's own fonts. Text is converted to outlines with fontkit, so the
// image looks the same on any machine, with or without fonts installed.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as fontkit from 'fontkit';
import sharp from 'sharp';

const mark = JSON.parse(readFileSync(resolve('src/assets/brand/fb-mark.json'), 'utf8'));

const W = 1200;
const H = 630;
const fontFile = (pkg, file) => resolve('node_modules', pkg, 'files', file);

// Static (single-weight) files: fontkit can't instance variable WOFF2 fonts.
const load = (pkg, file) => fontkit.create(readFileSync(fontFile(pkg, file)));

const unbounded = load('@fontsource/unbounded', 'unbounded-latin-800-normal.woff2');
const sansBold = load('@fontsource/source-sans-3', 'source-sans-3-latin-600-normal.woff2');
const sans = load('@fontsource/source-sans-3', 'source-sans-3-latin-400-normal.woff2');
const mono = load('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff2');
const monoBold = load('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-700-normal.woff2');

/** Text → one SVG path. Returns the markup and the advance width. */
function text(font, str, x, y, size, fill, tracking = 0) {
  const scale = size / font.unitsPerEm;
  const run = font.layout(str);
  let pen = x;
  let d = '';
  run.glyphs.forEach((g, i) => {
    const p = g.path.scale(scale, -scale).translate(pen, y);
    d += p.toSVG();
    pen += run.positions[i].xAdvance * scale + tracking * size;
  });
  return { svg: `<path d="${d}" fill="${fill}"/>`, width: pen - x };
}

const lime = '#e4f222';
const ink = '#ffffff';
const muted = '#9a9fa8';
const line = '#383b3f';

const parts = [];
const dashed = (x1, y1, x2, y2) =>
  parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${line}" stroke-width="1" stroke-dasharray="5 5"/>`);
dashed(52, 0, 52, H);
dashed(W - 52, 0, W - 52, H);
dashed(0, 56, W, 56);
dashed(0, H - 110, W, H - 110);

// Location chip
parts.push(`<rect x="84.5" y="84.5" width="332" height="47" rx="23.5" fill="none" stroke="${line}"/>`);
parts.push(`<circle cx="106" cy="108" r="5" fill="${lime}"/>`);
const chipA = text(sansBold, 'Morocco', 120, 115, 20, ink);
parts.push(chipA.svg);
parts.push(text(mono, '·  SOC & fullstack', 120 + chipA.width + 12, 114, 18, muted).svg);

// Name
parts.push(text(unbounded, 'FOUAD', 84, 250, 96, ink, -0.045).svg);
parts.push(text(unbounded, 'BARKAOUI', 84, 340, 96, muted, -0.045).svg);

// Role + promise
parts.push(text(mono, 'SOC analyst and fullstack developer. Vibe coder and prompt engineer.', 86, 388, 16, muted).svg);
const p1 = text(sans, 'I turn ideas into working products: fast, clean and', 84, 428, 30, ink);
parts.push(p1.svg);
const strong = text(sansBold, 'secure by default', 84, 468, 30, ink);
parts.push(`<rect x="84" y="${468 - 11}" width="${strong.width}" height="12" fill="${lime}" fill-opacity="0.45"/>`);
parts.push(strong.svg);
parts.push(text(sans, '.', 84 + strong.width + 1, 468, 30, ink).svg);

// Brand mark
const k = 38 / mark.viewBox;
parts.push(
  `<g transform="translate(84 ${H - 82}) scale(${k})"><rect width="${mark.viewBox}" height="${mark.viewBox}" rx="${mark.radius}" fill="${lime}"/><path d="${mark.letters}" fill="#06070b"/></g>`,
);
parts.push(text(sansBold, 'Fouad Barkaoui', 134, H - 56, 21, ink).svg);

// Portrait frame
const fx = W - 84 - 330;
const fy = 84;
parts.push(`<rect x="${fx + 0.5}" y="${fy + 0.5}" width="329" height="419" fill="none" stroke="${line}" stroke-dasharray="5 5"/>`);
const tick = (x, y, dx, dy) =>
  parts.push(`<path d="M${x} ${y + dy * 20}V${y}H${x + dx * 20}" fill="none" stroke="${lime}" stroke-width="3"/>`);
tick(fx - 6, fy - 6, 1, 1);
tick(fx + 336, fy - 6, -1, 1);
tick(fx - 6, fy + 426, 1, -1);
tick(fx + 336, fy + 426, -1, -1);
const cap = text(monoBold, 'Fig. 1', fx, fy + 458, 16, ink);
parts.push(cap.svg);
parts.push(text(mono, 'Fouad Barkaoui, Morocco', fx + cap.width + 10, fy + 458, 16, muted).svg);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#06070b"/>${parts.join('')}</svg>`;

const portrait = await sharp(resolve('src/assets/portrait/fouad.avif'))
  .resize(310, 400, { fit: 'cover', position: 'top' })
  .toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: portrait, left: fx + 10, top: fy + 10 }])
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(resolve('public/og-image.jpg'));

console.log('og-image.jpg written');

// Home-screen icon: the full mark on a square tile (iOS rounds the corners).
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="-6 -6 76 76">
<rect x="-6" y="-6" width="76" height="76" fill="${lime}"/>
<path d="${mark.ticks}" fill="none" stroke="#06070b" stroke-width="2.6" stroke-linecap="square" opacity="0.55"/>
<path d="${mark.letters}" fill="#06070b"/></svg>`;
await sharp(Buffer.from(icon)).png({ compressionLevel: 9 }).toFile(resolve('public/apple-touch-icon.png'));
console.log('apple-touch-icon.png written');
