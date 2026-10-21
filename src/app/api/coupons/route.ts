import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_COUPONS = [
  { code: 'WELCOME10', discount: 10, type: 'percentage', isActive: true, minPurchase: 0, usageLimit: 100, usageCount: 0, expiryDate: '2026-12-31' },
  { code: 'VALNQIX15', discount: 15, type: 'percentage', isActive: true, minPurchase: 1000, usageLimit: 100, usageCount: 0, expiryDate: '2026-12-31' },
  { code: 'FLAT500', discount: 500, type: 'fixed', isActive: true, minPurchase: 3000, usageLimit: 50, usageCount: 0, expiryDate: '2026-12-31' }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const subtotal = Number(searchParams.get('subtotal') || 0);

    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code is required.' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('coupons');

    // Auto seed if empty
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(DEFAULT_COUPONS);
    }

    const coupon = await collection.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid or inactive coupon code.' }, { status: 404 });
    }

    // Validation 1: Expiry date check
    if (coupon.expiryDate) {
      const today = new Date();
      const expiry = new Date(coupon.expiryDate);
      expiry.setHours(23, 59, 59, 999);
      if (today > expiry) {
        return NextResponse.json({ success: false, error: 'This coupon code has expired.' }, { status: 400 });
      }
    }

    // Validation 2: Min Purchase check
    const minPurchaseVal = Number(coupon.minPurchase || 0);
    if (subtotal < minPurchaseVal) {
      return NextResponse.json({ 
        success: false, 
        error: `Minimum purchase of ₹${minPurchaseVal.toLocaleString()} is required for this coupon.` 
      }, { status: 400 });
    }

    // Validation 3: Usage limit check
    const usageLimitVal = Number(coupon.usageLimit || 100);
    const usageCountVal = Number(coupon.usageCount || 0);
    if (usageCountVal >= usageLimitVal) {
      return NextResponse.json({ success: false, error: 'This coupon usage limit has been reached.' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      coupon: {
        id: coupon._id.toString(),
        code: coupon.code,
        discount: coupon.discount,
        type: coupon.type,
        isActive: coupon.isActive,
        minPurchase: coupon.minPurchase,
        usageLimit: coupon.usageLimit,
        usageCount: coupon.usageCount,
        expiryDate: coupon.expiryDate
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
