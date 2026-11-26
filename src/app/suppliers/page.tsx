import React from 'react';
import type { Metadata } from 'next';
import SuppliersClient from './SuppliersClient';
import { getCanonicalUrl } from '@/lib/seo';
import { getInitialSuppliersData } from '@/lib/serverData';
import { getBreadcrumbSchema } from '@/lib/schema';

// Cached page, regenerated in the background at most every 10 minutes (admin edits refresh it immediately).
// Previously it was frozen at build time, so changes only showed up after a redeploy.
export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Verified Suppliers & Manufacturers Across India | VALNQIX Directory',
  description: 'Connect directly with verified IT hardware distributors, manufacturers, and wholesalers with GST verification and lowest wholesale price quotes.',
  alternates: {
    canonical: getCanonicalUrl('/suppliers'),
  },
};

export default async function SuppliersPage() {
  const initialData = await getInitialSuppliersData(24);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Verified Suppliers Directory', url: '/suppliers' }
  ]);

  return (
    <>
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SuppliersClient
        initialSellers={initialData.sellers}
        initialTotal={initialData.total}
        initialTotalPages={initialData.totalPages}
      />
    </>
  );
}
