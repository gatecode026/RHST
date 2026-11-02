'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnquiryModal, { EnquiryProduct } from '@/components/EnquiryModal';
import styles from './Suppliers.module.css';

interface Seller {
  id: string;
  name: string;
  mainCategory: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  memberSince: string;
  gstNumber: string;
  responseTime: string;
  responseRate: string;
  natureOfBusiness: string;
  contactPerson: string;
  phone: string;
  email: string;
  trustScore: string;
  status: string;
}

const TOP_CATEGORIES = [
  'All',
  "Speaker's",
  'Laptops & Computers',
  'Television',
  'Electronics',
  'Camera',
  'Storage Devices',
  'Keyboard & Mouse',
  'BAGS',
  'Clocks'
];

const MAJOR_STATES = [
  'All',
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Gujarat',
  'Tamil Nadu',
  'Telangana',
  'Rajasthan',
  'Uttar Pradesh',
  'Punjab',
  'Haryana',
  'West Bengal'
];

function SuppliersCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters state synced with URL params
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [activeState, setActiveState] = useState(searchParams.get('state') || 'All');
  const [activeSort, setActiveSort] = useState(searchParams.get('sort') || 'rating');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [typedSearch, setTypedSearch] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Enquiry modal
  const [selectedSellerForEnquiry, setSelectedSellerForEnquiry] = useState<EnquiryProduct | null>(null);

  // Sync state if URL changes externally
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
      setTypedSearch(q);
    }
    const page = searchParams.get('page');
    if (page) setCurrentPage(parseInt(page, 10));
  }, [searchParams]);

  // Fetch sellers when filters change
  useEffect(() => {
    let isCancelled = false;
    const fetchSellers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('limit', '24');
        if (activeCategory && activeCategory !== 'All') params.set('category', activeCategory);
        if (activeState && activeState !== 'All') params.set('state', activeState);
        if (activeSort) params.set('sort', activeSort);
        if (searchQuery.trim()) params.set('search', searchQuery.trim());

        const res = await fetch(`/api/sellers?${params.toString()}`, { cache: 'no-store' });
        const data = await res.json();

        if (!isCancelled && data.success) {
          setSellers(data.sellers || []);
          if (data.pagination) {
            setTotal(data.pagination.total);
            setTotalPages(data.pagination.totalPages);
          } else {
            setTotal((data.sellers || []).length);
            setTotalPages(1);
          }
        }
      } catch (err) {
        if (!isCancelled) console.error('Failed to load suppliers:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchSellers();
    return () => {
      isCancelled = true;
    };
  }, [currentPage, activeCategory, activeState, activeSort, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchQuery(typedSearch);
  };

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 340, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      buttons.push(1);
      if (currentPage > 3) buttons.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) buttons.push(i);

      if (currentPage < totalPages - 2) buttons.push('...');
      buttons.push(totalPages);
    }

    return buttons;
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      {/* Hero Banner */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>Verified IndiaMART B2B Directory</span>
          </div>
          <h1 className={styles.heroTitle}>Verified Suppliers & Manufacturers Across India</h1>
          <p className={styles.heroSubtitle}>
            Connect directly with 1,000+ verified distributors, OEM manufacturers & authorized stockists with GST verification, TrustSEAL accreditation, and lowest wholesale price quotes.
          </p>

          <form onSubmit={handleSearchSubmit} className={styles.searchBoxWrapper}>
            <input
              type="text"
              placeholder="Search by supplier name, city, category, or GST number..."
              value={typedSearch}
              onChange={(e) => setTypedSearch(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.contentSection}>
        {/* Filter Controls Bar */}
        <div className={styles.filterBar}>
          <div className={styles.statsText}>
            {loading ? (
              <span>Loading verified suppliers...</span>
            ) : (
              <span>
                Showing <strong>{sellers.length > 0 ? (currentPage - 1) * 24 + 1 : 0}–{Math.min(currentPage * 24, total)}</strong> of <strong>{total.toLocaleString()}</strong> verified suppliers
              </span>
            )}
          </div>

          <div className={styles.filterControls}>
            {/* State Filter */}
            <select
              value={activeState}
              onChange={(e) => {
                setActiveState(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.selectInput}
              aria-label="Filter by state"
            >
              <option value="All">All Locations & States</option>
              {MAJOR_STATES.slice(1).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={activeSort}
              onChange={(e) => {
                setActiveSort(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.selectInput}
              aria-label="Sort suppliers"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="name">Supplier Name (A-Z)</option>
              <option value="memberSince">Member Since (Oldest)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className={styles.categoryPills}>
          {TOP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.pill} ${activeCategory === cat ? styles.activePill : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat === 'All' ? 'All Categories (1,000+)' : cat}
            </button>
          ))}
        </div>

        {/* Suppliers Grid */}
        {loading ? (
          <div className={styles.loadingPlaceholder}>
            <p>Fetching verified supplier records...</p>
          </div>
        ) : sellers.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyStateTitle}>No suppliers matched your search</h3>
            <p>Try searching for a different company name, city, or reset your filters.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setActiveState('All');
                setSearchQuery('');
                setTypedSearch('');
                setCurrentPage(1);
              }}
              className={styles.resetBtn}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {sellers.map((s) => (
              <div key={s.id} className={styles.card}>
                <div>
                  <div className={styles.cardTop}>
                    <div className={styles.verifiedPill}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span>{s.trustScore || 'Verified TrustSEAL'}</span>
                    </div>

                    <div className={styles.ratingBadge}>
                      <span>⭐</span>
                      <span>{s.rating.toFixed(1)}</span>
                      <span style={{ color: '#a16207', fontWeight: 400 }}>({s.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className={styles.supplierName}>{s.name}</h3>

                  <div className={styles.locationRow}>
                    <span>📍</span>
                    <span>{s.location}</span>
                  </div>

                  <div className={styles.metaRow}>
                    <span className={styles.metaTag}>🏷️ {s.mainCategory}</span>
                    {s.gstNumber && (
                      <span className={styles.gstTag}>GST: {s.gstNumber}</span>
                    )}
                  </div>

                  <div className={styles.businessDetails}>
                    <div className={styles.businessItem}>
                      <span className={styles.businessLabel}>Nature of Business</span>
                      <span className={styles.businessValue} title={s.natureOfBusiness}>
                        {s.natureOfBusiness}
                      </span>
                    </div>
                    <div className={styles.businessItem}>
                      <span className={styles.businessLabel}>Response Time</span>
                      <span className={styles.businessValue}>
                        ⚡ {s.responseTime} ({s.responseRate})
                      </span>
                    </div>
                    <div className={styles.businessItem}>
                      <span className={styles.businessLabel}>Contact Person</span>
                      <span className={styles.businessValue}>{s.contactPerson}</span>
                    </div>
                    <div className={styles.businessItem}>
                      <span className={styles.businessLabel}>Member Since</span>
                      <span className={styles.businessValue}>🗓️ {s.memberSince}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className={styles.cardActions}>
                    <Link
                      href={`/products?seller=${encodeURIComponent(s.name)}`}
                      className={styles.viewProductsBtn}
                    >
                      <span>View Products</span>
                      <span>→</span>
                    </Link>

                    <button
                      onClick={() => {
                        setSelectedSellerForEnquiry({
                          name: `Wholesale Quotation from ${s.name}`,
                          sellerName: s.name,
                          sellerLocation: s.location,
                          sellerVerified: s.verified
                        });
                      }}
                      className={styles.enquiryBtn}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                      <span>Send Enquiry</span>
                    </button>
                  </div>

                  <div className={styles.contactBar}>
                    <span>📞 {s.phone}</span>
                    <a href={`tel:${s.phone}`} className={styles.phoneLink}>
                      Call Supplier
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className={styles.paginationWrapper}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageBtn}
              aria-label="Previous Page"
            >
              ← Prev
            </button>

            {renderPaginationButtons().map((p, idx) => {
              if (p === '...') {
                return (
                  <span key={`dots-${idx}`} style={{ padding: '0 6px', color: '#94a3b8' }}>
                    ...
                  </span>
                );
              }
              const pageNum = p as number;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`${styles.pageBtn} ${currentPage === pageNum ? styles.activePageBtn : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageBtn}
              aria-label="Next Page"
            >
              Next →
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={!!selectedSellerForEnquiry}
        onClose={() => setSelectedSellerForEnquiry(null)}
        product={selectedSellerForEnquiry}
      />
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748b' }}>
        <h3>Loading Verified Suppliers...</h3>
      </div>
    }>
      <SuppliersCatalogContent />
    </Suspense>
  );
}

