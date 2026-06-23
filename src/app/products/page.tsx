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
import { useCart } from '@/context/CartContext';
import { useSearchParams } from 'next/navigation';
import styles from './Products.module.css';

// Fallback static products are removed. The catalog relies on live MongoDB database records.

// Mock reviews matching the mockup exactly
const MOCKUP_REVIEWS = [
  {
    id: 1,
    text: '“RHST is a select IT innovative service provider of IT products, solutions, and services. The primary focus is to deliver prompt quality, cost-effective and client satisfaction.”',
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
    text: '“I had a great experience working with RHST. Their vehicles easy to use, product selection is vast, and customer service is outstanding. Highly recommend to everyone.”',
    rating: 5,
    author: 'Pranav Patel'
  }
];

function ProductsCatalogContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();

  // Filter local states
  const [searchQuery, setSearchQuery] = useState('');
  const [typedSearch, setTypedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeBrand, setActiveBrand] = useState('All');
  const [activePriceRange, setActivePriceRange] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const [prodRes, catRes, brandRes] = await Promise.all([
          fetch('/api/products?t=' + Date.now(), { cache: 'no-store' }),
          fetch('/api/categories?t=' + Date.now(), { cache: 'no-store' }),
          fetch('/api/brands?t=' + Date.now(), { cache: 'no-store' })
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const brandData = await brandRes.json();
        if (prodData.success) {
          setDbProducts(prodData.products);
        }
        if (catData.success) {
          setDbCategories(catData.categories);
        }
        if (brandData.success) {
          setDbBrands(brandData.brands);
        }
      } catch (err) {
        console.error('Failed to load products/categories/brands in catalog:', err);
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
      stock: p.stock !== undefined ? p.stock : 99
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

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
  }, [allProducts, searchQuery, activeCategory, activeBrand, activePriceRange, sortOption]);

  // Pagination logic (12 items per page)
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

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
                  <div>
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
                        <Link href={`/products/${prod.slug || prod.id}`} className={styles.imageLink}>
                          <div className={styles.imageWrapper}>
                            <img src={prod.image} alt={prod.name} className={styles.image} />
                          </div>
                        </Link>
                        <div className={styles.info}>
                          <Link href={`/products/${prod.slug || prod.id}`} className={styles.nameLink}>
                            <h3 className={styles.name}>{prod.name}</h3>
                          </Link>
                          <span className={styles.price}>₹{prod.price.toLocaleString()}</span>
                          <button
                            onClick={() => addToCart({
                              id: prod.id,
                              name: prod.name,
                              price: prod.price,
                              image: prod.image,
                              stock: prod.stock
                            })}
                            className={styles.cartBtn}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    {currentPage > 1 && (
                      <button
                        className={styles.pageBtn}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                      >
                        Prev
                      </button>
                    )}
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        className={`${styles.pageBtn} ${currentPage === idx + 1 ? styles.activePageBtn : ''}`}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    {currentPage < totalPages && (
                      <button
                        className={styles.pageBtn}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                      >
                        Next
                      </button>
                    )}
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
                  textAlign: 'left'
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
                  textAlign: 'left',
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
