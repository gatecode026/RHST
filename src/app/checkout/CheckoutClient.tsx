'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Categories from '@/components/Categories';
import Brands from '@/components/Brands';
import styles from './Checkout.module.css';

export default function CheckoutClient() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [quantity, setQuantity] = useState('10');
  const [unit, setUnit] = useState('Pieces');
  const [requirement, setRequirement] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Rajasthan');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [enquiryId, setEnquiryId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill details if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        if (user.name) setBuyerName(user.name);
        if (user.email) setBuyerEmail(user.email);
        if (user.phone) setBuyerPhone(user.phone);
        if (user.address && user.address.city) setCity(user.address.city);
        if (user.address && user.address.state) setStateName(user.address.state);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPhone = buyerPhone.replace(/[^\d]/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!buyerName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!productName.trim()) {
      setErrorMessage('Please specify the product or service you require.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          buyerName,
          buyerPhone: cleanPhone,
          buyerEmail,
          quantity,
          unit,
          requirement: `${requirement} (Preferred Location: ${city || 'Any'}, ${stateName})`,
          source: 'Post Buy Requirement Page',
          sellerName: `Verified ${category} Suppliers`
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setEnquiryId(data.enquiryId);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to submit requirement.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <div className={styles.checkoutSection}>
      <div className="container">
        {status === 'success' ? (
          <div style={{
            maxWidth: '600px',
            margin: '3rem auto',
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '3rem 2rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '32px'
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
              Requirement Posted Successfully!
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Your buy requirement for <strong>{productName}</strong> ({quantity} {unit}) has been broadcast to verified suppliers in {category}. Verified sellers will contact you with their lowest quotations shortly.
            </p>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              padding: '6px 16px',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '2rem'
            }}>
              Requirement Ref: {enquiryId}
            </div>
            <div>
              <Link
                href="/products"
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}
              >
                Explore More Products
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Tell Us What You Need
              </h2>
              <p style={{ fontSize: '15px', color: '#64748b' }}>
                Receive customized quotations directly from verified manufacturers and suppliers across India
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              {errorMessage && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  marginBottom: '1.5rem',
                  fontSize: '14px'
                }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Product / Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell Laptops, CCTV Cameras, Core i7 Desktop PCs..."
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '15px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Main Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '15px',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Office Equipment">Office Equipment</option>
                    <option value="Gaming Products">Gaming Products</option>
                    <option value="Computer Access">Computer Access</option>
                    <option value="Networking">Networking & CCTV</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Quantity Needed *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '15px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '15px',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="Pieces">Pieces</option>
                    <option value="Units">Units</option>
                    <option value="Sets">Sets</option>
                    <option value="Boxes">Boxes</option>
                    <option value="Bulk Lots">Bulk Lots</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Requirement Details / Specifications
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention brand preferences, technical specifications, required delivery timeline, etc."
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '15px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Your Mobile Number *
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    height: '46px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0 12px',
                      height: '100%',
                      backgroundColor: '#f8fafc',
                      borderRight: '1px solid #e2e8f0',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#334155',
                      whiteSpace: 'nowrap',
                      userSelect: 'none',
                      flexShrink: 0
                    }}>
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
                      required
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      placeholder="Enter 10-digit mobile number"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                      style={{
                        flex: 1,
                        height: '100%',
                        border: 'none',
                        outline: 'none',
                        padding: '0 14px',
                        fontSize: '15px',
                        color: '#0f172a',
                        background: 'transparent',
                        letterSpacing: '0.5px',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '15px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '15px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    City / State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={city ? `${city}, ${stateName}` : ''}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '15px'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                }}
              >
                {status === 'loading' ? 'BROADCASTING REQUIREMENT...' : 'POST BUY REQUIREMENT NOW'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '12px', color: '#64748b' }}>
                🔒 Free service • Connect directly with verified suppliers • Zero brokerage fees
              </div>
            </form>
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <Categories title="CATEGORIES YOU MAY BE INTERESTED IN" />
      </div>
      <Brands />
    </div>
  );
}
