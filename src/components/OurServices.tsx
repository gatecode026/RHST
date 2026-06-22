"use client";

import React, { useRef } from 'react';
import styles from './OurServices.module.css';

const SERVICES_DATA = [
  {
    id: 1,
    name: 'IT Support',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
    link: '/services/it-support'
  },
  {
    id: 2,
    name: 'Installation Services',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80',
    link: '/services/installation'
  },
  {
    id: 3,
    name: 'Repair & Maintenance',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80',
    link: '/services/repair-maintenance'
  },
  {
    id: 4,
    name: 'AMC',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
    link: '/services/amc'
  },
  {
    id: 5,
    name: 'Cloud Services',
    image: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?w=400&q=80',
    link: '/services/cloud'
  }
];

export default function OurServices() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardElement = scrollContainerRef.current.firstElementChild as HTMLElement;
      // Scroll by one card width plus gap (24px = 1.5rem)
      const scrollAmount = cardElement ? cardElement.offsetWidth + 24 : 260;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="services" className={`section bg-white ${styles.servicesSection}`}>
      <div className="container">
        {/* Section Heading */}
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Our Services</h2>
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

        {/* Services Slider Row */}
        <div className={styles.sliderContainer}>
          <div ref={scrollContainerRef} className={styles.grid}>
            {SERVICES_DATA.map((service) => (
              <a key={service.id} href={service.link} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={service.image} alt={service.name} className={styles.image} />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.name}>{service.name}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
