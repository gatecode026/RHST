import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import styles from './Terms.module.css';

export const metadata: Metadata = {
  title: 'Terms & Conditions | VALNQIX E-commerce & IT Solutions',
  description: 'Read the terms and conditions of VALNQIX governing rules, registration, product details, billing, shipping, returns, and limitation of liability.',
};

export default function TermsConditionsPage() {
  return (
    <>
      {/* Navigation Header */}
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Breadcrumb Banner */}
        <section className={styles.breadcrumbBanner}>
          <div className="container">
            <h1 className={styles.breadcrumbTitle}>TERMS & CONDITIONS</h1>
            <div className={styles.breadcrumbs}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>&gt;</span>
              <span>Terms & Conditions</span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className={styles.termsSection}>
          <div className="container">
            <div className={styles.contentWrapper}>

              {/* Introduction Block */}
              <div className={styles.introBlock}>
                <h2 className={styles.policyTitle}>TERMS & CONDITIONS</h2>
                <p className={styles.lastUpdated}>Last Updated: 2026</p>
                <p className={styles.introParagraph}>
                  Welcome to VALNQIX. These Terms & Conditions explain the rules and guidelines for using our website, purchasing products, and accessing our services. By visiting or using the VALNQIX website, you agree to follow these terms.
                </p>
                <p className={styles.introParagraph}>
                  Please read these terms carefully before using our services.
                </p>
              </div>

              {/* 1. WEBSITE USAGE */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>1. WEBSITE USAGE</h3>
                <p className={styles.text}>
                  By accessing the VALNQIX website, you agree that:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>You will use the website only for lawful purposes</li>
                  <li className={styles.listItem}>You will provide accurate and complete information during registration and checkout</li>
                  <li className={styles.listItem}>You will not misuse, damage, or attempt unauthorized access to our website</li>
                  <li className={styles.listItem}>You are responsible for maintaining the confidentiality of your account information</li>
                </ul>
              </div>

              {/* 2. ACCOUNT REGISTRATION */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>2. ACCOUNT REGISTRATION</h3>
                <p className={styles.text}>
                  To access certain features, customers may need to create an account.
                </p>
                <p className={styles.text}>
                  You are responsible for:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Providing correct personal information</li>
                  <li className={styles.listItem}>Keeping your login credentials secure</li>
                  <li className={styles.listItem}>All activities performed through your account</li>
                </ul>
                <p className={styles.text}>
                  VALNQIX reserves the right to suspend or terminate accounts involved in suspicious or unauthorized activities.
                </p>
              </div>

              {/* 3. PRODUCT INFORMATION */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>3. PRODUCT INFORMATION</h3>
                <p className={styles.text}>
                  VALNQIX makes every effort to provide accurate product information, including:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Product descriptions</li>
                  <li className={styles.listItem}>Images</li>
                  <li className={styles.listItem}>Specifications</li>
                  <li className={styles.listItem}>Pricing details</li>
                  <li className={styles.listItem}>Availability information</li>
                </ul>
                <p className={styles.text}>
                  However, minor variations may occur due to manufacturer updates or display differences.
                </p>
              </div>

              {/* 4. PRICING & PAYMENTS */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>4. PRICING & PAYMENTS</h3>
                <p className={styles.text}>
                  All product prices displayed on the website are subject to change without prior notice.
                </p>
                <p className={styles.text}>
                  Customers agree to:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Provide valid payment information</li>
                  <li className={styles.listItem}>Complete payment before order processing</li>
                  <li className={styles.listItem}>Accept applicable taxes and shipping charges</li>
                </ul>
                <p className={styles.text}>
                  VALNQIX uses secure payment methods to process transactions.
                </p>
              </div>

              {/* 5. ORDER CONFIRMATION & CANCELLATION */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>5. ORDER CONFIRMATION & CANCELLATION</h3>
                <p className={styles.text}>
                  After placing an order:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Customers will receive order confirmation</li>
                  <li className={styles.listItem}>VALNQIX reserves the right to cancel orders due to stock issues, incorrect pricing, or verification problems</li>
                  <li className={styles.listItem}>Customers may request cancellation before shipment processing</li>
                </ul>
              </div>

              {/* 6. SHIPPING & DELIVERY */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>6. SHIPPING & DELIVERY</h3>
                <p className={styles.text}>
                  VALNQIX aims to deliver products within the estimated delivery timeframe.
                </p>
                <p className={styles.text}>
                  Delivery may be affected by:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Product availability</li>
                  <li className={styles.listItem}>Shipping partner delays</li>
                  <li className={styles.listItem}>Location-related issues</li>
                  <li className={styles.listItem}>Unforeseen circumstances</li>
                </ul>
                <p className={styles.text}>
                  Please refer to our Shipping Policy for detailed information.
                </p>
              </div>

              {/* 7. RETURNS & REFUNDS */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>7. RETURNS & REFUNDS</h3>
                <p className={styles.text}>
                  Returns, replacements, and refunds are processed according to our Return Policy.
                </p>
                <p className={styles.text}>
                  Customers must ensure:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Products are returned in original condition</li>
                  <li className={styles.listItem}>Required documents and accessories are included</li>
                  <li className={styles.listItem}>Return requests are submitted within the allowed timeframe</li>
                </ul>
              </div>

              {/* 8. INTELLECTUAL PROPERTY */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>8. INTELLECTUAL PROPERTY</h3>
                <p className={styles.text}>
                  All website content including:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Logo</li>
                  <li className={styles.listItem}>Images</li>
                  <li className={styles.listItem}>Text</li>
                  <li className={styles.listItem}>Graphics</li>
                  <li className={styles.listItem}>Designs</li>
                  <li className={styles.listItem}>Software</li>
                </ul>
                <p className={styles.text}>
                  is the property of VALNQIX and cannot be copied, modified, or used without permission.
                </p>
              </div>

              {/* 9. LIMITATION OF LIABILITY */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>9. LIMITATION OF LIABILITY</h3>
                <p className={styles.text}>
                  VALNQIX is not responsible for:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Temporary website interruptions</li>
                  <li className={styles.listItem}>Delays caused by external services</li>
                  <li className={styles.listItem}>Product misuse by customers</li>
                  <li className={styles.listItem}>Loss caused by unauthorized account access</li>
                </ul>
              </div>

              {/* 10. THIRD-PARTY SERVICES */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>10. THIRD-PARTY SERVICES</h3>
                <p className={styles.text}>
                  Our website may include links or services provided by third parties. VALNQIX is not responsible for the content, policies, or actions of external websites.
                </p>
              </div>

              {/* 11. PRIVACY */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>11. PRIVACY</h3>
                <p className={styles.text}>
                  Your personal information is handled according to our Privacy Policy. By using our website, you agree to our data practices.
                </p>
              </div>

              {/* 12. CHANGES TO TERMS */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>12. CHANGES TO TERMS</h3>
                <p className={styles.text}>
                  VALNQIX reserves the right to update or modify these Terms & Conditions at any time. Updated terms will be published on this page.
                </p>
              </div>

              {/* 13. CONTACT US */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>13. CONTACT US</h3>
                <p className={styles.text}>
                  For any questions regarding these Terms & Conditions, please contact us at:
                </p>
                <div className={styles.contactDetails}>
                  <p className={styles.text}>
                    <strong>Email:</strong> info@valnqix.in
                  </p>
                </div>
                <p className={styles.trustText}>
                  Thank you for choosing VALNQIX - Your Trusted Technology Partner
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Brands Ribbon */}
        <Brands />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
