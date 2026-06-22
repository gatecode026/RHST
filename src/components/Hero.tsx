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

const FALLBACK_SLIDES: Slide[] = [
  {
    title: 'Powering Your Digital World With Reliable IT Solutions',
    subtitle: 'Limited stocks available. Grab it now!',
    ctaText: 'Shop Collection',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/IMG.png?updatedAt=1781696174888',
    theme: 'light',
    link: '#products'
  },
  {
    title: 'Immersive Gaming with the Play Station 5',
    subtitle: 'Experience lightning-fast load times, 3D audio, and an all-new generation of incredible games.',
    ctaText: 'Explore Gaming',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/IMG.png?updatedAt=1781696174888',
    theme: 'light',
    link: '#products'
  },
  {
    title: 'Studio Quality Audio Wherever You Go',
    subtitle: 'Step into premium sound with wireless noise-cancelling headphones tuned to perfection.',
    ctaText: 'Discover Headsets',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/IMG.png?updatedAt=1781696174888',
    theme: 'light',
    link: '#products'
  }
];

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners?t=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.banners && data.banners.length > 0) {
          setSlides(data.banners);
        }
      } catch (err) {
        console.error('Failed to load dynamic banners, using local defaults', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

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
                  <a href={slide.link || '#products'} className={styles.ctaButton}>
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
