"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import EnquiryModal, { EnquiryProduct } from './EnquiryModal';
import styles from './ProductColumns.module.css';

interface Product {
  id: string | number;
  slug?: string;
  name: string;
  price: string | number;
  oldPrice?: string;
  image: string;
  featured?: boolean;
  onOffer?: boolean;
  discount?: number;
  mrp?: number;
  stock?: number;
  sellerName?: string;
  sellerLocation?: string;
  sellerRating?: number;
  sellerVerified?: boolean;
}

interface Column {
  title: string;
  products: Product[];
}

export default function ProductColumns() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState<EnquiryProduct | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=18', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load columns products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Restore scroll position on home page after content is loaded
  useEffect(() => {
    if (!loading && products.length > 0) {
      const savedPos = sessionStorage.getItem('scroll_pos_before_product_detail');
      if (savedPos) {
        try {
          const parsed = JSON.parse(savedPos);
          if (parsed.path === window.location.pathname) {
            setTimeout(() => {
              window.scrollTo({
                top: parsed.scrollY,
                behavior: 'instant'
              });
              sessionStorage.removeItem('scroll_pos_before_product_detail');
            }, 100);
          }
        } catch (e) {
          sessionStorage.removeItem('scroll_pos_before_product_detail');
        }
      }
    }
  }, [loading, products]);

  const parsePrice = (priceVal: any): number => {
    if (typeof priceVal === 'number') return priceVal;
    if (typeof priceVal === 'string') {
      return parseInt(priceVal.replace(/[^\d]/g, ''), 10) || 0;
    }
    return 0;
  };

  const formatPrice = (priceVal: any): string => {
    if (typeof priceVal === 'number') {
      return `₹${priceVal.toLocaleString()}`;
    }
    if (typeof priceVal === 'string') {
      if (!priceVal.startsWith('₹')) {
        const num = parseInt(priceVal.replace(/[^\d]/g, ''), 10) || 0;
        return `₹${num.toLocaleString()}`;
      }
      return priceVal;
    }
    return '₹0';
  };

  const getColumnData = (): Column[] => {
    if (loading || products.length === 0) {
      return [
        { title: 'Featured Suppliers', products: [] },
        { title: 'Latest Products', products: [] },
        { title: 'Verified Quotations', products: [] },
        { title: 'Bulk Deals', products: [] }
      ];
    }

    // Filter dynamic lists
    const featuredList = products.filter(p => p.featured === true).slice(0, 3);
    const saleList = products.filter(p => (p.discount && p.discount > 0) || p.onOffer).slice(0, 3);
    const latestList = [...products].sort((a, b) => String(b.id).localeCompare(String(a.id))).slice(0, 3);
    const bestReviewedList = [...products].sort((a, b) => parsePrice(b.price) - parsePrice(a.price)).slice(0, 3);

    const fillList = (list: Product[]) => {
      const needed = 3 - list.length;
      if (needed <= 0) return list;
      const extra = products.filter(p => !list.some(el => el.id === p.id)).slice(0, needed);
      return [...list, ...extra];
    };

    return [
      {
        title: 'Featured Suppliers',
        products: fillList(featuredList)
      },
      {
        title: 'Latest Products',
        products: fillList(latestList)
      },
      {
        title: 'Verified Quotations',
        products: fillList(bestReviewedList)
      },
      {
        title: 'Bulk Deals',
        products: fillList(saleList).map(p => ({
          ...p,
          oldPrice: p.mrp && p.mrp > parsePrice(p.price) ? `₹${p.mrp.toLocaleString()}` : undefined
        }))
      }
    ];
  };

  const activeColumns = getColumnData();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--gray)' }}>
        Loading catalog feeds...
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={styles.sectionContainer}>
      <div className="container">
        <div className={styles.grid}>
          {activeColumns.map((col, idx) => (
            <div key={idx} className={styles.column}>
              <h3 className={styles.columnTitle}>{col.title}</h3>
              <div className={styles.divider}>
                ////////////////////////////////////////////////
              </div>
              <div className={styles.productList}>
                {col.products.map((prod, pIdx) => (
                  <div 
                    key={`${prod.id}-${pIdx}`} 
                    className={styles.productRow}
                    style={{ position: 'relative' }}
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
                        <h4 className={styles.name}>{prod.name}</h4>
                      </Link>

                      <div className={styles.priceRow}>
                        {prod.oldPrice && (
                          <span className={styles.oldPrice}>{prod.oldPrice}</span>
                        )}
                        <span className={styles.price}>{formatPrice(prod.price)}</span>
                      </div>

                      {/* IndiaMART Seller Info */}
                      <div style={{
                        fontSize: '11px',
                        color: '#15803d',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        marginTop: '2px'
                      }}>
                        <span>✓</span>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                          {prod.sellerName || 'Apex Tech Systems Pvt Ltd'}
                        </span>
                      </div>
                    </div>

                    {/* Enquiry Button */}
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
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        marginLeft: 'auto',
                        flexShrink: 0,
                        transition: 'background 0.15s'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
                      title="Send Enquiry to Seller"
                    >
                      Enquiry
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
