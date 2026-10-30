'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import Categories from '@/components/Categories';
import CustomerReviews from '@/components/CustomerReviews';
import OurBlog from '@/components/OurBlog';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import EnquiryModal, { EnquiryProduct } from '@/components/EnquiryModal';
import { useSearchParams } from 'next/navigation';
import styles from './Products.module.css';

// Fallback static products are removed. The catalog relies on live MongoDB database records.

// Mock reviews matching the mockup exactly
const MOCKUP_REVIEWS = [
  {
    id: 1,
    text: '“VALNQIX is a select IT innovative service provider of IT products, solutions, and services. The primary focus is to deliver prompt quality, cost-effective and client satisfaction.”',
    rating: 5,
    author: 'Rahul Sharma'
  },
  {
    id: 2,
    text: '“Best place for IT solutions and Technology products. Quality products, affordable price, and outstanding customer service to the IT environment. Thank you!”',
    rating: 5,
    author: 'Nikita Rani'
  },
  {
    id: 3,
    text: '“I had a great experience working with VALNQIX. Their vehicles easy to use, product selection is vast, and customer service is outstanding. Highly recommend to everyone.”',
    rating: 5,
    author: 'Pranav Patel'
  }
];

function ProductsCatalogContent() {
  const searchParams = useSearchParams();

  // Filter local states
  const [searchQuery, setSearchQuery] = useState('');
  const [typedSearch, setTypedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeBrand, setActiveBrand] = useState('All');
  const [activeSeller, setActiveSeller] = useState('All');
  const [activePriceRange, setActivePriceRange] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Enquiry modal state
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState<EnquiryProduct | null>(null);

  // Sync category with URL query parameter
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setActiveCategory(category);
    } else {
      setActiveCategory('All');
    }
  }, [searchParams]);

  // Dynamic products states
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbBrands, setDbBrands] = useState<any[]>([]);
  const [dbSellers, setDbSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const [prodRes, catRes, brandRes, sellerRes] = await Promise.all([
          fetch('/api/products?t=' + Date.now(), { cache: 'no-store' }),
          fetch('/api/categories?t=' + Date.now(), { cache: 'no-store' }),
          fetch('/api/brands?t=' + Date.now(), { cache: 'no-store' }),
          fetch('/api/sellers?t=' + Date.now(), { cache: 'no-store' })
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const brandData = await brandRes.json();
        const sellerData = await sellerRes.json();
        if (prodData.success) {
          setDbProducts(prodData.products);
        }
        if (catData.success) {
          setDbCategories(catData.categories);
        }
        if (brandData.success) {
          setDbBrands(brandData.brands);
        }
        if (sellerData.success) {
          setDbSellers(sellerData.sellers);
        }
      } catch (err) {
        console.error('Failed to load products/categories/brands/sellers in catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDynamicData();
  }, []);

  const parsePrice = (priceVal: any): number => {
    if (typeof priceVal === 'number') return priceVal;
    if (typeof priceVal === 'string') {
      return parseInt(priceVal.replace(/[^\d]/g, ''), 10) || 0;
    }
    return 0;
  };

  const allProducts = useMemo(() => {
    return dbProducts.map(p => ({
      id: p.id,
      slug: p.slug || p.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
      name: p.name,
      price: parsePrice(p.price),
      image: p.image,
      category: p.category,
      brand: p.brand || 'Dell',
      stock: p.stock !== undefined ? p.stock : 99,
      sellerId: p.sellerId,
      sellerName: p.sellerName || 'Apex Tech Systems Pvt Ltd',
      sellerLocation: p.sellerLocation || 'Jaipur, Rajasthan',
      sellerRating: p.sellerRating || 4.8,
      sellerVerified: p.sellerVerified !== undefined ? p.sellerVerified : true,
      sellerTrustScore: p.sellerTrustScore || 'Verified TrustSEAL'
    }));
  }, [dbProducts]);

  const categoriesList = useMemo(() => {
    const list = [{ key: 'All', display: 'All' }];
    const seen = new Set(['all']);

    if (dbCategories.length > 0) {
      dbCategories.forEach(cat => {
        const keyLower = cat.name.toLowerCase();
        if (!seen.has(keyLower)) {
          seen.add(keyLower);
          list.push({ key: cat.name, display: cat.name });
        }
      });
    } else if (loading) {
      const baseKeys = ['Hardware', 'Networking', 'Computer Access', 'Office Equipment', 'Gaming Products'];
      baseKeys.forEach(k => {
        list.push({ key: k, display: k });
      });
    }
    return list;
  }, [dbCategories, loading]);

  const brandsList = useMemo(() => {
    const list = [{ key: 'All', display: 'All' }];
    const seen = new Set(['all']);

    if (dbBrands.length > 0) {
      dbBrands.forEach(b => {
        if (b.status === 'Hidden') return;
        const keyLower = b.name.toLowerCase();
        if (!seen.has(keyLower)) {
          seen.add(keyLower);
          list.push({ key: b.name, display: b.name });
        }
      });
    } else if (loading) {
      const baseKeys = ['Asus', 'Samsung', 'Dell'];
      baseKeys.forEach(k => {
        list.push({ key: k, display: k });
      });
    }
    return list;
  }, [dbBrands, loading]);

  // Scroll to top of window when current page changes
  useEffect(() => {
    // Only scroll to top if we are NOT restoring scroll from a product detail view
    const saved = sessionStorage.getItem('scroll_pos_before_product_detail');
    if (saved) {
      try {
        const { path } = JSON.parse(saved);
        if (path === window.location.pathname) {
          return;
        }
      } catch (e) {}
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  // Restore scroll position after loading completes
  useEffect(() => {
    if (!loading) {
      const saved = sessionStorage.getItem('scroll_pos_before_product_detail');
      if (saved) {
        try {
          const { path, scrollY } = JSON.parse(saved);
          if (path === window.location.pathname) {
            const timer = setTimeout(() => {
              window.scrollTo(0, scrollY);
              sessionStorage.removeItem('scroll_pos_before_product_detail');
            }, 100);
            return () => clearTimeout(timer);
          }
        } catch (e) {
          console.error('Failed to restore scroll position:', e);
        }
      }
    }
  }, [loading]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(typedSearch);
    setCurrentPage(1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setTypedSearch('');
    setActiveCategory('All');
    setActiveBrand('All');
    setActivePriceRange(null);
    setSortOption('default');
    setCurrentPage(1);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery.trim() !== '') {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Brand filter
    if (activeBrand !== 'All') {
      result = result.filter(p => p.brand.toLowerCase() === activeBrand.toLowerCase());
    }

    // Seller filter
    if (activeSeller !== 'All') {
      result = result.filter(p => (p.sellerName || '').toLowerCase() === activeSeller.toLowerCase());
    }

    // Price filter
    if (activePriceRange) {
      if (activePriceRange === 'less15') {
        result = result.filter(p => p.price < 15000);
      } else if (activePriceRange === '15_25') {
        result = result.filter(p => p.price >= 15000 && p.price <= 25000);
      } else if (activePriceRange === '25_50') {
        result = result.filter(p => p.price >= 25000 && p.price <= 50000);
      } else if (activePriceRange === '50_75') {
        result = result.filter(p => p.price >= 50000 && p.price <= 75000);
      } else if (activePriceRange === '75_100') {
        result = result.filter(p => p.price >= 75000 && p.price <= 100000);
      } else if (activePriceRange === '100_125') {
        result = result.filter(p => p.price >= 100000 && p.price <= 125000);
      }
    }

    // Sorting options
    if (sortOption === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [allProducts, searchQuery, activeCategory, activeBrand, activeSeller, activePriceRange, sortOption]);

  const sellersList = useMemo(() => {
    const list = [{ key: 'All', display: 'All Verified Sellers' }];
    const seen = new Set(['all']);

    if (dbSellers.length > 0) {
      dbSellers.forEach(s => {
        const keyLower = s.name.toLowerCase();
        if (!seen.has(keyLower)) {
          seen.add(keyLower);
          list.push({ key: s.name, display: s.name });
        }
      });
    } else {
      allProducts.forEach(p => {
        if (p.sellerName) {
          const keyLower = p.sellerName.toLowerCase();
          if (!seen.has(keyLower)) {
            seen.add(keyLower);
            list.push({ key: p.sellerName, display: p.sellerName });
          }
        }
      });
    }
    return list;
  }, [dbSellers, allProducts]);

  const getSellerCount = (sellerName: string) => {
    if (sellerName === 'All') return allProducts.length;
    return allProducts.filter(p => (p.sellerName || '').toLowerCase() === sellerName.toLowerCase()).length;
  };

  // Pagination logic (24 items per page to fill page cleanly without white space)
  const itemsPerPage = 24;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Generate sliding window of around 5 pages with Prev and Next
  const getPageNumbers = () => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - 2);
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Dynamic counts for sidebar widgets
  const getCategoryCount = (catName: string) => {
    if (catName === 'All') return allProducts.length;
    return allProducts.filter(p => p.category.toLowerCase() === catName.toLowerCase()).length;
  };

  const getBrandCount = (brandName: string) => {
    return allProducts.filter(p => p.brand.toLowerCase() === brandName.toLowerCase()).length;
  };

  const getPriceRangeCount = (rangeKey: string) => {
    if (rangeKey === 'All') return allProducts.length;
    if (rangeKey === 'less15') return allProducts.filter(p => p.price < 15000).length;
    if (rangeKey === '15_25') return allProducts.filter(p => p.price >= 15000 && p.price <= 25000).length;
    if (rangeKey === '25_50') return allProducts.filter(p => p.price >= 25000 && p.price <= 50000).length;
    if (rangeKey === '50_75') return allProducts.filter(p => p.price >= 50000 && p.price <= 75000).length;
    if (rangeKey === '75_100') return allProducts.filter(p => p.price >= 75000 && p.price <= 100000).length;
    if (rangeKey === '100_125') return allProducts.filter(p => p.price >= 100000 && p.price <= 125000).length;
    return 0;
  };

  return (
    <>
      {/* Navigation Header */}
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Main Catalog Shop Grid */}
        <section className={styles.shopSection}>
          <div className="container">
            <div className={styles.shopLayout}>

              {/* Left Column: Products Grid & Pagination */}
              <div className={styles.productsCol}>
                
                {/* Result header */}
                <div className={styles.catalogHeader}>
                  <div className={styles.resultsCount}>
                    Showing {paginatedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
                    {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
                  </div>
                  <div className={styles.headerActionsWrapper}>
                    <button
                      type="button"
                      className={styles.mobileFilterToggleBtn}
                      onClick={() => setIsMobileFilterOpen(true)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                      </svg>
                      Filter
                    </button>
                    <select
                      className={styles.sortSelect}
                      value={sortOption}
                      onChange={(e) => {
                        setSortOption(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="default">Default Sorting</option>
                      <option value="price_asc">Sort by Price: Low to High</option>
                      <option value="price_desc">Sort by Price: High to Low</option>
                      <option value="name_asc">Sort by Name: A-Z</option>
                    </select>
                  </div>
                </div>

                {/* Grid of Products */}
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray)' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 300, marginBottom: '1rem' }}>Loading dynamic catalog...</h3>
                  </div>
                ) : paginatedProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray)' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 300, marginBottom: '1rem' }}>No products match your filters.</h3>
                    <button
                      onClick={handleResetFilters}
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '10px 24px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className={styles.productsGrid}>
                    {paginatedProducts.map((prod) => (
                      <div key={prod.id} className={styles.card}>
                        <Link 
                          href={`/products/${prod.slug || prod.id}`} 
                          className={styles.imageLink}
                          onClick={() => {
                            sessionStorage.setItem('scroll_pos_before_product_detail', JSON.stringify({
                              path: window.location.pathname,
                              scrollY: window.scrollY
                            }));
                          }}
                        >
                          <div className={styles.imageWrapper}>
                            <img src={prod.image} alt={prod.name} className={styles.image} />
                          </div>
                        </Link>
                        <div className={styles.info}>
                          <Link 
                            href={`/products/${prod.slug || prod.id}`} 
                            className={styles.nameLink}
                            onClick={() => {
                              sessionStorage.setItem('scroll_pos_before_product_detail', JSON.stringify({
                                path: window.location.pathname,
                                scrollY: window.scrollY
                              }));
                            }}
                          >
                            <h3 className={styles.name}>{prod.name}</h3>
                          </Link>
                          <span className={styles.price}>₹{prod.price.toLocaleString()}</span>

                          {/* IndiaMART Seller Info on Product Card */}
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            color: '#15803d',
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            marginTop: '6px',
                            fontWeight: 600,
                            width: 'fit-content'
                          }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            <span>{prod.sellerName || 'Apex Tech Systems Pvt Ltd'}</span>
                          </div>

                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <span>📍</span>
                            <span>{prod.sellerLocation || 'Jaipur, Rajasthan'}</span>
                          </div>

                          {/* Enquiry Button */}
                          <button
                            onClick={() => setSelectedProductForEnquiry({
                              id: prod.id,
                              name: prod.name,
                              price: prod.price,
                              image: prod.image,
                              sellerName: prod.sellerName,
                              sellerLocation: prod.sellerLocation,
                              sellerVerified: prod.sellerVerified
                            })}
                            style={{
                              backgroundColor: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '10px 14px',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textTransform: 'uppercase',
                              letterSpacing: '0.03em',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              width: '100%',
                              marginTop: '0.85rem',
                              boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)',
                              transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="22" y1="2" x2="11" y2="13"></line>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                            Enquiry
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={`${styles.pageBtn} ${styles.prevNextBtn}`}
                      disabled={currentPage === 1}
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage(prev => prev - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      aria-label="Previous Page"
                    >
                      Prev
                    </button>

                    {getPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        className={`${styles.pageBtn} ${currentPage === pageNum ? styles.activePageBtn : ''}`}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      className={`${styles.pageBtn} ${styles.prevNextBtn}`}
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage(prev => prev + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      aria-label="Next Page"
                    >
                      Next
                    </button>
                  </div>
                )}

              </div>

              {/* Right Column: Filters Sidebar */}
              <aside className={styles.sidebar}>
                
                {/* Search widget */}
                <form onSubmit={handleSearchSubmit} className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className={styles.sidebarInput}
                    value={typedSearch}
                    onChange={(e) => setTypedSearch(e.target.value)}
                  />
                  <button type="submit" className={styles.sidebarSearchBtn} aria-label="Search button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                </form>

                {/* Categories Widget */}
                <div className={styles.widget}>
                  <h3 className={styles.widgetTitle}>Categories</h3>
                  <ul className={styles.widgetList}>
                    {categoriesList.map((cat) => (
                      <li
                        key={cat.key}
                        className={`${styles.widgetItem} ${activeCategory === cat.key ? styles.activeWidgetItem : ''}`}
                        onClick={() => {
                          setActiveCategory(cat.key);
                          setCurrentPage(1);
                        }}
                      >
                        <span>{cat.display}</span>
                        <span className={styles.itemCount}>{getCategoryCount(cat.key)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Brands Widget */}
                <div className={styles.widget}>
                  <h3 className={styles.widgetTitle}>Brands</h3>
                  <ul className={styles.widgetList}>
                    {brandsList.map((brand) => (
                      <li
                        key={brand.key}
                        className={`${styles.widgetItem} ${activeBrand === brand.key ? styles.activeWidgetItem : ''}`}
                        onClick={() => {
                          setActiveBrand(brand.key);
                          setCurrentPage(1);
                        }}
                      >
                        <span>{brand.display}</span>
                        {brand.key !== 'All' && (
                          <span className={styles.itemCount}>{getBrandCount(brand.key)}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Verified Sellers Widget */}
                <div className={styles.widget}>
                  <h3 className={styles.widgetTitle}>Verified Suppliers</h3>
                  <ul className={styles.widgetList}>
                    {sellersList.map((seller) => (
                      <li
                        key={seller.key}
                        className={`${styles.widgetItem} ${activeSeller === seller.key ? styles.activeWidgetItem : ''}`}
                        onClick={() => {
                          setActiveSeller(seller.key);
                          setCurrentPage(1);
                        }}
                      >
                        <span style={{ fontSize: '13px' }}>{seller.display}</span>
                        {seller.key !== 'All' && (
                          <span className={styles.itemCount}>{getSellerCount(seller.key)}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Filter By Price Widget */}
                <div className={styles.widget}>
                  <h3 className={styles.widgetTitle}>Filter By Price</h3>
                  <ul className={styles.widgetList}>
                    {[
                      { key: 'All', display: 'All Prices' },
                      { key: 'less15', display: 'Less than 15,000' },
                      { key: '15_25', display: '15,000 - 25,000' },
                      { key: '25_50', display: '25,000 - 50,000' },
                      { key: '50_75', display: '50,000 - 75,000' },
                      { key: '75_100', display: '75,000 - 100,000' },
                      { key: '100_125', display: '100,000 - 125,000' }
                    ].map((range) => {
                      const isActive = range.key === 'All' ? activePriceRange === null : activePriceRange === range.key;
                      return (
                        <li
                          key={range.key}
                          className={`${styles.widgetItem} ${isActive ? styles.activeWidgetItem : ''}`}
                          onClick={() => {
                            setActivePriceRange(range.key === 'All' ? null : range.key);
                            setCurrentPage(1);
                          }}
                        >
                          <span>{range.display}</span>
                          <span className={styles.itemCount}>{getPriceRangeCount(range.key)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

              </aside>

            </div>
          </div>
        </section>

        {/* Carousel Categories (HARDWARE PRODUCTS Section) */}
        <Categories title="HARDWARE PRODUCTS" />

        {/* Mockup Reviews Section */}
        <CustomerReviews reviews={MOCKUP_REVIEWS} />

        {/* Our Blog Slider */}
        <OurBlog />

        {/* Any Questions Form section */}
        <section
          style={{
            padding: '5.5rem 0',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e1e1e6'
          }}
        >
          <div className="container">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '2.2rem',
                  fontWeight: 300,
                  color: 'var(--dark)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  textAlign: 'center'
                }}
              >
                ANY QUESTIONS?
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.05rem',
                  fontWeight: 300,
                  color: 'var(--gray)',
                  textAlign: 'center',
                  marginBottom: '3rem'
                }}
              >
                Fill out the form below to get in touch with us.
              </p>
              <ContactForm type="contact" styles={{
                form: styles.form,
                formRow: styles.formRow,
                inputField: styles.inputField,
                input: styles.input,
                textarea: styles.textarea,
                submitBtn: styles.submitBtn
              }} />
            </div>
          </div>
        </section>

        {/* Infinite Brand Marquee */}
        <Brands />

      </main>

      {/* Structured Dark Footer */}
      <Footer />

      {/* Mobile Filters Drawer Overlay */}
      <div
        className={`${styles.mobileFilterDrawerOverlay} ${isMobileFilterOpen ? styles.mobileFilterDrawerOpen : ''}`}
        onClick={() => setIsMobileFilterOpen(false)}
      />
      <div className={`${styles.mobileFilterDrawer} ${isMobileFilterOpen ? styles.mobileFilterDrawerOpen : ''}`}>
        <div className={styles.mobileFilterHeader}>
          <h3>Filters</h3>
          <button onClick={() => setIsMobileFilterOpen(false)} className={styles.mobileFilterCloseBtn} aria-label="Close Filters">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className={styles.mobileFilterContent}>
          {/* Search widget */}
          <form
            onSubmit={(e) => {
              handleSearchSubmit(e);
              setIsMobileFilterOpen(false);
            }}
            className={styles.searchBox}
          >
            <input
              type="text"
              placeholder="Search products..."
              className={styles.sidebarInput}
              value={typedSearch}
              onChange={(e) => setTypedSearch(e.target.value)}
            />
            <button type="submit" className={styles.sidebarSearchBtn} aria-label="Search button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          {/* Categories Widget */}
          <div className={styles.widget}>
            <h3 className={styles.widgetTitle}>Categories</h3>
            <ul className={styles.widgetList}>
              {categoriesList.map((cat) => (
                <li
                  key={cat.key}
                  className={`${styles.widgetItem} ${activeCategory === cat.key ? styles.activeWidgetItem : ''}`}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    setCurrentPage(1);
                    setIsMobileFilterOpen(false);
                  }}
                >
                  <span>{cat.display}</span>
                  <span className={styles.itemCount}>{getCategoryCount(cat.key)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands Widget */}
          <div className={styles.widget}>
            <h3 className={styles.widgetTitle}>Brands</h3>
            <ul className={styles.widgetList}>
              {brandsList.map((brand) => (
                <li
                  key={brand.key}
                  className={`${styles.widgetItem} ${activeBrand === brand.key ? styles.activeWidgetItem : ''}`}
                  onClick={() => {
                    setActiveBrand(brand.key);
                    setCurrentPage(1);
                    setIsMobileFilterOpen(false);
                  }}
                >
                  <span>{brand.display}</span>
                  {brand.key !== 'All' && (
                    <span className={styles.itemCount}>{getBrandCount(brand.key)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Filter By Price Widget */}
          <div className={styles.widget}>
            <h3 className={styles.widgetTitle}>Filter By Price</h3>
            <ul className={styles.widgetList}>
              {[
                { key: 'All', display: 'All Prices' },
                { key: 'less15', display: 'Less than 15,000' },
                { key: '15_25', display: '15,000 - 25,000' },
                { key: '25_50', display: '25,000 - 50,000' },
                { key: '50_75', display: '50,000 - 75,000' },
                { key: '75_100', display: '75,000 - 100,000' },
                { key: '100_125', display: '100,000 - 125,000' }
              ].map((range) => {
                const isActive = range.key === 'All' ? activePriceRange === null : activePriceRange === range.key;
                return (
                  <li
                    key={range.key}
                    className={`${styles.widgetItem} ${isActive ? styles.activeWidgetItem : ''}`}
                    onClick={() => {
                      setActivePriceRange(range.key === 'All' ? null : range.key);
                      setCurrentPage(1);
                      setIsMobileFilterOpen(false);
                    }}
                  >
                    <span>{range.display}</span>
                    <span className={styles.itemCount}>{getPriceRangeCount(range.key)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={!!selectedProductForEnquiry}
        onClose={() => setSelectedProductForEnquiry(null)}
        product={selectedProductForEnquiry}
      />
    </>
  );
}

export default function ProductsCatalogPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 300 }}>Loading Catalog...</h3>
      </div>
    }>
      <ProductsCatalogContent />
    </Suspense>
  );
}
