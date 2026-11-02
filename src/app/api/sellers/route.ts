import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection('sellers');
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limitParam = parseInt(searchParams.get('limit') || '50', 10);
    const limit = Math.min(Math.max(1, isNaN(limitParam) ? 50 : limitParam), 200);

    const filter: any = {};
    if (category && category !== 'All') {
      filter.mainCategory = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    const sellers = await collection.find(filter, {
      projection: {
        name: 1,
        mainCategory: 1,
        location: 1,
        rating: 1,
        reviewCount: 1,
        verified: 1,
        gstNumber: 1,
        trustScore: 1,
        status: 1
      }
    }).limit(limit).toArray();

    const formatted = sellers.map(s => ({
      id: s._id.toString(),
      name: s.name,
      mainCategory: s.mainCategory,
      location: s.location,
      rating: s.rating,
      reviewCount: s.reviewCount,
      verified: s.verified !== undefined ? s.verified : true,
      gstNumber: s.gstNumber || '',
      trustScore: s.trustScore || 'Verified TrustSEAL',
      status: s.status || 'Active'
    }));

    return NextResponse.json({ success: true, sellers: formatted });
  } catch (error: any) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

