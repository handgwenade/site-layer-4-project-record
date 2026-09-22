import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { canonicalUrl } from './social-sharing.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(readFileSync(resolve(root, 'social-sharing.json')));
const { origin } = JSON.parse(readFileSync(resolve(root, 'site.config.json')));
const output = resolve(root, process.argv.includes('--production') ? 'dist' : 'preview-dist');
const approved = JSON.parse(readFileSync(resolve(root, 'approved-manifest.json'))).files;
const decode = text => text.replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const tags = html => [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, decode(value)])));
let records = 0;
for (const [path, metadata] of Object.entries(approved)) {
  const bytes = readFileSync(resolve(root, 'public', path));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), metadata.sha256, `Original input changed: ${path}`);
  if (!path.endsWith('.html') && !['sitemap.xml', 'robots.txt'].includes(path)) assert.deepEqual(readFileSync(resolve(output, path)), bytes, path);
  if (path.startsWith('records/')) records++;
}
assert.equal(records, 23);
const titles = new Set(), descriptions = new Set();
for (const [path, page] of Object.entries(config.pages)) {
  const html = readFileSync(resolve(output, path), 'utf8');
  const source = readFileSync(resolve(root, 'public', path), 'utf8');
  assert.equal(html.split('</head>')[1], source.split('</head>')[1], `Visible content or body changed: ${path}`);
  const head = html.split('</head>')[0], meta = tags(head);
  const value = key => {
    const found = meta.filter(tag => tag.property === key || tag.name === key);
    assert.equal(found.length, 1, `${path}: expected exactly one ${key}`);
    assert.ok(found[0].content);
    return found[0].content;
  };
  assert.equal(value('og:title'), page.title);
  assert.equal(value('og:description'), page.description);
  assert.equal(value('description'), page.description);
  assert.equal(value('og:type'), 'website');
  assert.equal(value('og:site_name'), config.siteName);
  assert.equal(value('og:url'), canonicalUrl(path, origin));
  for (const key of ['og:url', 'og:image', 'og:image:secure_url', 'twitter:image']) {
    const url = new URL(value(key));
    assert.equal(url.origin, origin);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hash + url.search, '');
  }
  const canonicals = [...head.matchAll(/<link rel="canonical" href="([^"]+)"\/>/g)];
  assert.equal(canonicals.length, 1);
  assert.equal(canonicals[0][1], value('og:url'));
  assert.equal(value('og:image'), `${origin}/${config.image.path}`);
  assert.equal(value('og:image:width'), '1200');
  assert.equal(value('og:image:height'), '630');
  assert.equal(value('og:image:type'), config.image.type);
  assert.equal(value('og:image:alt'), config.image.alt);
  assert.equal(value('twitter:card'), 'summary_large_image');
  for (const key of ['title', 'description', 'image', 'image:alt']) assert.equal(value(`twitter:${key}`), value(`og:${key}`));
  titles.add(page.title); descriptions.add(page.description);
}
const pages = Object.keys(config.pages).length;
assert.equal(titles.size, pages); assert.equal(descriptions.size, pages);
assert.equal(pages, readdirSync(output).filter(path => path.endsWith('.html')).length);
const imagePath = resolve(output, config.image.path);
let image = { verified: false, blocker: 'The supplied Facebook artwork has not been located; sharing image not created.' };
if (existsSync(imagePath)) {
  const bytes = readFileSync(imagePath);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16), 1200);
  assert.equal(bytes.readUInt32BE(20), 630);
  assert.ok(bytes.length < 5 * 1024 * 1024, 'Sharing image should stay below 5 MB');
  image = { verified: true, width: 1200, height: 630, bytes: bytes.length };
}
console.log(JSON.stringify({ pages, initialHtmlMetadata: 'pass', uniqueTitlesAndDescriptions: 'pass', absoluteCleanProductionUrls: 'pass', visibleBodiesUnchanged: 'pass', originalRecordsUnchanged: records, image, publicationApproved: config.releaseStatus === 'approved' }, null, 2));
if (!image.verified) process.exitCode = 2;
