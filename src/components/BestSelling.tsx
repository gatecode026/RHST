"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
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
}

export default function BestSelling() {
  const { addToCart } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^\d]/g, ''), 10);
  };

  return (
    <section id="products" className="section bg-white">
      <div className="container">
        {/* Header */}
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Best Selling Products</h2>
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
            Loading products...
          </div>
        ) : (
          <div className={styles.sliderContainer}>
            <div ref={scrollContainerRef} className={styles.grid}>
              {products.map((prod) => (
                <Link 
                  key={prod.id} 
                  href={`/products/${prod.slug || prod.id}`} 
                  className={styles.card}
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
                    <h3 className={styles.name}>{prod.name}</h3>
                    <span className={styles.price}>{prod.price}</span>
                    
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
                      style={{
                        marginTop: '0.75rem',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        width: '100%',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        transition: 'all 0.2s',
                        border: 'none',
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
