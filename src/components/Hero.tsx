'use client';

import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';

interface Slide {
  id?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  image: string;
  theme: string;
  link: string;
}

const STATIC_SLIDES: Slide[] = [
  {
    title: 'India’s Leading B2B IT Hardware & Network Solutions Portal',
    subtitle: 'Connect with verified manufacturers, wholesalers & dealers across India.',
    ctaText: 'Explore Verified Suppliers',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/IMG.png?updatedAt=1781696174888',
    theme: 'light',
    link: '/products'
  },
  {
    title: 'Gaming & Computing Systems from Authorized Distributors',
    subtitle: 'Get lowest wholesale quotations on bulk orders with verified warranty.',
    ctaText: 'Get Best Price Quotes',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/Home%20page%20banner%2004=3%201.png',
    theme: 'light',
    link: '/products?category=Gaming%20Products'
  },
  {
    title: 'Commercial Displays & Office IT Infrastructure',
    subtitle: 'Source direct from verified OEM suppliers with fast delivery across India.',
    ctaText: 'Post Your Requirement',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/image%20191.png',
    theme: 'light',
    link: '/checkout'
  }
];

export default function Hero() {
  const slides = STATIC_SLIDES;
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className={styles.heroSection}>
      <div className={styles.sliderContainer}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`${styles.slide} ${idx === current ? styles.active : ''} ${slide.theme === 'dark' ? styles.darkTheme : ''}`}
          >
            <div className="container">
              <div className={styles.slideContent}>
                {/* Text Left */}
                <div className={styles.textContent}>
                  <h1 className={styles.title}>{slide.title}</h1>
                  <p className={styles.description}>{slide.subtitle}</p>
                  <a href={slide.link || '/products'} className={styles.ctaButton}>
                    {slide.ctaText || 'Shop Collection'}
                  </a>
                </div>

                {/* Image Right */}
                <div className={styles.imageContent}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className={styles.heroImage}
                    />
                    <div className={styles.circleBg} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          {/* Control Navigation */}
          <button onClick={prevSlide} className={`${styles.navBtn} ${styles.prev}`} aria-label="Previous Slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button onClick={nextSlide} className={`${styles.navBtn} ${styles.next}`} aria-label="Next Slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
