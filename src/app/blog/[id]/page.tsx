import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import OurBlog from '@/components/OurBlog';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import styles from './BlogDetail.module.css';
import SafeImage from './SafeImage';

// Next.js dynamic page components take params as a promise in React 19 / Next.js 15+
interface PageProps {
  params: Promise<{ id: string }>;
}

// Dynamic route metadata query
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const db = await getDb();
    const collection = db.collection('blogs');

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
    } else {
      query = { id: id };
    }

    const blog = await collection.findOne(query);
    if (blog) {
      return {
        title: `${blog.title} | RHST Blog`,
        description: blog.excerpt || `Read the latest blog post "${blog.title}" on RHST E-commerce & IT Solutions.`,
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }
  return {
    title: 'Blog Post | RHST Blog',
    description: 'Explore the latest tech news, gadgets advice, and software guidelines on the RHST Blog.',
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  // Await the dynamic params as required by Next.js 15+
  const { id } = await params;

  let blog: any = null;
  let prevPost: any = null;
  let nextPost: any = null;

  try {
    const db = await getDb();
    const collection = db.collection('blogs');

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
    } else {
      query = { id: id };
    }

    blog = await collection.findOne(query);

    if (blog) {
      // Find previous and next posts from published list to build dynamic navigation
      const allBlogs = await collection.find({ status: 'Published' }).sort({ sortOrder: 1, createdAt: -1 }).toArray();
      const currentIndex = allBlogs.findIndex(b => b._id.toString() === blog._id.toString());
      
      prevPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
      nextPost = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;
    }
  } catch (error) {
    console.error("Error loading blog details from database:", error);
  }

  // Not found handler
  if (!blog) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--dark)' }}>Blog Post Not Found</h2>
          <p style={{ margin: '1rem 0 2rem 0', fontWeight: 200, color: '#777' }}>The blog article you are looking for does not exist or has been removed.</p>
          <Link href="/blog" style={{ padding: '12px 30px', borderRadius: '50px', backgroundColor: 'var(--primary)', color: '#fff', textTransform: 'uppercase', fontSize: '14px', fontWeight: 600 }}>
            Back to Blogs List
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const blogTags = blog.tags ? blog.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

  return (
    <>
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Article Details Section */}
        <section className={styles.articleSection}>
          <div className="container">
            <div className={styles.articleWrapper}>
              
              {/* Large Hero Image */}
              <div className={styles.heroImageWrapper}>
                <SafeImage 
                  src={blog.image} 
                  alt={blog.title} 
                  className={styles.heroImage}
                />
              </div>

              {/* Metadata row */}
              <div className={styles.metaRow}>
                <span>{formattedDate} - {blog.category || 'Technology'}</span>
              </div>

              {/* Article Main Heading */}
              <h1 className={styles.articleTitle}>
                {blog.title}
              </h1>

              {/* Article Content - Dynamic Blocks Renderer */}
              <div className={styles.articleBody}>
                {(blog.blocks || []).map((b: any) => {
                  switch (b.type) {
                    case 'paragraph':
                      return <p key={b.id}>{b.text}</p>;
                    
                    case 'heading':
                      return <h2 key={b.id} className={styles.sectionHeading}>{b.text}</h2>;
                    
                    case 'subheading':
                      return <h3 key={b.id} className={styles.subheading}>{b.text}</h3>;
                    
                    case 'blockquote':
                      return (
                        <blockquote key={b.id} className={styles.quoteBlock}>
                          <span className={styles.quoteText}>
                            "{b.text}"
                          </span>
                        </blockquote>
                      );
                    
                    case 'bulletList':
                      return (
                        <ul key={b.id} className={styles.bulletList}>
                          {(b.items || []).map((item: string, idx: number) => (
                            <li key={idx} className={styles.bulletListItem}>{item}</li>
                          ))}
                        </ul>
                      );
                    
                    case 'numberedList':
                      return (
                        <div key={b.id} className={styles.pointsContainer}>
                          {(b.items || []).map((item: string, idx: number) => {
                            const parts = item.split(':');
                            if (parts.length > 1) {
                              const title = parts[0];
                              const desc = parts.slice(1).join(':').trim();
                              return (
                                <div key={idx} className={styles.pointBlock}>
                                  <h3 className={styles.pointTitle}>{title}</h3>
                                  <p className={styles.pointText}>{desc}</p>
                                </div>
                              );
                            }
                            return (
                              <div key={idx} className={styles.pointBlock}>
                                <p className={styles.pointText}>{item}</p>
                              </div>
                            );
                          })}
                        </div>
                      );
                    
                    case 'callout':
                      return (
                        <div key={b.id} className={styles.calloutBox}>
                          {b.image && (
                            <div className={styles.calloutImageWrapper}>
                              <SafeImage 
                                src={b.image} 
                                alt={b.title || "Callout Illustration"} 
                                className={styles.calloutImage}
                                hideOnError={true}
                              />
                            </div>
                          )}
                          <div className={styles.calloutContent}>
                            {b.title && <h3 className={styles.calloutTitle}>{b.title}</h3>}
                            {(() => {
                              const paras = (b.description || '').split('\n\n');
                              return (
                                <>
                                  {paras[0] && <p>{paras[0]}</p>}
                                  {b.subtitle && <h4 className={styles.calloutSubtitle}>{b.subtitle}</h4>}
                                  {paras.slice(1).map((p: string, pIdx: number) => (
                                    <p key={pIdx}>{p}</p>
                                  ))}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      );
                    
                    case 'image':
                      return (
                        <div key={b.id} className={styles.imageBlock}>
                          <SafeImage 
                            src={b.url} 
                            alt={b.alt || "Article illustration"} 
                            className={styles.blockImage}
                          />
                          {b.caption && <p className={styles.imageCaption}>{b.caption}</p>}
                        </div>
                      );
                    
                    case 'video':
                      return (
                        <div key={b.id} className={styles.videoBlock}>
                          <iframe 
                            width="100%" 
                            height="450" 
                            src={b.url} 
                            title={b.alt || "Embedded Video"} 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            style={{ borderRadius: '12px', border: 'none' }}
                          />
                          {b.caption && <p className={styles.imageCaption}>{b.caption}</p>}
                        </div>
                      );
                    
                    case 'table':
                      return (
                        <div key={b.id} className={styles.tableBlockWrapper}>
                          <table className={styles.tableBlock}>
                            {b.headers && b.headers.length > 0 && (
                              <thead>
                                <tr>
                                  {b.headers.map((h: string, hIdx: number) => (
                                    <th key={hIdx} className={styles.tableTh}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                            )}
                            <tbody>
                              {(b.rows || []).map((row: string[], rIdx: number) => (
                                <tr key={rIdx}>
                                  {row.map((cell: string, cIdx: number) => (
                                    <td key={cIdx} className={styles.tableTd}>{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    
                    case 'divider':
                      return <hr key={b.id} className={styles.dividerBlock} />;
                    
                    default:
                      return null;
                  }
                })}
              </div>

              {/* Tags & Social Share links */}
              <div className={styles.shareRow}>
                <div className={styles.tags}>
                  {blogTags.length === 0 ? (
                    <span style={{ color: '#aaa', fontSize: '14px' }}>No Tags</span>
                  ) : (
                    blogTags.map((tag: string, idx: number) => (
                      <Link key={idx} href={`/blog?tag=${tag}`} className={styles.tagItem}>{tag}</Link>
                    ))
                  )}
                </div>
                <div className={styles.shares}>
                  <span className={styles.shareLabel}>Share:</span>
                  <Link href="#share-facebook" className={styles.shareLinkFacebook} aria-label="Share on Facebook">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V1h-3c-3 0-5 2-5 5v2z"/></svg>
                  </Link>
                  <Link href="#share-instagram" className={styles.shareLink} aria-label="Share on Instagram">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                  </Link>
                  <Link href="#share-twitter" className={styles.shareLink} aria-label="Share on Twitter">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.56a9.84 9.84 0 0 1-2.8.77 4.9 4.9 0 0 0 2.15-2.7 9.81 9.81 0 0 1-3.1 1.18 4.89 4.89 0 0 0-8.3 4.45 13.9 13.9 0 0 1-10.1-5.12 4.9 4.9 0 0 0 1.5 6.5 4.9 4.9 0 0 1-2.2-.6v.06a4.89 4.89 0 0 0 3.9 4.8 4.9 4.9 0 0 1-2.2.08 4.9 4.9 0 0 0 4.6 3.4 9.8 9.8 0 0 1-6.1 2.1c-.4 0-.8 0-1.2-.05A13.9 13.9 0 0 0 7.55 20a13.9 13.9 0 0 0 14-14v-.63A9.93 9.93 0 0 0 24 4.56z"/></svg>
                  </Link>
                  <Link href="#share-linkedin" className={styles.shareLink} aria-label="Share on LinkedIn">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.76-1.75 1.76zm13.5 12.27h-3v-5.6c0-3.37-4-3.12-4 0v5.6h-3v-11h3v1.77c1.4-2.58 7-2.77 7 2.47v6.76z"/></svg>
                  </Link>
                  <Link href="#share-youtube" className={styles.shareLink} aria-label="Share on YouTube">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163c-.272-1.016-1.073-1.815-2.091-2.086C19.56 3.75 12 3.75 12 3.75s-7.56 0-9.407.327C1.576 4.348.775 5.147.502 6.163.173 8.01 0 12 0 12s.173 3.99.502 5.837c.273 1.016 1.074 1.815 2.092 2.086 1.847.327 9.406.327 9.406.327s7.56 0 9.407-.327c1.017-.27 1.819-1.07 2.091-2.086.33-1.847.502-5.837.502-5.837s-.172-3.99-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </Link>
                </div>
              </div>

              {/* Prev / Next Article navigation links */}
              <div className={styles.articleNav}>
                {prevPost ? (
                  <Link href={`/blog/${prevPost._id.toString()}`} className={styles.navLink}>
                    <span className={styles.navLinkText}>← Previous Post</span>
                    <span className={styles.navLinkTitle}>{prevPost.title}</span>
                  </Link>
                ) : (
                  <div style={{ flex: 1 }} />
                )}
                {nextPost ? (
                  <Link href={`/blog/${nextPost._id.toString()}`} className={`${styles.navLink} ${styles.navLinkRight}`}>
                    <span className={styles.navLinkText}>Next Post →</span>
                    <span className={styles.navLinkTitle}>{nextPost.title}</span>
                  </Link>
                ) : (
                  <div style={{ flex: 1 }} />
                )}
              </div>

              {/* Comments Section */}
              <CommentSection postId={id} styles={styles} />

            </div> {/* close articleWrapper */}
          </div> {/* close container */}
        </section>

        {/* Reused blog layout section */}
        <OurBlog className={styles.ourBlogSection} />
        <Brands />
      </main>

      {/* Structured Dark Footer */}
      <Footer />
    </>
  );
}
