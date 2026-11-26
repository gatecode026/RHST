import React from 'react';
import type { Metadata } from 'next';
import BlogClient from './BlogClient';
import { getCanonicalUrl } from '@/lib/seo';
import { getInitialBlogsData } from '@/lib/serverData';

// Cached page, regenerated in the background at most every 10 minutes (admin edits refresh it immediately).
// Previously it was frozen at build time, so changes only showed up after a redeploy.
export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Tech Blog & Insights | VALNQIX E-commerce & IT Solutions',
  description: 'Explore the latest tech news, gadgets advice, hardware reviews, and software guidelines on the VALNQIX Blog.',
  alternates: {
    canonical: getCanonicalUrl('/blog'),
  },
};

export default async function BlogPage() {
  const initialBlogs = await getInitialBlogsData();
  return <BlogClient initialBlogs={initialBlogs} />;
}
