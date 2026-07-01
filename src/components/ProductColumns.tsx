"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
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
}

interface Column {
  title: string;
  products: Product[];
}

export default function ProductColumns() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?t=' + Date.now(), { cache: 'no-store' });
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
    if (!loading) {
      const saved = sessionStorage.getItem('scroll_pos_before_product_detail');
      if (saved) {
        try {
          const { path, scrollY } = JSON.parse(saved);
          if (path === window.location.pathname) {
            const timer = setTimeout(() => {
              window.scrollTo(0, scrollY);
              sessionStorage.removeItem('scroll_pos_before_product_detail');
            }, 150);
            return () => clearTimeout(timer);
          }
        } catch (e) {
          console.error('Failed to restore scroll position:', e);
        }
      }
    }
  }, [loading]);

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

  // Define static fallback columns in case DB fails to load or has 0 products
// Static fallback columns are removed. Homepage feeds rely purely on database items.

  const getColumnData = (): Column[] => {
    if (loading || products.length === 0) {
      return [
        { title: 'Featured', products: [] },
        { title: 'Latest Items', products: [] },
        { title: 'Best Reviewed', products: [] },
        { title: 'On Sale', products: [] }
      ];
    }

    // Filter dynamic lists
    const featuredList = products.filter(p => p.featured === true).slice(0, 3);
    const saleList = products.filter(p => (p.discount && p.discount > 0) || p.onOffer).slice(0, 3);
    // Sort latest by ID (newer MongoDB ObjectIds are alphabetically/chronologically greater)
    const latestList = [...products].sort((a, b) => String(b.id).localeCompare(String(a.id))).slice(0, 3);
    // Sort by price descending as mock for premium "Best Reviewed" items
    const bestReviewedList = [...products].sort((a, b) => parsePrice(b.price) - parsePrice(a.price)).slice(0, 3);

    // Helper to fill columns with generic fallback products if specific lists are less than 3
    const fillList = (list: Product[]) => {
      const needed = 3 - list.length;
      if (needed <= 0) return list;
      const extra = products.filter(p => !list.some(el => el.id === p.id)).slice(0, needed);
      return [...list, ...extra];
    };

    return [
      {
        title: 'Featured',
        products: fillList(featuredList)
      },
      {
        title: 'Latest Items',
        products: fillList(latestList)
      },
      {
        title: 'Best Reviewed',
        products: fillList(bestReviewedList)
      },
      {
        title: 'On Sale',
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
                  <Link 
                    key={`${prod.id}-${pIdx}`} 
                    href={`/products/${prod.slug || prod.id}`} 
                    className={styles.productRow}
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
                    <div className={styles.info}>
                      <h4 className={styles.name}>{prod.name}</h4>
                      <div className={styles.priceRow}>
                        {prod.oldPrice && (
                          <span className={styles.oldPrice}>{prod.oldPrice}</span>
                        )}
                        <span className={styles.price}>{formatPrice(prod.price)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({
                          id: prod.id,
                          name: prod.name,
                          price: parsePrice(prod.price),
                          image: prod.image,
                          stock: prod.stock
                        });
                      }}
                      className={styles.addCartIconBtn}
                      title="Add to Cart"
                    >
                      +
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
