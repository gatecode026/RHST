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
import styles from './About.module.css';

export const metadata: Metadata = {
  title: 'About Us | RHST E-commerce & IT Solutions',
  description: 'Learn more about RHST, our mission to connect people and businesses with top-tier technology, and our vision to lead digital transformation.',
};

export default function AboutPage() {
  return (
    <>
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

        {/* About RHST Content Grid */}
        <section className={styles.aboutContentSection}>
          <div className="container">
            <div className={styles.introGrid}>
              <div className={styles.introImageWrapper}>
                <img
                  src="https://ik.imagekit.io/zp0tch54w/RHST/igor-miske-CwVE4xCAA8Y-unsplash.png"
                  alt="RHST Team Collaborating"
                  className={styles.introImage}
                />
              </div>
              <div className={styles.introText}>
                <h2 className={styles.introTitle}>ABOUT RHST</h2>
                <p className={styles.introParagraph}>
                  At RHST, we are committed to providing high-quality IT products and services, tailoring solutions to meet the needs of businesses and individuals. We focus on key functional areas: Hardware, Software, Networking, and Digital Solutions to help clients navigate the demands of an evolving technology environment.
                </p>
                <p className={styles.introParagraph}>
                  With a focus on quality, reliability, and customer satisfaction, RHST offers a diverse range of IT products, including computers, laptops, accessories, networking devices, software licenses, and enterprise technology products. Our goal is to make technology more accessible, reliable, and simple to use.
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
                    We envision RHST as a trusted technology partner that supports digital transformation by providing smart solutions, advanced products, and exceptional service. Through continuous innovation, strong partnerships, and customer-first values, we strive to create a future where technology becomes simpler, smarter, and more accessible for everyone.
                  </p>
                  <p className={styles.panelText} style={{ fontWeight: 400, color: '#ffffff', letterSpacing: '0.02em' }}>
                    RHST - Empowering Digital Growth Through Technology.
                  </p>
                </div>

                <hr className={styles.divider} />

                {/* Mission Panel */}
                <div className={styles.panel}>
                  <span className={styles.badge}>Our Core Objectives</span>
                  <h3 className={styles.panelTitle}>OUR MISSION</h3>
                  <p className={styles.panelText}>
                    At RHST, our mission is to provide reliable, innovative, and customer-focused IT solutions by making high-quality technology products easily accessible to businesses and individuals. We aim to simplify the technology purchasing experience by offering genuine products, competitive pricing, and dependable services through our IT-Ecommerce platform.

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

        {/* Reused Home Page Sections */}
        <OurServices />
        <CustomerReviews />
        <OurBlog />
        <Brands />
      </main>

      {/* Structured Dark Footer */}
      <Footer />
    </>
  );
}
