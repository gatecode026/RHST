"use client";

import React, { useState, useEffect } from 'react';
import styles from './Brands.module.css';

interface Brand {
  id: string;
  name: string;
  slug: string;
  status: string;
}

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/brands?t=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          // Filter to only visible brands
          const visible = data.brands.filter((b: any) => b.status !== 'Hidden');
          setBrands(visible);
        }
      } catch (err) {
        console.error('Failed to load brands', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <section id="brands" className={styles.brandsSection}>
        <div className="container" style={{ textAlign: 'center', color: '#aaa', fontSize: '14px', padding: '2rem 0' }}>
          Loading brands...
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section id="brands" className={styles.brandsSection}>
      <div className="container">
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeTrack}>
            {/* First Set */}
            {brands.map((brand, idx) => (
              <div key={`brand-1-${brand.id || idx}`} className={styles.brandLogo}>
                {brand.name}
              </div>
            ))}
            {/* Duplicate Set for Infinite Loop */}
            {brands.map((brand, idx) => (
              <div key={`brand-2-${brand.id || idx}`} className={styles.brandLogo}>
                {brand.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
