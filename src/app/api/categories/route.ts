import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('categories');

    // Clean up existing seeded 'Software' category
    await collection.deleteOne({ name: 'Software' });

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

    const categories = await collection.find().toArray();
    const cleanCategories = categories.filter(c => !isGarbageCategory(c.name));

    const formatted = cleanCategories.map(doc => ({
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

