import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutClient from './CheckoutClient';
import styles from './Checkout.module.css';

export const metadata: Metadata = {
  title: 'Checkout | RHST IT Products & Solutions',
  description: 'Provide your billing and shipment details to complete your order securely with RHST.',
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        {/* Breadcrumb banner heading */}
        <div className={styles.breadcrumbsHeader}>
          <div className="container">
            <h1>Checkout</h1>
            <p>
              <a href="/">Home</a> &gt; <span>Shop</span>
            </p>
          </div>
        </div>

        <CheckoutClient />
      </main>
      <Footer />
    </>
  );
}
