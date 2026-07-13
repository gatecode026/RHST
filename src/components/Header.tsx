'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './Header.module.css';

// No static products in Header. Search queries are fetched from the live MongoDB database.

// No static fallbacks are used. All categories and parent groupings are fetched dynamically from the database.

export default function Header() {
  const router = useRouter();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    logoutCleanup,
    isCartOpen,
    setIsCartOpen,
    isSearchOpen,
    setIsSearchOpen,
    subtotal,
    wishlistItems
  } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Search local states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  const getSubcategories = (parentName: string) => {
    const matched = dbCategories.filter(cat => 
      cat.parentGroup && cat.parentGroup.toLowerCase() === parentName.toLowerCase()
    );
    return matched.map(cat => ({
      name: cat.name,
      link: `/products?category=${encodeURIComponent(cat.name)}`
    }));
  };

  const getMainCategories = () => {
    const dbMain = dbCategories.filter(cat => !cat.parentGroup || cat.parentGroup === 'None');
    return Array.from(new Set(dbMain.map(cat => cat.name)));
  };

  // Fetch categories when Header mounts
  useEffect(() => {
    const fetchDbCategories = async () => {
      try {
        const res = await fetch('/api/categories?t=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.categories) {
          setDbCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories for header links', err);
      }
    };
    fetchDbCategories();
  }, []);

  // Fetch database products when search opens to ensure latest state is queried
  useEffect(() => {
    if (isSearchOpen) {
      const fetchDbProducts = async () => {
        try {
          const res = await fetch('/api/products?t=' + Date.now(), { cache: 'no-store' });
          const data = await res.json();
          if (data.success && data.products) {
            setDbProducts(data.products);
          }
        } catch (err) {
          console.error('Failed to load products for header search', err);
        }
      };
      fetchDbProducts();
    }
  }, [isSearchOpen]);

  // Profile overlay states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileMode, setProfileMode] = useState<'signup' | 'signin' | 'profile'>('signup');
  const [otpStatus, setOtpStatus] = useState('');
  const [profileSuccessMessage, setProfileSuccessMessage] = useState('');

  // Logged in user details state
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone: string } | null>(null);

  // Profile forms input states
  const [signUpName, setSignUpName] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Checkout local states
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [orderId, setOrderId] = useState('');

  // Revamped checkout fields
  const [step, setStep] = useState<'cart' | 'details'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: string } | null>(null);

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

  const getDiscountedSubtotal = () => {
    if (!appliedCoupon) return subtotal;
    if (appliedCoupon.type === 'percentage') {
      const discount = (subtotal * appliedCoupon.discount) / 100;
      return Math.max(0, subtotal - discount);
    } else {
      return Math.max(0, subtotal - appliedCoupon.discount);
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

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load current user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse currentUser from localStorage:', e);
      }
    }
  }, []);

  // Sync drawer checkout fields if logged in
  useEffect(() => {
    if (currentUser) {
      setCustomerName(prev => prev || currentUser.name);
      setCustomerEmail(prev => prev || currentUser.email);
      setCustomerPhone(prev => prev || currentUser.phone);
    }
  }, [currentUser]);

  // Lock body scroll when any overlay/drawer is open to prevent background scrolling/bleeding
  useEffect(() => {
    if (isCartOpen || isMobileMenuOpen || isSearchOpen || isProfileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, isMobileMenuOpen, isSearchOpen, isProfileOpen]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  const getSearchableProducts = () => {
    return dbProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: typeof p.price === 'number' ? p.price : (parseInt(String(p.price).replace(/[^\d]/g, ''), 10) || 0),
      image: p.image,
      link: `/products/${p.slug || p.id}`,
      stock: p.stock !== undefined ? p.stock : 12
    }));
  };

  const executeSearch = (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    const pool = getSearchableProducts();
    const filtered = pool.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    executeSearch(query);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
      alert('Please fill out all delivery fields.');
      return;
    }
    setCheckoutStatus('loading');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cartItems,
          subtotal: getDiscountedSubtotal(),
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: customerAddress
          },
          couponCode: appliedCoupon?.code || null,
          discountApplied: getDiscountAmount()
        })
      });

      const data = await res.json();
      if (data.success) {
        setCheckoutStatus('success');
        setOrderId(data.orderId);
        clearCart();
        // Reset states
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setCustomerAddress('');
        setCouponInput('');
        setAppliedCoupon(null);
        setStep('cart');
        setTimeout(() => {
          setCheckoutStatus('idle');
          setIsCartOpen(false);
        }, 6000);
      } else {
        setCheckoutStatus('error');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutStatus('error');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpStatus('');
    try {
      const res = await fetch('/api/profile/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          phone: signUpPhone,
          password: signUpPassword,
        })
      });
      const data = await res.json();
      if (data.success) {
        // Set current user session
        setCurrentUser(data.user);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        // Show success view
        setProfileSuccessMessage('Account created successfully! Welcome to RHST Store.');

        // Clear inputs
        setSignUpName('');
        setSignUpPhone('');
        setSignUpEmail('');
        setSignUpPassword('');
        setOtpStatus('');
      } else {
        setOtpStatus(data.error || 'Registration failed.');
      }
    } catch (err) {
      setOtpStatus('Network error during registration.');
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpStatus('');
    try {
      const res = await fetch('/api/profile/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
        })
      });
      const data = await res.json();
      if (data.success) {
        // Set current user session
        setCurrentUser(data.user);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        // Show success view
        setProfileSuccessMessage('Signed in successfully! Welcome back.');
        setSignInEmail('');
        setSignInPassword('');
        setOtpStatus('');
      } else {
        setOtpStatus(data.error || 'Invalid email or password.');
      }
    } catch (err) {
      setOtpStatus('Network error during sign in.');
    }
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    const hadSuccess = !!profileSuccessMessage;
    setProfileSuccessMessage('');
    setOtpStatus('');
    if (hadSuccess) {
      router.push('/profile');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarContent}>
            <div className={styles.topBarItem}>
              Need help? Call us +91-8387634520
            </div>
            <div className={styles.topBarItem}>
              <span>Summer sale discount off 60% off! <Link href="/products" className={styles.topBarLink}>Shop Now</Link></span>
            </div>
            <div className={styles.topBarItem}>
              2-3 business days delivery & free returns
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className="container">
          <div className={styles.navWrapper}>
            {/* Logo */}
            <Link href="/" className={styles.logoWrapper}>
              <img
                src="/images/logo.png"
                alt="RHST ECOMMERCE PVT. LTD."
                className={styles.logoImage}
              />
            </Link>

            {/* Navigation Links */}
            <nav className={styles.navLinks}>
              <Link href="/" className={styles.activeLink}>HOME</Link>

              <div className={styles.dropdown}>
                <Link href="/products" className={styles.dropdownBtn}>
                  PRODUCTS<span className={styles.chevron}>▾</span>
                </Link>
                <div className={styles.dropdownContent}>
                  {getMainCategories().map((mainCat) => {
                    const subs = getSubcategories(mainCat);
                    return (
                      <div key={mainCat} className={styles.nestedDropdown}>
                        <Link 
                          href={`/products?category=${encodeURIComponent(mainCat)}`} 
                          className={styles.nestedDropdownBtn}
                        >
                          {mainCat} <span className={styles.rightChevron}>▸</span>
                        </Link>
                        {subs.length > 0 && (
                          <div className={styles.nestedDropdownContent}>
                            {subs.map((sub) => (
                              <Link key={sub.name} href={sub.link}>
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.dropdown}>
                <Link href="/#services" className={styles.dropdownBtn}>
                  SERVICES<span className={styles.chevron}>▾</span>
                </Link>
                <div className={styles.dropdownContent}>
                  <Link href="/services/it-support">IT Support</Link>
                  <Link href="/services/installation">Installation Services</Link>
                  <Link href="/services/repair-maintenance">Repair & Maintenance</Link>
                  <Link href="/services/amc">AMC (Annual Maintenance Contract)</Link>
                  <Link href="/services/cloud">Cloud Services</Link>
                  <Link href="/services/consultation">Consultation Services</Link>
                </div>
              </div>
              <Link href="/about">ABOUT</Link>
              <Link href="/blog">BLOGS</Link>
              <Link href="/contact">CONTACT</Link>
            </nav>

            {/* Actions (Search, Account, Wishlist, Cart) */}
            <div className={styles.actions}>
              <button
                onClick={() => setIsSearchOpen(true)}
                className={styles.actionBtn}
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>

              <button
                onClick={() => {
                  if (currentUser) {
                    router.push('/profile');
                  } else {
                    setProfileMode('signup');
                    setIsProfileOpen(true);
                  }
                }}
                className={styles.actionBtn}
                aria-label="Account"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>

              <Link
                href="/wishlist"
                className={styles.actionBtn}
                style={{ position: 'relative' }}
                aria-label="Wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {wishlistItems && wishlistItems.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: '11px',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600
                  }}>
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className={styles.actionBtn}
                style={{ position: 'relative' }}
                aria-label="Cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {totalCartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: '11px',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600
                  }}>
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Hamburger Button (Mobile) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={styles.hamburgerBtn}
                aria-label="Toggle Menu"
              >
                <div className={`${styles.bar} ${isMobileMenuOpen ? styles.bar1 : ''}`} />
                <div className={`${styles.bar} ${isMobileMenuOpen ? styles.bar2 : ''}`} />
                <div className={`${styles.bar} ${isMobileMenuOpen ? styles.bar3 : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNavLinks}>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>

          <div className={styles.mobileNavGroup}>
            <span className={styles.mobileNavHeader}>PRODUCTS</span>
            <div className={styles.mobileSubLinksContainer}>
              {getMainCategories().map((mainCat) => {
                const subs = getSubcategories(mainCat);
                return (
                  <div key={mainCat} className={styles.mobileSubCategoryGroup}>
                    <Link
                      href={`/products?category=${encodeURIComponent(mainCat)}`}
                      className={styles.mobileMainCatLink}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {mainCat}
                    </Link>
                    {subs.length > 0 && (
                      <div className={styles.mobileNestedSubLinks}>
                        {subs.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.link}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Link href="/#categories" onClick={() => setIsMobileMenuOpen(false)}>CATEGORIES</Link>
          <Link href="/#brands" onClick={() => setIsMobileMenuOpen(false)}>BRANDS</Link>

          <div className={styles.mobileNavGroup}>
            <span className={styles.mobileNavHeader}>SERVICES</span>
            <div className={styles.mobileSubLinks}>
              <Link href="/services/it-support" onClick={() => setIsMobileMenuOpen(false)}>IT Support</Link>
              <Link href="/services/installation" onClick={() => setIsMobileMenuOpen(false)}>Installation Services</Link>
              <Link href="/services/repair-maintenance" onClick={() => setIsMobileMenuOpen(false)}>Repair & Maintenance</Link>
              <Link href="/services/amc" onClick={() => setIsMobileMenuOpen(false)}>AMC (Annual Maintenance Contract)</Link>
              <Link href="/services/cloud" onClick={() => setIsMobileMenuOpen(false)}>Cloud Services</Link>
              <Link href="/services/consultation" onClick={() => setIsMobileMenuOpen(false)}>Consultation Services</Link>
            </div>
          </div>

          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>ABOUT</Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)}>BLOGS</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>CONTACT</Link>
        </nav>
      </div>

      {/* Slide-out Cart Drawer Overlay */}
      <div className={`${styles.drawerOverlay} ${isCartOpen ? styles.overlayOpen : ''}`} onClick={() => setIsCartOpen(false)} />
      <div className={`${styles.cartDrawer} ${isCartOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <h3>Shopping Cart ({totalCartCount})</h3>
          <button onClick={() => setIsCartOpen(false)} className={styles.closeBtn} aria-label="Close Cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {checkoutStatus === 'success' ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80%',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h3 style={{ fontSize: '24px', marginBottom: '0.75rem', fontWeight: 600 }}>Order Placed!</h3>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '0.5rem' }}>
              Thank you for your order.
            </p>
            <span style={{ fontSize: '14px', fontWeight: 600, background: '#e2f0d9', padding: '6px 12px', borderRadius: '4px' }}>
              ID: {orderId}
            </span>
          </div>
        ) : (
          <>
            {step === 'cart' ? (
              <>
                <div className={styles.drawerItems}>
                  {cartItems.length === 0 ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      color: 'var(--gray)',
                      fontSize: '18px'
                    }}>
                      Your cart is empty
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className={styles.cartItem}>
                        <img src={item.image} alt={item.name} className={styles.itemImage} />
                        <div className={styles.itemDetails}>
                          <h4 style={{ fontSize: '16px', fontWeight: 400, marginBottom: '2px' }}>{item.name}</h4>
                          <p style={{ fontSize: '15px', color: 'var(--gray)', margin: 0 }}>
                            <span className={styles.itemPrice}>₹{item.price.toLocaleString()}</span>
                          </p>
                          {/* Qty adjustments */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              style={{
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                color: '#333',
                                cursor: 'pointer'
                              }}
                            >
                              -
                            </button>
                            <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              style={{
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                color: '#333',
                                cursor: 'pointer'
                              }}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsCartOpen(false);
                                router.push(`/checkout?buyNow=${item.id}`);
                              }}
                              className={styles.buyNowCartBtn}
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                        <button
                          className={styles.removeItem}
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove Item"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className={styles.drawerFooter}>
                    <div className={styles.subtotalRow}>
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <button
                      className={styles.checkoutBtn}
                      onClick={() => {
                        setIsCartOpen(false);
                        router.push('/checkout');
                      }}
                    >
                      Proceed To Checkout
                    </button>
                    <button onClick={() => setIsCartOpen(false)} className={styles.viewCartBtn}>Continue Shopping</button>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 73px)' }}>
                <div className={styles.drawerItems} style={{ gap: '1rem' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '6px', marginBottom: '8px' }}>Delivery details</h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>Full Name *</label>
                    <input
                      type="text"
                      className={styles.searchInput}
                      style={{ fontSize: '15px', border: '1px solid #ddd', borderRadius: '6px', padding: '8px 12px', width: '100%', backgroundColor: '#fff' }}
                      placeholder="e.g. John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>Email Address *</label>
                    <input
                      type="email"
                      className={styles.searchInput}
                      style={{ fontSize: '15px', border: '1px solid #ddd', borderRadius: '6px', padding: '8px 12px', width: '100%', backgroundColor: '#fff' }}
                      placeholder="e.g. john@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>Phone Number *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      className={styles.searchInput}
                      style={{ fontSize: '15px', border: '1px solid #ddd', borderRadius: '6px', padding: '8px 12px', width: '100%', backgroundColor: '#fff' }}
                      placeholder="e.g. 9876543210"
                      value={customerPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d]/g, '');
                        if (val.length === 0 || /^[6-9]/.test(val)) {
                          setCustomerPhone(val.slice(0, 10));
                        }
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>Shipping Address *</label>
                    <textarea
                      className={styles.searchInput}
                      style={{ fontSize: '15px', border: '1px solid #ddd', borderRadius: '6px', padding: '8px 12px', width: '100%', minHeight: '60px', fontFamily: 'inherit', resize: 'vertical', backgroundColor: '#fff' }}
                      placeholder="e.g. House No., Street, City, State, ZIP"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      required
                    />
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '6px', marginTop: '1rem', marginBottom: '8px' }}>Promo Coupon</h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className={styles.searchInput}
                      style={{ fontSize: '14px', border: '1px solid #ddd', borderRadius: '6px', padding: '8px 12px', flex: 1, textTransform: 'uppercase', backgroundColor: '#fff' }}
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      style={{ backgroundColor: 'var(--dark)', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <div style={{ color: '#ff4e2a', fontSize: '13px' }}>{couponError}</div>}
                  {appliedCoupon && (
                    <div style={{ color: '#28a745', fontSize: '13px', fontWeight: 500 }}>
                      Coupon code "{appliedCoupon.code}" applied! (-{appliedCoupon.discount}{appliedCoupon.type === 'percentage' ? '%' : ' INR'})
                    </div>
                  )}
                </div>

                <div className={styles.drawerFooter}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#28a745', fontWeight: 500 }}>
                        <span>Discount ({appliedCoupon.code}):</span>
                        <span>-₹{getDiscountAmount().toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, borderTop: '1px solid #ddd', paddingTop: '8px', marginTop: '4px' }}>
                      <span>Grand Total:</span>
                      <span style={{ color: 'var(--primary)' }}>₹{getDiscountedSubtotal().toLocaleString()}</span>
                    </div>
                  </div>

                  {checkoutStatus === 'error' && (
                    <div style={{ color: '#ff4e2a', fontSize: '14px', marginBottom: '8px', textAlign: 'center' }}>
                      Checkout failed. Please try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    className={styles.checkoutBtn}
                    disabled={checkoutStatus === 'loading'}
                    style={{ opacity: checkoutStatus === 'loading' ? 0.7 : 1, marginBottom: '0.5rem' }}
                  >
                    {checkoutStatus === 'loading' ? 'PLACING ORDER...' : 'Confirm & Place Order'}
                  </button>
                  <button
                    type="button"
                    className={styles.viewCartBtn}
                    onClick={() => setStep('cart')}
                  >
                    Back to Cart
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {/* Search Modal Overlay */}
      <div className={`${styles.searchOverlay} ${isSearchOpen ? styles.searchOpen : ''}`}>
        <button onClick={() => setIsSearchOpen(false)} className={styles.closeSearchBtn} aria-label="Close Search">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className={styles.searchContainer}>
          <h2 className={styles.searchTitle}>What are you looking for?</h2>
          <div className={styles.searchBarWrapper}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products, services, accessories..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className={styles.searchSubmitBtn}>Search</button>
          </div>

          {/* Real-time search results */}
          {searchQuery.trim() !== '' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              maxHeight: '400px',
              overflowY: 'auto',
              marginTop: '1.5rem',
              width: '100%',
              maxWidth: '600px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '16px', color: '#666', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '12px', fontWeight: 500 }}>
                {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found
              </h3>
              {searchResults.length === 0 ? (
                <div style={{ color: '#999', padding: '1rem 0' }}>No products match your search.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {searchResults.map((prod) => (
                    <div key={prod.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f9f9f9', paddingBottom: '8px' }}>
                      <Link
                        href={prod.link}
                        onClick={() => {
                          setIsSearchOpen(false);
                          sessionStorage.setItem('scroll_pos_before_product_detail', JSON.stringify({
                            path: window.location.pathname,
                            scrollY: window.scrollY
                          }));
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none' }}
                      >
                        <img src={prod.image} alt={prod.name} style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #eee' }} />
                        <div>
                          <div style={{ fontSize: '15px', color: '#333', fontWeight: 500 }}>{prod.name}</div>
                          <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600 }}>₹{prod.price.toLocaleString()}</div>
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          addToCart({ id: prod.id, name: prod.name, price: prod.price, image: prod.image, stock: prod.stock });
                          setIsSearchOpen(false);
                        }}
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {searchQuery.trim() === '' && (
            <div className={styles.quickSearches}>
              <span>Popular:</span>
              <a href="#products" onClick={() => { setSearchQuery('Laptops'); setSearchResults(getSearchableProducts().filter(p => p.name.toLowerCase().includes('laptop') || p.name.toLowerCase().includes('ipad'))); }}>Laptops</a>
              <a href="#products" onClick={() => { setSearchQuery('Mouse'); setSearchResults(getSearchableProducts().filter(p => p.name.toLowerCase().includes('mouse'))); }}>Mouse</a>
              <a href="#products" onClick={() => { setSearchQuery('Head'); setSearchResults(getSearchableProducts().filter(p => p.name.toLowerCase().includes('head'))); }}>Headphones</a>
              <a href="#products" onClick={() => { setSearchQuery('Monitor'); setSearchResults(getSearchableProducts().filter(p => p.name.toLowerCase().includes('monitor'))); }}>Monitor</a>
            </div>
          )}
        </div>
      </div>

      {/* Profile/Account Modal Overlay */}
      <div className={`${styles.profileOverlay} ${isProfileOpen ? styles.profileOpen : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseProfile();
      }}>
        <div className={styles.profileModalCard}>
          {/* Close Button */}
          <button onClick={handleCloseProfile} className={styles.closeProfileBtn} aria-label="Close Profile Modal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Hexagon Logo */}
          <div className={styles.profileLogoWrapper}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.hexagonIcon}>
              <path d="M12 2l8.66 5v10L12 22l-8.66-5V7z" />
            </svg>
          </div>

          {profileSuccessMessage ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
              <div style={{ color: '#28a745', marginBottom: '1.5rem', animation: 'scaleUp 0.3s ease' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className={styles.profileModalTitle}>Success!</h2>
              <p className={styles.profileModalSubtitle} style={{ marginBottom: '1.5rem' }}>
                {profileSuccessMessage}
              </p>
              <button
                type="button"
                className={styles.profileSubmitBtn}
                style={{ width: 'auto', padding: '12px 35px', marginTop: '1rem' }}
                onClick={() => {
                  handleCloseProfile();
                  router.push('/profile');
                }}
              >
                Get Started
              </button>
            </div>
          ) : (
            <>
              {profileMode === 'profile' ? (
                <>
                  <h2 className={styles.profileModalTitle}>My Account</h2>
                  <p className={styles.profileModalSubtitle}>
                    Welcome back to RHST Store!
                  </p>

                  <div className={styles.profileDetailsBox}>
                    <div className={styles.profileDetailRow}>
                      <span className={styles.profileDetailLabel}>Full Name</span>
                      <span className={styles.profileDetailValue}>{currentUser?.name}</span>
                    </div>
                    <div className={styles.profileDetailRow}>
                      <span className={styles.profileDetailLabel}>Email Address</span>
                      <span className={styles.profileDetailValue}>{currentUser?.email}</span>
                    </div>
                    <div className={styles.profileDetailRow}>
                      <span className={styles.profileDetailLabel}>Phone Number</span>
                      <span className={styles.profileDetailValue}>{currentUser?.phone}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.profileSubmitBtn}
                    style={{ backgroundColor: '#ff4e2a', marginTop: '1.5rem' }}
                    onClick={() => {
                      setCurrentUser(null);
                      localStorage.removeItem('currentUser');
                      logoutCleanup();
                      setProfileMode('signup');
                      router.push('/');
                      setTimeout(() => {
                        window.location.reload();
                      }, 100);
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : profileMode === 'signup' ? (
                <>
                  <h2 className={styles.profileModalTitle}>Create Account</h2>
                  <p className={styles.profileModalSubtitle}>
                    Join RHST Store to get the best deals on PC components.
                  </p>

                  <form onSubmit={handleSignUpSubmit} className={styles.profileForm}>
                    {/* Full Name */}
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        className={styles.profileInput}
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                      />
                    </div>

                    {/* Phone Number */}
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </span>
                      <input
                        type="tel"
                        required
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        placeholder="Phone Number (10 digits)"
                        className={styles.profileInput}
                        value={signUpPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d]/g, '');
                          if (val.length === 0 || /^[6-9]/.test(val)) {
                            setSignUpPhone(val.slice(0, 10));
                          }
                        }}
                      />
                    </div>

                    {/* Email Address */}
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        className={styles.profileInput}
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                      />
                    </div>

                    {otpStatus && (
                      <div style={{ color: '#ff4e2a', fontSize: '13px', textAlign: 'left', marginTop: '-0.5rem', marginBottom: '0.25rem', paddingLeft: '0.5rem', fontWeight: 500 }}>
                        <span>{otpStatus}</span>
                      </div>
                    )}

                    {/* Password */}
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <input
                        type="password"
                        required
                        placeholder="Password"
                        className={styles.profileInput}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                      />
                    </div>

                    {/* Submit Sign Up */}
                    <button type="submit" className={styles.profileSubmitBtn}>
                      Sign Up <span className={styles.arrowIcon}>→</span>
                    </button>
                  </form>

                  <div className={styles.profileFooter}>
                    Already have an account? <span className={styles.signInLink} onClick={() => { setProfileMode('signin'); setOtpStatus(''); }}>Sign In</span>
                  </div>
                </>
              ) : (
                <>
                  <h2 className={styles.profileModalTitle}>Sign In</h2>
                  <p className={styles.profileModalSubtitle}>
                    Welcome back! Sign in to your RHST account to check your orders.
                  </p>

                  <form onSubmit={handleSignInSubmit} className={styles.profileForm}>
                    {/* Email Address */}
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        className={styles.profileInput}
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                      />
                    </div>

                    {/* Password */}
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <input
                        type="password"
                        required
                        placeholder="Password"
                        className={styles.profileInput}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                      />
                    </div>

                    {otpStatus && (
                      <div style={{ color: '#ff4e2a', fontSize: '13px', textAlign: 'left', marginTop: '-0.5rem', marginBottom: '0.25rem', paddingLeft: '0.5rem', fontWeight: 500 }}>
                        {otpStatus}
                      </div>
                    )}

                    {/* Submit Sign In */}
                    <button type="submit" className={styles.profileSubmitBtn}>
                      Sign In <span className={styles.arrowIcon}>→</span>
                    </button>
                  </form>

                  <div className={styles.profileFooter}>
                    Don't have an account yet? <span className={styles.signInLink} onClick={() => { setProfileMode('signup'); setOtpStatus(''); }}>Sign Up</span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

