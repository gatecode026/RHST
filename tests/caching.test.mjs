import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { PUBLIC_API_CACHE_HEADERS } from '../src/lib/cacheHeaders.ts';
import { PAGES_USING } from '../src/lib/revalidatePages.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const rel = (p) => path.relative(root, p).replaceAll('\\', '/');

test('public API cache headers are shared-cacheable and never private', () => {
  const cc = PUBLIC_API_CACHE_HEADERS['Cache-Control'];
  assert.match(cc, /\bpublic\b/);
  assert.match(cc, /s-maxage=\d+/);
  assert.doesNotMatch(cc, /private|no-store/);
});

test('a single product edit never invalidates every cached product page', () => {
  const patterns = (targets) => targets.filter((t) => Array.isArray(t));
  assert.deepEqual(patterns(PAGES_USING.products), [], 'single edits must refresh only that product via revalidateProductPages()');
  assert.deepEqual(patterns(PAGES_USING.productsBulk), [['/products/[id]', 'page']], 'bulk imports refresh all product pages');
});

test('every admin-managed collection refreshes the pages that display it', () => {
  assert.ok(PAGES_USING.products.includes('/') && PAGES_USING.products.includes('/products'));
  assert.ok(PAGES_USING.categories.includes('/products'));
  assert.ok(PAGES_USING.brands.includes('/products'));
  assert.ok(PAGES_USING.blogs.includes('/blog'));
  assert.ok(PAGES_USING.sellers.includes('/suppliers'));
  assert.ok(PAGES_USING.promoBanner.includes('/'));
});

test('public components do not bypass the CDN with cache-busting query strings or no-store', () => {
  const offenders = [];
  for (const file of walk(src).filter((f) => f.endsWith('.tsx') && !rel(f).startsWith('src/app/admin/'))) {
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      if (line.includes('fetch(') && /Date\.now\(\)|no-store/.test(line)) offenders.push(`${rel(file)}:${i + 1}`);
    });
  }
  assert.deepEqual(offenders, []);
});

test('public read endpoints send cache headers', () => {
  for (const route of ['categories', 'brands', 'promo-banner', 'blog', 'products', 'products/facets', 'sellers']) {
    const code = readFileSync(path.join(src, 'app/api', route, 'route.ts'), 'utf8');
    assert.match(code, /PUBLIC_API_CACHE_HEADERS/, `/api/${route}`);
  }
});

test('the product page keeps its single cached lookup and its ISR settings', () => {
  const page = readFileSync(path.join(src, 'app/products/[id]/page.tsx'), 'utf8');
  assert.match(page, /const getProduct = cache\(/, 'metadata + page must share one lookup');
  assert.match(page, /export const revalidate = \d+/);
  assert.match(page, /export async function generateStaticParams/);
  assert.doesNotMatch(page, /force-dynamic/);
});

test('slug fallback never loads every product document again', () => {
  for (const file of ['app/products/[id]/page.tsx', 'app/api/products/[id]/route.ts']) {
    const code = readFileSync(path.join(src, file), 'utf8');
    assert.doesNotMatch(code, /collection\('products'\)\s*\.find\(\)\s*\.toArray\(\)/, file);
    assert.doesNotMatch(code, /find\(\{\}, \{ projection: \{ slug: 1, name: 1 \} \}\)/, file);
    assert.match(code, /slug: \{ \$exists: false \}/, file);
  }
});
