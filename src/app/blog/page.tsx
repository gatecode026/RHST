'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import CustomerReviews from '@/components/CustomerReviews';
import OurBlog from '@/components/OurBlog';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import styles from './Blog.module.css';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        if (data.success) {
          setBlogs(data.blogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filter blogs
  const filteredBlogs = blogs.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory 
      ? post.category?.toUpperCase() === selectedCategory.toUpperCase()
      : true;

    const matchesTag = selectedTag
      ? (post.tags || '').toLowerCase().includes(selectedTag.toLowerCase())
      : true;

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Sort blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (sortOption === 'latest') return dateB - dateA;
    if (sortOption === 'oldest') return dateA - dateB;
    return 0;
  });

  // Pagination
  const totalPages = Math.max(Math.ceil(sortedBlogs.length / itemsPerPage), 1);
  const paginatedBlogs = sortedBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (cat: string | null) => {
    setSelectedCategory(cat);
    setSelectedTag(null);
    setCurrentPage(1);
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTag(null);
    setCurrentPage(1);
  };

  return (
    <>
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Breadcrumb Banner */}
        <section className={styles.breadcrumbBanner}>
          <div className="container">
            <h1 className={styles.breadcrumbTitle}>Blogs</h1>
            <div className={styles.breadcrumbs}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
              <span>Blogs</span>
            </div>
          </div>
        </section>

        {/* Blog Main Content Section */}
        <section className={styles.blogSection}>
          <div className="container">
            <div className={styles.blogLayout}>
              
              {/* Sidebar Section */}
              <aside className={styles.sidebar}>
                {/* Search Widget */}
                <div className={styles.searchWrapper}>
                  <input 
                    type="text" 
                    placeholder="Search" 
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  <button className={styles.searchBtn} aria-label="Search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </div>

                {/* Categories Widget */}
                <div className={styles.widget}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className={styles.widgetTitle} style={{ margin: 0 }}>Categories</h3>
                    {(selectedCategory || selectedTag || searchQuery) && (
                      <button onClick={clearFilters} style={{ fontSize: '11px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Reset All</button>
                    )}
                  </div>
                  <hr className={styles.dashedDivider} />
                  <ul className={styles.widgetList}>
                    {[
                      { key: 'Laptops & Computers', label: 'Laptops & Computers' },
                      { key: "Desktop PC's", label: 'Desktop PCs' },
                      { key: 'Computer Accessories', label: 'Computer Accessories' },
                      { key: 'Keyboard & Mouse', label: 'Keyboard & Mouse' },
                      { key: 'Storage Devices', label: 'Storage Devices' },
                      { key: 'Printers & Scanners', label: 'Printers & Scanners' },
                      { key: 'Security Products', label: 'Security Products' },
                      { key: 'Television', label: 'Television' }
                    ].map(cat => (
                      <li key={cat.key}>
                        <button 
                          onClick={() => handleCategorySelect(cat.key)} 
                          className={styles.widgetLink}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            padding: '4px 0',
                            color: selectedCategory === cat.key ? 'var(--primary)' : 'inherit',
                            fontWeight: selectedCategory === cat.key ? 600 : 300,
                            fontFamily: 'inherit'
                          }}
                        >
                          {cat.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Social Links Widget */}
                <div className={styles.widget}>
                  <h3 className={styles.widgetTitle}>Social Links</h3>
                  <hr className={styles.dashedDivider} />
                  <ul className={styles.widgetList}>
                    <li><Link href="#facebook" className={styles.widgetLink}>Facebook</Link></li>
                    <li><Link href="#instagram" className={styles.widgetLink}>Instagram</Link></li>
                    <li><Link href="#twitter" className={styles.widgetLink}>Twitter</Link></li>
                    <li><Link href="#youtube" className={styles.widgetLink}>Youtube</Link></li>
                    <li><Link href="#pinterest" className={styles.widgetLink}>Pinterest</Link></li>
                  </ul>
                </div>
              </aside>

              {/* Feed Grid Section */}
              <div className={styles.blogFeed}>
                {/* Header Info */}
                <div className={styles.feedHeader}>
                  <span className={styles.resultsText}>
                    {loading ? 'Loading...' : `Showing ${sortedBlogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, sortedBlogs.length)} of ${sortedBlogs.length} results`}
                  </span>
                  <select 
                    className={styles.sortSelect} 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>

                {/* 3x3 Post Grid */}
                <div className={styles.postsGrid}>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className={styles.card} style={{ height: '320px', backgroundColor: '#f0f0f0', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
                    ))
                  ) : paginatedBlogs.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: '#777' }}>
                      <h3>No blog posts matches your query.</h3>
                      <p style={{ marginTop: '0.5rem', fontWeight: 200 }}>Try searching another topic or resetting filters.</p>
                      <button onClick={clearFilters} style={{ marginTop: '1rem', padding: '8px 20px', borderRadius: '20px', border: 'none', backgroundColor: 'var(--primary)', color: '#fff', cursor: 'pointer' }}>Reset Filter</button>
                    </div>
                  ) : (
                    paginatedBlogs.map((post) => (
                      <article key={post.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                          <img 
                            src={post.image} 
                            alt={post.title} 
                            className={styles.image}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/bestselling_ipad.png';
                            }}
                          />
                          <span className={styles.badge}>{post.tag}</span>
                        </div>
                        <div className={styles.info}>
                          <h3 className={styles.name} style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: '52px'
                          }}>{post.title}</h3>
                          <p className={styles.excerpt} style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: '66px'
                          }}>{post.excerpt || 'Read details of this post.'}</p>
                          <Link href={post.link} className={styles.readMore}>
                            Read More
                          </Link>
                        </div>
                      </article>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className={styles.pagination} aria-label="Pagination">
                    <span className={styles.paginationLabel}>Page</span>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pNum = i + 1;
                      return (
                        <span 
                          key={pNum}
                          onClick={() => handlePageChange(pNum)}
                          className={`${styles.pageNum} ${currentPage === pNum ? styles.activePage : ''}`}
                          style={{ cursor: 'pointer' }}
                        >
                          {pNum}
                        </span>
                      );
                    })}
                    <span 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={styles.nextBtn}
                      style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                      Next
                    </span>
                  </nav>
                )}
              </div>

            </div>
          </div>
        </section>

        <CustomerReviews />
        <OurBlog />
        <Brands />
      </main>

      <Footer />
    </>
  );
}
