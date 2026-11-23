import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import FaqClient from './FaqClient';
import { getCanonicalUrl } from '@/lib/seo';
import { getBreadcrumbSchema } from '@/lib/schema';
import styles from './Faq.module.css';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | VALNQIX E-commerce & IT Solutions',
  description: 'Find answers to frequently asked questions about VALNQIX IT-Ecommerce services, product catalog, orders, payments, shipping, returns, technical support, and account setup.',
  alternates: {
    canonical: getCanonicalUrl('/faq'),
  },
};

export default function FAQPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Frequently Asked Questions (FAQ)', url: '/faq' }
  ]);

  return (
    <>
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Navigation Header */}
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Breadcrumb Banner */}
        <section className={styles.breadcrumbBanner}>
          <div className="container">
            <h1 className={styles.breadcrumbTitle}>FREQUENTLY ASKED QUESTIONS (FAQ)</h1>
            <div className={styles.breadcrumbs}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>&gt;</span>
              <span>Frequently Asked Questions (FAQ)</span>
            </div>
          </div>
        </section>

        {/* FAQ Interactive Accordions Content */}
        <FaqClient />

        {/* Brands Section */}
        <Brands />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
