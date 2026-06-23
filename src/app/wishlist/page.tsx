'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import styles from './Wishlist.module.css';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      stock: item.stock
    });
  };

  return (
    <>
      {/* Header component at the top */}
      <Header />

      <main className={styles.wishlistSection}>
        <div className="container">
          
          {/* Breadcrumbs Header */}
          <div className={styles.breadcrumbsHeader}>
            <h1>My Wishlist</h1>
            <p>
              <Link href="/">Home</Link> / Wishlist
            </p>
          </div>

          {/* Conditional rendering based on wishlist count */}
          {!wishlistItems || wishlistItems.length === 0 ? (
            
            /* Empty State Layout - Matches Mockup Design Exactly */
            <div className={styles.emptyStateContainer}>
              <div className={styles.heartCircle}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
              <p className={styles.emptyDesc}>
                Browse our products and save the items you love. Your wishlist
                makes it easy to find and buy what you want later.
              </p>
              <Link href="/products" className={styles.exploreBtn}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Explore Products
              </Link>
            </div>
          ) : (
            
            /* Populated wishlist table view */
            <div className={styles.tableContainer}>
              <table className={styles.wishlistTable}>
                <thead>
                  <tr>
                    <th>Product details</th>
                    <th>Unit price</th>
                    <th>Actions</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlistItems.map((item) => (
                    <tr key={item.id} className={styles.wishlistItemRow}>
                      
                      {/* Image & Title Column */}
                      <td>
                        <div className={styles.productInfoCol}>
                          <Link href={`/products/${item.slug || item.id}`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className={styles.productImg}
                            />
                          </Link>
                          <Link href={`/products/${item.slug || item.id}`} className={styles.productNameLink}>
                            {item.name}
                          </Link>
                        </div>
                      </td>

                      {/* Price Column */}
                      <td>
                        <span className={styles.productPrice}>
                          ₹{item.price.toLocaleString()}/-
                        </span>
                      </td>

                      {/* Add to Cart Action Column */}
                      <td>
                        <button
                          type="button"
                          className={styles.addToCartBtn}
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to cart
                        </button>
                      </td>

                      {/* Remove Action Column */}
                      <td>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeFromWishlist(item.id)}
                          aria-label={`Remove ${item.name} from wishlist`}
                        >
                          &times;
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>

      {/* Footer component at the bottom */}
      <Footer />
    </>
  );
}
