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
