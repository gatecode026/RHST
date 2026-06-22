import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { logActivity } from '@/lib/activity';

export async function GET() {
  try {
    const db = await getDb();
    const banners = await db.collection('banners').find().toArray();
    
    const formatted = banners.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      subtitle: doc.subtitle,
      ctaText: doc.ctaText,
      image: doc.image,
      theme: doc.theme,
      link: doc.link
    }));

    return NextResponse.json({ success: true, banners: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, ctaText, image, theme, link } = body;

    if (!title || !image) {
      return NextResponse.json({ success: false, error: 'Title and Image URL are required.' }, { status: 400 });
    }

    const newBanner = {
      title,
      subtitle: subtitle || '',
      ctaText: ctaText || 'Learn More',
      image,
      theme: theme || 'light',
      link: link || '#products'
    };

    const db = await getDb();
    const result = await db.collection('banners').insertOne(newBanner);

    await logActivity('Created Banner', `Title: "${title}"`);

    return NextResponse.json({
      success: true,
      banner: {
        id: result.insertedId.toString(),
        ...newBanner
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Banner ID is required.' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('banners');

    const banner = await collection.findOne({ _id: new ObjectId(id) });
    if (!banner) {
      return NextResponse.json({ success: false, error: 'Banner not found.' }, { status: 404 });
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    await logActivity('Deleted Banner', `Title: "${banner.title}"`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
