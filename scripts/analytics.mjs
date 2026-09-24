import assert from 'node:assert/strict';

// Static HTML integration: Vercel serves this script after Web Analytics is enabled.
export function analyticsMarkup(origin) {
  const productionOrigin = JSON.stringify(origin).replaceAll('<', '\\u003c');
  return `<script data-site-analytics>
(() => {
  if (window.location.origin !== ${productionOrigin}) return;
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  if (document.querySelector('script[src="/_vercel/insights/script.js"]')) return;
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
})();
</script>
`;
}

export function addAnalytics(html, origin) {
  assert.equal((html.match(/<\/body>/g) || []).length, 1, 'Expected one closing body for analytics');
  assert.ok(!html.includes('data-site-analytics'), 'Analytics must be added only by the shared build');
  return html.replace('</body>', `${analyticsMarkup(origin)}</body>`);
}
