import { revalidatePath } from 'next/cache';

type Handler = (request: Request) => Promise<Response>;

/** A literal path ("/products") or a dynamic route pattern with its type (["/products/[id]", "page"]). */
export type RevalidateTarget = string | readonly [string, 'page' | 'layout'];

/** Pages that render data from each admin-managed collection. */
export const PAGES_USING = {
  // A single product edit: only the listing pages. The edited product's own page is refreshed by
  // revalidateProductPages() so we don't invalidate every cached product page for one edit.
  products: ['/', '/products'],
  // Bulk import: many products can change at once, so refresh every cached product page too.
  productsBulk: ['/', '/products', ['/products/[id]', 'page']],
  categories: ['/', '/products'],
  brands: ['/', '/products'],
  blogs: ['/', '/blog'],
  promoBanner: ['/'],
  sellers: ['/suppliers'],
  // assign-all rewrites seller fields on every product
  productSellers: ['/', '/products', '/suppliers', ['/products/[id]', 'page']],
} satisfies Record<string, readonly RevalidateTarget[]>;

function revalidateTargets(targets: readonly RevalidateTarget[]) {
  for (const target of targets) {
    try {
      if (typeof target === 'string') revalidatePath(target);
      else revalidatePath(target[0], target[1]);
    } catch (err) {
      console.error('Failed to revalidate', target, err);
    }
  }
}

/**
 * Wraps an admin mutation route handler: after a successful change, the cached public pages that
 * display that data are refreshed on their next visit. Those pages are cached (ISR) for speed, so
 * without this an admin edit would only appear when the revalidate window expires.
 */
export function withRevalidate(handler: Handler, targets: readonly RevalidateTarget[]): Handler {
  return async (request: Request) => {
    const response = await handler(request);
    if (response.ok) revalidateTargets(targets);
    return response;
  };
}

/**
 * Refresh the cached page(s) of ONE product, by slug and/or id (the page can be cached under either URL).
 */
export function revalidateProductPages(...keys: Array<string | null | undefined>) {
  const paths = [...new Set(keys.filter((k): k is string => !!k))].map((k) => '/products/' + k);
  revalidateTargets(paths);
}

export { revalidateTargets };
