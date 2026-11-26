"use client";

import React, { useState, useEffect } from 'react';
import styles from './Brands.module.css';

interface Brand {
  id: string;
  name: string;
  slug: string;
  status: string;
}

export default function Brands({ initialBrands }: { initialBrands?: Brand[] }) {
  // When the server already provided the (visible) brands we render immediately and skip the client request
  const hasInitial = initialBrands !== undefined;
  const [brands, setBrands] = useState<Brand[]>(hasInitial ? initialBrands : []);
  const [loading, setLoading] = useState(!hasInitial);

  useEffect(() => {
    if (hasInitial) return;
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/brands');
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
  }, [hasInitial]);

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
