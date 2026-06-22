import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { logActivity } from '@/lib/activity';

export async function GET() {
  try {
    const db = await getDb();
    const orders = await db.collection('orders').find().toArray();
    
    const formatted = orders.map(doc => ({
      id: doc._id.toString(),
      orderId: doc.orderId || doc._id.toString(),
      items: doc.items || [],
      subtotal: doc.subtotal || 0,
      customer: doc.customer || { name: 'Guest', email: '', phone: '', address: '' },
      couponCode: doc.couponCode || null,
      discountApplied: doc.discountApplied || 0,
      status: doc.status || 'Pending',
      paymentStatus: doc.paymentStatus || 'PENDING',
      createdAt: doc.createdAt
    }));

    return NextResponse.json({ success: true, orders: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required.' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('orders');

    // Find first by orderId or ObjectId
    let order = await collection.findOne({ orderId: id });
    let filter: any = { orderId: id };

    if (!order && id.length === 24) {
      const { ObjectId } = require('mongodb');
      try {
        order = await collection.findOne({ _id: new ObjectId(id) });
        filter = { _id: new ObjectId(id) };
      } catch (e) {}
    }

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
    }

    const updateFields: any = {};
    if (status !== undefined) updateFields.status = status;
    if (paymentStatus !== undefined) updateFields.paymentStatus = paymentStatus;

    await collection.updateOne(filter, { $set: updateFields });

    await logActivity(
      'Updated Order Status',
      `Order: "${order.orderId || id}". Status: "${status || order.status}", Payment: "${paymentStatus || order.paymentStatus}"`
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required.' }, { status: 400 });
    }

    const db = await getDb();
    // Try to delete by orderId (custom) first, otherwise fallback to _id
    let result = await db.collection('orders').deleteOne({ orderId: id });
    
    // Fallback if deletedCount is 0 (check if id is a valid ObjectId)
    if (result.deletedCount === 0 && id.length === 24) {
      try {
        const { ObjectId } = require('mongodb');
        result = await db.collection('orders').deleteOne({ _id: new ObjectId(id) });
      } catch (e) {}
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
    }

    await logActivity('Deleted Order', `Order ID: "${id}"`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
