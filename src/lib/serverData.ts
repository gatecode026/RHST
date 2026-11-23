import { getDb } from '@/lib/mongodb';

// Fallback products for instant SSR render if DB is slow or connecting
export const FALLBACK_SSR_PRODUCTS = [
  {
    id: 'prod-fallback-1',
    slug: 'ipad-9th-gen',
    name: 'IPad (9th Gen)',
    price: '₹1,25,000',
    numericPrice: 125000,
    mrp: 135000,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
    category: 'Hardware',
    brand: 'Apple',
    sku: 'SKU-IPAD-9G',
    stock: 18,
    description: 'Apple iPad 9th Gen with A13 Bionic chip, 10.2-inch Retina display, and 64GB storage.',
    sellerName: 'Apex Tech Systems Pvt Ltd',
    sellerLocation: 'Nehru Place, New Delhi, Delhi',
    sellerRating: 4.8,
    sellerVerified: true,
  },
  {
    id: 'prod-fallback-2',
    slug: 'gaming-mouse',
    name: 'Gaming Mouse',
    price: '₹2,500',
    numericPrice: 2500,
    mrp: 3000,
    discount: 16,
    image: '/images/bestselling_mouse.png',
    category: 'Gaming Products',
    brand: 'Asus',
    sku: 'SKU-GM-MOUSE',
    stock: 35,
    description: 'RGB High Performance Gaming Mouse with adjustable DPI and mechanical switches.',
    sellerName: 'Arya Sonic Enterprises',
    sellerLocation: 'Sector 63, Noida, Uttar Pradesh',
    sellerRating: 4.9,
    sellerVerified: true,
  },
  {
    id: 'prod-fallback-3',
    slug: 'cpu-processor',
    name: 'CPU Processor',
    price: '₹10,000',
    numericPrice: 10000,
    mrp: 12000,
    discount: 16,
    image: '/images/bestselling_cpu.png',
    category: 'Hardware',
    brand: 'Asus',
    sku: 'SKU-CPU-INT',
    stock: 8,
    description: 'High performance processor with multicore capability for hardware builds.',
    sellerName: 'Zenith AudioTech Systems',
    sellerLocation: 'Okhla Industrial Area, New Delhi',
    sellerRating: 4.7,
    sellerVerified: true,
  },
  {
    id: 'prod-fallback-4',
    slug: 'ultra-hd-tv-screen',
    name: 'Ultra HD TV 4K Display',
    price: '₹55,000',
    numericPrice: 55000,
    mrp: 65000,
    discount: 15,
    image: '/images/bestselling_tv.png',
    category: 'Television',
    brand: 'Dell',
    sku: 'SKU-TV-UHD',
    stock: 4,
    description: '4K Ultra HD smart television screen for conference rooms and presentations.',
    sellerName: 'Nexus Harmonics Pvt Ltd',
    sellerLocation: 'Andheri East, Mumbai, Maharashtra',
    sellerRating: 4.8,
    sellerVerified: true,
  },
  {
    id: 'prod-fallback-5',
    slug: 'smart-watch',
    name: 'Smart Watch Series 5',
    price: '₹15,000',
    numericPrice: 15000,
    mrp: 18000,
    discount: 16,
    image: '/images/bestselling_watch.png',
    category: 'Hardware',
    brand: 'Dell',
    sku: 'SKU-SW-V5',
    stock: 22,
    description: 'Modern smartwatch with optical heart rate tracking and cellular alerts.',
    sellerName: 'Mahaveer OptiScreen Corporation',
    sellerLocation: 'Andheri East, Mumbai, Maharashtra',
    sellerRating: 4.9,
    sellerVerified: true,
  },
  {
    id: 'prod-fallback-6',
    slug: 'wireless-headphones',
    name: 'Wireless Headphones',
    price: '₹8,500',
    numericPrice: 8500,
    mrp: 10000,
    discount: 15,
    image: '/images/bestselling_headphones.png',
    category: 'Hardware',
    brand: 'Asus',
    sku: 'SKU-HEADPHONE-OB',
    stock: 15,
    description: 'Over-ear headphones with superior audio clarity and deep bass.',
    sellerName: 'Zen Harmonics Enterprises',
    sellerLocation: 'SP Road, Bengaluru, Karnataka',
    sellerRating: 4.8,
    sellerVerified: true,
  },
  {
    id: 'prod-fallback-7',
    slug: 'bluetooth-speaker-black',
    name: 'Bluetooth Speaker Black',
    price: '₹2,500',
    numericPrice: 2500,
    mrp: 3500,
    discount: 28,
    image: '/images/speaker_black.png',
    category: 'Speaker\'s',
    brand: 'Asus',
    sku: 'SKU-SPK-BLACK',
    stock: 30,
    description: 'Compact black bluetooth speaker with rich sound and portable design.',
    sellerName: 'AcuTech Stereo Electronics',
    sellerLocation: 'Madhapur, Hyderabad, Telangana',
    sellerRating: 4.7,
    sellerVerified: true,
  },
  {
    id: 'prod-fallback-8',
    slug: 'laptops-pc-workstation',
    name: 'Laptops PC Workstation',
    price: '₹80,000',
    numericPrice: 80000,
    mrp: 95000,
    discount: 15,
    image: '/images/laptop.png',
    category: 'Laptops & Computers',
    brand: 'Asus',
    sku: 'SKU-LAPTOP-PC',
    stock: 10,
    description: 'High-performance laptop suitable for work, engineering, and enterprise productivity.',
    sellerName: 'Future AudioTech Pvt Ltd',
    sellerLocation: 'Mansarovar Tech Hub, Jaipur, Rajasthan',
    sellerRating: 4.9,
    sellerVerified: true,
  }
];

export const FALLBACK_SSR_CATEGORIES = [
  { id: 'cat-1', name: 'Electronics', image: '/images/category_electronics.png', link: '/products?category=Electronics', slug: 'electronics' },
  { id: 'cat-2', name: "Speaker's", image: '/images/category_speaker.png', link: "/products?category=Speaker's", slug: 'speakers' },
  { id: 'cat-3', name: 'Camera', image: '/images/category_camera.png', link: '/products?category=Camera', slug: 'camera' },
  { id: 'cat-4', name: 'Television', image: '/images/category_tv.png', link: '/products?category=Television', slug: 'television' },
  { id: 'cat-5', name: 'Storage devices', image: '/images/category_storage.png', link: '/products?category=Storage%20devices', slug: 'storage-devices' },
  { id: 'cat-6', name: 'Laptops & computers', image: '/images/category_laptop.png', link: '/products?category=Laptops%20%26%20computers', slug: 'laptops-computers' },
  { id: 'cat-7', name: 'Keyboard & mouse', image: '/images/category_keyboard.png', link: '/products?category=Keyboard%20%26%20mouse', slug: 'keyboard-mouse' }
];

export const FALLBACK_SSR_BLOGS = [
  {
    id: '1',
    tag: 'Laptops & Computers',
    title: '5 MUST-HAVE GADGETS FOR THE MODERN HOME',
    excerpt: 'Dive into the world of cutting-edge technology with our latest blog post, highlighting essential IT gadgets that elevate digital productivity and modern workspace connectivity.',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png',
    link: '/blog/1',
    category: 'Laptops & Computers',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    tag: 'Hardware',
    title: 'CHOOSING RELIABLE IT HARDWARE FOR ENTERPRISE SCALING',
    excerpt: 'Explore strategic approaches to hardware procurement, enterprise lifecycle maintenance, and component warranty coverage for corporate IT infrastructure.',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png',
    link: '/blog/2',
    category: 'Hardware',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    tag: 'Networking',
    title: 'OPTIMIZING SECURE OFFICE NETWORKS AND SERVER ARCHITECTURE',
    excerpt: 'Learn how to configure robust firewall gateways, managed switches, and high-speed Wi-Fi access points to secure enterprise data workflows.',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png',
    link: '/blog/3',
    category: 'Networking',
    createdAt: new Date().toISOString()
  }
];

export const FALLBACK_SSR_SELLERS = [
  {
    id: 'seller-fb-1',
    name: 'Apex Tech Systems Pvt Ltd',
    mainCategory: 'Electronics',
    location: 'Nehru Place, New Delhi, Delhi',
    rating: 4.8,
    reviewCount: 142,
    verified: true,
    memberSince: '2019',
    gstNumber: '07AABCA1234F1Z5',
    responseTime: '< 2 Hours',
    responseRate: '96%',
    natureOfBusiness: 'Wholesaler & Authorized Distributor',
    contactPerson: 'Rajesh Mehra',
    phone: '+91 98110 24890',
    email: 'sales@apextechsystems.in',
    trustScore: 'Verified TrustSEAL',
    status: 'ACTIVE'
  },
  {
    id: 'seller-fb-2',
    name: 'Arya Sonic Enterprises',
    mainCategory: 'Gaming Products',
    location: 'Sector 63, Noida, Uttar Pradesh',
    rating: 4.9,
    reviewCount: 98,
    verified: true,
    memberSince: '2020',
    gstNumber: '09AAZCS5678K1Z2',
    responseTime: '< 1 Hour',
    responseRate: '98%',
    natureOfBusiness: 'OEM Manufacturer & Supplier',
    contactPerson: 'Suresh Kumar Arya',
    phone: '+91 98230 45671',
    email: 'info@aryasonic.com',
    trustScore: 'Verified TrustSEAL',
    status: 'ACTIVE'
  },
  {
    id: 'seller-fb-3',
    name: 'Nexus Harmonics Pvt Ltd',
    mainCategory: 'Television',
    location: 'Andheri East, Mumbai, Maharashtra',
    rating: 4.8,
    reviewCount: 215,
    verified: true,
    memberSince: '2018',
    gstNumber: '27AABCN8901L1Z9',
    responseTime: '< 3 Hours',
    responseRate: '94%',
    natureOfBusiness: 'Authorized Stockist & Importer',
    contactPerson: 'Nitin Desai',
    phone: '+91 98920 11223',
    email: 'contact@nexusharmonics.in',
    trustScore: 'Verified TrustSEAL',
    status: 'ACTIVE'
  },
  {
    id: 'seller-fb-4',
    name: 'Zen Harmonics Enterprises',
    mainCategory: 'Laptops & Computers',
    location: 'SP Road, Bengaluru, Karnataka',
    rating: 4.8,
    reviewCount: 180,
    verified: true,
    memberSince: '2019',
    gstNumber: '29AABCS3456D1Z4',
    responseTime: '< 2 Hours',
    responseRate: '95%',
    natureOfBusiness: 'Wholesaler & IT Supplier',
    contactPerson: 'Arun Venkatesh',
    phone: '+91 98450 78901',
    email: 'support@zenharmonics.com',
    trustScore: 'Verified TrustSEAL',
    status: 'ACTIVE'
  }
];

// Server function with timeout protection
async function getDbWithTimeout(timeoutMs = 4000) {
  const dbPromise = getDb();
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('DB connection timed out for SSR')), timeoutMs)
  );
  return (await Promise.race([dbPromise, timeoutPromise])) as any;
}

/**
 * Server-side loader for Products Catalog SSR
 */
export async function getInitialProductsData(limit = 24) {
  try {
    const db = await getDbWithTimeout();
    const collection = db.collection('products');

    const [docs, totalCount, categoriesDoc, brandsDoc] = await Promise.all([
      collection
        .find({ status: { $ne: 'DRAFT' } })
        .sort({ _id: -1 })
        .limit(limit)
        .toArray(),
      collection.estimatedDocumentCount().catch(() => 14592),
      db.collection('categories').find({}).toArray().catch(() => []),
      db.collection('brands').find({}).toArray().catch(() => [])
    ]);

    if (!docs || docs.length === 0) {
      return {
        products: FALLBACK_SSR_PRODUCTS,
        total: 8,
        categories: FALLBACK_SSR_CATEGORIES,
        brands: []
      };
    }

    const formattedProducts = docs.map((doc: any) => ({
      id: doc._id.toString(),
      slug: doc.slug || doc.name?.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || doc._id.toString(),
      name: doc.name,
      price: doc.price || `₹${(doc.numericPrice || 0).toLocaleString('en-IN')}`,
      numericPrice: doc.numericPrice || 0,
      image: doc.image || '/images/default_product.png',
      link: doc.link || `/products/${doc.slug || doc._id.toString()}`,
      category: doc.category || 'Hardware',
      brand: doc.brand || 'Dell',
      sku: doc.sku || `SKU-${doc._id.toString().substring(18).toUpperCase()}`,
      stock: doc.stock !== undefined ? doc.stock : 10,
      status: doc.status || 'PUBLISHED',
      description: doc.description || 'High quality IT equipment with full warranty.',
      mrp: doc.mrp !== undefined ? doc.mrp : doc.numericPrice,
      discount: doc.discount !== undefined ? doc.discount : 0,
      sellerName: doc.sellerName || 'Apex Tech Systems Pvt Ltd',
      sellerLocation: doc.sellerLocation || 'Nehru Place, New Delhi, Delhi',
      sellerRating: doc.sellerRating || 4.8,
      sellerVerified: doc.sellerVerified !== undefined ? doc.sellerVerified : true,
      sellerTrustScore: doc.sellerTrustScore || 'Verified TrustSEAL'
    }));

    const formattedCategories = categoriesDoc.map((c: any) => ({
      id: c._id.toString(),
      name: c.name,
      image: c.image || '/images/category_electronics.png',
      link: `/products?category=${encodeURIComponent(c.name)}`,
      slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-')
    }));

    return {
      products: formattedProducts,
      total: totalCount || formattedProducts.length,
      categories: formattedCategories.length > 0 ? formattedCategories : FALLBACK_SSR_CATEGORIES,
      brands: brandsDoc || []
    };
  } catch (error) {
    console.warn('Failed to load initial products in SSR, serving fallbacks:', error);
    return {
      products: FALLBACK_SSR_PRODUCTS,
      total: 14592,
      categories: FALLBACK_SSR_CATEGORIES,
      brands: []
    };
  }
}

/**
 * Server-side loader for Verified Suppliers SSR
 */
export async function getInitialSuppliersData(limit = 24) {
  try {
    const db = await getDbWithTimeout();
    const collection = db.collection('sellers');

    const [sellersDocs, total] = await Promise.all([
      collection
        .find({ status: { $ne: 'SUSPENDED' } })
        .sort({ rating: -1, reviewCount: -1 })
        .limit(limit)
        .toArray(),
      collection.countDocuments().catch(() => 1000)
    ]);

    if (!sellersDocs || sellersDocs.length === 0) {
      return {
        sellers: FALLBACK_SSR_SELLERS,
        total: 4,
        totalPages: 1
      };
    }

    const sellers = sellersDocs.map((s: any) => ({
      id: s._id.toString(),
      name: s.name,
      mainCategory: s.mainCategory || 'Electronics',
      location: s.location || 'New Delhi, Delhi',
      rating: s.rating || 4.8,
      reviewCount: s.reviewCount || 50,
      verified: s.verified !== undefined ? s.verified : true,
      memberSince: s.memberSince || '2019',
      gstNumber: s.gstNumber || '07AABCA1234F1Z5',
      responseTime: s.responseTime || '< 2 Hours',
      responseRate: s.responseRate || '96%',
      natureOfBusiness: s.natureOfBusiness || 'Wholesaler & Authorized Stockist',
      contactPerson: s.contactPerson || 'Authorized Representative',
      phone: s.phone || '+91 98110 24890',
      email: s.email || 'info@valnqix.in',
      trustScore: s.trustScore || 'Verified TrustSEAL',
      status: s.status || 'ACTIVE'
    }));

    return {
      sellers,
      total: total || sellers.length,
      totalPages: Math.ceil((total || sellers.length) / limit)
    };
  } catch (error) {
    console.warn('Failed to load initial suppliers in SSR, serving fallbacks:', error);
    return {
      sellers: FALLBACK_SSR_SELLERS,
      total: 1000,
      totalPages: Math.ceil(1000 / limit)
    };
  }
}

/**
 * Server-side loader for Blog List SSR
 */
export async function getInitialBlogsData() {
  try {
    const db = await getDbWithTimeout();
    const collection = db.collection('blogs');

    const blogs = await collection
      .find({ status: 'Published' })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(12)
      .toArray();

    if (!blogs || blogs.length === 0) {
      return FALLBACK_SSR_BLOGS;
    }

    return blogs.map((doc: any) => ({
      id: doc._id.toString(),
      tag: doc.tag || 'Laptops & Computers',
      title: doc.title,
      excerpt: doc.excerpt || '',
      image: doc.image || 'https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png',
      link: `/blog/${doc._id.toString()}`,
      category: doc.category || 'Laptops & Computers',
      tags: doc.tags || '',
      authorName: doc.authorName || 'Admin Team',
      createdAt: doc.createdAt
    }));
  } catch (error) {
    console.warn('Failed to load initial blogs in SSR, serving fallbacks:', error);
    return FALLBACK_SSR_BLOGS;
  }
}

/**
 * Server-side loader for Home Page SSR components
 */
export async function getHomeInitialData() {
  try {
    const [productsData, categories, blogs] = await Promise.all([
      getInitialProductsData(20),
      getInitialCategories(),
      getInitialBlogsData()
    ]);

    const allProducts = productsData.products;
    const bestSelling = allProducts.slice(0, 8);
    const columnsProducts = allProducts.slice(0, 12);

    return {
      categories: categories.length > 0 ? categories : FALLBACK_SSR_CATEGORIES,
      bestSelling: bestSelling.length > 0 ? bestSelling : FALLBACK_SSR_PRODUCTS.slice(0, 8),
      columnsProducts: columnsProducts.length > 0 ? columnsProducts : FALLBACK_SSR_PRODUCTS,
      blogs: blogs.length > 0 ? blogs : FALLBACK_SSR_BLOGS
    };
  } catch (error) {
    console.warn('Failed to load home data in SSR:', error);
    return {
      categories: FALLBACK_SSR_CATEGORIES,
      bestSelling: FALLBACK_SSR_PRODUCTS.slice(0, 8),
      columnsProducts: FALLBACK_SSR_PRODUCTS,
      blogs: FALLBACK_SSR_BLOGS
    };
  }
}

export async function getInitialCategories() {
  try {
    const db = await getDbWithTimeout();
    const categories = await db.collection('categories').find({}).toArray();

    const isGarbageCategory = (name: string) => {
      if (!name || typeof name !== 'string') return true;
      const str = name.trim();
      if (str.length === 0 || str.length > 40) return true;
      if (/^https?:\/\//i.test(str)) return true;
      if (/www\./i.test(str)) return true;
      if (/\.(com|org|net|html|php|jpg|png|jpeg)\b/i.test(str)) return true;
      if (/%25|%20|\/c\/product|\.p\?/i.test(str)) return true;
      if (/^\d{4}-\d{2}-\d{2}/.test(str)) return true;
      if (/^(true|false|undefined|null|none|n\/a)$/i.test(str)) return true;
      if (/^[A-Z0-9]{10}$/.test(str)) return true;
      return false;
    };

    const valid = categories.filter((c: any) => !isGarbageCategory(c.name));
    return valid.map((doc: any) => ({
      id: doc._id.toString(),
      name: doc.name,
      image: doc.image || '/images/category_electronics.png',
      link: `/products?category=${encodeURIComponent(doc.name)}`,
      slug: doc.slug || doc.name.toLowerCase().replace(/\s+/g, '-')
    }));
  } catch (err) {
    return FALLBACK_SSR_CATEGORIES;
  }
}
