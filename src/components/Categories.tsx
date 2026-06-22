"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Categories.module.css';

interface Category {
  id: string | number;
  name: string;
  image: string;
  link: string;
}

export default function Categories({ title = 'Categories' }: { title?: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories?t=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardElement = scrollContainerRef.current.firstElementChild as HTMLElement;
      // Scroll by one card width plus gap (24px = 1.5rem)
      const scrollAmount = cardElement ? cardElement.offsetWidth + 24 : 240;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="categories" className={`section bg-white ${styles.categoriesSection}`}>
      <div className="container">
        {/* Section Heading */}
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>{title}</h2>
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

        {/* Categories Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--gray)', fontSize: '18px' }}>
            Loading categories...
          </div>
        ) : (
          <div ref={scrollContainerRef} className={styles.grid}>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${encodeURIComponent(cat.name)}`} className={styles.card}>
                <div className={styles.imageContainer}>
                  <img src={cat.image} alt={cat.name} className={styles.image} />
                </div>
                <div className={styles.info}>
                  <h3>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
