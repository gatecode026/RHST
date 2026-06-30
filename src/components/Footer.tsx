'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      {/* Top Footer Section */}
      <div className={styles.footerTop}>
        <div className="container">
          <div className={styles.grid}>
            {/* Logo and About */}
            <div className={styles.col}>
              <div className={styles.logoWrapper}>
                <img
                  src="/images/logo.png"
                  alt="RHST Logo"
                  className={styles.logoImg}
                />
              </div>
              <p className={styles.aboutText}>
                RHST is your trusted technology partner providing quality IT products, solutions, and services.
                We offer the latest hardware, software, networking solutions, and business technology products to meet your digital needs.
              </p>
              <div className={styles.socials}>
                <a href="#" className={styles.socialFB} aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className={styles.socialGray} aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className={styles.socialGray} aria-label="Twitter">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#" className={styles.socialGray} aria-label="LinkedIn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#" className={styles.socialGray} aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.col}>
              <h3 className={styles.heading}>Quick Links</h3>
              <ul className={styles.links}>
                <li><Link href="/">HOME</Link></li>
                <li><Link href="/products">PRODUCTS</Link></li>
                <li><Link href="/#categories">CATEGORIES</Link></li>
                <li><Link href="/#services">SERVICES</Link></li>
                <li><Link href="/about">ABOUT</Link></li>
                <li><Link href="/#deals">DEALS/OFFERS</Link></li>
                <li><Link href="/blog">BLOGS</Link></li>
                <li><Link href="/contact">CONTACT</Link></li>
              </ul>
            </div>

            {/* Help & Info */}
            <div className={styles.col}>
              <h3 className={styles.heading}>Help & Info</h3>
              <ul className={styles.links}>
                <li><Link href="/profile">TRACK YOUR ORDER</Link></li>
                <li><Link href="/return-policy">RETURNS POLICIES</Link></li>
                <li><Link href="/shipping-policy">SHIPPING POLICIES</Link></li>
                <li><Link href="/privacy-policy">PRIVACY POLICIES</Link></li>
                <li><Link href="/terms-conditions">TERMS & CONDITIONS</Link></li>
                <li><Link href="/faq">FAQS</Link></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className={styles.col}>
              <h3 className={styles.heading}>Contact Us</h3>
              <div className={styles.contactWrapper}>
                <p className={styles.contactText}>
                  Do you have any queries or suggestions?
                </p>
                <a href="mailto:rhst@gmail.com" className={styles.emailLink}>
                  rhst@gmail.com
                </a>
                <p className={styles.contactText} style={{ marginTop: '1.5rem' }}>
                  If you need support? Just give us a call.
                </p>
                <span className={styles.phoneVal}>
                  +91-8387634520
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.bottomContent}>
            {/* Payment & Shipping Logos */}
            <div className={styles.logosRow}>
              <div className={styles.logoItem}>
                <span className={styles.logoLabel}>We ship with:</span>
                <span className={styles.logoDhl}>
                  <img 
                    src="https://www.google.com/s2/favicons?domain=dhl.com&sz=32" 
                    alt="DHL" 
                    className={styles.favicon}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  DHL
                </span>
                <span className={styles.logoFedex}>
                  <img 
                    src="https://www.google.com/s2/favicons?domain=fedex.com&sz=32" 
                    alt="FedEx" 
                    className={styles.favicon}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  FedEx
                </span>
              </div>
              <div className={styles.logoItem}>
                <span className={styles.logoLabel}>Payment options:</span>
                <div className={styles.cardLogos}>
                  <span className={styles.cardLogo}>
                    <img 
                      src="https://www.google.com/s2/favicons?domain=visa.com&sz=32" 
                      alt="Visa" 
                      className={styles.favicon}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    Visa
                  </span>
                  <span className={styles.cardLogo}>
                    <img 
                      src="https://www.google.com/s2/favicons?domain=mastercard.com&sz=32" 
                      alt="Mastercard" 
                      className={styles.favicon}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    Mastercard
                  </span>
                  <span className={styles.cardLogo}>
                    <img 
                      src="https://www.google.com/s2/favicons?domain=paypal.com&sz=32" 
                      alt="PayPal" 
                      className={styles.favicon}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    PayPal
                  </span>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <p className={styles.copyright}>
              © Copyright 2026 RHST IT-Ecommerce Pvt. Ltd.. Design by Gatecode Pvt. Ltd.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
