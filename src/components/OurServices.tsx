"use client";

import React from 'react';
import styles from './OurServices.module.css';

const SERVICES_DATA = [
  {
    id: 1,
    name: 'IT Support',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20172.png',
    link: '/services/it-support'
  },
  {
    id: 2,
    name: 'Installation Services',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20173.png',
    link: '/services/installation'
  },
  {
    id: 3,
    name: 'Repair & Maintenance',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20174.png',
    link: '/services/repair-maintenance'
  },
  {
    id: 4,
    name: 'AMC',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20176.png',
    link: '/services/amc'
  },
  {
    id: 5,
    name: 'Cloud Services',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/Rectangle%20177.png',
    link: '/services/cloud'
  }
];

export default function OurServices() {
  return (
    <section id="services" className={`section bg-white ${styles.servicesSection}`}>
      <div className="container">
        {/* Section Heading */}
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Our Services</h2>
        </div>

        {/* Services Slider Row */}
        <div className={styles.sliderContainer}>
          <div className={styles.grid}>
            {SERVICES_DATA.map((service) => (
              <a key={service.id} href={service.link} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={service.image} alt={service.name} className={styles.image} />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.name}>{service.name}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
