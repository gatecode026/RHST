"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './OurBlog.module.css';

const FALLBACK_BLOG_DATA = [
  {
    id: 1,
    tag: 'Laptops & Computers',
    title: '5 MUST-HAVE GADGETS FOR THE MODERN HOME',
    excerpt: 'Dive into the world of cutting-edge technology with our latest blog post, where we highlight fi...',
    image: '/images/bestselling_ipad.png',
    link: '/blog/1'
  },
  {
    id: 2,
    tag: 'Laptops & Computers',
    title: '5 MUST-HAVE GADGETS FOR THE MODERN HOME',
    excerpt: 'Dive into the world of cutting-edge technology with our latest blog post, where we highlight fi...',
    image: '/images/bestselling_ipad.png',
    link: '/blog/2'
  },
  {
    id: 3,
    tag: 'Laptops & Computers',
    title: '5 MUST-HAVE GADGETS FOR THE MODERN HOME',
    excerpt: 'Dive into the world of cutting-edge technology with our latest blog post, where we highlight fi...',
    image: '/images/bestselling_ipad.png',
    link: '/blog/3'
  }
];

export default function OurBlog({ className = '' }: { className?: string }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        if (data.success && data.blogs && data.blogs.length > 0) {
          setBlogs(data.blogs);
        }
      } catch (error) {
        console.error("Error loading widget blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardElement = scrollContainerRef.current.firstElementChild as HTMLElement;
      // Scroll by one card width plus gap (24px = 1.5rem)
      const scrollAmount = cardElement ? cardElement.offsetWidth + 24 : 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const renderData = blogs.length > 0 ? blogs : FALLBACK_BLOG_DATA;

  return (
    <section id="blog" className={`section bg-white ${className}`}>
      <div className="container">
        {/* Section Heading */}
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Our Blog</h2>
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
 
        {/* Blog Grid/Slider Row */}
        <div className={styles.sliderContainer}>
          <div ref={scrollContainerRef} className={styles.grid}>
            {renderData.map((post) => {
              const blogUrl = post.link || `/blog/${post.id || post._id}`;
              return (
                <div key={post.id || post._id} className={styles.card}>
                  <Link href={blogUrl} style={{ display: 'block', width: '100%' }}>
                    <div className={styles.imageWrapper}>
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className={styles.image} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/bestselling_ipad.png';
                        }}
                      />
                      <span className={styles.badge}>{post.tag || post.category}</span>
                    </div>
                  </Link>
                  <div className={styles.info}>
                    <h3 className={styles.name} style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      height: '52px'
                    }}>
                      <Link href={blogUrl} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className={styles.excerpt} style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      height: '66px'
                    }}>{post.excerpt}</p>
                    <Link href={blogUrl} className={styles.readMore}>
                      Read More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
