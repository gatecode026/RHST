import React from 'react';
import type { Metadata } from 'next';
import SuppliersClient from './SuppliersClient';
import { getCanonicalUrl } from '@/lib/seo';
import { getInitialSuppliersData } from '@/lib/serverData';

export const metadata: Metadata = {
  title: 'Verified Suppliers & Manufacturers Across India | VALNQIX Directory',
  description: 'Connect directly with verified IT hardware distributors, manufacturers, and wholesalers with GST verification and lowest wholesale price quotes.',
  alternates: {
    canonical: getCanonicalUrl('/suppliers'),
  },
};

export default async function SuppliersPage() {
  const initialData = await getInitialSuppliersData(24);

  return (
    <SuppliersClient
      initialSellers={initialData.sellers}
      initialTotal={initialData.total}
      initialTotalPages={initialData.totalPages}
    />
  );
}
