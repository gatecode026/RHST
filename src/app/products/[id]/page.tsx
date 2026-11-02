import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailsClient from './ProductDetailsClient';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

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

// Server helper to load product by ID or slug directly
async function getProduct(id: string) {
  let product: any = null;

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

      // Robust fallback matching by generated slug in memory
      if (!dbProduct && !isObjectId && !bsName) {
        const allDbProducts = await db.collection('products').find().toArray();
        const matched = allDbProducts.find(p => {
          const genSlug = p.slug || p.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
          return genSlug === id.toLowerCase();
        });
        dbProduct = matched || null;
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

  if (!product) return null;

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
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return {
      title: 'Product Not Found | VALNQIX',
      description: 'The requested product could not be found.'
    };
  }
  return {
    title: `${product.name} | VALNQIX IT Products & Solutions`,
    description: product.description
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '1rem', textTransform: 'uppercase' }}>Product Not Found</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>We could not find the product you were looking for.</p>
          <a href="/products" style={{ backgroundColor: 'var(--primary)', color: '#fff', padding: '10px 24px', borderRadius: '4px', fontSize: '15px' }}>
            Back to Products Catalog
          </a>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <ProductDetailsClient initialProduct={product} />
      </main>
      <Footer />
    </>
  );
}
