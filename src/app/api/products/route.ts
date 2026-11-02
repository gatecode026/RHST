import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ensureSellersSeeded, assignSellersToProducts } from '@/lib/sellers';

export const dynamic = 'force-dynamic';

const DEFAULT_PRODUCTS = [
  {
    name: 'IPad (9th Gen)',
    mrp: 135000,
    discount: 7,
    price: '₹1,25,000',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
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

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection('products');

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

    const allParam = searchParams.get('all') === 'true';
    const limitParam = searchParams.get('limit');
    let limit = 24;
    if (allParam) {
      limit = 200;
    } else if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      limit = Math.min(Math.max(1, isNaN(parsedLimit) ? 24 : parsedLimit), 200);
    }

    const bannerParam = searchParams.get('banner') === 'true';
    const columnsParam = searchParams.get('columns') === 'true';
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const sellerParam = searchParams.get('seller');
    const searchParam = (searchParams.get('search') || searchParams.get('q') || '').trim();
    const priceRangeParam = searchParams.get('priceRange');
    const sortParam = searchParams.get('sort') || 'default';
    const featuredParam = searchParams.get('featured');
    const onOfferParam = searchParams.get('onOffer');
    const facetsParam = searchParams.get('facets') === 'true';

    const escapeRegex = (s: string) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

    // Build filter
    const filter: any = {};

    if (categoryParam && categoryParam !== 'All') {
      filter.category = { $regex: new RegExp(`^${escapeRegex(categoryParam)}$`, 'i') };
    }

    if (brandParam && brandParam !== 'All') {
      filter.brand = { $regex: new RegExp(`^${escapeRegex(brandParam)}$`, 'i') };
    }

    if (sellerParam && sellerParam !== 'All') {
      filter.sellerName = { $regex: new RegExp(`^${escapeRegex(sellerParam)}$`, 'i') };
    }

    if (featuredParam === 'true') {
      filter.featured = true;
    }

    if (onOfferParam === 'true') {
      filter.onOffer = true;
    }

    if (searchParam) {
      const sReg = { $regex: escapeRegex(searchParam), $options: 'i' };
      filter.$or = [
        { name: sReg },
        { category: sReg },
        { brand: sReg },
        { sellerName: sReg }
      ];
    }

    // Price range filter
    if (priceRangeParam) {
      if (priceRangeParam === 'less15') {
        filter.numericPrice = { $lt: 15000 };
      } else if (priceRangeParam === '15_25') {
        filter.numericPrice = { $gte: 15000, $lte: 25000 };
      } else if (priceRangeParam === '25_50') {
        filter.numericPrice = { $gte: 25000, $lte: 50000 };
      } else if (priceRangeParam === '50_75') {
        filter.numericPrice = { $gte: 50000, $lte: 75000 };
      } else if (priceRangeParam === '75_100') {
        filter.numericPrice = { $gte: 75000, $lte: 100000 };
      } else if (priceRangeParam === '100_125') {
        filter.numericPrice = { $gte: 100000, $lte: 125000 };
      }
    }

    // Sort order
    let sortObj: any = { _id: -1 };
    if (sortParam === 'price_asc') {
      sortObj = { numericPrice: 1, _id: -1 };
    } else if (sortParam === 'price_desc') {
      sortObj = { numericPrice: -1, _id: -1 };
    } else if (sortParam === 'name_asc') {
      sortObj = { name: 1, _id: -1 };
    }

    // Projection for compact, fast response
    const projection = {
      _id: 1,
      slug: 1,
      name: 1,
      price: 1,
      mrp: 1,
      discount: 1,
      numericPrice: 1,
      image: 1,
      link: 1,
      category: 1,
      brand: 1,
      sku: 1,
      stock: 1,
      status: 1,
      description: 1,
      featured: 1,
      onOffer: 1,
      warranty: 1,
      lowStockThreshold: 1,
      sellerId: 1,
      sellerName: 1,
      sellerLocation: 1,
      sellerRating: 1,
      sellerVerified: 1,
      sellerMainCategory: 1,
      sellerTrustScore: 1
    };

    // Fast path for Banner/Slider or Product Columns:
    // Fetches candidates, deduplicates products by name to prevent repetitive cards,
    // ensures diverse categories, and skips expensive countDocuments scan.
    if (bannerParam || columnsParam) {
      const targetLimit = bannerParam ? Math.min(limit || 8, 12) : Math.min(limit || 12, 18);
      const candidateDocs = await collection
        .find({
          image: { $exists: true, $nin: ['', null, '/images/default_product.png'] }
        }, { projection })
        .sort({ _id: -1 })
        .limit(100)
        .toArray();

      const seenNames = new Set<string>();
      const seenCats = new Map<string, number>();
      const selectedDocs: any[] = [];

      for (const doc of candidateDocs) {
        const normName = (doc.name || '').trim().toLowerCase();
        if (!normName || seenNames.has(normName)) continue;

        const cat = (doc.category || 'General').trim().toLowerCase();
        const catCount = seenCats.get(cat) || 0;
        // Limit to at most 2 items per category for banner diversity
        if (catCount >= 2 && candidateDocs.length > 20) continue;

        seenNames.add(normName);
        seenCats.set(cat, catCount + 1);
        selectedDocs.push(doc);

        if (selectedDocs.length >= targetLimit) break;
      }

      // If we need more unique items, fill from remaining candidate docs
      if (selectedDocs.length < targetLimit) {
        for (const doc of candidateDocs) {
          const normName = (doc.name || '').trim().toLowerCase();
          if (normName && !seenNames.has(normName)) {
            seenNames.add(normName);
            selectedDocs.push(doc);
            if (selectedDocs.length >= targetLimit) break;
          }
        }
      }

      const formattedBanner = selectedDocs.map(doc => ({
        id: doc._id.toString(),
        slug: doc.slug || doc.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
        name: doc.name,
        price: doc.price || `₹${(doc.numericPrice || 0).toLocaleString('en-IN')}`,
        image: doc.image || '/images/default_product.png',
        link: doc.link || ('#product-' + doc._id.toString()),
        category: doc.category || 'Electronics',
        brand: doc.brand || 'Dell',
        sku: doc.sku || ('SKU-' + doc._id.toString().substring(18).toUpperCase()),
        stock: doc.stock !== undefined ? doc.stock : 10,
        status: doc.status || 'PUBLISHED',
        description: doc.description || '',
        mrp: doc.mrp !== undefined ? doc.mrp : (doc.numericPrice || 0),
        discount: doc.discount !== undefined ? doc.discount : 0,
        featured: doc.featured !== undefined ? doc.featured : false,
        onOffer: doc.onOffer !== undefined ? doc.onOffer : false,
        warranty: doc.warranty !== undefined ? doc.warranty : 0,
        lowStockThreshold: doc.lowStockThreshold !== undefined ? doc.lowStockThreshold : 10,
        sellerId: doc.sellerId || 'seller-default',
        sellerName: doc.sellerName || 'Apex Tech Systems Pvt Ltd',
        sellerLocation: doc.sellerLocation || 'Jaipur, Rajasthan',
        sellerRating: doc.sellerRating || 4.8,
        sellerVerified: doc.sellerVerified !== undefined ? doc.sellerVerified : true,
        sellerMainCategory: doc.sellerMainCategory || doc.category || 'Electronics',
        sellerTrustScore: doc.sellerTrustScore || 'Verified TrustSEAL'
      }));

      return NextResponse.json({
        success: true,
        products: formattedBanner,
        pagination: {
          total: formattedBanner.length,
          page: 1,
          limit: targetLimit,
          totalPages: 1
        }
      });
    }

    const hasPageParam = searchParams.has('page');
    const needCount = hasPageParam || searchParams.get('count') === 'true';

    let total = 0;
    let rawProducts: any[] = [];

    if (needCount) {
      const isFiltered = Object.keys(filter).length > 0;
      const countPromise = isFiltered
        ? collection.countDocuments(filter)
        : collection.estimatedDocumentCount();

      [total, rawProducts] = await Promise.all([
        countPromise,
        collection.find(filter, { projection })
          .sort(sortObj)
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray()
      ]);
    } else {
      rawProducts = await collection.find(filter, { projection })
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
      total = rawProducts.length;
    }

    const formatted = rawProducts.map(doc => ({
      id: doc._id.toString(),
      slug: doc.slug || doc.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
      name: doc.name,
      price: doc.price || `₹${(doc.numericPrice || 0).toLocaleString('en-IN')}`,
      image: doc.image || '/images/default_product.png',
      link: doc.link || ('#product-' + doc._id.toString()),
      category: doc.category || 'Electronics',
      brand: doc.brand || 'Dell',
      sku: doc.sku || ('SKU-' + doc._id.toString().substring(18).toUpperCase()),
      stock: doc.stock !== undefined ? doc.stock : 10,
      status: doc.status || 'PUBLISHED',
      description: doc.description || '',
      mrp: doc.mrp !== undefined ? doc.mrp : (doc.numericPrice || 0),
      discount: doc.discount !== undefined ? doc.discount : 0,
      featured: doc.featured !== undefined ? doc.featured : false,
      onOffer: doc.onOffer !== undefined ? doc.onOffer : false,
      warranty: doc.warranty !== undefined ? doc.warranty : 0,
      lowStockThreshold: doc.lowStockThreshold !== undefined ? doc.lowStockThreshold : 10,
      sellerId: doc.sellerId || 'seller-default',
      sellerName: doc.sellerName || 'Apex Tech Systems Pvt Ltd',
      sellerLocation: doc.sellerLocation || 'Jaipur, Rajasthan',
      sellerRating: doc.sellerRating || 4.8,
      sellerVerified: doc.sellerVerified !== undefined ? doc.sellerVerified : true,
      sellerMainCategory: doc.sellerMainCategory || doc.category || 'Electronics',
      sellerTrustScore: doc.sellerTrustScore || 'Verified TrustSEAL'
    }));

    let facetsData: any = null;
    if (facetsParam) {
      try {
        const facetRes = await collection.aggregate([
          {
            $facet: {
              categories: [
                { $group: { _id: "$category", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
              ],
              brands: [
                { $group: { _id: "$brand", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 30 }
              ]
            }
          }
        ]).toArray();
        if (facetRes && facetRes[0]) {
          facetsData = facetRes[0];
        }
      } catch (fErr) {
        console.warn('Facets computation error:', fErr);
      }
    }

    return NextResponse.json({
      success: true,
      products: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      },
      ...(facetsData ? { facets: facetsData } : {})
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
