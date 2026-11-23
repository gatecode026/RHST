import React from 'react';
import styles from './PageFAQ.module.css';

export interface FAQItem {
  question: string;
  answer: string;
}

interface PageFAQProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  faqs: FAQItem[];
  includeSchema?: boolean;
}

export default function PageFAQ({
  title = 'Frequently Asked Questions',
  subtitle = 'Find direct, factual answers to common procurement, warranty, and service questions.',
  badge = 'Help & Verification Center',
  faqs,
  includeSchema = true,
}: PageFAQProps) {
  if (!faqs || faqs.length === 0) return null;

  const schemaData = includeSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <section className={styles.faqSection} aria-label="Frequently Asked Questions">
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}

      <div className="container">
        <div className={styles.faqHeader}>
          {badge && <span className={styles.faqBadge}>{badge}</span>}
          <h2 className={styles.faqTitle}>{title}</h2>
          {subtitle && <p className={styles.faqSubtitle}>{subtitle}</p>}
        </div>

        <div className={styles.faqGrid}>
          {faqs.map((faq, index) => (
            <details
              key={index}
              className={styles.faqItem}
              open={index === 0}
            >
              <summary className={styles.faqQuestion}>
                <span className={styles.questionText}>{faq.question}</span>
                <svg
                  className={styles.toggleIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </summary>
              <div className={styles.faqAnswer}>
                <p className={styles.answerText}>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
