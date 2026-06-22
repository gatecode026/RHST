import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('brands');
    const brands = await collection.find().toArray();
    const formatted = brands.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug || doc.name.toLowerCase().replace(/\s+/g, '-'),
      description: doc.description || '',
      image: doc.image || '/images/default_brand.png',
      status: doc.status || 'Visible'
    }));
    return NextResponse.json({ success: true, brands: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
