import React from 'react';
import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import PageFAQ from '@/components/PageFAQ';
import { PRODUCT_FAQS } from '@/data/faqs';
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
    <>
      <ProductsClient
        initialProducts={initialData.products}
        initialTotal={initialData.total}
        initialCategories={initialData.categories}
        initialBrands={initialData.brands}
      />
      <PageFAQ
        title="Hardware Procurement & Category FAQs"
        subtitle="Direct answers to corporate hardware sourcing, bulk laptop procurement, and GST billing questions."
        badge="B2B Procurement Support"
        faqs={PRODUCT_FAQS}
      />
    </>
  );
}
