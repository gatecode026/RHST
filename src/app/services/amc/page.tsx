import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import styles from './AMC.module.css';

export const metadata: Metadata = {
  title: 'AMC (Annual Maintenance Contract) | RHST E-commerce & IT Solutions',
  description: 'RHST provides an IT Annual Maintenance Contract (AMC) service to deliver proactive IT support to keep your systems, devices, and technology infrastructure secure, high-performing, and operational.',
};

export default function AMCPage() {
  return (
    <>
      {/* Navigation Header */}
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Hero Banner Section */}
        <section className={styles.heroBanner}>
          <div className={styles.heroOverlay} />
        </section>

        {/* Introduction Section */}
        <section className={styles.introSection}>
          <div className="container">
            <div className={styles.introWrapper}>
              <h1 className={styles.introTitle}>
                Hassle-Free IT Maintenance for Continuous Business Performance
              </h1>
              <p className={styles.introText}>
                RHST provides an IT Annual Maintenance Contract (AMC) service to deliver proactive IT support to keep your systems, devices, and technology infrastructure secure, high-performing, and operational throughout the year.
              </p>
              <p className={styles.introText}>
                With RHST's AMC, you get a dedicated team of technical experts who visit your premises regularly to maintain your devices along with regular monitoring, maintenance, and support for your systems.
              </p>
            </div>
          </div>
        </section>

        {/* What is AMC Text Section */}
        <section className={styles.introSection} style={{ paddingTop: 0 }}>
          <div className="container">
            <div className={styles.introWrapper}>
              <h2 className={styles.splitTitle} style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
                What is an Annual Maintenance Contract (AMC)?
              </h2>
              <p className={styles.introText} style={{ marginBottom: '1rem' }}>
                An Annual Maintenance Contract (AMC) is an agreement between RHST and customers where we provide scheduled IT maintenance, technical support, and troubleshooting for a period.
              </p>
              <p className={styles.introText}>
                Our AMC service is signed for a year. The contract can be customized to suit your business requirements.
              </p>
            </div>
          </div>
        </section>

        {/* Our AMC Services Include Section (5 Cards) */}
        <section className={styles.servicesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Our AMC Services Include</h2>

            <div className={styles.servicesGrid}>

              {/* Card 1 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Laptop Monitor SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="#111111" strokeWidth="1.5" />
                    <path d="M6 14v4" stroke="#111111" strokeWidth="1.5" />
                    <path d="M3 18h12" stroke="#3a90f3" strokeWidth="2" />
                    <rect x="12" y="10" width="10" height="7" rx="1" fill="#f5f5f7" stroke="#3a90f3" strokeWidth="1.5" />
                    <path d="M14 17h6" stroke="#3a90f3" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Computer & Laptop AMC</h3>
                <p className={styles.cardDesc}>
                  We provide complete maintenance support for desktops and laptops.
                </p>
              </div>

              {/* Card 2 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Server SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="5" rx="1" stroke="#111111" strokeWidth="1.5" />
                    <rect x="3" y="10" width="18" height="5" rx="1" stroke="#3a90f3" strokeWidth="1.5" />
                    <rect x="3" y="17" width="18" height="5" rx="1" stroke="#111111" strokeWidth="1.5" />
                    <circle cx="6" cy="5.5" r="0.75" fill="#3a90f3" />
                    <circle cx="6" cy="12.5" r="0.75" fill="#111111" />
                    <circle cx="6" cy="19.5" r="0.75" fill="#3a90f3" />
                    <line x1="14" y1="5.5" x2="18" y2="5.5" stroke="#111111" strokeWidth="1.5" />
                    <line x1="14" y1="12.5" x2="18" y2="12.5" stroke="#3a90f3" strokeWidth="1.5" />
                    <line x1="14" y1="19.5" x2="18" y2="19.5" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Server AMC Services</h3>
                <p className={styles.cardDesc}>
                  Ensure your business servers operate smoothly with our professional server maintenance solutions.
                </p>
              </div>

              {/* Card 3 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Network Support SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" stroke="#111111" strokeWidth="1.5" />
                    <circle cx="12" cy="5" r="2.5" fill="#f5d6cb" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="5" cy="17" r="2.5" fill="#f5d6cb" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="19" cy="17" r="2.5" fill="#f5d6cb" stroke="#3a90f3" strokeWidth="1.5" />
                    <line x1="12" y1="7.5" x2="12" y2="9" stroke="#3a90f3" strokeWidth="1.5" />
                    <line x1="7" y1="15" x2="10" y2="13.5" stroke="#3a90f3" strokeWidth="1.5" />
                    <line x1="17" y1="15" x2="14" y2="13.5" stroke="#3a90f3" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Network AMC Services</h3>
                <p className={styles.cardDesc}>
                  Maintain a stable and secure network environment.
                </p>
              </div>

              {/* Card 4 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Hardware repair SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" stroke="#111111" strokeWidth="1.5" />
                    <path d="M6 18c0-2.5 2.5-4.5 6-4.5s6 2 6 4.5" stroke="#111111" strokeWidth="1.5" />
                    <rect x="9" y="16" width="6" height="4" rx="0.5" fill="#3a90f3" stroke="#3a90f3" strokeWidth="1" fillOpacity="0.8" />
                    <line x1="8" y1="20" x2="16" y2="20" stroke="#3a90f3" strokeWidth="1.5" />
                    <path d="M12 4v3M3 10h3M18 10h3M12 16v2" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="12" cy="3" r="1.5" fill="#3a90f3" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Hardware Maintenance AMC</h3>
                <p className={styles.cardDesc}>
                  We provide maintenance support for various IT equipment.
                </p>
              </div>

              {/* Card 5 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Cybersecurity Support SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3a90f3" strokeWidth="1.5" fill="#f5d6cb" />
                    <path d="M9 11l2 2 4-4" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Software & Security Maintenance</h3>
                <p className={styles.cardDesc}>
                  We help keep your software environment updated and protected.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Types of AMC Plans Split Section */}
        <section className={styles.splitSection}>
          <div className="container">
            <div className={styles.twoCol}>

              <div className={styles.textCol}>
                <h2 className={styles.splitTitle}>Types of AMC Plans</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h3 className={styles.benefitsHeading} style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--dark)' }}>
                      Comprehensive AMC
                    </h3>
                    <ul className={styles.benefitsList}>
                      <li className={styles.benefitItem}>Complete hardware and software support</li>
                      <li className={styles.benefitItem}>Regular maintenance visits</li>
                      <li className={styles.benefitItem}>Repair assistance</li>
                      <li className={styles.benefitItem}>Priority technical support</li>
                      <li className={styles.benefitItem}>System monitoring</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className={styles.benefitsHeading} style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--dark)' }}>
                      Non-Comprehensive AMC
                    </h3>
                    <ul className={styles.benefitsList}>
                      <li className={styles.benefitItem}>Regular system checkups</li>
                      <li className={styles.benefitItem}>Technical support</li>
                      <li className={styles.benefitItem}>Troubleshooting services</li>
                      <li className={styles.benefitItem}>Maintenance guidance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.imageCol}>
                <div className={styles.splitImgWrapper}>
                  <img
                    src="/images/it_support_headset_operator.png"
                    alt="AMC Plans Support"
                    className={styles.splitImg}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Our AMC Process Section */}
        <section className={styles.servicesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Our AMC Process</h2>

            <div className={styles.servicesGrid}>

              {/* Process 1 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>IT Assessment</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We analyze your existing IT infrastructure and requirements.
                </p>
              </div>

              {/* Process 2 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Customized AMC Plan</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We create a maintenance plan according to your business needs.
                </p>
              </div>

              {/* Process 3 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Regular Monitoring</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Our team performs scheduled maintenance and system checks.
                </p>
              </div>

              {/* Process 4 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Issue Resolution</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Technical problems are identified and resolved quickly.
                </p>
              </div>

              {/* Process 5 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Performance Improvement</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We optimize your systems for better reliability and efficiency.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Benefits of Choosing RHST AMC Services (Grid of 8 image cards) */}
        <section className={styles.benefitsSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Benefits of RHST AMC Services</h2>

            <div className={styles.benefitsGrid}>

              {/* Benefit 1 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20305%20(2).png"
                    alt="Reduced Downtime"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Reduced Downtime</h3>
              </div>

              {/* Benefit 2 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20300%20(3).png"
                    alt="Cost Savings"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Cost Savings</h3>
              </div>

              {/* Benefit 3 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20301%20(3).png"
                    alt="Better System Performance"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Better System Performance</h3>
              </div>

              {/* Benefit 4 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20299%20(2).png?updatedAt=1783511107228"
                    alt="Expert Technical Support"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Expert Technical Support</h3>
              </div>

              {/* Benefit 5 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20303%20(3).png"
                    alt="Improved Security"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Improved Security</h3>
              </div>

              {/* Benefit 6 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20304%20(3).png"
                    alt="Proactive Issue Detection"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Proactive Issue Detection</h3>
              </div>

              {/* Benefit 7 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20305%20(3).png"
                    alt="Priority Service Support"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Priority Service Support</h3>
              </div>

              {/* Benefit 8 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20306%20(3).png"
                    alt="Complete IT Management"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Complete IT Management</h3>
              </div>

            </div>
          </div>
        </section>

        {/* Why RHST IT-Ecommerce Pvt. Ltd. (Dark Banner) */}
        <section className={styles.darkBanner}>
          <div className="container">
            <h2 className={styles.darkBannerTitle}>Why RHST IT-Ecommerce Pvt. Ltd.?</h2>
            <p className={styles.darkBannerText}>
              RHST provides dependable IT maintenance solutions with experienced technicians, customized service plans, and proactive support. We help businesses focus on growth while we take care of their technology infrastructure.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className={styles.formSection}>
          <div className="container">
            <div className={styles.formContainer}>
              <h2 className={styles.formTitle}>ANY QUESTIONS?</h2>
              <p className={styles.formDesc}>
                Fill out the form below to get in touch with us.
              </p>

              <ContactForm type="it-support" styles={styles} />
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
