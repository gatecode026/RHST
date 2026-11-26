import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isNonItCategory, isNonItSlug, get410GoneHtml } from '@/lib/nonItFilter';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Intercept non-IT category query parameters on /products or /suppliers
  // Example: /products?category=SIDEBAGS -> 301 Redirect to /products
  if (pathname === '/products' || pathname === '/suppliers') {
    const categoryParam = searchParams.get('category');
    if (categoryParam && isNonItCategory(categoryParam)) {
      const redirectUrl = new URL(pathname, request.url);
      // Strip obsolete non-IT category parameter while preserving legitimate search terms if any
      searchParams.delete('category');
      searchParams.forEach((value, key) => {
        redirectUrl.searchParams.set(key, value);
      });

      return NextResponse.redirect(redirectUrl, {
        status: 301,
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    }
  }

  // 2. Intercept deleted non-IT product slugs under /products/:id
  // Example: /products/women-beige-textured-short-sleeves-casual-shirt -> 410 Gone
  if (pathname.startsWith('/products/')) {
    const slug = pathname.replace(/^\/products\//, '').replace(/\/+$/, '');

    if (slug && isNonItSlug(slug)) {
      return new NextResponse(get410GoneHtml(), {
        status: 410,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow, gone',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // /products and /suppliers only need this middleware when a ?category= filter is present
    // (check 1 above), so plain visits to those pages no longer invoke it at all.
    { source: '/products', has: [{ type: 'query', key: 'category' }] },
    { source: '/suppliers', has: [{ type: 'query', key: 'category' }] },
    // Every product slug must be checked for the 410 Gone rule (check 2 above).
    '/products/:path+',
  ],
};
