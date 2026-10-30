import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutClient from './CheckoutClient';
import styles from './Checkout.module.css';

export const metadata: Metadata = {
  title: 'Post Buy Requirement | VALNQIX Verified Suppliers',
  description: 'Post your requirement to receive competitive quotations from verified IT suppliers and manufacturers across India.',
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        {/* Breadcrumb banner heading */}
        <div className={styles.breadcrumbsHeader}>
          <div className="container">
            <h1>Post Buy Requirement</h1>
            <p>
              <a href="/">Home</a> &gt; <span>Get Quotes from Verified Sellers</span>
            </p>
          </div>
        </div>

        <React.Suspense fallback={
          <div className={styles.checkoutSection} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ fontSize: '16px', color: '#666', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>Loading checkout...</div>
          </div>
        }>
          <CheckoutClient />
        </React.Suspense>
      </main>
      <Footer />
    </>
  );
}
