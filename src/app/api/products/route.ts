import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_PRODUCTS = [
  {
    name: 'IPad (9th Gen)',
    mrp: 135000,
    discount: 7,
    price: '₹1,25,000',
    image: '/images/bestselling_ipad.png',
    link: '#ipad',
    category: 'Hardware',
    brand: 'Dell',
    sku: 'SKU-IPAD-9G',
    stock: 18,
    status: 'PUBLISHED',
    description: 'Apple iPad 9th Gen with A13 Bionic chip, 10.2-inch Retina display, and 64GB storage.',
    featured: true,
    onOffer: true,
    warranty: 12,
    lowStockThreshold: 5
  },
  {
    name: 'Gaming Mouse',
    mrp: 3000,
    discount: 16,
    price: '₹2,500',
    image: '/images/bestselling_mouse.png',
    link: '#mouse',
    category: 'Gaming Products',
    brand: 'Asus',
    sku: 'SKU-GM-MOUSE',
    stock: 35,
    status: 'PUBLISHED',
    description: 'RGB High Performance Gaming Mouse with adjustable DPI, mechanical switches, and programmable buttons.',
    featured: false,
    onOffer: true,
    warranty: 6,
    lowStockThreshold: 10
  },
  {
    name: 'CPU',
    mrp: 12000,
    discount: 16,
    price: '₹10,000',
    image: '/images/bestselling_cpu.png',
    link: '#cpu',
    category: 'Hardware',
    brand: 'Asus',
    sku: 'SKU-CPU-INT',
    stock: 8,
    status: 'PUBLISHED',
    description: 'High performance processor with multicore capability for hardware builds and networking hosts.',
    featured: true,
    onOffer: false,
    warranty: 36,
    lowStockThreshold: 3
  },
  {
    name: 'Ultra HD TV',
    mrp: 65000,
    discount: 15,
    price: '₹55,000',
    image: '/images/bestselling_tv.png',
    link: '#tv',
    category: 'Office Equipment',
    brand: 'Dell',
    sku: 'SKU-TV-UHD',
    stock: 4,
    status: 'PUBLISHED',
    description: '4K Ultra HD smart television screen for conference rooms and presentations.',
    featured: false,
    onOffer: true,
    warranty: 24,
    lowStockThreshold: 2
  },
  {
    name: 'Smart Watch',
    mrp: 18000,
    discount: 16,
    price: '₹15,000',
    image: '/images/bestselling_watch.png',
    link: '#watch',
    category: 'Hardware',
    brand: 'Dell',
    sku: 'SKU-SW-V5',
    stock: 22,
    status: 'PUBLISHED',
    description: 'Modern smartwatch with optical heart rate tracking, customizable faces, and cellular alerts.',
    featured: false,
    onOffer: false,
    warranty: 12,
    lowStockThreshold: 5
  },
  {
    name: 'Wireless Headphones',
    mrp: 10000,
    discount: 15,
    price: '₹8,500',
    image: '/images/bestselling_headphones.png',
    link: '#headphones',
    category: 'Hardware',
    brand: 'Asus',
    sku: 'SKU-HP-WRL',
    stock: 14,
    status: 'PUBLISHED',
    description: 'Stereo audio noise cancelling headphones featuring bluetooth pairing and long battery backup.',
    featured: true,
    onOffer: true,
    warranty: 12,
    lowStockThreshold: 5
  },
  {
    name: 'Wireless Headset',
    mrp: 2500,
    discount: 20,
    price: '₹2,000',
    image: '/images/column_headset.png',
    link: '#headset',
    category: 'Hardware',
    brand: 'Dell',
    sku: 'SKU-WL-HSET',
    stock: 20,
    status: 'PUBLISHED',
    description: 'Ergonomic wireless headset with high fidelity sound and noise cancellation.',
    featured: true,
    onOffer: false,
    warranty: 12,
    lowStockThreshold: 5
  },
  {
    name: 'Apple AirPod',
    mrp: 12000,
    discount: 16,
    price: '₹10,000',
    image: '/images/column_airpods.png',
    link: '#airpod',
    category: 'Hardware',
    brand: 'Dell',
    sku: 'SKU-APPLE-AP',
    stock: 15,
    status: 'PUBLISHED',
    description: 'Original Apple AirPods featuring seamless connectivity and charging case.',
    featured: false,
    onOffer: false,
    warranty: 12,
    lowStockThreshold: 5
  },
  {
    name: 'Wireless Joysticks',
    mrp: 14000,
    discount: 14,
    price: '₹12,000',
    image: '/images/column_joystick.png',
    link: '#joystick',
    category: 'Gaming Products',
    brand: 'Asus',
    sku: 'SKU-WL-JOY',
    stock: 12,
    status: 'PUBLISHED',
    description: 'Responsive wireless game controller designed for ultimate comfort and precision gaming.',
    featured: false,
    onOffer: false,
    warranty: 12,
    lowStockThreshold: 5
  },
  {
    name: 'Monitor',
    mrp: 8000,
    discount: 37,
    price: '₹5,000',
    image: '/images/column_monitor.png',
    link: '#monitor',
    category: 'Office Equipment',
    brand: 'Samsung',
    description: 'Crisp LED desktop monitor with slim bezel design, perfect for home office and gaming setups.',
    sku: 'SKU-MONITOR-HD',
    stock: 10,
    status: 'PUBLISHED',
    featured: false,
    onOffer: true,
    warranty: 24,
    lowStockThreshold: 5
  },
  {
    name: 'Drone With Camera',
    mrp: 50000,
    discount: 16,
    price: '₹42,000',
    image: '/images/drone.png',
    link: '#drone',
    category: 'Hardware',
    brand: 'Samsung',
    description: 'Quadcopter drone with high-definition camera and remote control.',
    sku: 'SKU-DRONE-CAM',
    stock: 6,
    status: 'PUBLISHED',
    featured: false,
    onOffer: true,
    warranty: 12,
    lowStockThreshold: 2
  },
  {
    name: 'Watch Stylist',
    mrp: 18000,
    discount: 16,
    price: '₹15,000',
    image: '/images/bestselling_watch.png',
    link: '#watch-stylist',
    category: 'Hardware',
    brand: 'Dell',
    description: 'Stylish smartwatch for everyday wear with standard tracking features.',
    sku: 'SKU-WATCH-STY',
    stock: 25,
    status: 'PUBLISHED',
    featured: false,
    onOffer: false,
    warranty: 12,
    lowStockThreshold: 5
  },
  {
    name: 'Head Phone',
    mrp: 10000,
    discount: 15,
    price: '₹8,500',
    image: '/images/bestselling_headphones.png',
    link: '#headphone-ob',
    category: 'Hardware',
    brand: 'Asus',
    description: 'Over-ear headphones with superior audio clarity and deep bass.',
    sku: 'SKU-HEADPHONE-OB',
    stock: 15,
    status: 'PUBLISHED',
    featured: false,
    onOffer: false,
    warranty: 12,
    lowStockThreshold: 5
  },
  {
    name: 'Bluetooth Speaker Black',
    mrp: 3500,
    discount: 28,
    price: '₹2,500',
    image: '/images/speaker_black.png',
    link: '#speaker-black',
    category: 'Computer Access',
    brand: 'Asus',
    description: 'Compact black bluetooth speaker with rich sound and portable design.',
    sku: 'SKU-SPK-BLACK',
    stock: 30,
    status: 'PUBLISHED',
    featured: false,
    onOffer: true,
    warranty: 12,
    lowStockThreshold: 10
  },
  {
    name: 'Bluetooth Speaker White',
    mrp: 3500,
    discount: 28,
    price: '₹2,500',
    image: '/images/speaker_white.png',
    link: '#speaker-white',
    category: 'Computer Access',
    brand: 'Dell',
    description: 'Compact white bluetooth speaker with rich sound and portable design.',
    sku: 'SKU-SPK-WHITE',
    stock: 30,
    status: 'PUBLISHED',
    featured: false,
    onOffer: true,
    warranty: 12,
    lowStockThreshold: 10
  },
  {
    name: 'Laptops PC',
    mrp: 95000,
    discount: 15,
    price: '₹80,000',
    image: '/images/laptop.png',
    link: '#laptop',
    category: 'Hardware',
    brand: 'Asus',
    description: 'High-performance laptop suitable for work, gaming, and software development.',
    sku: 'SKU-LAPTOP-PC',
    stock: 10,
    status: 'PUBLISHED',
    featured: false,
    onOffer: false,
    warranty: 24,
    lowStockThreshold: 3
  }
];

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('products');

    // Check if the extended seeding has run
    const seedingMeta = db.collection('seeding_meta');
    const flag = await seedingMeta.findOne({ key: 'extended_seeded' });

    if (!flag) {
      // Seed products non-destructively
      for (const p of DEFAULT_PRODUCTS) {
        const exists = await collection.findOne({ name: p.name });
        if (!exists) {
          await collection.insertOne({
            ...p,
            createdAt: new Date()
          });
        }
      }
      await seedingMeta.updateOne(
        { key: 'extended_seeded' },
        { $set: { key: 'extended_seeded', value: true } },
        { upsert: true }
      );
    }

    const products = await collection.find().toArray();
    const formatted = products.map(doc => ({
      id: doc._id.toString(),
      slug: doc.slug || doc.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
      name: doc.name,
      price: doc.price,
      image: doc.image,
      link: doc.link,
      category: doc.category,
      brand: doc.brand || 'Dell',
      sku: doc.sku || ('SKU-' + doc._id.toString().substring(18).toUpperCase()),
      stock: doc.stock !== undefined ? doc.stock : 10,
      status: doc.status || 'PUBLISHED',
      description: doc.description || '',
      mrp: doc.mrp !== undefined ? doc.mrp : parseInt((doc.price || '').replace(/[^\d]/g, ''), 10),
      discount: doc.discount !== undefined ? doc.discount : 0,
      featured: doc.featured !== undefined ? doc.featured : false,
      onOffer: doc.onOffer !== undefined ? doc.onOffer : false,
      warranty: doc.warranty !== undefined ? doc.warranty : 0,
      lowStockThreshold: doc.lowStockThreshold !== undefined ? doc.lowStockThreshold : 10
    }));

    return NextResponse.json({ success: true, products: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
