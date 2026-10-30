'use client';

import React, { useState, useEffect } from 'react';
import styles from './EnquiryModal.module.css';

export interface EnquiryProduct {
  id?: string | number;
  name: string;
  price?: string | number;
  image?: string;
  sellerId?: string;
  sellerName?: string;
  sellerLocation?: string;
  sellerVerified?: boolean;
}

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: EnquiryProduct | null;
}

export default function EnquiryModal({ isOpen, onClose, product }: EnquiryModalProps) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [quantity, setQuantity] = useState('10');
  const [unit, setUnit] = useState('Pieces');
  const [requirement, setRequirement] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState<{ enquiryId: string; message: string } | null>(null);

  // Prefill details from logged in user if available
  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessData(null);

      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          if (u.name) setBuyerName(u.name);
          if (u.email) setBuyerEmail(u.email);
          if (u.phone) setBuyerPhone(u.phone);
        } catch (e) {
          // ignore
        }
      }

      if (product) {
        setRequirement(
          `Hi, I am interested in purchasing "${product.name}". Please send me your lowest quotation, delivery timeline, and warranty terms.`
        );
      }
    }
  }, [isOpen, product]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const sellerName = product.sellerName || 'Apex Tech Systems Pvt Ltd';
  const sellerLocation = product.sellerLocation || 'Jaipur, Rajasthan';
  const displayPrice = typeof product.price === 'number'
    ? `₹${product.price.toLocaleString()}`
    : product.price || 'Price on Request';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPhone = buyerPhone.replace(/[^\d]/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!buyerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productPrice: displayPrice,
          productImage: product.image,
          sellerId: product.sellerId,
          sellerName,
          sellerLocation,
          buyerName,
          buyerEmail,
          buyerPhone: cleanPhone,
          quantity,
          unit,
          requirement,
          source: 'Product Card Enquiry'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessData({
          enquiryId: data.enquiryId,
          message: data.message
        });
      } else {
        setErrorMessage(data.error || 'Failed to send enquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Network error occurred. Please check your internet connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h3>Get Best Price / Send Enquiry</h3>
            <p>Connect with verified supplier directly</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Product & Seller Info Card */}
        <div className={styles.productCard}>
          <img
            src={product.image || '/images/default_category.png'}
            alt={product.name}
            className={styles.productImage}
          />
          <div className={styles.productInfo}>
            <h4 className={styles.productName}>{product.name}</h4>
            <div className={styles.productPrice}>{displayPrice}</div>
            <div className={styles.sellerBadge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>{sellerName}</span>
            </div>
            <div className={styles.sellerLocation}>📍 {sellerLocation}</div>
          </div>
        </div>

        {/* Success Screen */}
        {successData ? (
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className={styles.successTitle}>Enquiry Sent Successfully!</h3>
            <p className={styles.successDesc}>
              {successData.message}
            </p>
            <div className={styles.enquiryTag}>Enquiry Ref: {successData.enquiryId}</div>
            <button className={styles.successCloseBtn} onClick={onClose}>
              Done / Continue Browsing
            </button>
          </div>
        ) : (
          /* Enquiry Form */
          <form className={styles.form} onSubmit={handleSubmit}>
            {errorMessage && <div className={styles.errorBanner}>⚠️ {errorMessage}</div>}

            <div className={styles.formRow}>
              <div className={styles.fieldGroup} style={{ flex: '1' }}>
                <label className={styles.fieldLabel}>Required Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  className={styles.input}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 10"
                />
              </div>

              <div className={styles.fieldGroup} style={{ flex: '1' }}>
                <label className={styles.fieldLabel}>Unit</label>
                <select
                  className={styles.select}
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="Pieces">Pieces</option>
                  <option value="Units">Units</option>
                  <option value="Sets">Sets</option>
                  <option value="Boxes">Boxes</option>
                  <option value="Lots">Bulk Lots</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Detailed Requirement / Message</label>
              <textarea
                className={styles.textarea}
                rows={3}
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="Describe your requirement (specifications, delivery timeline, etc.)..."
              />
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelWithBadge}>
                <label className={styles.fieldLabel}>Your Mobile Number (with WhatsApp) *</label>
                <span className={styles.whatsappBadge}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 16.67c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.214 8.214 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23z"/>
                  </svg>
                  <span>WhatsApp Verified</span>
                </span>
              </div>
              <div className={styles.phoneWrapper}>
                <div className={styles.phonePrefix}>
                  <svg width="20" height="14" viewBox="0 0 24 16" style={{ borderRadius: '2px', flexShrink: 0, boxShadow: '0 0 1px rgba(0,0,0,0.3)' }}>
                    <rect width="24" height="5.33" fill="#FF9933" />
                    <rect y="5.33" width="24" height="5.34" fill="#FFFFFF" />
                    <rect y="10.67" width="24" height="5.33" fill="#138808" />
                    <circle cx="12" cy="8" r="2" fill="#000080" />
                  </svg>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  required
                  placeholder="Enter 10-digit mobile number"
                  className={styles.phoneInput}
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  className={styles.input}
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className={styles.input}
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? (
                'DISPATCHING ENQUIRY...'
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  SEND ENQUIRY TO SUPPLIER
                </>
              )}
            </button>

            <div className={styles.trustFooter}>
              🛡️ Direct IndiaMART-style connection with verified seller • No commission charges • Instant quotes
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

