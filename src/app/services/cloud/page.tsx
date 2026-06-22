import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import styles from './Cloud.module.css';

export const metadata: Metadata = {
  title: 'Cloud Services | RHST E-commerce & IT Solutions',
  description: 'At RHST, we provide customized Cloud solutions and support that are engineered to align with your business requirements. We help you migrate, manage, develop, and optimize your complete IT environments on the cloud.',
};

export default function CloudServicesPage() {
  return (
    <>
      {/* Navigation Header */}
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Hero Banner Section */}
        <section className={styles.heroBanner}>
          <div className={styles.heroOverlay} />

          <button className={styles.heroArrowLeft} aria-label="Previous Slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button className={styles.heroArrowRight} aria-label="Next Slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </section>

        {/* Introduction Section */}
        <section className={styles.introSection}>
          <div className="container">
            <div className={styles.introWrapper}>
              <h1 className={styles.introTitle}>
                Secure, Scalable & Reliable Cloud Solutions for Modern Businesses
              </h1>
              <p className={styles.introText}>
                At RHST, we provide advanced Cloud Services that help businesses store, manage, access, and protect their data with flexibility and security. Our cloud solutions are designed to improve efficiency, reduce infrastructure costs, and support business growth with reliable technology.
              </p>
              <p className={styles.introText}>
                Whether you need cloud storage, data backup, cloud migration, or complete cloud management, RHST delivers customized solutions to meet your business requirements.
              </p>
            </div>
          </div>
        </section>

        {/* What Are Cloud Services Section */}
        <section className={styles.introSection} style={{ paddingTop: 0 }}>
          <div className="container">
            <div className={styles.introWrapper}>
              <h2 className={styles.splitTitle} style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
                What Are Cloud Services?
              </h2>
              <p className={styles.introText} style={{ marginBottom: '1rem' }}>
                Cloud Services allow businesses to use computing resources such as storage, servers, software, and applications over the internet instead of relying only on physical infrastructure.
              </p>
              <p className={styles.introText}>
                With RHST Cloud Solutions, businesses can access their data anytime, anywhere, while maintaining security, performance, and scalability.
              </p>
            </div>
          </div>
        </section>

        {/* Our Cloud Services Include (10 Cards Grid) */}
        <section className={styles.servicesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Our Cloud Services Include</h2>

            <div className={styles.servicesGrid}>

              {/* Card 1 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="13" rx="2" stroke="#111111" strokeWidth="1.5" />
                    <path d="M12 17v4M8 21h8" stroke="#111111" strokeWidth="1.5" />
                    <path d="M8 12a4 4 0 0 1 8 0" stroke="#3a90f3" strokeWidth="1.5" />
                    <rect x="7" y="11" width="2" height="3" rx="0.5" fill="#111111" />
                    <rect x="15" y="11" width="2" height="3" rx="0.5" fill="#111111" />
                    <path d="M15 13c-.5 1-1.5 1.5-2.5 1.5" stroke="#3a90f3" strokeWidth="1.2" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Cloud Storage Solutions</h3>
                <p className={styles.cardDesc}>
                  Securely store and manage your important business data with flexible cloud storage solutions.
                </p>
              </div>

              {/* Card 2 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="11" r="3" stroke="#111111" strokeWidth="1.5" fill="#f5d6cb" />
                    <path d="M10.5 9.5a2 2 0 0 1 3 0" stroke="#3a90f3" strokeWidth="1" />
                    <circle cx="5" cy="5" r="1.5" fill="#3a90f3" />
                    <circle cx="19" cy="5" r="1.5" fill="#3a90f3" />
                    <circle cx="4" cy="14" r="1.5" fill="#3a90f3" />
                    <circle cx="20" cy="14" r="1.5" fill="#3a90f3" />
                    <circle cx="12" cy="20" r="1.5" fill="#3a90f3" />
                    <path d="M12 8V5M7.5 7.5L10 9.5M16.5 7.5l-2.5 2M7.5 13.5l2.5-2M16.5 13.5l-2.5-2M12 14v4.5" stroke="#3a90f3" strokeWidth="1.2" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Cloud Backup & Recovery</h3>
                <p className={styles.cardDesc}>
                  Protect your valuable business information with reliable backup solutions.
                </p>
              </div>

              {/* Card 3 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="11" rx="1.5" stroke="#111111" strokeWidth="1.5" />
                    <path d="M1 19h22M5 19l1-3h12l1 3" stroke="#111111" strokeWidth="1.5" />
                    <circle cx="12" cy="10" r="2.5" stroke="#3a90f3" strokeWidth="1.5" fill="#f5d6cb" />
                    <path d="M12 6.5v1M12 12.5v1M8.5 10h1M14.5 10h1M9.5 7.5l.7.7M13.8 11.8l.7.7M9.5 12.5l.7-.7M13.8 8.2l.7-.7" stroke="#3a90f3" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Cloud Migration Services</h3>
                <p className={styles.cardDesc}>
                  Move your existing IT infrastructure to the cloud smoothly and securely.
                </p>
              </div>

              {/* Card 4 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 17a5 5 0 0 0-5-5H11a5 5 0 0 0-5 5v2h12v-2z" stroke="#111111" strokeWidth="1.5" fill="#f5d6cb" />
                    <circle cx="12" cy="7" r="3.5" stroke="#111111" strokeWidth="1.5" />
                    <path d="M9.5 7a3 3 0 0 1 5 0" stroke="#3a90f3" strokeWidth="1.5" />
                    <rect x="8.5" y="6" width="1" height="2" fill="#111111" />
                    <rect x="14.5" y="6" width="1" height="2" fill="#111111" />
                    <path d="M14.5 8l-2 1.5" stroke="#3a90f3" strokeWidth="1.2" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Cloud Server Solutions</h3>
                <p className={styles.cardDesc}>
                  Improve business performance with flexible and scalable cloud servers.
                </p>
              </div>

              {/* Card 5 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3a90f3" strokeWidth="1.5" fill="#f5d6cb" />
                    <circle cx="12" cy="10" r="2.5" stroke="#111111" strokeWidth="1.2" />
                    <path d="M10 9.5a2 2 0 0 1 4 0" stroke="#3a90f3" strokeWidth="1.2" />
                    <path d="M14 10.5l-2 1.5" stroke="#3a90f3" strokeWidth="1" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Cloud Security Services</h3>
                <p className={styles.cardDesc}>
                  Protect your cloud environment with strong security solutions.
                </p>
              </div>

              {/* Card 6 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="13" rx="2" stroke="#111111" strokeWidth="1.5" />
                    <path d="M12 17v4M8 21h8" stroke="#111111" strokeWidth="1.5" />
                    <path d="M8 12a4 4 0 0 1 8 0" stroke="#3a90f3" strokeWidth="1.5" />
                    <rect x="7" y="11" width="2" height="3" rx="0.5" fill="#111111" />
                    <rect x="15" y="11" width="2" height="3" rx="0.5" fill="#111111" />
                    <path d="M15 13c-.5 1-1.5 1.5-2.5 1.5" stroke="#3a90f3" strokeWidth="1.2" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Business Cloud Solutions</h3>
                <p className={styles.cardDesc}>
                  We provide cloud solutions designed for business productivity and collaboration.
                </p>
              </div>

              {/* Card 7 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="11" r="3" stroke="#111111" strokeWidth="1.5" fill="#f5d6cb" />
                    <path d="M10.5 9.5a2 2 0 0 1 3 0" stroke="#3a90f3" strokeWidth="1" />
                    <circle cx="5" cy="5" r="1.5" fill="#3a90f3" />
                    <circle cx="19" cy="5" r="1.5" fill="#3a90f3" />
                    <circle cx="4" cy="14" r="1.5" fill="#3a90f3" />
                    <circle cx="20" cy="14" r="1.5" fill="#3a90f3" />
                    <circle cx="12" cy="20" r="1.5" fill="#3a90f3" />
                    <path d="M12 8V5M7.5 7.5L10 9.5M16.5 7.5l-2.5 2M7.5 13.5l-2.5-2M16.5 13.5l-2.5-2M12 14v4.5" stroke="#3a90f3" strokeWidth="1.2" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Cloud Application Services</h3>
                <p className={styles.cardDesc}>
                  We help businesses run their applications smoothly through secure and reliable cloud environments.
                </p>
              </div>

              {/* Card 8 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="11" rx="1.5" stroke="#111111" strokeWidth="1.5" />
                    <path d="M1 19h22M5 19l1-3h12l1 3" stroke="#111111" strokeWidth="1.5" />
                    <circle cx="12" cy="10" r="2.5" stroke="#3a90f3" strokeWidth="1.5" fill="#f5d6cb" />
                    <path d="M12 6.5v1M12 12.5v1M8.5 10h1M14.5 10h1M9.5 7.5l.7.7M13.8 11.8l.7.7M9.5 12.5l.7-.7M13.8 8.2l.7-.7" stroke="#3a90f3" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Cloud Infrastructure Management</h3>
                <p className={styles.cardDesc}>
                  We provide complete cloud infrastructure management to ensure high performance and reliability.
                </p>
              </div>

              {/* Card 9 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="5" rx="1" stroke="#111111" strokeWidth="1.5" />
                    <rect x="3" y="9.5" width="18" height="5" rx="1" stroke="#3a90f3" strokeWidth="1.5" fill="#f5d6cb" />
                    <rect x="3" y="16" width="18" height="5" rx="1" stroke="#111111" strokeWidth="1.5" />
                    <circle cx="6" cy="5.5" r="0.75" fill="#3a90f3" />
                    <circle cx="6" cy="12" r="0.75" fill="#111111" />
                    <circle cx="6" cy="18.5" r="0.75" fill="#3a90f3" />
                    <path d="M14 5.5h4M14 12h4M14 18.5h4" stroke="#111111" strokeWidth="1.2" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Virtual Desktop Solutions (VDI)</h3>
                <p className={styles.cardDesc}>
                  Enable employees to access their work environment securely from anywhere with virtual desktop solutions.
                </p>
              </div>

              {/* Card 10 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3a90f3" strokeWidth="1.5" fill="#f5d6cb" />
                    <circle cx="12" cy="10" r="2.5" stroke="#111111" strokeWidth="1.2" />
                    <path d="M10 9.5a2 2 0 0 1 4 0" stroke="#3a90f3" strokeWidth="1.2" />
                    <path d="M14 10.5l-2 1.5" stroke="#3a90f3" strokeWidth="1" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Cloud Consulting Services</h3>
                <p className={styles.cardDesc}>
                  Our experts help businesses choose and implement the right cloud strategy.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Benefits of RHST Cloud Services (Split Section) */}
        <section className={styles.splitSection}>
          <div className="container">
            <div className={styles.twoCol}>

              <div className={styles.textCol}>
                <h2 className={styles.splitTitle}>Benefits of RHST Cloud Services</h2>
                <ul className={styles.benefitsList}>
                  <li className={styles.benefitItem}>Cost-Efficiency</li>
                  <li className={styles.benefitItem}>Anytime, Anywhere Access</li>
                  <li className={styles.benefitItem}>Scalability</li>
                  <li className={styles.benefitItem}>Data Security</li>
                  <li className={styles.benefitItem}>Improved Productivity</li>
                  <li className={styles.benefitItem}>Business Continuity</li>
                </ul>
              </div>

              <div className={styles.imageCol}>
                <div className={styles.splitImgWrapper}>
                  <img
                    src="/images/it_support_headset_operator.png"
                    alt="Cloud Services Benefits"
                    className={styles.splitImg}
                  />
                  <div className={styles.playBtn}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#ffffff" style={{ transform: 'translateX(2px)' }}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Our Cloud Service Process (5 steps) */}
        <section className={styles.servicesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Our Cloud Service Process</h2>

            <div className={styles.servicesGrid}>

              {/* Process 1 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Requirement Analysis</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We understand your business needs and recommend the right cloud solution.
                </p>
              </div>

              {/* Process 2 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Cloud Planning</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Our experts design a secure and efficient cloud strategy.
                </p>
              </div>

              {/* Process 3 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Implementation</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We configure and deploy cloud services according to your requirements.
                </p>
              </div>

              {/* Process 4 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Data Migration</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We securely transfer your data and applications to the cloud environment.
                </p>
              </div>

              {/* Process 5 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Monitoring & Support</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We provide continuous support and maintenance for smooth cloud operations.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Who Needs Cloud Services? (Grid of 8 image cards) */}
        <section className={styles.benefitsSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Who Needs Cloud Services?</h2>

            <div className={styles.benefitsGrid}>

              {/* Card 1 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=80"
                    alt="Small Businesses"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Small Businesses</h3>
              </div>

              {/* Card 2 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80"
                    alt="Corporate Organizations"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Corporate Organizations</h3>
              </div>

              {/* Card 3 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="/images/amc_benefit_students.png"
                    alt="Startups"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Startups</h3>
              </div>

              {/* Card 4 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="/images/amc_benefit_doctors.png"
                    alt="Educational Institutions"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Educational Institutions</h3>
              </div>

              {/* Card 5 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="/images/amc_benefit_security.png"
                    alt="Healthcare Companies"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Healthcare Companies</h3>
              </div>

              {/* Card 6 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80"
                    alt="Retail Businesses"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Retail Businesses</h3>
              </div>

              {/* Card 7 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80"
                    alt="Enterprise Organizations"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Enterprise Organizations</h3>
              </div>

              {/* Card 8 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="/images/amc_benefit_management.png"
                    alt="Remote Work Solutions"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Remote Work Solutions</h3>
              </div>

            </div>
          </div>
        </section>

        {/* Why RHST IT-Ecommerce Pvt. Ltd. (Dark Banner) */}
        <section className={styles.darkBanner}>
          <div className="container">
            <h2 className={styles.darkBannerTitle}>Why RHST IT-Ecommerce Pvt. Ltd.?</h2>
            <p className={styles.darkBannerText}>
              RHST helps businesses adopt modern cloud technology with secure, reliable, and customized solutions. Our team ensures smooth implementation, continuous support, and optimized cloud performance.
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

              <ContactForm type="cloud" styles={styles} />
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
