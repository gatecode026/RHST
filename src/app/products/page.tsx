import React from 'react';
import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Products Catalog | VALNQIX E-commerce & IT Solutions',
  description: 'Browse thousands of verified IT hardware products, components, computers, networking equipment, and accessories on VALNQIX.',
  alternates: {
    canonical: getCanonicalUrl('/products'),
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
