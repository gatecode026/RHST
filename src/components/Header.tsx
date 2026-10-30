'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './Header.module.css';

// No static products in Header. Search queries are fetched from the live MongoDB database.

// No static fallbacks are used. All categories and parent groupings are fetched dynamically from the database.

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    logoutCleanup,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    isSearchOpen,
    setIsSearchOpen,
    subtotal,
    wishlistItems,
    removeFromWishlist
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

  // Load and continuously sync current user session
  useEffect(() => {
    const syncUser = () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse currentUser from localStorage:', e);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    window.addEventListener('focus', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('focus', syncUser);
    };
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
    if (isCartOpen || isWishlistOpen || isMobileMenuOpen || isSearchOpen || isProfileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, isWishlistOpen, isMobileMenuOpen, isSearchOpen, isProfileOpen]);

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
      let data: any = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        setOtpStatus(`Server error (${res.status}). Please check your server or database configuration.`);
        return;
      }
      if (data && data.success) {
        // Set current user session
        setCurrentUser(data.user);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        // Show success view and redirect to profile page
        setProfileSuccessMessage('Account created successfully! Redirecting to your profile...');

        // Clear inputs
        setSignUpName('');
        setSignUpPhone('');
        setSignUpEmail('');
        setSignUpPassword('');
        setOtpStatus('');

        setTimeout(() => {
          setIsProfileOpen(false);
          setProfileSuccessMessage('');
          router.push('/profile');
        }, 600);
      } else {
        setOtpStatus(data?.error || 'Registration failed.');
      }
    } catch (err: any) {
      setOtpStatus(err?.message || 'Network error during registration.');
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
      let data: any = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        setOtpStatus(`Server error (${res.status}). Please check your server or database configuration.`);
        return;
      }
      if (data && data.success) {
        // Set current user session
        setCurrentUser(data.user);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        // Show success view and redirect to profile page
        setProfileSuccessMessage('Signed in successfully! Redirecting to your profile...');
        setSignInEmail('');
        setSignInPassword('');
        setOtpStatus('');

        setTimeout(() => {
          setIsProfileOpen(false);
          setProfileSuccessMessage('');
          router.push('/profile');
        }, 600);
      } else {
        setOtpStatus(data?.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setOtpStatus(err?.message || 'Network error during sign in.');
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
                alt="VALNQIX - A Brand under RHST E-Commerce Pvt. Ltd."
                className={styles.logoImage}
              />
            </Link>

            {/* Navigation Links */}
            <nav className={styles.navLinks}>
              <Link 
                href="/" 
                className={pathname === '/' ? styles.activeLink : ''}
              >
                HOME
              </Link>

              <div className={styles.dropdown}>
                <Link 
                  href="/products" 
                  className={`${styles.dropdownBtn} ${pathname.startsWith('/products') ? styles.activeLink : ''}`}
                >
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
                <Link 
                  href="/#services" 
                  className={`${styles.dropdownBtn} ${pathname.startsWith('/services') ? styles.activeLink : ''}`}
                >
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
              <Link 
                href="/about" 
                className={pathname === '/about' ? styles.activeLink : ''}
              >
                ABOUT
              </Link>
              <Link 
                href="/blog" 
                className={pathname.startsWith('/blog') ? styles.activeLink : ''}
              >
                BLOGS
              </Link>
              <Link 
                href="/contact" 
                className={pathname === '/contact' ? styles.activeLink : ''}
              >
                CONTACT
              </Link>
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

              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setProfileMode('profile');
                    setIsProfileOpen(true);
                  }}
                  className={styles.actionBtn}
                  aria-label="My Profile"
                  title={`Logged in as ${currentUser.name || currentUser.email} — Click to view profile`}
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0
                  }}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary, #ff4e2a)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 6px rgba(255, 78, 42, 0.35)'
                  }}>
                    {(currentUser.name || currentUser.email || 'U').trim()[0]}
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#333333',
                    maxWidth: '85px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {currentUser.name ? currentUser.name.split(' ')[0] : 'Profile'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setProfileMode('signup');
                    setIsProfileOpen(true);
                  }}
                  className={styles.actionBtn}
                  aria-label="Account"
                  title="Sign In / Register"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                className={styles.actionBtn}
                style={{ position: 'relative' }}
                aria-label="Wishlist"
                title={`Wishlist (${wishlistItems?.length || 0} items)`}
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
              </button>

              {/* IndiaMART Post Buy Requirement CTA */}
              <Link
                href="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)'
                }}
                className={styles.headerRequirementBtn}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                <span>Post Requirement</span>
              </Link>

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
          <Link 
            href="/" 
            className={pathname === '/' ? styles.activeLink : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            HOME
          </Link>

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

          <Link 
            href="/about" 
            className={pathname === '/about' ? styles.activeLink : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ABOUT
          </Link>
          <Link 
            href="/blog" 
            className={pathname.startsWith('/blog') ? styles.activeLink : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            BLOGS
          </Link>
          <Link 
            href="/contact" 
            className={pathname === '/contact' ? styles.activeLink : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            CONTACT
          </Link>

          {currentUser ? (
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: 'var(--primary, #ff4e2a)',
                fontWeight: 600,
                borderTop: '1px solid #f0f0f0',
                paddingTop: '0.75rem',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              MY ACCOUNT ({currentUser.name ? currentUser.name.split(' ')[0] : 'Profile'}) →
            </Link>
          ) : (
            <span
              onClick={() => {
                setIsMobileMenuOpen(false);
                setProfileMode('signup');
                setIsProfileOpen(true);
              }}
              style={{
                cursor: 'pointer',
                color: '#333333',
                fontWeight: 500,
                borderTop: '1px solid #f0f0f0',
                paddingTop: '0.75rem',
                marginTop: '0.5rem',
                display: 'block'
              }}
            >
              SIGN IN / REGISTER
            </span>
          )}
        </nav>
      </div>

      {/* Slide-out Wishlist/Liked Items Drawer Overlay */}
      <div 
        className={`${styles.drawerOverlay} ${isWishlistOpen ? styles.overlayOpen : ''}`} 
        onClick={() => setIsWishlistOpen(false)} 
      />
      <div className={`${styles.cartDrawer} ${isWishlistOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <h3>Wishlist ({wishlistItems?.length || 0})</h3>
          <button 
            onClick={() => setIsWishlistOpen(false)} 
            className={styles.closeBtn} 
            aria-label="Close Wishlist"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.drawerItems}>
          {(!wishlistItems || wishlistItems.length === 0) ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              padding: '2rem 1rem',
              color: 'var(--gray)'
            }}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>Your Wishlist is Empty</h4>
              <p style={{ fontSize: '14px', color: '#777', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Explore products and tap the heart icon to save products you love.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsWishlistOpen(false);
                  router.push('/products');
                }}
                className={styles.checkoutBtn}
                style={{ width: 'auto', padding: '10px 24px', fontSize: '14px' }}
              >
                Explore Products
              </button>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemDetails}>
                  <h4 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>
                    <Link 
                      href={`/products/${item.slug || item.id}`}
                      onClick={() => setIsWishlistOpen(false)}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {item.name}
                    </Link>
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600, margin: '0 0 8px 0' }}>
                    ₹{item.price.toLocaleString()}
                  </p>
                  <Link
                    href={`/products/${item.slug || item.id}`}
                    onClick={() => setIsWishlistOpen(false)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 12px',
                      fontSize: '12px',
                      backgroundColor: '#16a34a',
                      color: '#ffffff',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    Send Enquiry →
                  </Link>
                </div>
                <button
                  type="button"
                  className={styles.removeItem}
                  onClick={() => removeFromWishlist(item.id)}
                  aria-label="Remove from Wishlist"
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {wishlistItems && wishlistItems.length > 0 && (
          <div className={styles.drawerFooter}>
            <button
              type="button"
              className={styles.checkoutBtn}
              onClick={() => {
                setIsWishlistOpen(false);
                router.push('/wishlist');
              }}
            >
              View Full Wishlist Page
            </button>
            <button 
              type="button" 
              onClick={() => setIsWishlistOpen(false)} 
              className={styles.viewCartBtn}
            >
              Continue Shopping
            </button>
          </div>
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
                    Welcome back to VALNQIX (A Brand under RHST E-Commerce Pvt. Ltd.)!
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

                  {/* Primary Action Button */}
                  <button
                    type="button"
                    className={styles.profileSubmitBtn}
                    style={{ marginTop: '1.5rem', width: '100%' }}
                    onClick={() => {
                      handleCloseProfile();
                      router.push('/profile');
                    }}
                  >
                    Account Dashboard <span className={styles.arrowIcon}>→</span>
                  </button>

                  {/* Secondary Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        handleCloseProfile();
                        router.push('/profile?tab=orders');
                      }}
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1px solid #e2e4e8',
                        backgroundColor: '#f8f9fa',
                        color: '#222222',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                      My Orders
                    </button>

                    <button
                      type="button"
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
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1px solid #ffdcd6',
                        backgroundColor: '#fff5f3',
                        color: '#ff4e2a',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </>
              ) : profileMode === 'signup' ? (
                <>
                  <h2 className={styles.profileModalTitle}>Create Account</h2>
                  <p className={styles.profileModalSubtitle}>
                    Join VALNQIX (A Brand under RHST E-Commerce Pvt. Ltd.) to get the best deals on PC components.
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
                    Welcome back! Sign in to your VALNQIX account (A Brand under RHST E-Commerce Pvt. Ltd.) to check your orders.
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

