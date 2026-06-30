'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Categories from '@/components/Categories';
import Brands from '@/components/Brands';
import styles from './ProductDetails.module.css';

interface Review {
  author: string;
  rating: number;
  date: string;
  text: string;
}

interface ProductDetails {
  id: string;
  slug?: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  description: string;
  mrp: number;
  discount: number;
  warranty: number;
  os: string;
  designType: string;
  reviews: Review[];
}

export default function ProductDetailsClient({ initialProduct }: { initialProduct: ProductDetails }) {
  const router = useRouter();
  const { addToCart, updateQty, setIsCartOpen, toggleWishlist, isInWishlist } = useCart();

  // Local state for product data
  const [product, setProduct] = useState<ProductDetails>(initialProduct);
  const [activeImage, setActiveImage] = useState(initialProduct.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'info' | 'reviews'>('description');
  
  const isWishlisted = isInWishlist(product.id);

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [saveDetails, setSaveDetails] = useState(false);
  const [formFileName, setFormFileName] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Thumbnails variations (same image, styled/positioned differently for mock variations)
  const thumbnails = [
    initialProduct.image,
    initialProduct.image,
    initialProduct.image
  ];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock
    });

    if (quantity > 1) {
      updateQty(product.id, quantity);
    }
  };

  const handleOrderNow = () => {
    const isLoggedIn = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
    if (!isLoggedIn) {
      const accountBtn = document.querySelector('[aria-label="Account"]') as HTMLElement;
      if (accountBtn) {
        accountBtn.click();
      }
      return;
    }

    handleAddToCart();
    setIsCartOpen(false);
    router.push(`/checkout?buyNow=${product.id}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormFileName(e.target.files[0].name);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !reviewAuthor.trim() || !reviewEmail.trim()) {
      setReviewError('Please fill out all required fields.');
      return;
    }
    setReviewError('');
    setIsSubmittingReview(true);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: reviewAuthor,
          email: reviewEmail,
          rating: reviewRating,
          text: reviewText
        })
      });

      const data = await res.json();
      if (data.success && data.review) {
        // Update product reviews locally
        setProduct(prev => ({
          ...prev,
          reviews: [data.review, ...prev.reviews]
        }));
        // Reset form
        setReviewText('');
        setReviewAuthor('');
        setReviewEmail('');
        setFormFileName('');
        setReviewRating(5);
        if (saveDetails) {
          localStorage.setItem('reviewer_name', reviewAuthor);
          localStorage.setItem('reviewer_email', reviewEmail);
        }
      } else {
        setReviewError(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      setReviewError('Error submitting review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="container">
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <a href="/">Home</a> / <a href="/products">Products</a> / <span>{product.name}</span>
      </div>

      {/* Main product display section */}
      <div className={styles.productMain}>
        {/* Left Column: Gallery */}
        <div className={styles.gallerySection}>
          <div className={styles.mainImageWrapper}>
            {/* Wishlist Button over Image */}
            <button
              type="button"
              className={`${styles.wishlistBtnOverImage} ${isWishlisted ? styles.wishlistBtnOverImageActive : ''}`}
              onClick={() => toggleWishlist({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, stock: product.stock })}
              aria-label="Add to Wishlist"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <img src={activeImage} alt={product.name} className={styles.mainImage} />
          </div>

          <div className={styles.thumbnails}>
            {thumbnails.map((img, idx) => (
              <button
                key={idx}
                className={`${styles.thumbnailCard} ${activeImage === img ? styles.activeThumbnailCard : ''}`}
                onClick={() => setActiveImage(img)}
                aria-label={`View thumbnail ${idx + 1}`}
              >
                <img src={img} alt={`${product.name} thumbnail`} className={styles.thumbnailImg} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Info Details */}
        <div className={styles.infoSection}>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.price}>₹{product.price.toLocaleString()}/-</div>

          {/* Rating */}
          <div className={styles.ratingRow}>
            <span className={styles.stars}>★★★★★</span>
            <span className={styles.ratingCount}>({product.reviews.length} customer reviews)</span>
          </div>

          {/* Short description */}
          <p className={styles.shortDesc}>{product.description}</p>

          <div className={styles.dividerDot}></div>



          {/* Stock */}
          <div className={styles.stockStatus}>
            {product.stock > 0 ? (
              <span className={product.stock <= 3 ? styles.stockLow : ''}>
                {product.stock} In stock
              </span>
            ) : (
              <span className={styles.stockLow}>Out of stock</span>
            )}
          </div>

          {/* Purchase Actions */}
          <div className={styles.purchaseRow}>
            <div className={styles.qtyWrapper}>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                -
              </button>
              <input
                type="text"
                readOnly
                value={quantity}
                className={styles.qtyInput}
              />
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={styles.orderNowBtn}
              onClick={handleOrderNow}
            >
              Order Now
            </button>

            <button
              type="button"
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>

          <div className={styles.dividerDot}></div>

          {/* Secondary Specifications list */}
          <ul className={styles.specsList}>
            <li><strong>Brand:</strong> {product.brand}</li>
            <li><strong>Operating System:</strong> {product.os}</li>
            <li><strong>Personal computer design type:</strong> {product.designType}</li>
          </ul>
        </div>
      </div>

      {/* Tabs Section */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'description' ? styles.activeTabBtn : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'info' ? styles.activeTabBtn : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Additional Information
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTabBtn : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.reviews.length})
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'description' && (
            <div className={styles.descriptionTab}>
              <h3>Product Description</h3>
              <p>{product.description}</p>
              <p>The product is engineered to deliver exceptional performance, maximizing user efficiency and workflow reliability. It integrates cutting-edge technology platforms that blend seamless operability, fast response time, and robust configuration options suitable for contemporary systems setup.</p>
            </div>
          )}

          {activeTab === 'info' && (
            <div className={styles.infoTab}>
              <table className={styles.infoTabTable}>
                <tbody>
                  <tr>
                    <td>Brand</td>
                    <td>{product.brand}</td>
                  </tr>
                  <tr>
                    <td>Operating System</td>
                    <td>{product.os}</td>
                  </tr>
                  <tr>
                    <td>Personal computer design type</td>
                    <td>{product.designType}</td>
                  </tr>
                  <tr>
                    <td>SKU</td>
                    <td>{product.sku}</td>
                  </tr>
                  <tr>
                    <td>Warranty</td>
                    <td>{product.warranty} Months</td>
                  </tr>
                  <tr>
                    <td>Stock available</td>
                    <td>{product.stock} Units</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className={styles.reviewsTab}>
              {/* Reviews List */}
              <div className={styles.reviewsList}>
                {product.reviews.map((rev, idx) => (
                  <div key={idx} className={styles.reviewCard}>
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                      alt="User Reviewer Avatar"
                      className={styles.reviewAvatar}
                    />
                    <div className={styles.reviewInfo}>
                      <div className={styles.reviewMeta}>
                        <span className={styles.reviewAuthor}>{rev.author}</span>
                        <span className={styles.reviewDate}>{rev.date}</span>
                      </div>
                      <div style={{ color: '#ffb800', marginBottom: '0.4rem', fontSize: '13px' }}>
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </div>
                      <p className={styles.reviewText}>{rev.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <div className={styles.addReviewHeader}>
                <h3 className={styles.addReviewTitle}>Add a Review</h3>
                <p className={styles.addReviewSubtitle}>Your email address will not be published. Required fields are marked *</p>

                <form onSubmit={handleReviewSubmit}>
                  {reviewError && (
                    <div style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '14px' }}>
                      {reviewError}
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span className={styles.formLabel}>Your rating *</span>
                    <div className={styles.ratingSelection}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          className={`${styles.starOption} ${reviewRating >= star ? styles.starOptionActive : ''}`}
                          onClick={() => setReviewRating(star)}
                          aria-label={`Rate ${star} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Choose Photo File Input */}
                  <div className={styles.fileInputWrapper}>
                    <span className={styles.fileInputLabel}>Choose your photo</span>
                    <label className={styles.customFileBtn}>
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                    </label>
                    {formFileName && <span style={{ marginLeft: '10px', fontSize: '13px', color: '#666' }}>{formFileName}</span>}
                  </div>

                  <div className={styles.formFieldFull}>
                    <label htmlFor="review-text" className={styles.formLabel}>Write your review *</label>
                    <textarea
                      id="review-text"
                      className={styles.textarea}
                      placeholder="Share your thoughts about this product..."
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label htmlFor="review-name" className={styles.formLabel}>Write your name *</label>
                      <input
                        id="review-name"
                        type="text"
                        className={styles.input}
                        placeholder="John Doe"
                        value={reviewAuthor}
                        onChange={e => setReviewAuthor(e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.formField}>
                      <label htmlFor="review-email" className={styles.formLabel}>Write your email *</label>
                      <input
                        id="review-email"
                        type="email"
                        className={styles.input}
                        placeholder="john@example.com"
                        value={reviewEmail}
                        onChange={e => setReviewEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkboxInput}
                      checked={saveDetails}
                      onChange={e => setSaveDetails(e.target.checked)}
                    />
                    Save my name, email, and website in this browser for the next time.
                  </label>

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reused bottom page layouts matching the user layout exactly */}
      <div className={styles.categoriesWrapper}>
        <Categories title="HARDWARE PRODUCTS" />
      </div>
      <Brands />
    </div>
  );
}
