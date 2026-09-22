import { readFileSync, readdirSync, mkdirSync, writeFileSync, lstatSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'public');
const preview = process.argv.includes('--preview');
const output = resolve(root, preview ? 'preview-dist' : 'dist');
const approved = JSON.parse(readFileSync(resolve(root, 'approved-manifest.json'))).files;
// A local review must not silently approve a new production manifest.
const overrides = preview ? JSON.parse(readFileSync(resolve(root, 'preview-manifest.json'))).files : {};
for (const path of Object.keys(overrides)) {
  assert.ok(['participation-guide.html', 'participation-guide.css', 'participation-guide.js'].includes(path),
    `Outside the local participation-review scope: ${path}`);
}
const manifest = { ...approved, ...overrides };
const origin = JSON.parse(readFileSync(resolve(root, 'site.config.json'))).origin;
const previousOrigin = 'https://slater-project-record.viirl-1659.chatgpt.site';
assert.equal(new URL(origin).origin, origin, 'Use a valid HTTPS origin without a trailing slash');
assert.ok(origin.startsWith('https://') && !new URL(origin).hostname.includes('slater'));
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(dir, entry.name);
    assert.ok(!lstatSync(path).isSymbolicLink(), 'Symlinks are not permitted');
    return entry.isDirectory() ? files(path) : [path];
  });
}
const actual = files(source).map(path => relative(source, path)).sort();
assert.deepEqual(actual, Object.keys(manifest).sort(), 'Public inputs must match the approved allowlist');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
let metadataUpdates = 0;
for (const path of actual) {
  const original = readFileSync(resolve(source, path));
  assert.equal(sha(original), manifest[path].sha256, `Approved input changed: ${path}`);
  let bytes = original;
  if (path.endsWith('.html') || path === 'sitemap.xml' || path === 'robots.txt') {
    const text = original.toString('utf8');
    const updated = text.replaceAll(previousOrigin, origin);
    if (updated !== text) metadataUpdates++;
    bytes = Buffer.from(updated);
  }
  if (!process.argv.includes('--check')) {
    const target = resolve(output, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, bytes);
  }
}
if (!process.argv.includes('--check')) {
  assert.deepEqual(files(output).map(path => relative(output, path)).sort(), actual,
    'Unexpected output files: do not deploy');
}
console.log(`Verified ${actual.length} ${preview ? 'local-review' : 'approved'} files; ${metadataUpdates} metadata files point to ${origin}. Original records unchanged.${preview ? ' Not cleared for publication.' : ''}`);
