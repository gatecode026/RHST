import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Features from '@/components/Features';
import OurServices from '@/components/OurServices';
import CustomerReviews from '@/components/CustomerReviews';
import OurBlog from '@/components/OurBlog';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import PageFAQ from '@/components/PageFAQ';
import { ABOUT_FAQS } from '@/data/faqs';
import { getCanonicalUrl } from '@/lib/seo';
import { getOrganizationSchema, getBreadcrumbSchema } from '@/lib/schema';
import styles from './About.module.css';

export const metadata: Metadata = {
  title: 'About Us | VALNQIX E-commerce & IT Solutions',
  description: 'Learn more about VALNQIX, our mission to connect people and businesses with top-tier technology, and our vision to lead digital transformation.',
  alternates: {
    canonical: getCanonicalUrl('/about'),
  },
};

export default function AboutPage() {
  const orgSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'About Us', url: '/about' }
  ]);

  return (
    <>
      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      {/* BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Navigation Header */}
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Breadcrumb Banner */}
        <section className={styles.breadcrumbBanner}>
          <div className="container">
            <h1 className={styles.breadcrumbTitle}>About Us</h1>
            <div className={styles.breadcrumbs}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
              <span>About</span>
            </div>
          </div>
        </section>

        {/* Features Component */}
        <Features />

        {/* About VALNQIX Content Grid */}
        <section className={styles.aboutContentSection}>
          <div className="container">
            <div className={styles.introGrid}>
              <div className={styles.introImageWrapper}>
                <img
                  src="https://ik.imagekit.io/zp0tch54w/RHST/igor-miske-CwVE4xCAA8Y-unsplash.png?tr=w-600,f-auto,q-80"
                  alt="VALNQIX Team Collaborating"
                  width={540}
                  height={360}
                  loading="lazy"
                  decoding="async"
                  className={styles.introImage}
                />
              </div>
              <div className={styles.introText}>
                <h2 className={styles.introTitle}>ABOUT VALNQIX</h2>
                <p className={styles.introParagraph}>
                  VALNQIX is a brand under RHST E-Commerce Pvt. Ltd., committed to providing high-quality IT products and services, tailoring solutions to meet the needs of businesses and individuals. We focus on key functional areas: Hardware, Software, Networking, and Digital Solutions to help clients navigate the demands of an evolving technology environment.
                </p>
                <p className={styles.introParagraph}>
                  With a focus on quality, reliability, and customer satisfaction, VALNQIX offers a diverse range of IT products, including computers, laptops, accessories, networking devices, software licenses, and enterprise technology products. Our goal is to make technology more accessible, reliable, and simple to use.
                </p>
                <Link href="/products" className={styles.ctaButton}>
                  EXPLORE OUR PRODUCTS
                </Link>
              </div>
            </div>

            {/* Vision & Mission Section */}
            <div className={styles.visionMissionSection}>
              <div className={styles.darkCard}>
                {/* Vision Panel */}
                <div className={styles.panel}>
                  <span className={styles.badge}>What We Aspire For</span>
                  <h3 className={styles.panelTitle}>OUR VISION</h3>
                  <p className={styles.panelText}>
                    Our vision is to become a leading IT-Ecommerce platform that connects people and businesses with the latest technology solutions. We aim to build a digital marketplace where customers can discover, compare, and purchase IT products with confidence and convenience.
                  </p>
                  <p className={styles.panelText}>
                    We envision VALNQIX as a trusted technology partner that supports digital transformation by providing smart solutions, advanced products, and exceptional service. Through continuous innovation, strong partnerships, and customer-first values, we strive to create a future where technology becomes simpler, smarter, and more accessible for everyone.
                  </p>
                  <p className={styles.panelText} style={{ fontWeight: 400, color: '#ffffff', letterSpacing: '0.02em' }}>
                    VALNQIX - Empowering Digital Growth Through Technology.
                  </p>
                </div>

                <hr className={styles.divider} />

                {/* Mission Panel */}
                <div className={styles.panel}>
                  <span className={styles.badge}>Our Core Objectives</span>
                  <h3 className={styles.panelTitle}>OUR MISSION</h3>
                  <p className={styles.panelText}>
                    At VALNQIX, our mission is to provide reliable, innovative, and customer-focused IT solutions by making high-quality technology products easily accessible to businesses and individuals. We aim to simplify the technology purchasing experience by offering genuine products, competitive pricing, and dependable services through our IT-Ecommerce platform.

                  </p>
                  <p className={styles.panelText}>
                    We are committed to understanding our customers’ technology needs and delivering solutions that improve productivity, efficiency, and digital growth. From advanced hardware and software solutions to networking and IT support services, we focus on providing products and services that create real value.
                  </p>

                  <p className={styles.panelText}>
                    Our mission is built on three core principles:
                  </p>
                  <ul className={styles.panelList}>
                    <li className={styles.panelListItem}>
                      <strong>Quality:</strong> Delivering trusted and authentic IT products from reliable sources.
                    </li>
                    <li className={styles.panelListItem}>
                      <strong>Innovation:</strong> Bringing the latest technology solutions to meet modern digital requirements.
                    </li>
                    <li className={styles.panelListItem}>
                      <strong>Customer Satisfaction:</strong> Providing a smooth shopping experience with excellent support and service.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Corporate Governance & E-E-A-T Details Section */}
        <section className={styles.corporateSection}>
          <div className="container">
            <div className={styles.corporateHeader}>
              <span className={styles.corporateBadge}>E-E-A-T Corporate Verification</span>
              <h2 className={styles.corporateTitle}>Corporate Governance &amp; Legal Identity</h2>
              <p className={styles.corporateSubtitle}>
                VALNQIX is an enterprise IT hardware marketplace and managed technology solutions platform owned and operated by <strong>RHST E-Commerce Pvt. Ltd.</strong> We maintain complete statutory transparency, registered corporate offices, and verified tax credentials.
              </p>
            </div>

            <div className={styles.corporateGrid}>
              {/* Card 1: Parent Entity & Registration */}
              <div className={styles.corporateCard}>
                <div className={styles.corporateCardIcon}>🏛️</div>
                <h3 className={styles.corporateCardTitle}>Parent Legal Entity</h3>
                <ul className={styles.corporateDetailList}>
                  <li className={styles.corporateDetailItem}>
                    <span className={styles.corporateDetailLabel}>Company Legal Name</span>
                    <span className={styles.corporateDetailValue}>RHST E-Commerce Pvt. Ltd.</span>
                  </li>
                  <li className={styles.corporateDetailItem}>
                    <span className={styles.corporateDetailLabel}>Corporate Identity No. (CIN)</span>
                    <span className={styles.corporateDetailValue} style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>
                      U47912RJ2026PTC115018
                    </span>
                  </li>
                  <li className={styles.corporateDetailItem}>
                    <span className={styles.corporateDetailLabel}>MCA Registrar of Companies</span>
                    <span className={styles.corporateDetailValue}>RoC Jaipur (Ministry of Corporate Affairs)</span>
                  </li>
                  <li className={styles.corporateDetailItem}>
                    <span className={styles.corporateDetailLabel}>Brand / Commercial Trading Name</span>
                    <span className={styles.corporateDetailValue}>VALNQIX</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Tax & Statutory Compliance */}
              <div className={styles.corporateCard}>
                <div className={styles.corporateCardIcon}>📋</div>
                <h3 className={styles.corporateCardTitle}>Tax &amp; Statutory Compliance</h3>
                <ul className={styles.corporateDetailList}>
                  <li className={styles.corporateDetailItem}>
                    <span className={styles.corporateDetailLabel}>Goods &amp; Services Tax (GSTIN)</span>
                    <span className={styles.corporateDetailValue} style={{ fontFamily: 'monospace', fontWeight: 700, color: '#16a34a' }}>
                      08AAPCR9622R1Z9
                    </span>
                  </li>
                  <li className={styles.corporateDetailItem}>
                    <span className={styles.corporateDetailLabel}>State Tax Jurisdiction</span>
                    <span className={styles.corporateDetailValue}>Rajasthan, State Code: 08</span>
                  </li>
                  <li className={styles.corporateDetailItem}>
                    <span className={styles.corporateDetailLabel}>PAN Identifier</span>
                    <span className={styles.corporateDetailValue} style={{ fontFamily: 'monospace' }}>AAPCR9622R</span>
                  </li>
                  <li className={styles.corporateDetailItem}>
                    <span className={styles.corporateDetailLabel}>B2B Invoicing &amp; Tax Credits</span>
                    <span className={styles.corporateDetailValue}>100% GST-compliant tax invoices with full Input Tax Credit (ITC) eligibility</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: Offices & Support Desks */}
              <div className={styles.corporateCard}>
                <div className={styles.corporateCardIcon}>📍</div>
                <h3 className={styles.corporateCardTitle}>Offices &amp; Support Contact</h3>
                <ul className={styles.corporateDetailList}>
                  <li className={styles.corporateDetailItem}>
                    <span className={styles.corporateDetailLabel}>Noida Corporate Office</span>
                    <span className={styles.corporateDetailValue}>
                      G-52, Sector 63, UP, NOIDA, Uttar Pradesh, India - 201301
                    </span>
                  </li>
                  <li className={styles.corporateDetailItem}>
                    <span className={styles.corporateDetailLabel}>Registered Corporate Office</span>
                    <span className={styles.corporateDetailValue}>
                      Khasra 5437/1641 Kali Ka, Khana Sanganer Chapola, Sanganer Bazar, Sanganer, Jaipur, Rajasthan, India - 302029
                    </span>
                  </li>
                  <li className={styles.corporateDetailItem}>
                    <span className={styles.corporateDetailLabel}>Customer Support Phone</span>
                    <span className={styles.corporateDetailValue}>
                      <a href="tel:+919829012345" className={styles.corporateDetailLink} style={{ fontWeight: 700 }}>
                        +91 98290 12345
                      </a>
                    </span>
                  </li>
                  <li className={styles.corporateDetailItem}>
                    <span className={styles.corporateDetailLabel}>Official Support Email</span>
                    <span className={styles.corporateDetailValue}>
                      <a href="mailto:info@valnqix.in" className={styles.corporateDetailLink}>
                        info@valnqix.in
                      </a>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Trust Assurance Banner */}
            <div className={styles.corporateTrustBanner}>
              <div className={styles.trustBannerText}>
                <h4>Enterprise Trust &amp; Procurement Guarantee</h4>
                <p>
                  Every commercial transaction, quotation request, and service engagement processed via VALNQIX is backed by verifiable parent company governance, audited invoices, and direct OEM brand warranty coverage.
                </p>
              </div>
              <div className={styles.trustBannerBadges}>
                <span className={styles.trustPill}>✓ MCA Verified Company</span>
                <span className={styles.trustPill}>✓ Active GSTIN: 08AAPCR9622R1Z9</span>
                <span className={styles.trustPill}>✓ Noida Operations Hub</span>
              </div>
            </div>
          </div>
        </section>

        {/* Reused Home Page Sections */}
        <OurServices />
        <PageFAQ
          title="About VALNQIX & Corporate Verification FAQs"
          subtitle="Learn more about our relationship with RHST E-Commerce Pvt. Ltd., verified suppliers, and nationwide logistics."
          badge="Company & Trust Verification"
          faqs={ABOUT_FAQS}
        />
        <CustomerReviews />
        <OurBlog />
        <Brands />
      </main>

      {/* Structured Dark Footer */}
      <Footer />
    </>
  );
}
