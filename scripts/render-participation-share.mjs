// Editable, code-native artwork matching the existing Take Action module.
// Dates come from the participation page rather than a second factual source.
// Usage: SL4_SHARP_PATH=/path/to/sharp node scripts/render-participation-share.mjs
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require(process.env.SL4_SHARP_PATH || 'sharp');
const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'public/participation-guide.html'), 'utf8');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
function dateFor(id) {
  const article = html.match(new RegExp(`<article\\b[^>]*id="${id}"[^>]*>([\\s\\S]*?)</article>`))?.[1];
  assert.ok(article, `Missing participation card: ${id}`);
  const timestamp = article.match(/<time datetime="([^"]+)"/)[1];
  const instant = new Date(timestamp);
  const label = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', month: 'long', day: 'numeric', year: 'numeric' }).format(instant);
  const time = zone => new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })
    .format(instant).replace(':00', '').replace('PM', 'p.m.').replace('AM', 'a.m.');
  return { label: escape(label), mountain: escape(time('America/Denver')), eastern: escape(time('America/New_York')) };
}
const county = dateFor('county-action');
const federal = dateFor('federal-action');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#10233b"/>
<rect x="56" y="40" width="58" height="58" rx="12" fill="#fff"/>
<text x="85" y="79" text-anchor="middle" font-family="Arial,sans-serif" font-size="29" font-weight="700" fill="#10233b">SR</text>
<g font-family="Arial,sans-serif">
<text x="132" y="63" font-size="25" font-weight="700" fill="#fff">Site Layer 4 Project Record</text>
<text x="132" y="91" font-size="18" fill="#c5d3e3">Independent public-records research</text>
<text x="1144" y="66" text-anchor="end" font-size="19" font-weight="700" letter-spacing="1.4" fill="#e8bd62">PARTICIPATION GUIDE</text>
</g>
<text x="56" y="207" font-family="Georgia,serif" font-size="76" font-weight="700" letter-spacing="-2" fill="#fff">Have your say.</text>
<text x="59" y="257" font-family="Arial,sans-serif" font-size="27" fill="#c5d3e3">What to say. Where to send it. How to file.</text>
<g font-family="Arial,sans-serif">
<rect x="56" y="300" width="534" height="219" rx="14" fill="#182f4b" stroke="#526a85"/>
<path d="M71 301H575" stroke="#9fc7ff" stroke-width="4"/>
<text x="80" y="337" font-size="18" font-weight="700" letter-spacing="1" fill="#9fc7ff">FEDERAL / FERC · FILING DEADLINE</text>
<text x="80" y="391" font-size="39" font-weight="700" fill="#fff">${federal.label}</text>
<text x="80" y="431" font-size="26" font-weight="700" fill="#fff">${federal.mountain} / ${federal.eastern}</text>
<text x="80" y="470" font-size="24" fill="#c5d3e3">Tri-State utility filing</text>
<text x="80" y="499" font-size="19" fill="#c5d3e3">Register your FERC account early.</text>
<rect x="610" y="300" width="534" height="219" rx="14" fill="#182f4b" stroke="#526a85"/>
<path d="M625 301H1129" stroke="#e8bd62" stroke-width="4"/>
<text x="634" y="337" font-size="18" font-weight="700" letter-spacing="1" fill="#e8bd62">COUNTY · PUBLIC HEARING</text>
<text x="634" y="391" font-size="39" font-weight="700" fill="#fff">${county.label}</text>
<text x="634" y="431" font-size="26" font-weight="700" fill="#fff">${county.mountain}</text>
<text x="634" y="470" font-size="24" fill="#c5d3e3">Countywide land-use-rule hearing</text>
<text x="634" y="499" font-size="19" fill="#c5d3e3">Not a Site Layer 4 permit hearing.</text>
<text x="56" y="568" font-size="23" font-weight="700" fill="#fff">Open the guide for current dates and instructions →</text>
<text x="56" y="602" font-size="18" fill="#c5d3e3">site-layer-4-project-record.vercel.app/participation-guide</text>
</g>
</svg>`;
const output = resolve(root, 'public/social/participation-guide-share-v1.png');
mkdirSync(resolve(root, 'public/social'), { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(output);
console.log(`Rendered ${output} (1200 × 630). Review the artwork and update its manifest entry before building.`);
