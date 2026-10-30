"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import EnquiryModal, { EnquiryProduct } from './EnquiryModal';
import styles from './BestSelling.module.css';

interface Product {
  id: string | number;
  slug?: string;
  name: string;
  price: string;
  image: string;
  link: string;
  category: string;
  stock?: number;
  sellerName?: string;
  sellerLocation?: string;
  sellerRating?: number;
  sellerVerified?: boolean;
}

export default function BestSelling() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState<EnquiryProduct | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?t=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardElement = scrollContainerRef.current.firstElementChild as HTMLElement;
      // Scroll by one card width plus gap (24px = 1.5rem)
      const scrollAmount = cardElement ? cardElement.offsetWidth + 24 : 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="products" className="section bg-white">
      <div className="container">
        {/* Header */}
        <div className={styles.titleWrapper}>
          <div>
            <h2 className={styles.title}>Verified Products & Suppliers</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px', fontWeight: 400 }}>
              Connect directly with verified manufacturers & distributors across India
            </p>
          </div>
          <div className={styles.sliderControls}>
            <button 
              className={styles.sliderBtn} 
              onClick={() => handleScroll('left')} 
              aria-label="Slide Left"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button 
              className={styles.sliderBtn} 
              onClick={() => handleScroll('right')} 
              aria-label="Slide Right"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Products Grid/Slider Row */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--gray)', fontSize: '18px' }}>
            Loading products and verified suppliers...
          </div>
        ) : (
          <div className={styles.sliderContainer}>
            <div ref={scrollContainerRef} className={styles.grid}>
              {products.map((prod) => (
                <div 
                  key={prod.id} 
                  className={styles.card}
                >
                  <Link 
                    href={`/products/${prod.slug || prod.id}`} 
                    className={styles.imageWrapper}
                    onClick={() => {
                      sessionStorage.setItem('scroll_pos_before_product_detail', JSON.stringify({
                        path: window.location.pathname,
                        scrollY: window.scrollY
                      }));
                    }}
                  >
                    <img src={prod.image} alt={prod.name} className={styles.image} />
                  </Link>

                  <div className={styles.info}>
                    <Link 
                      href={`/products/${prod.slug || prod.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <h3 className={styles.name}>{prod.name}</h3>
                    </Link>
                    <span className={styles.price}>{prod.price}</span>

                    {/* IndiaMART Seller Info on Product Card */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
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

                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>📍</span>
                      <span>{prod.sellerLocation || 'Jaipur, Rajasthan'}</span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedProductForEnquiry({
                          id: prod.id,
                          name: prod.name,
                          price: prod.price,
                          image: prod.image,
                          sellerName: prod.sellerName,
                          sellerLocation: prod.sellerLocation,
                          sellerVerified: prod.sellerVerified
                        });
                      }}
                      style={{
                        marginTop: '0.85rem',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        padding: '9px 14px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        width: '100%',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        transition: 'background 0.2s',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                      Enquiry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={!!selectedProductForEnquiry}
        onClose={() => setSelectedProductForEnquiry(null)}
        product={selectedProductForEnquiry}
      />
    </section>
  );
}
