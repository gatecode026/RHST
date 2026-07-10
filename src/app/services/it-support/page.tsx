import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import styles from './ITSupport.module.css';

export const metadata: Metadata = {
  title: 'IT Support & Repair Services | RHST E-commerce & IT Solutions',
  description: 'At RHST, we provide professional IT Support and Repair Services to keep your technology systems running smoothly and efficiently. Explore our remote and on-site support options.',
};

export default function ITSupportPage() {
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
                Reliable IT Support for Your Business & Technology Needs
              </h1>
              <p className={styles.introText}>
                At RHST, we understand that technology plays a critical role in the success of every business. Our IT Support Services are designed to ensure that your systems, devices, networks, and software operate smoothly, securely, and efficiently.
              </p>
              <p className={styles.introText}>
                Whether you are a small business, growing organization, or enterprise, our experienced support team is ready to provide timely technical assistance and reliable solutions to minimize downtime and maximize productivity.
              </p>
            </div>
          </div>
        </section>

        {/* Our IT Support Services (First Grid - 5 Cards) */}
        <section className={styles.servicesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Our IT Support Services</h2>

            <div className={styles.servicesGrid}>

              {/* Card 1 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Laptop/Desktop Monitor SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="#111111" strokeWidth="1.5" />
                    <path d="M6 14v4" stroke="#111111" strokeWidth="1.5" />
                    <path d="M3 18h12" stroke="#3a90f3" strokeWidth="2" />
                    <rect x="12" y="10" width="10" height="7" rx="1" fill="#f5f5f7" stroke="#3a90f3" strokeWidth="1.5" />
                    <path d="M14 17h6" stroke="#3a90f3" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Desktop & Laptop Support</h3>
                <p className={styles.cardDesc}>
                  We provide comprehensive support for desktops, laptops, and workstations to ensure continuous performance.
                </p>
              </div>

              {/* Card 2 */}
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
                <h3 className={styles.cardTitle}>Network Support & Management</h3>
                <p className={styles.cardDesc}>
                  Setting up, monitoring, and troubleshooting office networks to guarantee strong connectivity.
                </p>
              </div>

              {/* Card 3 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Software Support SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="12" rx="2" stroke="#111111" strokeWidth="1.5" />
                    <path d="M7 20h10" stroke="#3a90f3" strokeWidth="2" />
                    <path d="M12 16v4" stroke="#3a90f3" strokeWidth="1.5" />
                    <path d="M7 8l3 2-3 2" stroke="#3a90f3" strokeWidth="1.5" />
                    <line x1="12" y1="12" x2="16" y2="12" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Software Support</h3>
                <p className={styles.cardDesc}>
                  Our expert help helps in installation, updates, and troubleshooting of OS and professional applications.
                </p>
              </div>

              {/* Card 4 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Server Support SVG */}
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
                <h3 className={styles.cardTitle}>Server Support</h3>
                <p className={styles.cardDesc}>
                  Full administration, updates, and troubleshooting for database and application servers.
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
                <h3 className={styles.cardTitle}>Cybersecurity Support</h3>
                <p className={styles.cardDesc}>
                  Protecting your network with firewalls, anti-virus setups, security audits, and active threat monitoring.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Remote IT Support Split Section */}
        <section className={styles.splitSection}>
          <div className="container">
            <div className={styles.twoCol}>

              <div className={styles.textCol}>
                <h2 className={styles.splitTitle}>Remote IT Support</h2>
                <p className={styles.splitDesc}>
                  Our remote support services provide instant troubleshooting assistance for software, hardware, and configuration issues over the internet.
                </p>
                <h3 className={styles.benefitsHeading}>Benefits include:</h3>
                <ul className={styles.benefitsList}>
                  <li className={styles.benefitItem}>Faster turnaround times</li>
                  <li className={styles.benefitItem}>Proactive monitoring</li>
                  <li className={styles.benefitItem}>Cost-efficient support</li>
                  <li className={styles.benefitItem}>Safe and secure solutions</li>
                  <li className={styles.benefitItem}>Real-time diagnostics</li>
                </ul>
              </div>

              <div className={styles.imageCol}>
                <div className={styles.splitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20297.png"
                    alt="Remote IT Support"
                    className={styles.splitImg}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* On-Site IT Support Split Section */}
        <section className={styles.splitSection} style={{ paddingTop: 0 }}>
          <div className="container">
            <div className={styles.twoCol}>

              <div className={styles.textCol}>
                <h2 className={styles.splitTitle}>On-Site IT Support</h2>
                <p className={styles.splitDesc}>
                  For issues requiring physical intervention, our technicians can provide fast on-site support. Ideal for:
                </p>
                <ul className={styles.benefitsList}>
                  <li className={styles.benefitItem}>New hardware installations</li>
                  <li className={styles.benefitItem}>Cable management</li>
                  <li className={styles.benefitItem}>Physical system damage</li>
                  <li className={styles.benefitItem}>Network switch/router upgrades</li>
                  <li className={styles.benefitItem}>Regular hardware cleaning & audits</li>
                </ul>
              </div>

              <div className={styles.imageCol}>
                <div className={styles.splitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20298.png"
                    alt="On-Site IT Support"
                    className={styles.splitImg}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Our IT Support Services (Second Grid - Benefits - 5 Cards without icons) */}
        <section className={styles.servicesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Our IT Support Services</h2>

            <div className={styles.servicesGrid}>

              {/* Card 1 */}
              <div className={styles.serviceCard} style={{ padding: '2.5rem 1.5rem' }}>
                <h3 className={styles.cardTitle} style={{ minHeight: 'auto', marginBottom: '0.85rem', fontWeight: 600 }}>
                  Quick Response Time
                </h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Our support team responds promptly to technical issues to reduce business interruptions.
                </p>
              </div>

              {/* Card 2 */}
              <div className={styles.serviceCard} style={{ padding: '2.5rem 1.5rem' }}>
                <h3 className={styles.cardTitle} style={{ minHeight: 'auto', marginBottom: '0.85rem', fontWeight: 600 }}>
                  Experienced Professionals
                </h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Our IT specialists have extensive experience in managing diverse technology environments.
                </p>
              </div>

              {/* Card 3 */}
              <div className={styles.serviceCard} style={{ padding: '2.5rem 1.5rem' }}>
                <h3 className={styles.cardTitle} style={{ minHeight: 'auto', marginBottom: '0.85rem', fontWeight: 600 }}>
                  Proactive Monitoring
                </h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We identify and address potential issues before they impact your operations.
                </p>
              </div>

              {/* Card 4 */}
              <div className={styles.serviceCard} style={{ padding: '2.5rem 1.5rem' }}>
                <h3 className={styles.cardTitle} style={{ minHeight: 'auto', marginBottom: '0.85rem', fontWeight: 600 }}>
                  Cost-Effective Solutions
                </h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We provide reliable support services designed to maximize value and performance.
                </p>
              </div>

              {/* Card 5 */}
              <div className={styles.serviceCard} style={{ padding: '2.5rem 1.5rem' }}>
                <h3 className={styles.cardTitle} style={{ minHeight: 'auto', marginBottom: '0.85rem', fontWeight: 600 }}>
                  Enhanced Security
                </h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Our support services help safeguard your systems, data, and digital assets.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Industries We Serve (Grid of 8 image cards) */}
        <section className={styles.benefitsSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Industries We Serve</h2>

            <div className={styles.benefitsGrid}>

              {/* Industry 1 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20299%20(1).png"
                    alt="Small Businesses"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Small Businesses</h3>
              </div>

              {/* Industry 2 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20300%20(1).png"
                    alt="Corporate Offices"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Corporate Offices</h3>
              </div>

              {/* Industry 3 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20301%20(1).png"
                    alt="Educational Institutions"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Educational Institutions</h3>
              </div>

              {/* Industry 4 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20302%20(1).png"
                    alt="Healthcare Organisations"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Healthcare Organisations</h3>
              </div>

              {/* Industry 5 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20303%20(1).png"
                    alt="Retail Businesses"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Retail Businesses</h3>
              </div>

              {/* Industry 6 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20304%20(1).png"
                    alt="Startups"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Startups</h3>
              </div>

              {/* Industry 7 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20305%20(1).png"
                    alt="Manufacturing Companies"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Manufacturing Companies</h3>
              </div>

              {/* Industry 8 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20306%20(1).png"
                    alt="Service Providers"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Service Providers</h3>
              </div>

            </div>
          </div>
        </section>

        {/* Why RHST IT-Ecommerce Pvt. Ltd. (Dark Banner) */}
        <section className={styles.darkBanner}>
          <div className="container">
            <h2 className={styles.darkBannerTitle}>Why RHST IT-Ecommerce Pvt. Ltd.?</h2>
            <p className={styles.darkBannerText}>
              At RHST, our goal is to deliver reliable technology solutions that help run and grow your business. We understand each client is unique, which is why we tailor our IT support to fit your specific needs.
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
