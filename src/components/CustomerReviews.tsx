"use client";

import React, { useRef } from 'react';
import styles from './CustomerReviews.module.css';

const REVIEWS_DATA = [
  {
    id: 1,
    text: '“VALNQIX is a reliable IT store with a wide range of technology products. The pricing is competitive and the product quality is outstanding. Happy with my purchase!”',
    rating: 5,
    author: 'Rahul Sharma'
  },
  {
    id: 2,
    text: '“Best place for IT solutions and technology products. Quality products, affordable prices, and excellent after-sales support make VALNQIX a trusted IT partner.”',
    rating: 5,
    author: 'Nikita Rani'
  },
  {
    id: 3,
    text: '“I had a great experience shopping with VALNQIX. The website is easy to use, product details are clear, and my order arrived on time. Looking forward to buying more products.”',
    rating: 5,
    author: 'Pawan Bisht'
  }
];

interface Review {
  id: string | number;
  text: string;
  rating: number;
  author: string;
}

interface CustomerReviewsProps {
  reviews?: Review[];
}

export default function CustomerReviews({ reviews }: CustomerReviewsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeReviews = reviews || REVIEWS_DATA;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardElement = scrollContainerRef.current.firstElementChild as HTMLElement;
      // Scroll by one card width plus gap (24px = 1.5rem)
      const scrollAmount = cardElement ? cardElement.offsetWidth + 24 : 360;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="reviews" className="section bg-white">
      <div className="container">
        {/* Section Heading */}
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Customers Reviews</h2>
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

        {/* Reviews Grid */}
        <div className={styles.sliderContainer}>
          <div ref={scrollContainerRef} className={styles.grid}>
            {activeReviews.map((review) => (
              <div key={review.id} className={styles.card}>
                <p className={styles.text}>{review.text}</p>
                <div className={styles.rating}>
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <span key={idx} className={styles.star}>★</span>
                  ))}
                </div>
                <h3 className={styles.author}>{review.author}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
