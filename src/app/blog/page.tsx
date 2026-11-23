import React from 'react';
import type { Metadata } from 'next';
import BlogClient from './BlogClient';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Tech Blog & Insights | VALNQIX E-commerce & IT Solutions',
  description: 'Explore the latest tech news, gadgets advice, hardware reviews, and software guidelines on the VALNQIX Blog.',
  alternates: {
    canonical: getCanonicalUrl('/blog'),
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
