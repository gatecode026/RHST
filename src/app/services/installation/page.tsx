import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import styles from './Installation.module.css';

export const metadata: Metadata = {
  title: 'IT Installation Services & Solutions | RHST E-commerce & IT Solutions',
  description: 'Explore professional IT installation services by RHST IT-Ecommerce. We provide desktop setups, firmware configuration, network installations, server setups, CCTV security setups, and software installation.',
};

export default function InstallationServicesPage() {
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
                Professional IT Installation Solutions for a Smooth Technology Setup
              </h1>
              <p className={styles.introText}>
                At RHST, we provide reliable and professional IT Installation Services to help businesses and individuals set up their technology infrastructure efficiently. Our skilled technicians ensure that your hardware, software, networks, and IT equipment are installed correctly, configured properly, and ready for seamless operation.
              </p>
              <p className={styles.introText}>
                From basic device setup to complete IT infrastructure installation, RHST delivers secure, efficient, and hassle-free installation solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Our IT Installation Services (Grid 1) */}
        <section className={styles.servicesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Our IT Installation Services</h2>

            <div className={styles.servicesGrid}>

              {/* Card 1 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Monitor with Headset SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="13" rx="2" stroke="#111111" strokeWidth="1.5" />
                    <path d="M12 16v4" stroke="#111111" strokeWidth="1.5" />
                    <path d="M8 20h8" stroke="#3a90f3" strokeWidth="2" />
                    <path d="M8 11a4 4 0 0 1 8 0v1" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="8" cy="12" r="1" fill="#111111" />
                    <circle cx="16" cy="12" r="1" fill="#111111" />
                    <path d="M16 12.5c0 1.5-1 2-2.5 2" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Computer & Laptop Installation</h3>
                <p className={styles.cardDesc}>
                  We provide complete setup and configuration services for computers and laptops.
                </p>
              </div>

              {/* Card 2 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Network User SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" stroke="#111111" strokeWidth="1.5" />
                    <path d="M6 18c0-2.5 2.5-4.5 6-4.5s6 2 6 4.5" stroke="#111111" strokeWidth="1.5" />
                    <rect x="9" y="16" width="6" height="4" rx="0.5" fill="#3a90f3" stroke="#3a90f3" strokeWidth="1" />
                    <line x1="8" y1="20" x2="16" y2="20" stroke="#3a90f3" strokeWidth="1.5" />
                    <path d="M12 4v3M3 10h3M18 10h3M12 16v2" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="12" cy="3" r="1.5" fill="#3a90f3" />
                    <circle cx="2" cy="10" r="1.5" fill="#3a90f3" />
                    <circle cx="22" cy="10" r="1.5" fill="#3a90f3" />
                    <circle cx="6" cy="6" r="1.5" fill="#3a90f3" />
                    <path d="M7 7l2 2" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="18" cy="6" r="1.5" fill="#3a90f3" />
                    <path d="M17 7l-2 2" stroke="#3a90f3" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Hardware Installation</h3>
                <p className={styles.cardDesc}>
                  Our experts help you install and configure various IT hardware devices.
                </p>
              </div>

              {/* Card 3 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Laptop with Gear SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="5" width="16" height="11" rx="1.5" stroke="#3a90f3" strokeWidth="1.5" fill="#f5f5f7" />
                    <path d="M2 16h20" stroke="#3a90f3" strokeWidth="2.5" />
                    <path d="M8 16l2 3h4l2-3" stroke="#3a90f3" strokeWidth="1" />
                    <circle cx="12" cy="10.5" r="2.5" stroke="#111111" strokeWidth="1.5" fill="#ffcc00" />
                    <path d="M12 7v1M12 13v1M8.5 10.5h1M14.5 10.5h1" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Network Installation</h3>
                <p className={styles.cardDesc}>
                  A properly configured network ensures smooth communication and connectivity.
                </p>
              </div>

              {/* Card 4 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Server with User SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="7" y="3" width="10" height="14" rx="1" stroke="#3a90f3" strokeWidth="1.5" />
                    <line x1="9" y1="6" x2="15" y2="6" stroke="#3a90f3" strokeWidth="1" />
                    <circle cx="11" cy="6" r="0.75" fill="#3a90f3" />
                    <line x1="9" y1="10" x2="15" y2="10" stroke="#3a90f3" strokeWidth="1" />
                    <circle cx="11" cy="10" r="0.75" fill="#3a90f3" />
                    <line x1="9" y1="14" x2="15" y2="14" stroke="#3a90f3" strokeWidth="1" />
                    <circle cx="11" cy="14" r="0.75" fill="#3a90f3" />
                    <circle cx="12" cy="20" r="2" stroke="#111111" strokeWidth="1.5" />
                    <path d="M8 23c0-1.5 1.8-2.5 4-2.5s4 1 4 2.5" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Server Installation & Configuration</h3>
                <p className={styles.cardDesc}>
                  We provide professional server setup solutions for businesses.
                </p>
              </div>

              {/* Card 5 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Shield with Headset SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3a90f3" strokeWidth="1.5" fill="#f5d6cb" />
                    <path d="M9 11c0-2 1.5-3 3-3s3 1 3 3" stroke="#111111" strokeWidth="1.5" />
                    <circle cx="9" cy="11.5" r="1" fill="#111111" />
                    <circle cx="15" cy="11.5" r="1" fill="#111111" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Software Installation & Setup</h3>
                <p className={styles.cardDesc}>
                  We help customers install and configure essential software solutions.
                </p>
              </div>

              {/* Card 6 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Monitor with Headset SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="13" rx="2" stroke="#111111" strokeWidth="1.5" />
                    <path d="M12 16v4" stroke="#111111" strokeWidth="1.5" />
                    <path d="M8 20h8" stroke="#3a90f3" strokeWidth="2" />
                    <path d="M8 11a4 4 0 0 1 8 0v1" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="8" cy="12" r="1" fill="#111111" />
                    <circle cx="16" cy="12" r="1" fill="#111111" />
                    <path d="M16 12.5c0 1.5-1 2-2.5 2" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Printer & Peripheral Installation</h3>
                <p className={styles.cardDesc}>
                  We provide complete installation support for office equipment.
                </p>
              </div>

              {/* Card 7 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Network User SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" stroke="#111111" strokeWidth="1.5" />
                    <path d="M6 18c0-2.5 2.5-4.5 6-4.5s6 2 6 4.5" stroke="#111111" strokeWidth="1.5" />
                    <rect x="9" y="16" width="6" height="4" rx="0.5" fill="#3a90f3" stroke="#3a90f3" strokeWidth="1" />
                    <line x1="8" y1="20" x2="16" y2="20" stroke="#3a90f3" strokeWidth="1.5" />
                    <path d="M12 4v3M3 10h3M18 10h3M12 16v2" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="12" cy="3" r="1.5" fill="#3a90f3" />
                    <circle cx="2" cy="10" r="1.5" fill="#3a90f3" />
                    <circle cx="22" cy="10" r="1.5" fill="#3a90f3" />
                    <circle cx="6" cy="6" r="1.5" fill="#3a90f3" />
                    <path d="M7 7l2 2" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="18" cy="6" r="1.5" fill="#3a90f3" />
                    <path d="M17 7l-2 2" stroke="#3a90f3" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>CCTV & Security System Installation</h3>
                <p className={styles.cardDesc}>
                  We help organizations improve security through professional installation.
                </p>
              </div>

              {/* Card 8 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Monitor with Headset SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="13" rx="2" stroke="#111111" strokeWidth="1.5" />
                    <path d="M12 16v4" stroke="#111111" strokeWidth="1.5" />
                    <path d="M8 20h8" stroke="#3a90f3" strokeWidth="2" />
                    <path d="M8 11a4 4 0 0 1 8 0v1" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="8" cy="12" r="1" fill="#111111" />
                    <circle cx="16" cy="12" r="1" fill="#111111" />
                    <path d="M16 12.5c0 1.5-1 2-2.5 2" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Cloud & Backup Installation</h3>
                <p className={styles.cardDesc}>
                  We help businesses implement secure cloud-based solutions.
                </p>
              </div>

              {/* Card 9 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Network User SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" stroke="#111111" strokeWidth="1.5" />
                    <path d="M6 18c0-2.5 2.5-4.5 6-4.5s6 2 6 4.5" stroke="#111111" strokeWidth="1.5" />
                    <rect x="9" y="16" width="6" height="4" rx="0.5" fill="#3a90f3" stroke="#3a90f3" strokeWidth="1" />
                    <line x1="8" y1="20" x2="16" y2="20" stroke="#3a90f3" strokeWidth="1.5" />
                    <path d="M12 4v3M3 10h3M18 10h3M12 16v2" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="12" cy="3" r="1.5" fill="#3a90f3" />
                    <circle cx="2" cy="10" r="1.5" fill="#3a90f3" />
                    <circle cx="22" cy="10" r="1.5" fill="#3a90f3" />
                    <circle cx="6" cy="6" r="1.5" fill="#3a90f3" />
                    <path d="M7 7l2 2" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="18" cy="6" r="1.5" fill="#3a90f3" />
                    <path d="M17 7l-2 2" stroke="#3a90f3" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Data Migration & System Setup</h3>
                <p className={styles.cardDesc}>
                  We provide safe and efficient data transfer services.
                </p>
              </div>

              {/* Card 10 */}
              <div className={styles.serviceCard}>
                <div className={styles.iconWrapper}>
                  {/* Network User SVG */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" stroke="#111111" strokeWidth="1.5" />
                    <path d="M6 18c0-2.5 2.5-4.5 6-4.5s6 2 6 4.5" stroke="#111111" strokeWidth="1.5" />
                    <rect x="9" y="16" width="6" height="4" rx="0.5" fill="#3a90f3" stroke="#3a90f3" strokeWidth="1" />
                    <line x1="8" y1="20" x2="16" y2="20" stroke="#3a90f3" strokeWidth="1.5" />
                    <path d="M12 4v3M3 10h3M18 10h3M12 16v2" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="12" cy="3" r="1.5" fill="#3a90f3" />
                    <circle cx="2" cy="10" r="1.5" fill="#3a90f3" />
                    <circle cx="22" cy="10" r="1.5" fill="#3a90f3" />
                    <circle cx="6" cy="6" r="1.5" fill="#3a90f3" />
                    <path d="M7 7l2 2" stroke="#3a90f3" strokeWidth="1.5" />
                    <circle cx="18" cy="6" r="1.5" fill="#3a90f3" />
                    <path d="M17 7l-2 2" stroke="#3a90f3" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Office IT Infrastructure Setup</h3>
                <p className={styles.cardDesc}>
                  Complete technology setup solutions for new and existing offices.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Business IT Setup Services Split Section */}
        <section className={styles.splitSection}>
          <div className="container">
            <div className={styles.twoCol}>

              <div className={styles.textCol}>
                <h2 className={styles.splitTitle}>Business IT Setup Services</h2>
                <p className={styles.splitDesc}>
                  For offices and organizations, RHST provides complete IT infrastructure setup including:
                </p>
                <ul className={styles.benefitsList}>
                  <li className={styles.benefitItem}>Office computer setup</li>
                  <li className={styles.benefitItem}>Network infrastructure setup</li>
                  <li className={styles.benefitItem}>Server room setup</li>
                  <li className={styles.benefitItem}>Employee workstation configuration</li>
                  <li className={styles.benefitItem}>IT equipment deployment</li>
                  <li className={styles.benefitItem}>Technology migration support</li>
                </ul>
              </div>

              <div className={styles.imageCol}>
                <div className={styles.splitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20297%20(1).png"
                    alt="Business IT Setup Services"
                    className={styles.splitImg}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Our Installation Process (Grid 2) */}
        <section className={styles.servicesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Our Installation Process</h2>

            <div className={styles.servicesGrid}>

              {/* Process Card 1 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Requirement Analysis</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We understand your technology needs and recommend the right setup.
                </p>
              </div>

              {/* Process Card 2 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Planning & Preparation</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Our team prepares the required hardware, software, and installation process.
                </p>
              </div>

              {/* Process Card 3 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Professional Installation</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  Our technicians install and configure your IT equipment properly.
                </p>
              </div>

              {/* Process Card 4 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Testing & Optimization</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We test all systems to ensure smooth performance.
                </p>
              </div>

              {/* Process Card 5 */}
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Customer Guidance</h3>
                <hr className={styles.cardSeparator} />
                <p className={styles.cardDesc}>
                  We provide basic guidance to help you use your installed technology effectively.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Benefits of Choosing RHST Installation Services (Grid 3 - Images with titles underneath) */}
        <section className={styles.benefitsSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Benefits of Choosing RHST Installation Services</h2>

            <div className={styles.benefitsGrid}>

              {/* Benefit 1 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20299.png"
                    alt="Latest Technology Knowledge"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Latest Technology Knowledge</h3>
              </div>

              {/* Benefit 2 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20300.png"
                    alt="Reduced Maintenance Problems"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Reduced Maintenance Problems</h3>
              </div>

              {/* Benefit 3 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20301.png"
                    alt="Transparent Service Process"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Transparent Service Process</h3>
              </div>

              {/* Benefit 4 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20302.png"
                    alt="Affordable & Reliable Solutions"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Affordable & Reliable Solutions</h3>
              </div>

              {/* Benefit 5 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20303.png"
                    alt="On-Site & Remote Assistance"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>On-Site & Remote Assistance</h3>
              </div>

              {/* Benefit 6 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20304.png"
                    alt="Long-Term Technology Support"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Long-Term Technology Support</h3>
              </div>

              {/* Benefit 7 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20305.png"
                    alt="Customer Satisfaction Focus"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Customer Satisfaction Focus</h3>
              </div>

              {/* Benefit 8 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20306.png"
                    alt="Business Growth Support"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Business Growth Support</h3>
              </div>

              {/* Benefit 9 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20310%20(1).png"
                    alt="Installation Testing & Quality Check"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Installation Testing & Quality Check</h3>
              </div>

              {/* Benefit 10 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20311.png"
                    alt="Professional & Accurate Installation"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Professional & Accurate Installation</h3>
              </div>

              {/* Benefit 11 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20312.png"
                    alt="Experienced IT Professionals"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Experienced IT Professionals</h3>
              </div>

              {/* Benefit 12 */}
              <div className={styles.benefitCard}>
                <div className={styles.benefitImgWrapper}>
                  <img
                    src="https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20313.png"
                    alt="Quick & Efficient Service"
                    className={styles.benefitImg}
                  />
                </div>
                <h3 className={styles.benefitName}>Quick & Efficient Service</h3>
              </div>

            </div>
          </div>
        </section>

        {/* Why RHST IT-Ecommerce Pvt. Ltd. (Dark Banner) */}
        <section className={styles.darkBanner}>
          <div className="container">
            <h2 className={styles.darkBannerTitle}>Why RHST IT-Ecommerce Pvt. Ltd.?</h2>
            <p className={styles.darkBannerText}>
              RHST IT-Ecommerce Pvt. Ltd. provides complete IT installation solutions with a focus on quality, security, and customer satisfaction. Whether you need a single device setup or a complete business technology installation, our team delivers professional results.
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

              <ContactForm type="installation" styles={styles} />
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
