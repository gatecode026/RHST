import React, { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailsClient from './ProductDetailsClient';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getCanonicalUrl } from '@/lib/seo';
import { isNonItSlug } from '@/lib/nonItFilter';
import { getProductSchema, getBreadcrumbSchema } from '@/lib/schema';

// Cached page, regenerated in the background at most once an hour. Everything the site itself changes
// refreshes just that product's page immediately: admin product edits, purchases (stock) and new
// reviews (see lib/revalidatePages.ts, the checkout route and the review POST handler). The hourly
// window is only a safety net for changes made outside the app (e.g. direct database scripts).
export const revalidate = 3600;

// Required for runtime caching (ISR) of dynamic routes: build no product pages up front,
// each one is rendered and cached the first time it is visited.
export async function generateStaticParams() {
  return [];
}

// Mock data catalogs to resolve mock IDs
const BASE_CATALOG_PRODUCTS = [
  { name: 'Ipad 9th Gen', price: 125000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0', category: 'Hardware', brand: 'Dell' },
  { name: 'Drone With Camera', price: 42000, image: '/images/drone.png', category: 'Hardware', brand: 'Samsung' },
  { name: 'Watch Stylist', price: 15000, image: '/images/bestselling_watch.png', category: 'Hardware', brand: 'Dell' },
  { name: 'Ultra HD TV', price: 75000, image: '/images/bestselling_tv.png', category: 'Office Equipment', brand: 'Samsung' },
  { name: 'Head Phone', price: 8500, image: '/images/bestselling_headphones.png', category: 'Hardware', brand: 'Asus' },
  { name: 'Bluetooth Speaker', price: 2500, image: '/images/speaker_black.png', category: 'Computer Access', brand: 'Asus' },
  { name: 'Ultra HD TV', price: 50000, image: '/images/column_monitor.png', category: 'Office Equipment', brand: 'Samsung' },
  { name: 'Bluetooth Speaker', price: 2500, image: '/images/speaker_white.png', category: 'Computer Access', brand: 'Dell' },
  { name: 'Ultra HD TV', price: 55000, image: '/images/bestselling_tv.png', category: 'Office Equipment', brand: 'Dell' },
  { name: 'Laptops PC', price: 80000, image: '/images/laptop.png', category: 'Hardware', brand: 'Asus' },
  { name: 'Ultra HD TV', price: 65000, image: '/images/column_monitor.png', category: 'Office Equipment', brand: 'Samsung' },
  { name: 'Ultra HD TV', price: 25000, image: '/images/bestselling_tv.png', category: 'Office Equipment', brand: 'Dell' }
];

const CATALOG_PRODUCTS = Array.from({ length: 144 }).map((_, index) => {
  const baseProduct = BASE_CATALOG_PRODUCTS[index % BASE_CATALOG_PRODUCTS.length];
  const pageNum = Math.floor(index / BASE_CATALOG_PRODUCTS.length) + 1;
  const name = pageNum === 1 ? baseProduct.name : `${baseProduct.name} - Page ${pageNum}`;
  const price = baseProduct.price + (pageNum - 1) * 100;
  return {
    id: `cat-${index + 1}`,
    name,
    price,
    image: baseProduct.image,
    category: baseProduct.category,
    brand: baseProduct.brand,
    sku: `SKU-CAT-${index + 1}`,
    stock: 12,
    description: `High quality ${baseProduct.name} suitable for IT infrastructure, office, or home setups.`
  };
});

const COLUMN_PRODUCTS = [
  { id: 'col-1', name: 'Wireless Headset', price: 2000, image: '/images/column_headset.png', category: 'Hardware', brand: 'Dell', description: 'Ergonomic wireless headset with high fidelity sound and noise cancellation.' },
  { id: 'col-2', name: 'Wireless Headset', price: 2000, image: '/images/column_headset.png', category: 'Hardware', brand: 'Dell', description: 'Ergonomic wireless headset with high fidelity sound and noise cancellation.' },
  { id: 'col-3', name: 'Wireless Headset', price: 2000, image: '/images/column_headset.png', category: 'Hardware', brand: 'Dell', description: 'Ergonomic wireless headset with high fidelity sound and noise cancellation.' },
  { id: 'col-4', name: 'Apple AirPod', price: 10000, image: '/images/column_airpods.png', category: 'Hardware', brand: 'Apple', description: 'Original Apple AirPods featuring seamless connectivity and charging case.' },
  { id: 'col-5', name: 'Apple AirPod', price: 10000, image: '/images/column_airpods.png', category: 'Hardware', brand: 'Apple', description: 'Original Apple AirPods featuring seamless connectivity and charging case.' },
  { id: 'col-6', name: 'Apple AirPod', price: 10000, image: '/images/column_airpods.png', category: 'Hardware', brand: 'Apple', description: 'Original Apple AirPods featuring seamless connectivity and charging case.' },
  { id: 'col-7', name: 'Wireless Joysticks', price: 12000, image: '/images/column_joystick.png', category: 'Gaming Products', brand: 'Asus', description: 'Responsive wireless game controller designed for ultimate comfort and precision gaming.' },
  { id: 'col-8', name: 'Wireless Joysticks', price: 12000, image: '/images/column_joystick.png', category: 'Gaming Products', brand: 'Asus', description: 'Responsive wireless game controller designed for ultimate comfort and precision gaming.' },
  { id: 'col-9', name: 'Wireless Joysticks', price: 12000, image: '/images/column_joystick.png', category: 'Gaming Products', brand: 'Asus', description: 'Responsive wireless game controller designed for ultimate comfort and precision gaming.' },
  { id: 'col-10', name: 'Monitor', price: 5000, image: '/images/column_monitor.png', category: 'Office Equipment', brand: 'Samsung', description: 'Crisp LED desktop monitor with slim bezel design, perfect for home office and gaming setups.' },
  { id: 'col-11', name: 'Monitor', price: 5000, image: '/images/column_monitor.png', category: 'Office Equipment', brand: 'Samsung', description: 'Crisp LED desktop monitor with slim bezel design, perfect for home office and gaming setups.' },
  { id: 'col-12', name: 'Monitor', price: 5000, image: '/images/column_monitor.png', category: 'Office Equipment', brand: 'Samsung', description: 'Crisp LED desktop monitor with slim bezel design, perfect for home office and gaming setups.' }
];

function parsePrice(priceVal: any): number {
  if (typeof priceVal === 'number') return priceVal;
  if (typeof priceVal === 'string') {
    return parseInt(priceVal.replace(/[^\d]/g, ''), 10) || 0;
  }
  return 0;
}

const DEFAULT_REVIEWS = [
  {
    author: 'Reena Choudhary',
    rating: 5,
    date: '06/22/2026',
    text: 'Excellent product quality and fast delivery. The performance is amazing and the buying experience with VALNQIX was smooth and reliable.'
  },
  {
    author: 'S.K. Jain',
    rating: 5,
    date: '06/22/2026',
    text: 'Great service and genuine products. The support team helped me choose the right IT product according to my requirements.'
  }
];

// Server helper to load product by ID or slug directly.
// Wrapped in cache() so generateMetadata() and the page share ONE lookup per request (it used to run twice).
const getProduct = cache(async (id: string) => {
  let product: any = null;
  let dbFailed = false;

  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
  const bsName = id.startsWith('bs-') ? {
    'bs-1': 'IPad (9th Gen)',
    'bs-2': 'Gaming Mouse',
    'bs-3': 'CPU',
    'bs-4': 'Ultra HD TV',
    'bs-5': 'Smart Watch',
    'bs-6': 'Wireless Headphones'
  }[id] : null;

  if (isObjectId || bsName || (!id.startsWith('cat-') && !id.startsWith('col-'))) {
    try {
      const db = await getDb();
      let query: any = {};
      if (isObjectId) {
        query = { _id: new ObjectId(id) };
      } else if (bsName) {
        query = { name: bsName };
      } else {
        query = {
          $or: [
            { slug: id },
            { slug: id.toLowerCase() },
            { name: { $regex: new RegExp('^' + id.replace(/-/g, ' ').replace(/[^\w\s]/g, '') + '$', 'i') } }
          ]
        };
      }
      let dbProduct = await db.collection('products').findOne(query);

      // Fallback: match legacy products that have NO stored slug by their name-generated slug.
      // Products that have a slug were already matched by the query above, so only slug-less
      // ones can match here - load just those (normally none) instead of scanning every product.
      if (!dbProduct && !isObjectId && !bsName) {
        const slugless = await db
          .collection('products')
          .find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] }, { projection: { name: 1 } })
          .toArray();
        const matched = slugless.find(p => {
          const genSlug = (p.name || '').toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
          return genSlug === id.toLowerCase();
        });
        dbProduct = matched ? await db.collection('products').findOne({ _id: matched._id }) : null;
      }

      if (dbProduct) {
        product = {
          id: dbProduct._id.toString(),
          slug: dbProduct.slug || dbProduct.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
          name: dbProduct.name,
          price: parsePrice(dbProduct.price),
          image: dbProduct.image,
          category: dbProduct.category || 'Hardware',
          brand: dbProduct.brand || 'ASUS',
          sku: dbProduct.sku || `SKU-DB-${dbProduct._id.toString().substring(18).toUpperCase()}`,
          stock: dbProduct.stock !== undefined ? dbProduct.stock : 8,
          description: dbProduct.description || 'Premium IT product delivered with full brand warranty and professional configuration guidance from VALNQIX.',
          mrp: dbProduct.mrp || parsePrice(dbProduct.price) * 1.1,
          discount: dbProduct.discount || 10,
          warranty: dbProduct.warranty || 12,
          os: dbProduct.os || 'Windows 11 Home',
          designType: dbProduct.designType || 'Standard Desktop PC'
        };
      }
    } catch (e) {
      console.error('Failed to get database product in SSR:', e);
      dbFailed = true;
    }
  }

  // Lookup in Mock catalogs if not found (matching ID or slug)
  if (!product) {
    const mockCatProd = CATALOG_PRODUCTS.find(p =>
      p.id === id ||
      p.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') === id.toLowerCase()
    );
    if (mockCatProd) {
      product = {
        ...mockCatProd,
        price: parsePrice(mockCatProd.price),
        mrp: parsePrice(mockCatProd.price) * 1.15,
        discount: 12,
        warranty: 12,
        os: 'Windows 11 Home',
        designType: mockCatProd.category === 'Hardware' ? 'Personal Computer' : 'Accessory'
      };
    } else {
      const mockColProd = COLUMN_PRODUCTS.find(p =>
        p.id === id ||
        p.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') === id.toLowerCase()
      );
      if (mockColProd) {
        product = {
          ...mockColProd,
          price: parsePrice(mockColProd.price),
          mrp: parsePrice(mockColProd.price) * 1.15,
          discount: 15,
          warranty: 12,
          os: 'Windows 11 Home',
          designType: 'Accessory'
        };
      }
    }
  }

  if (!product) {
    // A database failure must not look like "product not found": that 404 would be cached for the
    // revalidate window. Throwing keeps the failure uncached so the next request retries.
    if (dbFailed) throw new Error(`Product lookup failed for "${id}": database unavailable`);
    return null;
  }

  // Retrieve reviews
  let reviews = [...DEFAULT_REVIEWS];
  try {
    const db = await getDb();
    const dbReviews = await db.collection('reviews').find({ productId: id }).toArray();
    if (dbReviews && dbReviews.length > 0) {
      reviews = [
        ...dbReviews.map(r => ({
          author: r.author,
          rating: r.rating,
          date: r.date,
          text: r.text
        })),
        ...DEFAULT_REVIEWS
      ];
    }
  } catch (err) {
    console.warn('Failed to retrieve reviews in SSR:', err);
  }

  return {
    ...product,
    reviews
  };
});

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  const canonicalPath = `/products/${product?.slug || id}`;
  if (!product) {
    if (isNonItSlug(id)) {
      return {
        title: 'Product Discontinued (410 Gone) | VALNQIX',
        description: 'This product has been permanently discontinued and removed from the VALNQIX IT hardware catalog.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }
    return {
      title: 'Product Not Found | VALNQIX',
      description: 'The requested product could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  return {
    title: `${product.name} | VALNQIX IT Products & Solutions`,
    description: product.description,
    alternates: {
      canonical: getCanonicalUrl(canonicalPath),
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const productSchema = getProductSchema(product, id);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Products', url: '/products' },
    {
      name: product.category || 'Hardware',
      url: `/products?category=${encodeURIComponent(product.category || 'Hardware')}`
    },
    {
      name: product.name,
      url: `/products/${product.slug || id}`
    }
  ]);

  return (
    <>
      {/* Product Schema (SSR Structured Data) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* BreadcrumbList Schema (SSR Structured Data) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <ProductDetailsClient initialProduct={product} />
      </main>
      <Footer />
    </>
  );
}
