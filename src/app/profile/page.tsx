import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileClient from './ProfileClient';
import styles from './Profile.module.css';

export const metadata: Metadata = {
  title: 'Account Dashboard | VALNQIX Store',
  description: 'Manage your profile, active orders, and settings at VALNQIX Store.',
};

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafc' }}>
        {/* Breadcrumb banner heading */}
        <div className={styles.breadcrumbsHeader}>
          <div className="container">
            <h1 className={styles.breadcrumbsTitle}>Account Dashboard</h1>
            <p className={styles.breadcrumbsSubtitle}>
              Manage your profile, active orders, and settings.
            </p>
          </div>
        </div>

        <ProfileClient />
      </main>
      <Footer />
    </>
  );
}
