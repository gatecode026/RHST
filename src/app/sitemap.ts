import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getDb } from '@/lib/mongodb';
import { isNonItCategory, isNonItSlug } from '@/lib/nonItFilter';

// Cache sitemap for 1 hour to optimize crawler response time while keeping entries auto-updated
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/+$/, '');
  const now = new Date();

  // 1. Core static and hub pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${base}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/suppliers`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/checkout`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/services/amc`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/services/cloud`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/services/consultation`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/services/installation`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/services/it-support`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/services/repair-maintenance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${base}/terms-conditions`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${base}/return-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${base}/shipping-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // Helper to filter out garbage or non-standard category names
  const isGarbageCategory = (name: string) => {
    if (!name || typeof name !== 'string') return true;
    const str = name.trim();
    if (str.length === 0 || str.length > 40) return true;
    if (/^https?:\/\//i.test(str)) return true;
    if (/www\./i.test(str)) return true;
    if (/\.(com|org|net|html|php|jpg|png|jpeg)\b/i.test(str)) return true;
    if (/%25|%20|\/c\/product|\.p\?/i.test(str)) return true;
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) return true;
    if (/^(true|false|undefined|null|none|n\/a)$/i.test(str)) return true;
    if (/^[A-Z0-9]{10}$/.test(str)) return true;
    return false;
  };

  try {
    // Connect with a 6-second timeout guard to prevent build/crawler hangs
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Sitemap DB connection timed out')), 6000);
    });
    let db: any;
    try {
      db = await Promise.race([getDb(), timeoutPromise]);
    } finally {
      clearTimeout(timer); // don't leave the timer pending after the DB has answered
    }

    // 2. Dynamic Categories
    let categoryRoutes: MetadataRoute.Sitemap = [];
    try {
      const categories = await db
        .collection('categories')
        .find({}, { projection: { name: 1, slug: 1, updatedAt: 1 } })
        .toArray();

      const validCategories = categories.filter((c: any) => !isGarbageCategory(c.name) && !isNonItCategory(c.name));
      categoryRoutes = validCategories.map((c: any) => ({
        url: `${base}/products?category=${encodeURIComponent(c.name)}`,
        lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    } catch (catErr) {
      console.warn('Failed to fetch categories for sitemap:', catErr);
    }

    // 3. Dynamic Products
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
      const products = await db
        .collection('products')
        .find(
          {},
          {
            projection: {
              slug: 1,
              name: 1,
              category: 1,
              updatedAt: 1,
              createdAt: 1,
              _id: 1,
            },
          }
        )
        .limit(45000)
        .toArray();

      productRoutes = products
        .filter((p: any) => !isNonItCategory(p.category) && !isNonItSlug(p.slug || p.name))
        .map((p: any) => {
          const slug =
            p.slug ||
            p.name?.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') ||
            p._id.toString();

          return {
            url: `${base}/products/${slug}`,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : (p.createdAt ? new Date(p.createdAt) : now),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          };
        });
    } catch (prodErr) {
      console.warn('Failed to fetch products for sitemap:', prodErr);
    }

    // 4. Dynamic Blogs
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
      const blogs = await db
        .collection('blogs')
        .find(
          {},
          {
            projection: {
              id: 1,
              updatedAt: 1,
              createdAt: 1,
              _id: 1,
            },
          }
        )
        .toArray();

      blogRoutes = blogs.map((b: any) => ({
        url: `${base}/blog/${b.id || b._id.toString()}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : (b.createdAt ? new Date(b.createdAt) : now),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    } catch (blogErr) {
      console.warn('Failed to fetch blogs for sitemap:', blogErr);
    }

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...blogRoutes,
      ...productRoutes,
    ];
  } catch (err) {
    console.error('Error constructing dynamic sitemap:', err);
    // Safe fallback to static routes to avoid 500 error
    return staticRoutes;
  }
}
