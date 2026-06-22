import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_BANNERS = [
  {
    title: 'Powering Your Digital World With Reliable IT Solutions',
    subtitle: 'Limited stocks available. Grab it now!',
    ctaText: 'Shop Collection',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/IMG.png?updatedAt=1781696174888',
    theme: 'light',
    link: '#products'
  },
  {
    title: 'Immersive Gaming with the Play Station 5',
    subtitle: 'Experience lightning-fast load times, 3D audio, and an all-new generation of incredible games.',
    ctaText: 'Explore Gaming',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/IMG.png?updatedAt=1781696174888',
    theme: 'light',
    link: '#products'
  },
  {
    title: 'Studio Quality Audio Wherever You Go',
    subtitle: 'Step into premium sound with wireless noise-cancelling headphones tuned to perfection.',
    ctaText: 'Discover Headsets',
    image: 'https://ik.imagekit.io/zp0tch54w/RHST/IMG.png?updatedAt=1781696174888',
    theme: 'light',
    link: '#products'
  }
];

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('banners');

    // Count banners
    const count = await collection.countDocuments();
    if (count === 0) {
      // Seed banners
      await collection.insertMany(DEFAULT_BANNERS);
    } else {
      // Migrate existing seeded banners to the new image URL if they still use the old placeholder
      await collection.updateMany(
        { image: '/images/laptop.png' },
        { $set: { image: 'https://ik.imagekit.io/zp0tch54w/RHST/IMG.png?updatedAt=1781696174888' } }
      );
    }

    const banners = await collection.find().toArray();
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
