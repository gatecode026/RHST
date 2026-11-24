import React from 'react';
import type { Metadata } from 'next';
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
import { getCanonicalUrl } from '@/lib/seo';
import { getHomeInitialData } from '@/lib/serverData';
import { getOrganizationSchema } from '@/lib/schema';

// Serve the home page from cache and regenerate in the background at most every 5 minutes,
// instead of querying MongoDB on every request (was the main cause of slow document response).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "VALNQIX | B2B IT Hardware, Suppliers & Marketplace Directory",
  description: "Connect directly with verified IT hardware manufacturers, wholesalers, and distributors across India. Post buy requirements, request lowest quotations, and source IT equipment directly from suppliers.",
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
};

export default async function Home() {
  const homeData = await getHomeInitialData();
  const orgSchema = getOrganizationSchema();

  return (
    <>
      {/* Organization Structured Data for Search Engines & AI Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* Navigation Header */}
      <Header />

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Hero Slider */}
        <Hero />

        {/* Feature Value Propositions */}
        <Features />

        {/* Categories Section */}
        <Categories initialCategories={homeData.categories} />

        {/* Best Selling Products */}
        <BestSelling initialProducts={homeData.bestSelling} />

        {/* Apple Collection Promos & Countdown */}
        <PromoBanner />

        {/* Multi-Column List Feed */}
        <ProductColumns initialProducts={homeData.columnsProducts} />

        {/* Our Services */}
        <OurServices />

        {/* Customer Reviews */}
        <CustomerReviews />

        {/* Our Blog */}
        <OurBlog initialBlogs={homeData.blogs} />

        {/* Infinite Brand Marquee */}
        <Brands />
      </main>

      {/* Structured Dark Footer */}
      <Footer />
    </>
  );
}

