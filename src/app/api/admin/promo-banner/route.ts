import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('promo_banner');

    let banner = await collection.findOne({});
    if (!banner) {
      const defaultBanner = {
        badgeText: '⚡ Limited Time Offer',
        title: 'Summer Gaming Upgrade Sale',
        description: 'Get up to 40% off on all RTX 40-series graphics cards and premium gaming peripherals.',
        buttonText: 'Shop the Sale',
        buttonLink: '/shop',
        imageUrl: 'https://images.unsplash.com/photo-15872023775-e29f172b9d7a',
        expiryDate: '2026-09-30T23:59:00.000Z',
        isActive: true
      };
      const result = await collection.insertOne(defaultBanner);
      banner = {
        _id: result.insertedId,
        ...defaultBanner
      };
    }

    const formatted = {
      id: banner._id.toString(),
      badgeText: banner.badgeText,
      title: banner.title,
      description: banner.description,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      imageUrl: banner.imageUrl,
      expiryDate: banner.expiryDate,
      isActive: banner.isActive
    };

    return NextResponse.json({ success: true, banner: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { badgeText, title, description, buttonText, buttonLink, imageUrl, expiryDate, isActive } = body;

    const db = await getDb();
    const collection = db.collection('promo_banner');

    const updateData = {
      badgeText: badgeText || '',
      title: title || '',
      description: description || '',
      buttonText: buttonText || '',
      buttonLink: buttonLink || '',
      imageUrl: imageUrl || '',
      expiryDate: expiryDate || '',
      isActive: typeof isActive === 'boolean' ? isActive : true
    };

    // Update the first document or insert if not found
    const banner = await collection.findOne({});
    if (banner) {
      await collection.updateOne({ _id: banner._id }, { $set: updateData });
    } else {
      await collection.insertOne(updateData);
    }

    await logActivity('Edit Promo Banner', `Updated promo banner: "${title}"`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
