import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_PROMO_BANNER = {
  badgeText: '⚡ Limited Time Offer',
  title: 'Summer Gaming Upgrade Sale',
  description: 'Get up to 40% off on all RTX 40-series graphics cards and premium gaming peripherals.',
  buttonText: 'Shop the Sale',
  buttonLink: '/shop',
  imageUrl: 'https://images.unsplash.com/photo-15872023775-e29f172b9d7a',
  expiryDate: '2026-09-30T23:59:00.000Z',
  isActive: true
};

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('promo_banner');

    let banner = await collection.findOne({});
    if (!banner) {
      const result = await collection.insertOne(DEFAULT_PROMO_BANNER);
      banner = {
        _id: result.insertedId,
        ...DEFAULT_PROMO_BANNER
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
