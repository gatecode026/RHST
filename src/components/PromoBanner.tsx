'use client';

import React, { useState, useEffect } from 'react';
import styles from './PromoBanner.module.css';

export default function PromoBanner() {
  // Set initial countdown values matching the user's screenshot
  const [timeLeft, setTimeLeft] = useState({
    days: 21,
    hours: 22,
    minutes: 19,
    seconds: 30
  });

  useEffect(() => {
    // Set target time: 21 days, 22 hours, 19 minutes, and 30 seconds from mount
    const targetTime = Date.now() + 
      (21 * 24 * 60 * 60 * 1000) + 
      (22 * 60 * 60 * 1000) + 
      (19 * 60 * 1000) + 
      (30 * 1000);

    const interval = setInterval(() => {
      const difference = targetTime - Date.now();

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="deals" className={styles.bannerSection}>
      <div className="container">
        <div className={styles.bannerWrapper}>
          {/* Image Column */}
          <div className={styles.imageCol}>
            <img 
              src="/images/promo_apple.png" 
              alt="Apple Collection" 
              className={styles.promoImage} 
            />
          </div>

          {/* Info Column */}
          <div className={styles.infoCol}>
            <h2 className={styles.title}>
              30% DISCOUNT ON<br />APPLE COLLECTION
            </h2>

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

            <a href="/#products" className={styles.shopBtn}>
              SHOP COLLECTION
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
