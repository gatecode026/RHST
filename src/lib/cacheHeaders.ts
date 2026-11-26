/**
 * Edge-cache headers for public, read-only API responses (categories, brands, products list, ...).
 * The CDN serves a cached copy for 60s and may serve a stale one for up to 5 more minutes while it
 * refreshes in the background, so repeated page views don't each hit MongoDB.
 * Only attach to successful responses - never to errors.
 */
export const PUBLIC_API_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
} as const;
