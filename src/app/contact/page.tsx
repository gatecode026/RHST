import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import CustomerReviews from '@/components/CustomerReviews';
import OurBlog from '@/components/OurBlog';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { getCanonicalUrl } from '@/lib/seo';
import styles from './Contact.module.css';

export const metadata: Metadata = {
  title: 'Contact Us | VALNQIX E-commerce & IT Solutions',
  description: 'Get in touch with VALNQIX. Contact our office or management teams, locate our store in Brooklyn, NY, or send us your questions and inquiries online.',
  alternates: {
    canonical: getCanonicalUrl('/contact'),
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Navigation Header */}
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Breadcrumb Banner */}
        <section className={styles.breadcrumbBanner}>
          <div className="container">
            <h1 className={styles.breadcrumbTitle}>CONTACT</h1>
            <div className={styles.breadcrumbs}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>&gt;</span>
              <span>Contact</span>
            </div>
          </div>
        </section>

        {/* Contact Main Section */}
        <section className={styles.contactSection}>
          <div className="container">
            <div className={styles.contactGrid}>

              {/* Left Column: Contact Info */}
              <div>
                <h2 className={styles.sectionTitle}>CONTACT INFO</h2>
                <p className={styles.sectionDesc}>
                  Get in touch with VALNQIX, a brand operated under RHST E-Commerce Pvt. Ltd. Our corporate support desk assists enterprises and institutions with wholesale IT hardware quotations, bulk procurement, and technical service contracts.
                </p>

                <div className={styles.infoCols}>
                  <div className={styles.infoCol}>
                    <h3 className={styles.infoTitle}>NOIDA OFFICE</h3>
                    <p className={styles.infoText}>G-52, Sector 63, UP, NOIDA, Uttar Pradesh, India - 201301</p>
                    <p className={styles.infoText}>
                      <a href="tel:+919829012345" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                        📞 +91 98290 12345
                      </a>
                    </p>
                    <p className={styles.infoText}>info@valnqix.in</p>
                  </div>
                  <div className={styles.infoCol}>
                    <h3 className={styles.infoTitle}>REGISTERED OFFICE</h3>
                    <p className={styles.infoText}>Khasra 5437/1641 Kali Ka, Khana Sanganer Chapola, Sanganer Bazar, Sanganer, Jaipur, Rajasthan - 302029</p>
                    <p className={styles.infoText} style={{ fontSize: '0.82rem', color: '#666' }}>
                      CIN: U47912RJ2026PTC115018<br />
                      GSTIN: 08AAPCR9622R1Z9
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Any Questions? Form */}
              <div>
                <h2 className={styles.sectionTitle}>ANY QUESTIONS?</h2>
                <p className={styles.sectionDesc}>
                  Use the form below to get in touch with our procurement and support teams.
                </p>

                <ContactForm type="contact" styles={styles} />
              </div>

            </div>

            {/* Store Grid Section */}
            <div className={styles.storeGrid}>
              <div className={styles.storeContent}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: '0.5rem' }}>CORPORATE LOCATIONS</h2>
                <p className={styles.sectionDesc} style={{ marginBottom: '1.5rem' }}>
                  VALNQIX and parent company RHST E-Commerce Pvt. Ltd. operate with physical presence and verified dispatch centers.
                </p>
                <h3 className={styles.storeName}>Noida Operational Headquarters</h3>
                <p className={styles.infoText}>G-52, Sector 63, UP, NOIDA, Uttar Pradesh, India - 201301</p>
                <p className={styles.infoText}>Phone: +91 98290 12345 | Email: info@valnqix.in</p>
                <p className={styles.infoText} style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#777' }}>
                  Parent Entity: RHST E-Commerce Pvt. Ltd. | CIN: U47912RJ2026PTC115018 | GSTIN: 08AAPCR9622R1Z9
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Customer Reviews Section */}
        <CustomerReviews />

        {/* Our Blog Section with adjusted styling */}
        <OurBlog className={styles.ourBlogSection} />

        {/* Brands Section */}
        <Brands />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
