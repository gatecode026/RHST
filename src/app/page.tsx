import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Categories from '@/components/Categories';
import BestSelling from '@/components/BestSelling';
import PromoBanner from '@/components/PromoBanner';
import ProductColumns from '@/components/ProductColumns';
import OurServices from '@/components/OurServices';
import CustomerReviews from '@/components/CustomerReviews';
import OurBlog from '@/components/OurBlog';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      {/* Navigation Header */}
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Hero Slider */}
        <Hero />

        {/* Feature Value Propositions */}
        <Features />

        {/* Categories Section */}
        <Categories />

        {/* Best Selling Products */}
        <BestSelling />

        {/* Apple Collection Promos & Countdown */}
        <PromoBanner />

        {/* Multi-Column List Feed */}
        <ProductColumns />

        {/* Our Services */}
        <OurServices />

        {/* Customer Reviews */}
        <CustomerReviews />

        {/* Our Blog */}
        <OurBlog />

        {/* Infinite Brand Marquee */}
        <Brands />
      </main>

      {/* Structured Dark Footer */}
      <Footer />
    </>
  );
}

