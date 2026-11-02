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
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbBrands, setDbBrands] = useState<any[]>([]);
  const [facetCounts, setFacetCounts] = useState<{
    total: number;
    categories: Record<string, number>;
    brands: Record<string, number>;
    sellers: Record<string, number>;
    priceRanges: Record<string, number>;
  }>({ total: 0, categories: {}, brands: {}, sellers: {}, priceRanges: {} });
  const [loading, setLoading] = useState(true);

  // Load initial catalog metadata (categories, brands, fast cached facet counts)
  useEffect(() => {
    // 1. Fetch categories
    fetch('/api/categories?t=' + Date.now(), { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d.success && d.categories) setDbCategories(d.categories); })
      .catch(e => console.warn('Categories load error:', e));

    // 2. Fetch brands
    fetch('/api/brands?t=' + Date.now(), { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d.success && d.brands) setDbBrands(d.brands); })
      .catch(e => console.warn('Brands load error:', e));

    // 3. Fetch facets (cached in-memory on server for instant response)
    fetch('/api/products/facets?t=' + Date.now(), { cache: 'no-store' })
      .then(r => r.json())
      .then(facetData => {
        if (facetData.success) {
          const catMap: Record<string, number> = {};
          (facetData.categories || []).forEach((c: any) => {
            if (c.name) catMap[c.name.toLowerCase()] = c.count;
          });
          const brandMap: Record<string, number> = {};
          (facetData.brands || []).forEach((b: any) => {
            if (b.name) brandMap[b.name.toLowerCase()] = b.count;
          });
          const sellerMap: Record<string, number> = {};
          (facetData.sellers || []).forEach((s: any) => {
            if (s.name) sellerMap[s.name.toLowerCase()] = s.count;
          });
          setFacetCounts({
            total: facetData.total || 0,
            categories: catMap,
            brands: brandMap,
            sellers: sellerMap,
            priceRanges: facetData.priceRanges || {}
          });
        }
      })
      .catch(e => console.warn('Facets load error:', e));
  }, []);

  // Server-side paginated & filtered products fetch
  useEffect(() => {
    let isCancelled = false;
    const fetchPaginatedProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('limit', '24');
        if (activeCategory && activeCategory !== 'All') params.set('category', activeCategory);
        if (activeBrand && activeBrand !== 'All') params.set('brand', activeBrand);
        if (activeSeller && activeSeller !== 'All') params.set('seller', activeSeller);
        if (activePriceRange) params.set('priceRange', activePriceRange);
        if (sortOption && sortOption !== 'default') params.set('sort', sortOption);
        if (searchQuery.trim()) params.set('search', searchQuery.trim());

        const res = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' });
        const data = await res.json();
        if (!isCancelled && data.success) {
          setProducts(data.products || []);
          if (data.pagination) {
            setTotalProducts(data.pagination.total);
            setTotalPages(data.pagination.totalPages);
          } else {
            setTotalProducts((data.products || []).length);
            setTotalPages(1);
          }
        }
      } catch (err) {
        if (!isCancelled) console.error('Failed to load products in catalog:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    fetchPaginatedProducts();
    return () => {
      isCancelled = true;
    };
  }, [currentPage, activeCategory, activeBrand, activeSeller, activePriceRange, sortOption, searchQuery]);

  const categoriesList = useMemo(() => {
    const list = [{ key: 'All', display: 'All' }];
    const seen = new Set(['all']);

    const isValidCat = (name: string) => {
      if (!name || typeof name !== 'string') return false;
      const str = name.trim();
      if (str.length === 0 || str.length > 35) return false;
      if (/^https?:\/\//i.test(str)) return false;
      if (/www\./i.test(str)) return false;
      if (/\.(com|org|net|html|php|jpg|png|jpeg)\b/i.test(str)) return false;
      if (/%25|%20|\/c\/product|\.p\?/i.test(str)) return false;
      if (/^\d{4}-\d{2}-\d{2}/.test(str)) return false;
      if (/^(true|false|undefined|null|none|n\/a)$/i.test(str)) return false;
      if (/^[A-Z0-9]{10}$/.test(str)) return false;
      return true;
    };

    // First add categories that have actual products in the catalog (sorted by highest product count)
    const activeCatsWithCounts = Object.entries(facetCounts.categories)
      .filter(([k, count]) => isValidCat(k) && count > 0)
      .sort((a, b) => b[1] - a[1]);

    activeCatsWithCounts.forEach(([catKey]) => {
      const lower = catKey.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        const display = catKey.charAt(0).toUpperCase() + catKey.slice(1);
        list.push({ key: display, display });
      }
    });

    // Then add registered dbCategories that are valid and have products
    if (dbCategories.length > 0) {
      const hasCounts = Object.keys(facetCounts.categories).length > 0;
      dbCategories.forEach(cat => {
        if (!isValidCat(cat.name)) return;
        const keyLower = (cat.name || '').toLowerCase();
        // Do not add if category has 0 products and counts are loaded
        if (hasCounts && (facetCounts.categories[keyLower] || 0) === 0) return;
        if (keyLower && !seen.has(keyLower)) {
          seen.add(keyLower);
          list.push({ key: cat.name, display: cat.name });
        }
      });
    }

    return list;
  }, [dbCategories, facetCounts.categories]);

  const brandsList = useMemo(() => {
    const list = [{ key: 'All', display: 'All' }];
    const seen = new Set(['all']);

    const isValidBrand = (name: string) => {
      if (!name || typeof name !== 'string') return false;
      const str = name.trim();
      if (str.length === 0 || str.length > 35) return false;
      if (/^https?:\/\//i.test(str) || /www\./i.test(str)) return false;
      if (/\.(com|org|net|html|php|jpg|png|jpeg)\b/i.test(str)) return false;
      if (/^\d{4}-\d{2}-\d{2}/.test(str)) return false;
      if (/^(true|false|undefined|null|none|n\/a)$/i.test(str)) return false;
      return true;
    };

    // Brands with actual products sorted by count
    const activeBrands = Object.entries(facetCounts.brands)
      .filter(([k, count]) => isValidBrand(k) && count > 0)
      .sort((a, b) => b[1] - a[1]);

    activeBrands.forEach(([brandKey]) => {
      const lower = brandKey.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        const display = brandKey.charAt(0).toUpperCase() + brandKey.slice(1);
        list.push({ key: display, display });
      }
    });

    if (dbBrands.length > 0) {
      const hasCounts = Object.keys(facetCounts.brands).length > 0;
      dbBrands.forEach(b => {
        if (b.status === 'Hidden' || !isValidBrand(b.name)) return;
        const keyLower = (b.name || '').toLowerCase();
        if (hasCounts && (facetCounts.brands[keyLower] || 0) === 0) return;
        if (keyLower && !seen.has(keyLower)) {
          seen.add(keyLower);
          list.push({ key: b.name, display: b.name });
        }
      });
    }

    return list;
  }, [dbBrands, facetCounts.brands]);

  const sellersList = useMemo(() => {
    const list = [{ key: 'All', display: 'All Verified Suppliers' }];
    const seen = new Set(['all']);

    // Top verified sellers with actual products sorted by count
    const activeSellers = Object.entries(facetCounts.sellers)
      .filter(([k, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40);

    activeSellers.forEach(([sKey]) => {
      const lower = sKey.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        const display = sKey.charAt(0).toUpperCase() + sKey.slice(1);
        list.push({ key: display, display });
      }
    });

    return list;
  }, [facetCounts.sellers]);

  // Scroll to top of window when current page changes
  useEffect(() => {
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
    setActiveSeller('All');
    setActivePriceRange(null);
    setSortOption('default');
    setCurrentPage(1);
  };

  const itemsPerPage = 24;
  const paginatedProducts = products;

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
    if (catName === 'All') return facetCounts.total || totalProducts;
    return facetCounts.categories[catName.toLowerCase()] || 0;
  };

  const getBrandCount = (brandName: string) => {
    return facetCounts.brands[brandName.toLowerCase()] || 0;
  };

  const getSellerCount = (sellerName: string) => {
    if (sellerName === 'All') return facetCounts.total || totalProducts;
    return facetCounts.sellers[sellerName.toLowerCase()] || 0;
  };

  const getPriceRangeCount = (rangeKey: string) => {
    if (rangeKey === 'All') return facetCounts.total || totalProducts;
    return facetCounts.priceRanges[rangeKey] || 0;
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
                    {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} results
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
                          <span className={styles.price}>
                            {typeof prod.price === 'string' && prod.price.startsWith('₹')
                              ? prod.price
                              : '₹' + Number(prod.price || 0).toLocaleString('en-IN')}
                          </span>

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
