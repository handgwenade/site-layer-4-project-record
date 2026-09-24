import assert from 'node:assert/strict';

const escapeAttribute = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function canonicalUrl(path, origin) {
  assert.match(path, /^[a-z0-9-]+\.html$/);
  return new URL(path === 'index.html' ? '/' : `/${path.slice(0, -5)}`, origin).href;
}

// Build-time HTML only: social crawlers do not need to run JavaScript.
export function addSocialMetadata(html, path, config, origin) {
  const page = config.pages[path];
  assert.ok(page?.title && page?.description, `Missing page-specific sharing copy: ${path}`);
  const artwork = page.image || config.image;
  assert.ok(artwork.alt, 'Sharing image needs descriptive alt text');
  assert.match(artwork.path, /^social\/[a-z0-9-]+\.(png|jpe?g)$/);
  const url = canonicalUrl(path, origin);
  const image = new URL(`/${artwork.path}`, origin).href;
  const properties = {
    'og:title': page.title,
    'og:description': page.description,
    'og:type': 'website',
    'og:url': url,
    'og:site_name': config.siteName,
    'og:locale': 'en_US',
    'og:image': image,
    'og:image:secure_url': image,
    'og:image:type': artwork.type,
    'og:image:width': artwork.width,
    'og:image:height': artwork.height,
    'og:image:alt': artwork.alt
  };
  const twitter = {
    'twitter:card': 'summary_large_image',
    'twitter:title': page.title,
    'twitter:description': page.description,
    'twitter:image': image,
    'twitter:image:alt': artwork.alt
  };
  const [head, ...rest] = html.split('</head>');
  assert.equal(rest.length, 1, `Expected one head: ${path}`);
  const clean = head
    .replace(/<meta\b[^>]*(?:property|name)=["'](?:og:|twitter:)[^"']*["'][^>]*>/gi, '')
    .replace(/<meta\b[^>]*name=["']description["'][^>]*>/gi, '')
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, '');
  const tags = [
    `<link rel="canonical" href="${escapeAttribute(url)}"/>`,
    `<meta name="description" content="${escapeAttribute(page.description)}"/>`,
    ...Object.entries(properties).map(([key, value]) => `<meta property="${key}" content="${escapeAttribute(value)}"/>`),
    ...Object.entries(twitter).map(([key, value]) => `<meta name="${key}" content="${escapeAttribute(value)}"/>`)
  ];
  return `${clean}\n${tags.join('\n')}\n</head>${rest[0]}`;
}
