import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { analyticsMarkup } from './analytics.mjs';

const root = new URL('../', import.meta.url);
const { origin } = JSON.parse(readFileSync(new URL('site.config.json', root)));
const { pages } = JSON.parse(readFileSync(new URL('social-sharing.json', root)));
const markup = analyticsMarkup(origin);
const script = markup.slice(markup.indexOf('>') + 1, markup.lastIndexOf('</script>'));

for (const page of Object.keys(pages)) {
  const html = readFileSync(new URL(`dist/${page}`, root), 'utf8');
  assert.equal(html.split(markup).length, 2, `Expected exactly one analytics loader in ${page}`);
}

for (const testOrigin of [origin, 'http://127.0.0.1:8766', 'http://localhost:8766', 'null', 'https://preview.vercel.app']) {
  const scripts = [];
  const window = { location: { origin: testOrigin } };
  const document = {
    querySelector: () => scripts.find(item => item.src === '/_vercel/insights/script.js'),
    createElement: tag => { assert.equal(tag, 'script'); return {}; },
    head: { appendChild: item => scripts.push(item) }
  };
  const context = { window, document };
  runInNewContext(script, context);
  runInNewContext(script, context);
  assert.equal(scripts.length, testOrigin === origin ? 1 : 0, testOrigin);
  if (testOrigin === origin) {
    assert.equal(scripts[0].defer, true);
    window.va('pageview');
    assert.equal(window.vaq.length, 1);
  } else {
    assert.equal(window.va, undefined);
  }
}
console.log(`Analytics verified on ${Object.keys(pages).length} pages; production only, local/preview disabled, duplicate loading prevented.`);
