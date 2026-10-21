import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import styles from './Return.module.css';

export const metadata: Metadata = {
  title: 'Return Policy | VALNQIX E-commerce & IT Solutions',
  description: 'Read the return and replacement policy of VALNQIX to understand return eligibility, time periods, non-returnable products, and refunds.',
};

export default function ReturnPolicyPage() {
  return (
    <>
      {/* Navigation Header */}
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Breadcrumb Banner */}
        <section className={styles.breadcrumbBanner}>
          <div className="container">
            <h1 className={styles.breadcrumbTitle}>RETURN POLICY</h1>
            <div className={styles.breadcrumbs}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>&gt;</span>
              <span>Return Policy</span>
            </div>
          </div>
        </section>

        {/* Return Policy Content Section */}
        <section className={styles.returnSection}>
          <div className="container">
            <div className={styles.contentWrapper}>
              
              {/* Introduction Block */}
              <div className={styles.introBlock}>
                <h2 className={styles.policyTitle}>RETURN POLICY</h2>
                <p className={styles.lastUpdated}>Last Updated: 2026</p>
                <p className={styles.introParagraph}>
                  At VALNQIX, we aim to provide high-quality IT products and a reliable shopping experience. If you receive a damaged, defective, or incorrect product, we are here to help you with our return and replacement process.
                </p>
              </div>

              {/* 1. Return Eligibility */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>1. RETURN ELIGIBILITY</h3>
                <p className={styles.text}>
                  Products purchased from VALNQIX may be eligible for return if:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>The product is received damaged or defective</li>
                  <li className={styles.listItem}>The wrong product has been delivered</li>
                  <li className={styles.listItem}>The product received is different from the order details</li>
                  <li className={styles.listItem}>The product has manufacturing defects</li>
                </ul>
                <p className={styles.text}>
                  Return requests must be submitted within the specified return period.
                </p>
              </div>

              {/* 2. Return Time Period */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>2. RETURN TIME PERIOD</h3>
                <p className={styles.text}>
                  Customers must request a return within:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>7 days from the date of delivery for eligible products</li>
                </ul>
                <p className={styles.text}>
                  Requests submitted after this period may not be accepted.
                </p>
              </div>

              {/* 3. Conditions for Return */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>3. CONDITIONS FOR RETURN</h3>
                <p className={styles.text}>
                  To qualify for returns:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Product must be unused and in original condition</li>
                  <li className={styles.listItem}>Original packaging, accessories, manuals, and invoices must be available</li>
                  <li className={styles.listItem}>Product serial number and warranty details should remain unchanged</li>
                  <li className={styles.listItem}>Products should not have physical damage caused by misuse</li>
                </ul>
              </div>

              {/* 4. Non-Returnable Products */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>4. NON-RETURNABLE PRODUCTS</h3>
                <p className={styles.text}>
                  The following products may not be eligible for return:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Software licenses and digital products</li>
                  <li className={styles.listItem}>Downloadable products</li>
                  <li className={styles.listItem}>Products damaged due to improper use</li>
                  <li className={styles.listItem}>Items missing original packaging or accessories</li>
                  <li className={styles.listItem}>Products with removed warranty labels or serial numbers</li>
                </ul>
              </div>

              {/* 5. Return Process */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>5. RETURN PROCESS</h3>
                <p className={styles.text}>
                  To request a return:
                </p>
                <ol className={styles.orderedList}>
                  <li className={styles.orderedListItem}>Contact VALNQIX customer support</li>
                  <li className={styles.orderedListItem}>Share your order details and reason for return</li>
                  <li className={styles.orderedListItem}>Provide images/videos of damaged or incorrect products if required</li>
                  <li className={styles.orderedListItem}>Our team will verify the request</li>
                  <li className={styles.orderedListItem}>Approved returns will be processed for replacement or refund</li>
                </ol>
              </div>

              {/* 6. Replacement Policy */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>6. REPLACEMENT POLICY</h3>
                <p className={styles.text}>
                  If a product is approved for replacement:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Replacement will be initiated after product verification</li>
                  <li className={styles.listItem}>Replacement depends on product availability</li>
                  <li className={styles.listItem}>Delivery time may vary based on location and stock availability</li>
                </ul>
              </div>

              {/* 7. Refund Policy */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>7. REFUND POLICY</h3>
                <p className={styles.text}>
                  For approved refunds:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Refunds will be processed after product inspection</li>
                  <li className={styles.listItem}>Refunds will be issued through the original payment method</li>
                  <li className={styles.listItem}>Processing time may vary depending on the payment provider</li>
                </ul>
              </div>

              {/* 8. Warranty Claims */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>8. WARRANTY CLAIMS</h3>
                <p className={styles.text}>
                  For products covered under manufacturer warranty:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Warranty services will follow the brand's warranty terms</li>
                  <li className={styles.listItem}>Customers may need to contact the authorized service center</li>
                </ul>
              </div>

              {/* 9. Cancellation Policy */}
              <div className={styles.policyBlock}>
                <h3 className={styles.sectionHeading}>9. CANCELLATION POLICY</h3>
                <p className={styles.text}>
                  Orders can be cancelled before shipment confirmation.
                </p>
                <p className={styles.text}>
                  Once an order has been shipped, cancellation requests may not be accepted.
                </p>
              </div>

              {/* 10. Contact Us */}
              <div className={styles.policyBlock} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <h3 className={styles.sectionHeading}>10. CONTACT US</h3>
                <p className={styles.text}>
                  For return and replacement queries:
                </p>
                <div className={styles.contactDetails}>
                  <p className={styles.text}><strong>VALNQIX IT-Ecommerce Private Limited</strong></p>
                  <p className={styles.text}>Email: info@valnqix.in</p>
                </div>
                <p className={styles.trustText} style={{ fontWeight: 500, color: 'var(--dark)' }}>
                  We are committed to providing quality products and customer satisfaction.
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
