import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import styles from './RepairMaintenance.module.css';

export const metadata: Metadata = {
  title: 'IT Repair & Maintenance Services | RHST E-commerce & IT Solutions',
  description: 'Explore the IT repair and maintenance services offered by RHST IT-Ecommerce. We provide desktop and laptop repair, hardware setups, software configurations, network setups, database support, and security audits.',
};

export default function RepairMaintenancePage() {
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
                Reliable IT Repair & Maintenance Solutions for Long-Term Performance
              </h1>
              <p className={styles.introText}>
                At RHST, we provide professional IT Repair & Maintenance Services to keep your technology systems running smoothly and efficiently. Our expert technicians diagnose, repair, and maintain your IT equipment to reduce downtime, improve performance, and extend the life of your devices.
              </p>
              <p className={styles.introText}>
                Whether it is a hardware issue, software problem, network failure, or regular system maintenance, RHST delivers fast and reliable solutions for individuals and businesses.
              </p>
            </div>
          </div>
        </section>

        {/* Our IT Repair Services (Grid 1 - 10 Cards) */}
        <section className={styles.servicesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Our IT Repair Services</h2>

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
                <h3 className={styles.cardTitle}>Computer & Laptop Repair</h3>
                <p className={styles.cardDesc}>
                  We provide complete repair solutions for desktops, laptops, and workstations to ensure optimal performance.
                </p>
              </div>

              {/* Card 2 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Hardware repair SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" stroke="#111111" strokeWidth="1.5" />
                    <path d="M6 18c0-2.5 2.5-4.5 6-4.5s6 2 6 4.5" stroke="#111111" strokeWidth="1.5" />
                    <rect x="9" y="16" width="6" height="4" rx="0.5" fill="#3a90f3" stroke="#3a90f3" strokeWidth="1" />
                    <line x1="8" y1="20" x2="16" y2="20" stroke="#3a90f3" strokeWidth="1.5" />
                    <path d="M12 4v3M3 10h3M18 10h3M12 16v2" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="12" cy="3" r="1.5" fill="#3a90f3" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Hardware Repair Services</h3>
                <p className={styles.cardDesc}>
                  Our technicians handle hardware failure, screen replacements, and configurations.
                </p>
              </div>

              {/* Card 3 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Laptop with Gear SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="5" width="16" height="11" rx="1.5" stroke="#3a90f3" strokeWidth="1.5" fill="#f5f5f7" />
                    <path d="M2 16h20" stroke="#3a90f3" strokeWidth="2.5" />
                    <circle cx="12" cy="10.5" r="2.5" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Software Troubleshooting & Setup</h3>
                <p className={styles.cardDesc}>
                  We resolve software issues, operating system errors, configurations, and application setups.
                </p>
              </div>

              {/* Card 4 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Network Support SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" stroke="#111111" strokeWidth="1.5" />
                    <circle cx="12" cy="5" r="2.5" fill="#f5d6cb" stroke="#3a90f3" strokeWidth="1.5" />
                    <line x1="12" y1="7.5" x2="12" y2="9" stroke="#3a90f3" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Network Repair & Troubleshooting</h3>
                <p className={styles.cardDesc}>
                  Fix connection issues, router setups, switches, and local network setups.
                </p>
              </div>

              {/* Card 5 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Server SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="5" rx="1" stroke="#111111" strokeWidth="1.5" />
                    <rect x="3" y="10" width="18" height="5" rx="1" stroke="#3a90f3" strokeWidth="1.5" />
                    <rect x="3" y="17" width="18" height="5" rx="1" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Server Repair & Maintenance</h3>
                <p className={styles.cardDesc}>
                  We provide professional server support to minimize downtime and protect data assets.
                </p>
              </div>

              {/* Card 6 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Printer SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="13" rx="2" stroke="#111111" strokeWidth="1.5" />
                    <path d="M12 16v4" stroke="#111111" strokeWidth="1.5" />
                    <path d="M8 20h8" stroke="#3a90f3" strokeWidth="2" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Printer & Peripheral Repair</h3>
                <p className={styles.cardDesc}>
                  We fix printer issues, scanners, and configuration support for office devices.
                </p>
              </div>

              {/* Card 7 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Data Recovery SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" stroke="#111111" strokeWidth="1.5" />
                    <path d="M6 18c0-2.5 2.5-4.5 6-4.5s6 2 6 4.5" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Data Recovery Services</h3>
                <p className={styles.cardDesc}>
                  Retrieve lost data from hard drives, SSDs, USBs, and broken systems.
                </p>
              </div>

              {/* Card 8 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Cybersecurity SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3a90f3" strokeWidth="1.5" fill="#f5d6cb" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Security & Malware Removal</h3>
                <p className={styles.cardDesc}>
                  Keep your systems secure against malware, viruses, and performance leaks.
                </p>
              </div>

              {/* Card 9 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Upgrades SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" stroke="#111111" strokeWidth="1.5" />
                    <line x1="8" y1="20" x2="16" y2="20" stroke="#3a90f3" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>IT Equipment Upgrades</h3>
                <p className={styles.cardDesc}>
                  We help improve system performance with hardware upgrades (RAM, SSDs).
                </p>
              </div>

              {/* Card 10 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Remote Support SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Remote Support Services</h3>
                <p className={styles.cardDesc}>
                  Get quick assistance for software and configuration issues over the internet.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* IT Maintenance Services Split Section */}
        <section className={styles.splitSection}>
          <div className="container">
            <div className={styles.twoCol}>

              <div className={styles.textCol}>
                <h2 className={styles.splitTitle}>IT Maintenance Services</h2>
                <p className={styles.splitDesc}>
                  Regular maintenance helps prevent technical problems and improves system performance.
                </p>
                <p className={styles.splitDesc} style={{ marginBottom: '10px' }}>
                  Our maintenance services include:
                </p>
                <ul className={styles.benefitsList}>
                  <li className={styles.benefitItem}>Preventive Maintenance</li>
                  <li className={styles.benefitItem}>Annual Maintenance Contract (AMC)</li>
                </ul>
              </div>

              <div className={styles.imageCol}>
                <div className={styles.splitImgWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=600&q=80"
                    alt="IT Maintenance Services"
                    className={styles.splitImg}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Our Repair Process Section */}
        <section className={styles.servicesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Our Repair Process</h2>

            <div className={styles.servicesGrid}>

              {/* Card 1 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Problem Diagnosis</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Our experts identify the root cause of the technical issue.
                </p>
              </div>

              {/* Card 2 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Solution Recommendation</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We provide the best repair approach based on your requirements.
                </p>
              </div>

              {/* Card 3 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Professional Repair</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Experienced technicians perform the repairs using high-quality parts.
                </p>
              </div>

              {/* Card 4 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Testing & Quality-Check</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Verify everything works under standard operations before delivery.
                </p>
              </div>

              {/* Card 5 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Customer Support</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We provide guidance to prevent future occurrences and keep systems healthy.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Benefits of Choosing RHST Repair & Maintenance (Grid of 8 image cards) */}
        <section className={styles.benefitsSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Benefits of Choosing RHST Repair & Maintenance</h2>

            <div className={styles.benefitsGrid}>

              {/* Benefit 1 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20299%20(2).png"
                    alt="Expert Technical Team"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Expert Technical Team</h3>
              </div>

              {/* Benefit 2 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/BUS.png"
                    alt="Fast & Reliable Service"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Fast & Reliable Service</h3>
              </div>

              {/* Benefit 3 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20301%20(2).png"
                    alt="Complete IT Problem Solutions"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Complete IT Problem Solutions</h3>
              </div>

              {/* Benefit 4 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20302%20(2).png"
                    alt="Preventive Maintenance Support"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Preventive Maintenance Support</h3>
              </div>

              {/* Benefit 5 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20303%20(2).png"
                    alt="Improved Device Performance"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Improved Device Performance</h3>
              </div>

              {/* Benefit 6 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20304%20(2).png"
                    alt="Cost-Effective IT Solutions"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Cost-Effective IT Solutions</h3>
              </div>

              {/* Benefit 7 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20305%20(2).png"
                    alt="Reduced Business Downtime"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Reduced Business Downtime</h3>
              </div>

              {/* Benefit 8 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20306%20(2).png"
                    alt="Customized Maintenance Plans"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Customized Maintenance Plans</h3>
              </div>

            </div>
          </div>
        </section>

        {/* Why RHST IT-Ecommerce Pvt. Ltd. (Dark Banner) */}
        <section className={styles.darkBanner}>
          <div className="container">
            <h2 className={styles.darkBannerTitle}>Why RHST IT-Ecommerce Pvt. Ltd.?</h2>
            <p className={styles.darkBannerText}>
              Technology problems can affect productivity and business operations. RHST provides dependable repair and maintenance solutions to ensure your IT systems remain secure, stable, and high-performing.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className={styles.formSection}>
          <div className="container">
            <div className={styles.formContainer}>
              <h2 className={styles.formTitle}>ANY QUESTIONS?</h2>
              <p className={styles.formDesc}>
                Use the form below to get in touch with us.
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
