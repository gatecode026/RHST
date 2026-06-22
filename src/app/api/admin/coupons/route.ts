import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { logActivity } from '@/lib/activity';

export async function GET() {
  try {
    const db = await getDb();
    const coupons = await db.collection('coupons').find().toArray();
    
    const formatted = coupons.map(doc => ({
      id: doc._id.toString(),
      code: doc.code,
      discount: doc.discount,
      type: doc.type,
      isActive: doc.isActive,
      minPurchase: doc.minPurchase !== undefined ? doc.minPurchase : 0,
      usageLimit: doc.usageLimit !== undefined ? doc.usageLimit : 100,
      usageCount: doc.usageCount !== undefined ? doc.usageCount : 0,
      expiryDate: doc.expiryDate || ''
    }));

    return NextResponse.json({ success: true, coupons: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discount, type, isActive, minPurchase, usageLimit, expiryDate } = body;

    if (!code || discount === undefined || !type) {
      return NextResponse.json({ success: false, error: 'Code, discount value, and type are required.' }, { status: 400 });
    }

    const discountVal = Number(discount);
    const minPurchaseVal = minPurchase !== undefined ? Number(minPurchase) : 0;

    if (discountVal < 0) {
      return NextResponse.json({ success: false, error: 'Discount value cannot be negative.' }, { status: 400 });
    }

    if (type === 'fixed') {
      if (minPurchaseVal < discountVal) {
        return NextResponse.json({ success: false, error: 'Minimum purchase amount cannot be less than the fixed discount amount.' }, { status: 400 });
      }
    } else if (type === 'percentage') {
      if (discountVal > 100) {
        return NextResponse.json({ success: false, error: 'Percentage discount cannot be greater than 100%.' }, { status: 400 });
      }
    }

    if (expiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = new Date(expiryDate);
      if (expiry < today) {
        return NextResponse.json({ success: false, error: 'Expiry date cannot be in the past.' }, { status: 400 });
      }
    }

    const newCoupon = {
      code: code.toUpperCase().trim(),
      discount: discountVal,
      type, // 'percentage' | 'fixed'
      isActive: isActive !== undefined ? isActive : true,
      minPurchase: minPurchaseVal,
      usageLimit: usageLimit !== undefined ? Number(usageLimit) : 100,
      usageCount: 0,
      expiryDate: expiryDate || ''
    };

    const db = await getDb();
    const result = await db.collection('coupons').insertOne(newCoupon);

    await logActivity('Created Coupon', `Code: "${newCoupon.code}" (${discount}${type === 'percentage' ? '%' : ' INR'})`);

    return NextResponse.json({
      success: true,
      coupon: {
        id: result.insertedId.toString(),
        ...newCoupon
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
      return NextResponse.json({ success: false, error: 'Coupon ID is required.' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('coupons');

    const coupon = await collection.findOne({ _id: new ObjectId(id) });
    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Coupon not found.' }, { status: 404 });
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    await logActivity('Deleted Coupon', `Code: "${coupon.code}"`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
