import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import CustomerReviews from '@/components/CustomerReviews';
import OurBlog from '@/components/OurBlog';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import styles from './Contact.module.css';

export const metadata: Metadata = {
  title: 'Contact Us | RHST E-commerce & IT Solutions',
  description: 'Get in touch with RHST. Contact our office or management teams, locate our stores in Rajasthan, or send us your questions and inquiries online.',
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
                  Tortor cras enim convallis aenean et tortor at risus viverra adipiscing.
                </p>

                <div className={styles.infoCols}>
                  <div className={styles.infoCol}>
                    <h3 className={styles.infoTitle}>OFFICE</h3>
                    <p className={styles.infoText}>412, Sumer Nagar, Mansarovar, Jaipur - 302020, Rajasthan.</p>
                    <p className={styles.infoText}>+91-8587634520</p>
                    <p className={styles.infoText}>rhst@gmail.com</p>
                  </div>
                  <div className={styles.infoCol}>
                    <h3 className={styles.infoTitle}>MANAGEMENT</h3>
                    <p className={styles.infoText}>412, Sumer Nagar, Mansarovar, Jaipur - 302020, Rajasthan.</p>
                    <p className={styles.infoText}>+91-8587634520</p>
                    <p className={styles.infoText}>rhst@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Any Questions? Form */}
              <div>
                <h2 className={styles.sectionTitle}>ANY QUESTIONS?</h2>
                <p className={styles.sectionDesc}>
                  Use the form below to get in touch with us.
                </p>

                <ContactForm type="contact" styles={styles} />
              </div>

            </div>

            {/* Store Grid Section */}
            <div className={styles.storeGrid}>
              <div className={styles.storeImageWrapper}>
                <img 
                  src="/images/our_store.png" 
                  alt="RHST Showroom Store Rajasthan" 
                  className={styles.storeImage}
                />
              </div>
              <div className={styles.storeContent}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: '0.5rem' }}>OUR STORES</h2>
                <p className={styles.sectionDesc} style={{ marginBottom: '1.5rem' }}>
                  You can also directly buy products from our stores.
                </p>
                <h3 className={styles.storeName}>RAJASTHAN</h3>
                <p className={styles.infoText}>412, Sumer Nagar, Mansarovar, Jaipur, (302020)</p>
                <p className={styles.infoText}>+91-8587634520</p>
                <p className={styles.infoText}>rhst@gmail.com</p>
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
