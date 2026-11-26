import assert from 'node:assert/strict';
import { test } from 'node:test';
import { NextRequest } from 'next/server';
import { config, middleware } from '../src/middleware.ts';

const run = (path) => middleware(new NextRequest(`http://localhost:3000${path}`));

test('non-IT category filter on /products is redirected with 301 to the clean URL', () => {
  const res = run('/products?category=SIDEBAGS');
  assert.equal(res.status, 301);
  assert.equal(new URL(res.headers.get('location')).pathname + new URL(res.headers.get('location')).search, '/products');
});

test('redirect keeps other query parameters', () => {
  const res = run('/products?category=SIDEBAGS&search=laptop');
  assert.equal(res.status, 301);
  const loc = new URL(res.headers.get('location'));
  assert.equal(loc.pathname, '/products');
  assert.equal(loc.searchParams.get('search'), 'laptop');
  assert.equal(loc.searchParams.has('category'), false);
});

test('non-IT category filter on /suppliers is redirected too', () => {
  assert.equal(run('/suppliers?category=Shoes').status, 301);
});

test('legitimate IT categories pass through', () => {
  for (const p of ['/products?category=Electronics', '/suppliers?category=Laptops%20%26%20Computers']) {
    assert.equal(run(p).headers.get('x-middleware-next'), '1', p);
  }
});

test('deleted non-IT product slugs return 410 Gone with noindex and a shared cache', async () => {
  const res = run('/products/women-beige-textured-short-sleeves-casual-shirt');
  assert.equal(res.status, 410);
  assert.match(res.headers.get('x-robots-tag'), /noindex/);
  assert.match(res.headers.get('cache-control'), /s-maxage=86400/);
  assert.match(await res.text(), /<html/i);
});

test('legitimate product slugs pass through', () => {
  assert.equal(run('/products/naxa---21-channel-soundbar-with-50-watt-digital-amplifier---black').headers.get('x-middleware-next'), '1');
});

// The matcher is what decides whether the middleware is invoked at all (a billed invocation per request).
test('matcher: plain /products and /suppliers visits do NOT invoke the middleware', () => {
  const sources = config.matcher.map((m) => (typeof m === 'string' ? m : m.source));
  const bare = config.matcher.filter((m) => typeof m === 'string' && (m === '/products' || m === '/suppliers' || m === '/products/:path*'));
  assert.deepEqual(bare, [], 'a bare string matcher would run the middleware on every visit');
  for (const route of ['/products', '/suppliers']) {
    const entry = config.matcher.find((m) => typeof m !== 'string' && m.source === route);
    assert.ok(entry, `${route} must have a conditional matcher`);
    assert.deepEqual(entry.has, [{ type: 'query', key: 'category' }]);
  }
  assert.ok(sources.includes('/products/:path+'), 'every product slug must still be checked for the 410 rule');
});
