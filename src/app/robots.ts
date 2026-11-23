import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/+$/, '');
  const aiBots = [
    'GPTBot',
    'OAI-SearchBot',
    'PerplexityBot',
    'Google-Extended',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
      ...aiBots.map((bot) => ({
        userAgent: bot,
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
