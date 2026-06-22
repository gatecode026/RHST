import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
  { name: 'Networking', image: '/images/networking.png', link: '#networking' },
  { name: 'Hardware', image: '/images/hardware.png', link: '#hardware' },
  { name: 'Office Equipment', image: '/images/office.png', link: '#office-equipment' },
  { name: 'Gaming Products', image: '/images/gaming.png', link: '#gaming-products' },
  { name: 'Computer Access', image: '/images/default_category.png', link: '#computer-access' }
];

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('categories');

    // Clean up existing seeded 'Software' category
    await collection.deleteOne({ name: 'Software' });

    // Count categories
    const count = await collection.countDocuments();
    if (count === 0) {
      // Seed categories
      await collection.insertMany(DEFAULT_CATEGORIES);
    }

    const categories = await collection.find().toArray();
    const formatted = categories.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      image: doc.image,
      link: doc.link,
      slug: doc.slug || doc.name.toLowerCase().replace(/\s+/g, '-'),
      parentGroup: doc.parentGroup || 'None',
      description: doc.description || '',
      status: doc.status || 'Visible'
    }));

    return NextResponse.json({ success: true, categories: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
