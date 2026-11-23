import React from 'react';
import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { getCanonicalUrl } from '@/lib/seo';
import { getInitialProductsData } from '@/lib/serverData';

export const metadata: Metadata = {
  title: 'Products Catalog | VALNQIX E-commerce & IT Solutions',
  description: 'Browse thousands of verified IT hardware products, components, computers, networking equipment, and accessories on VALNQIX.',
  alternates: {
    canonical: getCanonicalUrl('/products'),
  },
};

export default async function ProductsPage() {
  const initialData = await getInitialProductsData(24);

  return (
    <ProductsClient
      initialProducts={initialData.products}
      initialTotal={initialData.total}
      initialCategories={initialData.categories}
      initialBrands={initialData.brands}
    />
  );
}
