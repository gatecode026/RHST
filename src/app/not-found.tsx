import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '404 - Page Not Found | VALNQIX',
  description: 'The page or product you are looking for does not exist, has been removed, or is permanently discontinued.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '640px', width: '100%', textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '3.5rem 2.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '13px', fontWeight: 700, padding: '4px 14px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
            Error 404 &bull; Not Found
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Page Not Found
          </h1>
          <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
            The page or product you requested could not be found. It may have been relocated, deleted, or discontinued from the VALNQIX catalog.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <Link
              href="/products"
              style={{ backgroundColor: '#16a34a', color: '#ffffff', fontWeight: 600, fontSize: '15px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Browse IT Products Catalog &rarr;
            </Link>
            <Link
              href="/"
              style={{ backgroundColor: '#f1f5f9', color: '#334155', fontWeight: 600, fontSize: '15px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s ease' }}
            >
              Back to Home
            </Link>
          </div>
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', textAlign: 'left' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '0.75rem' }}>
              Popular IT Solutions & Services
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Link href="/products?category=Hardware" style={{ fontSize: '13px', color: '#0284c7', textDecoration: 'none', padding: '4px 10px', background: '#f0f9ff', borderRadius: '6px' }}>
                Hardware & Servers
              </Link>
              <Link href="/services/it-support" style={{ fontSize: '13px', color: '#0284c7', textDecoration: 'none', padding: '4px 10px', background: '#f0f9ff', borderRadius: '6px' }}>
                IT Support Services
              </Link>
              <Link href="/services/amc" style={{ fontSize: '13px', color: '#0284c7', textDecoration: 'none', padding: '4px 10px', background: '#f0f9ff', borderRadius: '6px' }}>
                Annual Maintenance (AMC)
              </Link>
              <Link href="/contact" style={{ fontSize: '13px', color: '#0284c7', textDecoration: 'none', padding: '4px 10px', background: '#f0f9ff', borderRadius: '6px' }}>
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
