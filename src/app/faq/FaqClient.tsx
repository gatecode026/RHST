'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './Faq.module.css';

interface FAQItemProps {
  number: number;
  question: string;
  answerText?: string;
  answerList?: string[];
  answerTextAfter?: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ number, question, answerText, answerList, answerTextAfter, isOpen, onToggle }: FAQItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isOpen]);

  return (
    <div className={`${styles.accordionItem} ${isOpen ? styles.accordionItemOpen : ''}`}>
      <button
        onClick={onToggle}
        className={`${styles.accordionHeader} ${isOpen ? styles.accordionHeaderOpen : ''}`}
        aria-expanded={isOpen}
      >
        <span className={styles.accordionTitle}>
          {number}. {question}
        </span>
        <svg
          className={styles.accordionIcon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div
        className={styles.accordionContentWrapper}
        style={{ maxHeight: height }}
      >
        <div ref={contentRef} className={styles.accordionContent}>
          {answerText && <p className={styles.answerText}>{answerText}</p>}
          {answerList && (
            <ul className={styles.answerList}>
              {answerList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          {answerTextAfter && (
            <p className={styles.answerText} style={{ whiteSpace: 'pre-line' }}>
              {answerTextAfter}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface FAQCategory {
  title: string;
  items: Omit<FAQItemProps, 'isOpen' | 'onToggle'>[];
}

const faqData: FAQCategory[] = [
  {
    title: 'General Questions',
    items: [
      {
        number: 1,
        question: 'What is RHST?',
        answerText: 'RHST is an IT-Ecommerce platform that provides a wide range of technology products and solutions including computers, laptops, accessories, networking devices, software solutions, and IT services for individuals and businesses.'
      },
      {
        number: 2,
        question: 'What products does RHST sell?',
        answerText: 'RHST offers various IT products such as:',
        answerList: [
          'Laptops & Desktop Computers',
          'Computer Accessories',
          'Networking Equipment',
          'Storage Devices',
          'Printers & Scanners',
          'Security Solutions',
          'Business IT Products'
        ]
      },
      {
        number: 3,
        question: 'Are RHST products genuine?',
        answerText: 'Yes, RHST provides authentic products sourced from trusted brands and suppliers. All products are checked to maintain quality and reliability.'
      },
      {
        number: 4,
        question: 'How can I contact RHST customer support?',
        answerText: 'You can contact our support team through:',
        answerList: [
          'Email: rhst@gmail.com',
          'Phone: +91-8387634520',
          'Contact Us page on our website'
        ],
        answerTextAfter: 'Our team will assist you with product, order, and service-related queries.'
      }
    ]
  },
  {
    title: 'Account Related Questions',
    items: [
      {
        number: 5,
        question: 'Do I need an account to purchase products?',
        answerText: 'Yes, creating an account helps you:',
        answerList: [
          'Track orders',
          'Manage personal information',
          'View purchase history',
          'Save products',
          'Get faster checkout experience'
        ]
      },
      {
        number: 6,
        question: 'How can I create an RHST account?',
        answerText: 'You can register by clicking on the Sign Up/Register option and providing your basic details like name, email, and phone number.'
      },
      {
        number: 7,
        question: 'I forgot my password. What should I do?',
        answerText: 'Click on the Forgot Password option on the login page and follow the instructions to reset your password.'
      }
    ]
  },
  {
    title: 'Product Related Questions',
    items: [
      {
        number: 8,
        question: 'How can I find the right IT product?',
        answerText: 'You can use:',
        answerList: [
          'Search option',
          'Product categories',
          'Filters',
          'Product comparison feature'
        ],
        answerTextAfter: 'You can also contact our support team for expert guidance.'
      },
      {
        number: 9,
        question: 'Do products come with warranty?',
        answerText: 'Yes, eligible products come with manufacturer warranty according to the brand’s warranty terms.',
        answerTextAfter: 'Warranty details are mentioned on the product page.'
      },
      {
        number: 10,
        question: 'Can I compare different products?',
        answerText: 'Yes, RHST provides a product comparison feature where you can compare specifications, features, and prices of different products.'
      },
      {
        number: 11,
        question: 'Are product specifications accurate?',
        answerText: 'We make every effort to provide accurate product information. Specifications may vary slightly depending on manufacturer updates.'
      }
    ]
  },
  {
    title: 'Order Related Questions',
    items: [
      {
        number: 12,
        question: 'How can I place an order?',
        answerText: 'To place an order:',
        answerList: [
          'Select your product',
          'Add it to cart',
          'Proceed to checkout',
          'Enter delivery details',
          'Select payment method',
          'Confirm your order'
        ]
      },
      {
        number: 13,
        question: 'How can I check my order status?',
        answerText: 'You can check your order status from:',
        answerList: [
          'My Account → My Orders'
        ],
        answerTextAfter: 'You can also use the tracking details provided after shipment.'
      },
      {
        number: 14,
        question: 'Can I cancel my order?',
        answerText: 'Yes, orders can be cancelled before shipment processing begins.',
        answerTextAfter: 'Once the order is shipped, cancellation may not be possible.'
      },
      {
        number: 15,
        question: 'What happens if my order is delayed?',
        answerText: 'Delivery delays may happen due to:',
        answerList: [
          'Logistics issues',
          'Weather conditions',
          'Product availability',
          'Location restrictions'
        ],
        answerTextAfter: 'Our team will provide updates whenever required.'
      }
    ]
  },
  {
    title: 'Payment Related Questions',
    items: [
      {
        number: 16,
        question: 'What payment methods are available?',
        answerText: 'RHST supports secure payment options including:',
        answerList: [
          'UPI',
          'Debit Card',
          'Credit Card',
          'Net Banking',
          'Other available online payment methods'
        ]
      },
      {
        number: 17,
        question: 'Is my payment information secure?',
        answerText: 'Yes, payments are processed through secure payment gateways. RHST does not store complete card details.'
      },
      {
        number: 18,
        question: 'Can I pay after delivery?',
        answerText: 'Cash on Delivery availability depends on product type and delivery location.'
      }
    ]
  },
  {
    title: 'Shipping Questions',
    items: [
      {
        number: 19,
        question: 'How long does delivery take?',
        answerText: 'Delivery time depends on your location and product availability.',
        answerTextAfter: 'Estimated delivery:\n• Metro Cities: 3–5 business days\n• Other Locations: 5–8 business days'
      },
      {
        number: 20,
        question: 'How can I track my order?',
        answerText: 'After shipment, you will receive tracking details through email/SMS. You can also track orders from your RHST account.'
      },
      {
        number: 21,
        question: 'Do you provide delivery across India?',
        answerText: 'Yes, RHST provides delivery services across available locations in India.'
      }
    ]
  },
  {
    title: 'Return & Replacement Questions',
    items: [
      {
        number: 22,
        question: 'Can I return a product?',
        answerText: 'Yes, eligible products can be returned according to our Return Policy.',
        answerTextAfter: 'Return requests must meet the required conditions and timeframe.'
      },
      {
        number: 23,
        question: 'What if I receive a damaged product?',
        answerText: 'If you receive a damaged or defective product:',
        answerList: [
          'Contact RHST support within 48 hours',
          'Share order details',
          'Provide product images if required'
        ],
        answerTextAfter: 'Our team will assist with replacement or resolution.'
      },
      {
        number: 24,
        question: 'Who pays return shipping charges?',
        answerText: 'Return shipping charges depend on the reason for return and product conditions.'
      }
    ]
  },
  {
    title: 'Technical Support Questions',
    items: [
      {
        number: 25,
        question: 'Does RHST provide installation support?',
        answerText: 'Yes, RHST may provide installation and technical support services for selected products.'
      },
      {
        number: 26,
        question: 'Do you provide IT solutions for businesses?',
        answerText: 'Yes, RHST provides business IT solutions including hardware setup, networking, software solutions, and technical support.'
      },
      {
        number: 27,
        question: 'Can I get help choosing products for my business?',
        answerText: 'Yes, our experts can help you select suitable IT products based on your business requirements.'
      }
    ]
  },
  {
    title: 'Security & Privacy Questions',
    items: [
      {
        number: 28,
        question: 'Is my personal information safe?',
        answerText: 'Yes, RHST follows security practices to protect customer information. Please refer to our Privacy Policy for more details.'
      },
      {
        number: 29,
        question: 'Does RHST share customer information?',
        answerText: 'No, RHST does not sell or misuse customer information. Information is only used for order processing, support, and service improvement.'
      }
    ]
  },
  {
    title: 'Other Questions',
    items: [
      {
        number: 30,
        question: 'How can I provide feedback about RHST?',
        answerText: 'You can share your feedback through:',
        answerList: [
          'Contact Us page',
          'Email support',
          'Customer review section'
        ],
        answerTextAfter: 'Your feedback helps us improve our services.'
      }
    ]
  }
];

export default function FaqClient() {
  const [activeNumber, setActiveNumber] = useState<number | null>(null);

  const handleToggle = (num: number) => {
    setActiveNumber(activeNumber === num ? null : num);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.contentWrapper}>
        
        {/* Intro */}
        <div className={styles.introBlock}>
          <h2 className={styles.introTitle}>Welcome to RHST Help Center!</h2>
          <p className={styles.introParagraph}>
            Find answers to common questions about our products, orders, payments, shipping, returns, and services. If you need further assistance, our support team is always ready to help you.
          </p>
        </div>

        {/* Categories and Accordions */}
        {faqData.map((category, catIdx) => (
          <div key={catIdx} className={styles.faqCategory}>
            <h3 className={styles.faqCategoryTitle}>{category.title}</h3>
            <div className={styles.accordionGroup}>
              {category.items.map((item) => (
                <AccordionItem
                  key={item.number}
                  number={item.number}
                  question={item.question}
                  answerText={item.answerText}
                  answerList={item.answerList}
                  answerTextAfter={item.answerTextAfter}
                  isOpen={activeNumber === item.number}
                  onToggle={() => handleToggle(item.number)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Still Have Questions? */}
        <div className={styles.stillQuestionsBox}>
          <div className={styles.stillQuestionsText}>
            <h4 className={styles.stillQuestionsTitle}>Still Have Questions?</h4>
            <p className={styles.stillQuestionsDesc}>
              If you cannot find the answer to your question in our FAQ, please contact our support team. We are online for support standard timings to assist you.
            </p>
          </div>
          <Link href="/contact" className={styles.contactBtn}>
            Contact Us
          </Link>
        </div>

      </div>
    </section>
  );
}
