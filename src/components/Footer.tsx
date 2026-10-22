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
                  alt="VALNQIX Logo"
                  className={styles.logoImg}
                />
              </div>
              <p className={styles.aboutText}>
                VALNQIX is a brand under RHST E-Commerce Pvt. Ltd., serving as your trusted technology partner providing quality IT products, solutions, and services.
                We offer the latest hardware, software, networking solutions, and business technology products to meet your digital needs.
              </p>
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
                <a href="mailto:info@valnqix.in" className={styles.emailLink}>
                  info@valnqix.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.bottomContent}>
            {/* Copyright & Brand Attribution */}
            <p className={styles.copyright}>
              © {new Date().getFullYear()} <strong>VALNQIX</strong> — A Brand under <strong>RHST E-Commerce Pvt. Ltd.</strong> All rights reserved.
            </p>

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
              </div>
              <div className={styles.logoItem}>
                <span className={styles.logoLabel}>Payment options:</span>
                <div className={styles.cardLogos}>
                  <span className={styles.cardLogo}>
                    <svg width="22" height="15" viewBox="0 0 32 22" fill="none" style={{ borderRadius: '3px', flexShrink: 0 }}>
                      <rect width="32" height="22" rx="3" fill="#003366"/>
                      <path d="M6 5h6.5c2.2 0 3.5 1.1 3.5 3s-1.3 3-3.5 3h-3.5v6H6V5zm3 4.5h3.5c.6 0 1-.3 1-.8s-.4-.8-1-.8H9v1.6z" fill="#FFFFFF"/>
                      <path d="M16 11l4.5 6h3.5l-4.5-6h-3.5z" fill="#00A859"/>
                      <path d="M21 11l4.5 6h3.5l-4.5-6h-3.5z" fill="#F58220"/>
                    </svg>
                    RuPay
                  </span>
                  <span className={styles.cardLogo}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M6 4l7 8-7 8" stroke="#009933" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 4l7 8-7 8" stroke="#F58220" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    UPI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
