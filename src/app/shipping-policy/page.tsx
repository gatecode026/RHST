import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import styles from './Shipping.module.css';

export const metadata: Metadata = {
  title: 'Shipping Policy | VALNQIX E-commerce & IT Solutions',
  description: 'Read the shipping policy of VALNQIX to understand order processing, delivery timelines, shipping charges, tracking details, and contact info.',
};

export default function ShippingPolicyPage() {
  return (
    <>
      {/* Navigation Header */}
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Breadcrumb Banner */}
        <section className={styles.breadcrumbBanner}>
          <div className="container">
            <h1 className={styles.breadcrumbTitle}>SHIPPING POLICY</h1>
            <div className={styles.breadcrumbs}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>&gt;</span>
              <span>Shipping Policy</span>
            </div>
          </div>
        </section>

        {/* Shipping Policy Content Section */}
        <section className={styles.shippingSection}>
          <div className="container">
            <div className={styles.contentWrapper}>

              {/* Introduction Block */}
              <div className={styles.introBlock}>
                <h2 className={styles.policyTitle}>SHIPPING POLICY</h2>
                <p className={styles.lastUpdated}>Last Updated: 2026</p>
                <p className={styles.introParagraph}>
                  At VALNQIX, we are committed to providing a smooth, reliable, and timely delivery experience for all our customers. This Shipping Policy explains our shipping process, delivery timelines, and related terms for products purchased through our website.
                </p>
              </div>

              {/* 1. Order Processing */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>1. ORDER PROCESSING</h3>
                <p className={styles.text}>
                  Once your order is successfully placed, our team will verify the order details and begin the processing procedure.
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Orders are processed within 1-3 business days.</li>
                  <li className={styles.listItem}>Orders placed on weekends or public holidays will be processed on the next working day.</li>
                  <li className={styles.listItem}>You will receive an order confirmation notification after successful placement.</li>
                </ul>
              </div>

              {/* 2. Shipping & Delivery Timeline */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>2. SHIPPING &amp; DELIVERY TIMELINE</h3>
                <p className={styles.text}>
                  Delivery time may vary depending on product availability, location, and shipping partner.
                </p>
                <p className={styles.text} style={{ fontWeight: 200 }}>
                  Estimated delivery time:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Metro Cities: 3-5 business days</li>
                  <li className={styles.listItem}>Other Locations: 5-8 business days</li>
                  <li className={styles.listItem}>Remote Areas: Delivery may take additional time.</li>
                </ul>
                <p className={styles.text}>
                  Customers will receive tracking details once the order has been shipped.
                </p>
              </div>

              {/* 3. Shipping Charges */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>3. SHIPPING CHARGES</h3>
                <p className={styles.text}>
                  Shipping charges may vary based on:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Product type</li>
                  <li className={styles.listItem}>Order value</li>
                  <li className={styles.listItem}>Delivery location</li>
                  <li className={styles.listItem}>Shipping method selected</li>
                </ul>
                <p className={styles.text}>
                  Any applicable shipping charges will be displayed during checkout before payment confirmation.
                </p>
              </div>

              {/* 4. Order Tracking */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>4. ORDER TRACKING</h3>
                <p className={styles.text}>
                  After your order is shipped, you can track your delivery using:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Order tracking link</li>
                  <li className={styles.listItem}>Tracking number provided through email/SMS</li>
                  <li className={styles.listItem}>Your VALNQIX account dashboard</li>
                </ul>
              </div>

              {/* 5. Delivery Process */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>5. DELIVERY PROCESS</h3>
                <p className={styles.text}>
                  Our delivery partners will attempt delivery at the provided shipping address.
                </p>
                <p className={styles.text} style={{ fontWeight: 200 }}>
                  Customers are requested to:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Provide accurate delivery information</li>
                  <li className={styles.listItem}>Keep their phone number active</li>
                  <li className={styles.listItem}>Be available to receive the order</li>
                </ul>
                <p className={styles.text}>
                  If delivery fails due to incorrect information or customer unavailability, additional delivery attempts may be made.
                </p>
              </div>

              {/* 6. Damaged or Incorrect Products */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>6. DAMAGED OR INCORRECT PRODUCTS</h3>
                <p className={styles.text}>
                  If you receive a damaged, defective, or incorrect product:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Contact VALNQIX customer support within 48 hours of delivery</li>
                  <li className={styles.listItem}>Share product images and order details</li>
                  <li className={styles.listItem}>Our team will review the request and provide a suitable solution</li>
                </ul>
              </div>

              {/* 7. Product Availability & Delays */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>7. PRODUCT AVAILABILITY &amp; DELAYS</h3>
                <p className={styles.text}>
                  Sometimes delivery may be delayed due to:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Product availability issues</li>
                  <li className={styles.listItem}>Weather conditions</li>
                  <li className={styles.listItem}>Logistics problems</li>
                  <li className={styles.listItem}>Unexpected circumstances</li>
                </ul>
                <p className={styles.text}>
                  VALNQIX will keep customers informed about any major delays.
                </p>
              </div>

              {/* 8. International Shipping */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>8. INTERNATIONAL SHIPPING</h3>
                <p className={styles.text}>
                  Currently, VALNQIX provides delivery services according to available shipping locations. International shipping availability may vary depending on product and destination.
                </p>
              </div>

              {/* 9. Contact Us */}
              <div className={styles.policyBlock} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <h3 className={styles.sectionHeading}>9. CONTACT US</h3>
                <p className={styles.text}>
                  If you have any questions regarding this Privacy Policy, please contact us:
                </p>
                <div className={styles.contactDetails}>
                  <p className={styles.text}><strong>VALNQIX IT-Ecommerce Private Limited</strong></p>
                  <p className={styles.text}>Email: info@valnqix.in</p>
                </div>
                <p className={styles.trustText} style={{ fontWeight: 500, color: 'var(--dark)' }}>
                  We are committed to delivering your technology products safely and efficiently.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Brands Section */}
        <Brands />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
