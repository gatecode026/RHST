import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { PUBLIC_API_CACHE_HEADERS } from '@/lib/cacheHeaders';

export const dynamic = 'force-dynamic';

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
      }, { headers: PUBLIC_API_CACHE_HEADERS });
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

    return NextResponse.json({
      success: true,
      products: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    }, { headers: PUBLIC_API_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
