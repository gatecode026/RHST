import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import styles from './Privacy.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy | RHST E-commerce & IT Solutions',
  description: 'Read the privacy policy of RHST to understand how we collect, use, store, and protect your personal and technical information.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Navigation Header */}
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Breadcrumb Banner */}
        <section className={styles.breadcrumbBanner}>
          <div className="container">
            <h1 className={styles.breadcrumbTitle}>PRIVACY POLICY</h1>
            <div className={styles.breadcrumbs}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>&gt;</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content Section */}
        <section className={styles.privacySection}>
          <div className="container">
            <div className={styles.contentWrapper}>

              {/* Introduction Block */}
              <div className={styles.introBlock}>
                <h2 className={styles.policyTitle}>PRIVACY POLICY</h2>
                <p className={styles.lastUpdated}>Last Updated: 2026</p>
                <p className={styles.introParagraph}>
                  At RHST, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website, purchase products, or use our services.
                </p>
                <p className={styles.agreeText}>
                  By using the RHST website, you agree to the practices described in this Privacy Policy.
                </p>
              </div>

              {/* 1. Information We Collect */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>1. INFORMATION WE COLLECT</h3>
                <p className={styles.text}>
                  When you use our website, we may collect the following information:
                </p>

                <h4 className={styles.subHeading}>Personal Information:</h4>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Full Name</li>
                  <li className={styles.listItem}>Email Address</li>
                  <li className={styles.listItem}>Phone Number</li>
                  <li className={styles.listItem}>Billing &amp; Shipping Address</li>
                  <li className={styles.listItem}>Account Information</li>
                  <li className={styles.listItem}>Payment details (processed securely through payment providers)</li>
                </ul>

                <h4 className={styles.subHeading}>Technical Information:</h4>
                <ul className={styles.list}>
                  <li className={styles.listItem}>IP Address</li>
                  <li className={styles.listItem}>Browser type</li>
                  <li className={styles.listItem}>Device information</li>
                  <li className={styles.listItem}>Website usage data</li>
                  <li className={styles.listItem}>Cookies and tracking information</li>
                </ul>
              </div>

              {/* 2. How We Use Your Information */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>2. HOW WE USE YOUR INFORMATION</h3>
                <p className={styles.text}>
                  We use your information to:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Process and deliver your orders</li>
                  <li className={styles.listItem}>Manage your account</li>
                  <li className={styles.listItem}>Provide customer support</li>
                  <li className={styles.listItem}>Improve website performance and user experience</li>
                  <li className={styles.listItem}>Send order updates and important notifications</li>
                  <li className={styles.listItem}>Share product updates, offers, and promotions (with your consent)</li>
                  <li className={styles.listItem}>Prevent fraudulent activities and maintain website security</li>
                </ul>
              </div>

              {/* 3. Product Orders & Payments */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>3. PRODUCT ORDERS &amp; PAYMENTS</h3>
                <p className={styles.text}>
                  RHST provides secure online shopping services. Payment information is handled through trusted and secure payment gateways. We do not store complete payment card details on our servers.
                </p>
              </div>

              {/* 4. Cookies Policy */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>4. COOKIES POLICY</h3>
                <p className={styles.text}>
                  Our website uses cookies to improve your browsing experience. Cookies help us:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Remember user preferences</li>
                  <li className={styles.listItem}>Understand website traffic</li>
                  <li className={styles.listItem}>Improve website functionality</li>
                  <li className={styles.listItem}>Provide relevant services and offers</li>
                </ul>
                <p className={styles.text}>
                  You can manage or disable cookies through your browser settings.
                </p>
              </div>

              {/* 5. Information Sharing */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>5. INFORMATION SHARING</h3>
                <p className={styles.text}>
                  RHST does not sell, rent, or trade your personal information.
                </p>
                <p className={styles.text}>
                  We may share limited information with:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Delivery partners for order fulfillment</li>
                  <li className={styles.listItem}>Payment service providers for transaction processing</li>
                  <li className={styles.listItem}>Service providers who help us operate our website</li>
                </ul>
                <p className={styles.text}>
                  All third parties are required to maintain the confidentiality and security of your information.
                </p>
              </div>

              {/* 6. Data Security */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>6. DATA SECURITY</h3>
                <p className={styles.text}>
                  We take appropriate security measures to protect your personal information from:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Unauthorized access</li>
                  <li className={styles.listItem}>Data misuse</li>
                  <li className={styles.listItem}>Loss or alteration</li>
                  <li className={styles.listItem}>Security threats</li>
                </ul>
                <p className={styles.text}>
                  However, no online platform can guarantee complete security of information transmitted over the internet.
                </p>
              </div>

              {/* 7. Your Rights */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>7. YOUR RIGHTS</h3>
                <p className={styles.text}>
                  You have the right to:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Access your personal information</li>
                  <li className={styles.listItem}>Update or correct your account details</li>
                  <li className={styles.listItem}>Request deletion of your personal information</li>
                  <li className={styles.listItem}>Opt-out of promotional communications</li>
                </ul>
                <p className={styles.text}>
                  For any requests, you can contact our support team.
                </p>
              </div>

              {/* 8. Third-Party Links */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>8. THIRD-PARTY LINKS</h3>
                <p className={styles.text}>
                  Our website may contain links to external sites. RHST is not responsible for the privacy practices or content of third-party websites.
                </p>
              </div>

              {/* 9. Children's Privacy */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>9. CHILDREN'S PRIVACY</h3>
                <p className={styles.text}>
                  RHST does not knowingly collect personal information from children. Users must be of an appropriate age to create an account and make purchases.                </p>
              </div>

              {/* 10. Changes To This Privacy Policy */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>10. CHANGES TO THIS PRIVACY POLICY</h3>
                <p className={styles.text}>
                  We may update this Privacy Policy from time to time to reflect changes in our services, technology, or legal requirements. Any updates will be posted on this page.
                </p>
              </div>

              {/* 11. Contact Us */}
              <div className={styles.policyBlock} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <h3 className={styles.sectionHeading}>11. CONTACT US</h3>
                <p className={styles.text}>
                  If you have any questions regarding this Privacy Policy, please contact us:
                </p>
                <div className={styles.contactDetails}>
                  <p className={styles.text}><strong>RHST - Ecommerce Private Limited</strong></p>
                  <p className={styles.text}>Email: rhst@gmail.com</p>
                  <p className={styles.text}>Phone: +91-8387634520</p>
                </div>
                <p className={styles.trustText}>
                  Your trust and privacy are important to us.
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
