'use client';

import React, { useState, useEffect } from 'react';
import styles from './PromoBanner.module.css';

export default function PromoBanner() {
  const [banner, setBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch('/api/promo-banner?t=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.banner) {
          setBanner(data.banner);
        }
      } catch (err) {
        console.error('Failed to fetch promo banner:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  useEffect(() => {
    if (!banner || !banner.expiryDate || !banner.isActive) return;

    const targetTime = new Date(banner.expiryDate).getTime();

    const updateTimer = () => {
      const difference = targetTime - Date.now();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      return true;
    };

    const hasActiveTimer = updateTimer();
    if (!hasActiveTimer) return;

    const interval = setInterval(() => {
      const stillActive = updateTimer();
      if (!stillActive) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [banner]);

  if (loading || !banner || !banner.isActive) {
    return null;
  }

  return (
    <section id="deals" className={styles.bannerSection}>
      <div className="container">
        <div className={styles.bannerWrapper}>
          {/* Image Column */}
          <div className={styles.imageCol}>
            <img 
              src={banner.imageUrl || "/images/promo_apple.png"} 
              alt={banner.title} 
              className={styles.promoImage} 
            />
          </div>

          {/* Info Column */}
          <div className={styles.infoCol}>
            {banner.badgeText && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '-0.5rem',
                alignSelf: 'flex-start'
              }}>
                {banner.badgeText}
              </span>
            )}
            <h2 className={styles.title} style={{ textTransform: 'none', fontWeight: 300 }}>
              {banner.title}
            </h2>
            {banner.description && (
              <p style={{
                color: '#555',
                fontSize: '15px',
                lineHeight: '1.6',
                margin: 0,
                fontWeight: 300,
                maxWidth: '500px'
              }}>
                {banner.description}
              </p>
            )}

            {/* Countdown Timer */}
            <div className={styles.countdown}>
              <div className={styles.timeBox}>
                <span className={styles.timeVal}>{timeLeft.days.toString().padStart(2, '0')}</span>
                <span className={styles.timeLabel}>Days</span>
              </div>
              <div className={styles.separator}>:</div>
              <div className={styles.timeBox}>
                <span className={styles.timeVal}>{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className={styles.timeLabel}>Hrs</span>
              </div>
              <div className={styles.separator}>:</div>
              <div className={styles.timeBox}>
                <span className={styles.timeVal}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className={styles.timeLabel}>Min</span>
              </div>
              <div className={styles.separator}>:</div>
              <div className={styles.timeBox}>
                <span className={styles.timeVal}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className={styles.timeLabel}>Sec</span>
              </div>
            </div>

            <a href={banner.buttonLink || "/products"} className={styles.shopBtn}>
              {banner.buttonText || "SHOP COLLECTION"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
