import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection('sellers');
    const { searchParams } = new URL(request.url);

    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

    const limitParam = parseInt(searchParams.get('limit') || '24', 10);
    const limit = Math.min(Math.max(1, isNaN(limitParam) ? 24 : limitParam), 100);

    const category = searchParams.get('category');
    const state = searchParams.get('state');
    const search = (searchParams.get('search') || searchParams.get('q') || '').trim();
    const sort = searchParams.get('sort') || 'rating';

    const escapeRegex = (s: string) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

    const filter: any = {};
    if (category && category !== 'All') {
      filter.mainCategory = { $regex: new RegExp(`^${escapeRegex(category)}$`, 'i') };
    }

    if (state && state !== 'All') {
      filter.location = { $regex: new RegExp(escapeRegex(state), 'i') };
    }

    if (search) {
      const sReg = { $regex: escapeRegex(search), $options: 'i' };
      filter.$or = [
        { name: sReg },
        { location: sReg },
        { contactPerson: sReg },
        { gstNumber: sReg },
        { mainCategory: sReg }
      ];
    }

    let sortObj: any = { rating: -1, reviewCount: -1, _id: -1 };
    if (sort === 'reviews') {
      sortObj = { reviewCount: -1, _id: -1 };
    } else if (sort === 'name') {
      sortObj = { name: 1, _id: -1 };
    } else if (sort === 'memberSince') {
      sortObj = { memberSince: 1, _id: -1 };
    }

    const projection = {
      name: 1,
      mainCategory: 1,
      location: 1,
      rating: 1,
      reviewCount: 1,
      verified: 1,
      gstNumber: 1,
      responseTime: 1,
      responseRate: 1,
      natureOfBusiness: 1,
      contactPerson: 1,
      phone: 1,
      email: 1,
      trustScore: 1,
      memberSince: 1,
      status: 1
    };

    const isFiltered = Object.keys(filter).length > 0;
    const countPromise = isFiltered
      ? collection.countDocuments(filter)
      : collection.estimatedDocumentCount();

    const [total, sellers] = await Promise.all([
      countPromise,
      collection.find(filter, { projection })
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray()
    ]);

    const formatted = sellers.map(s => ({
      id: s._id.toString(),
      name: s.name,
      mainCategory: s.mainCategory || 'Electronics',
      location: s.location || 'India',
      rating: s.rating !== undefined ? s.rating : 4.8,
      reviewCount: s.reviewCount !== undefined ? s.reviewCount : 120,
      verified: s.verified !== undefined ? s.verified : true,
      memberSince: s.memberSince || '2016',
      gstNumber: s.gstNumber || '',
      responseTime: s.responseTime || '< 2 Hours',
      responseRate: s.responseRate || '96%',
      natureOfBusiness: s.natureOfBusiness || 'Authorized Wholesale Supplier',
      contactPerson: s.contactPerson || 'Sales Desk',
      phone: s.phone || '+91 98290 12345',
      email: s.email || 'supplier@valnqix.com',
      trustScore: s.trustScore || 'Verified TrustSEAL',
      status: s.status || 'Active'
    }));

    return NextResponse.json({
      success: true,
      sellers: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error: any) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

