export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.valnqix.com';

/**
 * Returns an exact, full self-referencing canonical URL for any route path.
 * e.g. getCanonicalUrl('/about') -> 'https://www.valnqix.com/about'
 *      getCanonicalUrl('/')      -> 'https://www.valnqix.com'
 */
export function getCanonicalUrl(path: string = ''): string {
  const base = SITE_URL.replace(/\/+$/, '');
  if (!path || path === '/' || path === '.') {
    return base;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
