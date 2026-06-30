'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSearchParams } from 'next/navigation';
import Categories from '@/components/Categories';
import Brands from '@/components/Brands';
import styles from './Checkout.module.css';

export default function CheckoutClient() {
  const { cartItems: contextCartItems, clearCart, removeFromCart } = useCart();
  const searchParams = useSearchParams();
  const buyNowId = searchParams ? searchParams.get('buyNow') : null;

  // Filter items if checking out a single product via "Buy Now"
  const cartItems = buyNowId 
    ? contextCartItems.filter(item => String(item.id) === buyNowId)
    : contextCartItems;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Authentication check states
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Multi-step checkout states
  const [step, setStep] = useState<'billing' | 'payment'>('billing');
  const [paymentMethod, setPaymentMethod] = useState<'Direct bank transfer' | 'Cash on delivery' | 'PayPal'>('Direct bank transfer');

  // Custom bank/card & upi states matching user request
  const [cardNumber, setCardNumber] = useState('');
  const [cardNickname, setCardNickname] = useState('VIBHU SHARMA');
  const [cardExpiryMonth, setCardExpiryMonth] = useState('01');
  const [cardExpiryYear, setCardExpiryYear] = useState('2026');
  const [upiId, setUpiId] = useState('');

  // Form Field States matching the billing template details exactly
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('India');
  const [street1, setStreet1] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Rajasthan');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Checkout Status States
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [orderId, setOrderId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Coupon States
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: string } | null>(null);

  // Prefill billing details if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        if (user.name) {
          const parts = user.name.trim().split(/\s+/);
          if (parts.length > 0) {
            setFirstName(prev => prev || parts[0]);
            if (parts.length > 1) {
              setLastName(prev => prev || parts.slice(1).join(' '));
            }
          }
        }
        if (user.email) {
          setEmail(prev => prev || user.email);
        }
        if (user.phone) {
          setPhone(prev => prev || user.phone);
        }
      } catch (e) {
        console.error('Failed to prefill billing details from session:', e);
      }
    } else {
      // Automatically open the login overlay modal directly when landing on checkout if not logged in
      const accountBtn = document.querySelector('[aria-label="Account"]') as HTMLElement;
      if (accountBtn) {
        setTimeout(() => {
          accountBtn.click();
        }, 100);
      }
    }
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return (
      <div className={styles.checkoutSection} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '16px', color: '#666', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>Loading checkout...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={styles.checkoutSection} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', backgroundColor: '#fff', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#fdf2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6f61', marginBottom: '1.5rem', fontSize: '32px' }}>
          🔒
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 500, color: '#333', fontFamily: 'var(--font-sans)', marginBottom: '0.75rem' }}>Login Required to Place Order</h2>
        <p style={{ fontSize: '15.5px', color: '#666', fontWeight: 300, fontFamily: 'var(--font-sans)', maxWidth: '440px', lineHeight: '1.6', marginBottom: '2rem' }}>
          Please sign in or create an account to configure your delivery details and complete your order.
        </p>
        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
          <button 
            onClick={() => {
              const accountBtn = document.querySelector('[aria-label="Account"]') as HTMLElement;
              if (accountBtn) accountBtn.click();
            }} 
            style={{ padding: '12px 30px', borderRadius: '50px', backgroundColor: 'var(--primary)', color: '#fff', fontSize: '14.5px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(255, 111, 97, 0.2)' }}
          >
            Sign In / Register
          </button>
          <Link 
            href="/" 
            style={{ padding: '12px 30px', borderRadius: '50px', backgroundColor: '#f4f4f6', color: '#333', fontSize: '14.5px', fontWeight: 500, textDecoration: 'none', border: '1px solid #e1e1e6', transition: 'all 0.2s' }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError('');
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(couponInput.trim())}&subtotal=${subtotal}`);
      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedCoupon(data.coupon);
        setCouponError('');
      } else {
        setCouponError(data.error || 'Coupon code invalid.');
        setAppliedCoupon(null);
      }
    } catch (e) {
      setCouponError('Error validating coupon.');
      setAppliedCoupon(null);
    }
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.discount) / 100;
    } else {
      return appliedCoupon.discount;
    }
  };

  const getDiscountedTotal = () => {
    return Math.max(0, subtotal - getDiscountAmount());
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Add products to cart first.');
      setCheckoutStatus('error');
      return;
    }

    if (!firstName || !lastName || !street1 || !city || !zipCode || !phone || !email) {
      setErrorMessage('Please fill out all required fields.');
      setCheckoutStatus('error');
      return;
    }

    setErrorMessage('');
    setCheckoutStatus('idle');
    setStep('payment');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Add products to cart first.');
      setCheckoutStatus('error');
      return;
    }

    if (paymentMethod === 'Direct bank transfer') {
      if (!cardNumber || cardNumber.length < 16) {
        setErrorMessage('Please enter a valid 16-digit card number.');
        setCheckoutStatus('error');
        return;
      }
      if (!cardNickname.trim()) {
        setErrorMessage('Please enter a card nickname.');
        setCheckoutStatus('error');
        return;
      }
    }

    if (paymentMethod === 'PayPal') {
      if (!upiId.trim()) {
        setErrorMessage('Please enter your UPI ID.');
        setCheckoutStatus('error');
        return;
      }
    }

    setCheckoutStatus('loading');
    setErrorMessage('');

    // Concatenate full shipping address from inputs
    const address = `${street1}${street2 ? ', ' + street2 : ''}, ${city}, ${stateName} - ${zipCode}, ${country}`;
    const customer = {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      address
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            qty: item.qty
          })),
          subtotal: getDiscountedTotal(),
          customer,
          couponCode: appliedCoupon?.code || null,
          discountApplied: getDiscountAmount(),
          orderNotes: orderNotes || null,
          paymentMethod
        })
      });
      const data = await res.json();
      if (data.success && data.orderId) {
        setOrderId(data.orderId);
        setCheckoutStatus('success');
        if (buyNowId) {
          const itemToRemove = contextCartItems.find(item => String(item.id) === buyNowId);
          if (itemToRemove) {
            removeFromCart(itemToRemove.id);
          }
        } else {
          clearCart();
        }
      } else {
        setErrorMessage(data.error || 'Failed to place your order. Please check your inputs.');
        setCheckoutStatus('error');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage('An unexpected connection error occurred. Please try again.');
      setCheckoutStatus('error');
    }
  };

  if (checkoutStatus === 'success') {
    return (
      <div className={styles.checkoutSection}>
        <div className="container">
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Order Confirmed!</h2>
            <p className={styles.successText}>
              Thank you for shopping with us. Your order has been placed successfully and is being processed.
            </p>
            <div className={styles.successOrderId}>
              Order ID: {orderId}
            </div>
            <div>
              <Link href="/" className={styles.successHomeBtn}>
                Back to Shop Home
              </Link>
            </div>
          </div>

          <div className={styles.categoriesWrapper}>
            <Categories title="HARDWARE PRODUCTS" />
          </div>
          <Brands />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutSection}>
      {step === 'billing' ? (
        <div className="container">
          <div className={styles.grid}>
            {/* Left Column: Billing Form */}
            <div>
              <h2 className={styles.colTitle}>Billing Details</h2>
              <form onSubmit={handleProceedToPayment} className={styles.form}>
                {checkoutStatus === 'error' && (
                  <div style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '15px', marginBottom: '0.5rem' }}>
                    {errorMessage}
                  </div>
                )}

                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>First name <span>*</span></label>
                    <input
                      type="text"
                      required
                      className={styles.input}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Last name <span>*</span></label>
                    <input
                      type="text"
                      required
                      className={styles.input}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroupFull}>
                  <label className={styles.label}>Company name (optional)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroupFull}>
                  <label className={styles.label}>Country / Region <span>*</span></label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroupFull}>
                  <label className={styles.label}>Street address <span>*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="House number and street name"
                    className={styles.input}
                    style={{ marginBottom: '0.75rem' }}
                    value={street1}
                    onChange={(e) => setStreet1(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Apartments, suite, unit etc. (optional)"
                    className={styles.input}
                    value={street2}
                    onChange={(e) => setStreet2(e.target.value)}
                  />
                </div>

                <div className={styles.formRow3}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Town / City <span>*</span></label>
                    <input
                      type="text"
                      required
                      className={styles.input}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>State <span>*</span></label>
                    <input
                      type="text"
                      required
                      className={styles.input}
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>ZIP Code <span>*</span></label>
                    <input
                      type="text"
                      required
                      className={styles.input}
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Phone <span>*</span></label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      className={styles.input}
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d]/g, '');
                        if (val.length === 0 || /^[6-9]/.test(val)) {
                          setPhone(val.slice(0, 10));
                        }
                      }}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Email address <span>*</span></label>
                    <input
                      type="email"
                      required
                      className={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column: Additional Info & Order Summary */}
            <div>
              <h2 className={styles.colTitle}>Additional Information</h2>
              <div className={styles.fieldGroupFull} style={{ marginBottom: '2.5rem' }}>
                <label className={styles.label}>Order notes (optional)</label>
                <textarea
                  placeholder="Notes about your order, like special notes for delivery."
                  className={styles.textarea}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </div>

              {/* Order Summary Box */}
              <div className={styles.summaryBox}>
                <h3 className={styles.summaryTitle}>Your Order</h3>
                
                {cartItems.length === 0 ? (
                  <div style={{ color: 'var(--gray)', padding: '1rem 0', fontSize: '15px' }}>
                    Your cart is empty. Add items to cart to place an order.
                  </div>
                ) : (
                  <>
                    <div className={styles.orderItemsList}>
                      {cartItems.map((item) => (
                        <div key={item.id} className={styles.orderItemRow}>
                          <span className={styles.orderItemName}>
                            {item.name} <span className={styles.orderItemQty}>× {item.qty}</span>
                          </span>
                          <span className={styles.orderItemPrice}>
                            ₹{(item.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Coupon Validation Input */}
                    <div className={styles.couponSection}>
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        className={styles.couponInput}
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className={styles.couponBtn}
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <div style={{ color: 'var(--primary)', fontSize: '13px', marginTop: '-1rem', marginBottom: '1.25rem' }}>{couponError}</div>}
                    {appliedCoupon && (
                      <div style={{ color: '#28a745', fontSize: '13px', marginTop: '-1rem', marginBottom: '1.25rem', fontWeight: 500 }}>
                        Coupon code "{appliedCoupon.code}" applied! (-{appliedCoupon.discount}{appliedCoupon.type === 'percentage' ? '%' : ' INR'})
                      </div>
                    )}

                    <div className={styles.totalsWrapper}>
                      <div className={styles.totalRow}>
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      {appliedCoupon && (
                        <div className={styles.totalRow} style={{ color: '#28a745', fontWeight: 500 }}>
                          <span>Discount</span>
                          <span>-₹{getDiscountAmount().toLocaleString()}</span>
                        </div>
                      )}
                      <div className={styles.grandTotalRow}>
                        <span>Total</span>
                        <span style={{ color: 'var(--primary)' }}>₹{getDiscountedTotal().toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={styles.submitBtn}
                      onClick={handleProceedToPayment}
                      disabled={checkoutStatus === 'loading'}
                    >
                      {checkoutStatus === 'loading' ? 'PLACING ORDER...' : 'Place Order'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className={styles.paymentContainer}>
            <h2 className={styles.paymentTitle}>CART TOTALS</h2>
            
            <div className={styles.totalsTable}>
              <div className={styles.totalsRow}>
                <span className={styles.totalsLabel}>SUBTOTAL</span>
                <span className={styles.totalsValue}>₹{getDiscountedTotal().toLocaleString()}/-</span>
              </div>
              <div className={styles.totalsRow}>
                <span className={styles.totalsLabel}>TOTAL</span>
                <span className={styles.totalsValue}>₹{getDiscountedTotal().toLocaleString()}/-</span>
              </div>
            </div>

            <div className={styles.paymentMethods}>
              {[
                { id: 'bank', label: 'Direct bank transfer' },
                { id: 'cod', label: 'Cash on delivery' },
                { id: 'paypal', label: 'PayPal' }
              ].map(method => (
                <div key={method.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <label className={styles.radioLabel} style={{ marginBottom: 0 }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      className={styles.radioInput}
                      checked={paymentMethod === method.label}
                      onChange={() => setPaymentMethod(method.label as any)}
                    />
                    <span className={styles.customRadio}></span>
                    <span>{method.label}</span>
                  </label>

                  {/* If Direct bank transfer is selected, show card details matching 2nd image */}
                  {method.id === 'bank' && paymentMethod === 'Direct bank transfer' && (
                    <div className={styles.paymentSubForm}>
                      <label className={styles.subFormLabel}>Card number</label>
                      <input 
                        type="text" 
                        placeholder="Enter 16-digit card number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 16))}
                        className={styles.subFormInput}
                        maxLength={16}
                      />

                      <label className={styles.subFormLabel}>Nickname</label>
                      <input 
                        type="text" 
                        placeholder="Enter nickname"
                        value={cardNickname}
                        onChange={(e) => setCardNickname(e.target.value)}
                        className={styles.subFormInput}
                      />

                      <label className={styles.subFormLabel}>Expiry date</label>
                      <div className={styles.subFormSelectGroup}>
                        <select 
                          value={cardExpiryMonth} 
                          onChange={(e) => setCardExpiryMonth(e.target.value)}
                          className={styles.subFormSelect}
                        >
                          {Array.from({ length: 12 }).map((_, idx) => {
                            const m = String(idx + 1).padStart(2, '0');
                            return <option key={m} value={m}>{m}</option>;
                          })}
                        </select>
                        <select 
                          value={cardExpiryYear} 
                          onChange={(e) => setCardExpiryYear(e.target.value)}
                          className={styles.subFormSelect}
                        >
                          {Array.from({ length: 10 }).map((_, idx) => {
                            const y = String(2026 + idx);
                            return <option key={y} value={y}>{y}</option>;
                          })}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* If PayPal is selected, show UPI ID field */}
                  {method.id === 'paypal' && paymentMethod === 'PayPal' && (
                    <div className={styles.paymentSubForm}>
                      <label className={styles.subFormLabel}>UPI ID</label>
                      <input 
                        type="text" 
                        placeholder="e.g. username@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className={styles.subFormInput}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {checkoutStatus === 'error' && (
              <div style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '15px', marginBottom: '1.5rem' }}>
                {errorMessage}
              </div>
            )}

            <button
              type="button"
              className={styles.paymentPlaceOrderBtn}
              onClick={handlePlaceOrder}
              disabled={checkoutStatus === 'loading'}
            >
              {checkoutStatus === 'loading' ? 'PLACING ORDER...' : 'PLACE AN ORDER'}
            </button>
          </div>
        </div>
      )}

      <div className={styles.categoriesWrapper}>
        <Categories title="HARDWARE PRODUCTS" />
      </div>
      <Brands />
    </div>
  );
}
