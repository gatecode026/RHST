import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import FaqClient from './FaqClient';
import styles from './Faq.module.css';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | RHST E-commerce & IT Solutions',
  description: 'Find answers to frequently asked questions about RHST IT-Ecommerce services, product catalog, orders, payments, shipping, returns, technical support, and account setup.',
};

export default function FAQPage() {
  return (
    <>
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
