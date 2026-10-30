import React from 'react';
import styles from './Features.module.css';

const FEATURES = [
  {
    id: 1,
    title: 'VERIFIED SUPPLIERS',
    desc: 'Connect directly with verified manufacturers and authorized distributors across India.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 11 11 13 15 9"></polyline>
      </svg>
    )
  },
  {
    id: 2,
    title: 'BEST PRICE QUOTATIONS',
    desc: 'Post your requirements and receive competitive quotations with transparent pricing.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
        <path d="M12 6v2"></path>
        <path d="M12 16v2"></path>
      </svg>
    )
  },
  {
    id: 3,
    title: 'RAPID RESPONSE',
    desc: 'Quick turnaround with supplier response times under 2 hours for instant business deals.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    )
  },
  {
    id: 4,
    title: 'ZERO COMMISSION',
    desc: 'Trade directly with sellers with 100% free lead connections and no hidden middleman fees.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    )
  }
];

export default function Features() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.grid}>
          {FEATURES.map((feature) => (
            <div key={feature.id} className={styles.card}>
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <div className={styles.info}>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
