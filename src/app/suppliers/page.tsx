import React from 'react';
import type { Metadata } from 'next';
import SuppliersClient from './SuppliersClient';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Verified Suppliers & Manufacturers Across India | VALNQIX Directory',
  description: 'Connect directly with verified IT hardware distributors, manufacturers, and wholesalers with GST verification and lowest wholesale price quotes.',
  alternates: {
    canonical: getCanonicalUrl('/suppliers'),
  },
};

export default function SuppliersPage() {
  return <SuppliersClient />;
}
