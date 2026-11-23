import React from 'react';
import type { Metadata } from 'next';
import WishlistClient from './WishlistClient';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'My Wishlist | VALNQIX',
  description: 'View and manage your saved products on VALNQIX.',
  alternates: {
    canonical: getCanonicalUrl('/wishlist'),
  },
};

export default function WishlistPage() {
  return <WishlistClient />;
}
