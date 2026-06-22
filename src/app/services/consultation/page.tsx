import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import styles from './Consultation.module.css';

export const metadata: Metadata = {
  title: 'IT Consultation Services | RHST E-commerce & IT Solutions',
  description: 'RHST provides professional IT Consultation Services to help businesses make informed technology decisions. Our experienced consultants analyze your existing systems and recommend the right solutions.',
};

export default function ConsultationServicesPage() {
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
                Expert Technology Guidance to Drive Business Growth
              </h1>
              <p className={styles.introText}>
                At RHST, we provide professional IT Consultation Services to help businesses make smarter technology decisions. Our experts analyze your current IT environment, understand your business goals, and recommend the right solutions to improve efficiency, security, and performance.
              </p>
              <p className={styles.introText}>
                Whether you are planning a new IT setup, upgrading existing infrastructure, adopting cloud solutions, or improving cybersecurity, RHST provides strategic technology guidance tailored to your needs.
              </p>
            </div>
          </div>
        </section>

        {/* What is IT Consultation Section */}
        <section className={styles.introSection} style={{ paddingTop: 0 }}>
          <div className="container">
            <div className={styles.introWrapper}>
              <h2 className={styles.splitTitle} style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
                What is IT Consultation?
              </h2>
              <p className={styles.introText} style={{ marginBottom: '1rem' }}>
                IT Consultation is a professional service where technology experts help businesses identify challenges, plan solutions, and implement the right IT strategies.
              </p>
              <p className={styles.introText}>
                RHST helps organizations choose the right hardware, software, infrastructure, and digital solutions to achieve better productivity and long-term success.
              </p>
            </div>
          </div>
        </section>

        {/* Our IT Consultation Services (10 Cards Grid) */}
        <section className={styles.servicesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Our IT Consultation Services</h2>

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
                <h3 className={styles.cardTitle}>IT Infrastructure Consulting</h3>
                <p className={styles.cardDesc}>
                  We help businesses build and improve their technology infrastructure.
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
                <h3 className={styles.cardTitle}>Business Technology Consulting</h3>
                <p className={styles.cardDesc}>
                  We provide guidance to help businesses use technology effectively.
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
                <h3 className={styles.cardTitle}>Hardware & Software Consulting</h3>
                <p className={styles.cardDesc}>
                  Choose the right technology products with expert guidance.
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
                <h3 className={styles.cardTitle}>Cloud Consulting Services</h3>
                <p className={styles.cardDesc}>
                  We guide businesses in adopting secure and efficient cloud solutions.
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
                <h3 className={styles.cardTitle}>Cybersecurity Consulting</h3>
                <p className={styles.cardDesc}>
                  Protect your business with expert security planning.
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
                <h3 className={styles.cardTitle}>Network Consulting</h3>
                <p className={styles.cardDesc}>
                  We help design and improve reliable network systems.
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
                    <path d="M12 8V5M7.5 7.5L10 9.5M16.5 7.5l-2.5 2M7.5 13.5l2.5-2M16.5 13.5l-2.5-2M12 14v4.5" stroke="#3a90f3" strokeWidth="1.2" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>IT Strategy Consulting</h3>
                <p className={styles.cardDesc}>
                  We help businesses create effective technology plans aligned with their goals.
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
                <h3 className={styles.cardTitle}>Data Management Consulting</h3>
                <p className={styles.cardDesc}>
                  We provide guidance for managing and protecting business data efficiently.
                </p>
              </div>

              {/* Card 9 */}
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
                <h3 className={styles.cardTitle}>Digital Transformation Consulting</h3>
                <p className={styles.cardDesc}>
                  We help businesses adopt modern technologies for better efficiency.
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
                <h3 className={styles.cardTitle}>IT Budget & Cost Consulting</h3>
                <p className={styles.cardDesc}>
                  We help businesses plan their IT investments effectively.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Our IT Consulting Process (Split Section) */}
        <section className={styles.splitSection}>
          <div className="container">
            <div className={styles.twoCol}>

              <div className={styles.textCol}>
                <h2 className={styles.splitTitle}>Our IT Consulting Process</h2>
                <ul className={styles.benefitsList}>
                  <li className={styles.benefitItem}>Business Requirement Analysis</li>
                  <li className={styles.benefitItem}>Current IT Assessment</li>
                  <li className={styles.benefitItem}>Solution Discovery</li>
                  <li className={styles.benefitItem}>Implementation Support</li>
                  <li className={styles.benefitItem}>Continuous Guidance</li>
                </ul>
              </div>

              <div className={styles.imageCol}>
                <div className={styles.splitImgWrapper}>
                  <img
                    src="/images/it_support_headset_operator.png"
                    alt="IT Consulting Process"
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

        {/* Benefits of RHST IT Consultation Services (5 steps) */}
        <section className={styles.servicesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Benefits of RHST IT Consultation Services</h2>

            <div className={styles.benefitsGrid}>

              {/* Benefit 1 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle} style={{ minHeight: 'auto', marginBottom: '0.85rem' }}>Expert Technology Advice</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Get guidance from experienced IT professionals to make informed decisions.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle} style={{ minHeight: 'auto', marginBottom: '0.85rem' }}>Cost-Effective Planning</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Avoid unnecessary technology expenses with the right recommendations.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle} style={{ minHeight: 'auto', marginBottom: '0.85rem' }}>Improved Efficiency</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Optimize your IT systems for better productivity and performance.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle} style={{ minHeight: 'auto', marginBottom: '0.85rem' }}>Better Security</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Build a safer technology environment with proper security strategies.
                </p>
              </div>

              {/* Benefit 5 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle} style={{ minHeight: 'auto', marginBottom: '0.85rem' }}>Future-Ready Solutions</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Prepare your business for upcoming technology requirements.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Who Needs IT Consultation Services? (Grid of 8 image cards) */}
        <section className={styles.introSection} style={{ backgroundColor: '#FFFFFF', paddingBottom: '5rem' }}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Who Needs IT Consultation Services?</h2>

            <div className={styles.whoNeedsGrid}>

              {/* Card 1 */}
              <div className={styles.whoNeedsCard}>
                <div className={styles.whoNeedsImgWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=80"
                    alt="Small & Medium Businesses"
                    className={styles.whoNeedsImg}
                  />
                </div>
                <h3 className={styles.whoNeedsName}>Small & Medium Businesses</h3>
              </div>

              {/* Card 2 */}
              <div className={styles.whoNeedsCard}>
                <div className={styles.whoNeedsImgWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80"
                    alt="Corporate Organizations"
                    className={styles.whoNeedsImg}
                  />
                </div>
                <h3 className={styles.whoNeedsName}>Corporate Organizations</h3>
              </div>

              {/* Card 3 */}
              <div className={styles.whoNeedsCard}>
                <div className={styles.whoNeedsImgWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80"
                    alt="Startups"
                    className={styles.whoNeedsImg}
                  />
                </div>
                <h3 className={styles.whoNeedsName}>Startups</h3>
              </div>

              {/* Card 4 */}
              <div className={styles.whoNeedsCard}>
                <div className={styles.whoNeedsImgWrapper}>
                  <img
                    src="/images/amc_benefit_students.png"
                    alt="Educational Institutions"
                    className={styles.whoNeedsImg}
                  />
                </div>
                <h3 className={styles.whoNeedsName}>Educational Institutions</h3>
              </div>

              {/* Card 5 */}
              <div className={styles.whoNeedsCard}>
                <div className={styles.whoNeedsImgWrapper}>
                  <img
                    src="/images/amc_benefit_doctors.png"
                    alt="Healthcare Sector"
                    className={styles.whoNeedsImg}
                  />
                </div>
                <h3 className={styles.whoNeedsName}>Healthcare Sector</h3>
              </div>

              {/* Card 6 */}
              <div className={styles.whoNeedsCard}>
                <div className={styles.whoNeedsImgWrapper}>
                  <img
                    src="/images/amc_benefit_security.png"
                    alt="Retail Businesses"
                    className={styles.whoNeedsImg}
                  />
                </div>
                <h3 className={styles.whoNeedsName}>Retail Businesses</h3>
              </div>

              {/* Card 7 */}
              <div className={styles.whoNeedsCard}>
                <div className={styles.whoNeedsImgWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80"
                    alt="Growing Enterprises"
                    className={styles.whoNeedsImg}
                  />
                </div>
                <h3 className={styles.whoNeedsName}>Growing Enterprises</h3>
              </div>

              {/* Card 8 */}
              <div className={styles.whoNeedsCard}>
                <div className={styles.whoNeedsImgWrapper}>
                  <img
                    src="/images/amc_benefit_management.png"
                    alt="Government Sector"
                    className={styles.whoNeedsImg}
                  />
                </div>
                <h3 className={styles.whoNeedsName}>Government Sector</h3>
              </div>

            </div>
          </div>
        </section>

        {/* Why RHST IT-Ecommerce Pvt. Ltd. (Dark Banner) */}
        <section className={styles.darkBanner}>
          <div className="container">
            <h2 className={styles.darkBannerTitle}>Why RHST IT-Ecommerce Pvt. Ltd.?</h2>
            <p className={styles.darkBannerText}>
              RHST combines technical expertise, industry knowledge, and business understanding to deliver practical IT solutions. We help businesses select, implement, and manage technology that supports growth and success.
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
