import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, subtotal, customer, couponCode, discountApplied } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot checkout with an empty cart.' },
        { status: 400 }
      );
    }

    if (!customer || !customer.name || !customer.email || !customer.phone || !customer.address) {
      return NextResponse.json(
        { success: false, error: 'Customer name, email, phone, and address are required to checkout.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const productsCollection = db.collection('products');

    // 1. Verify stock for all items in the cart
    const bsLookup: Record<string, string> = {
      'bs-1': 'IPad (9th Gen)',
      'bs-2': 'Gaming Mouse',
      'bs-3': 'CPU',
      'bs-4': 'Ultra HD TV',
      'bs-5': 'Smart Watch',
      'bs-6': 'Wireless Headphones'
    };

    for (const item of items) {
      let query: any = {};
      const isObjectId = typeof item.id === 'string' && item.id.match(/^[0-9a-fA-F]{24}$/);
      
      const bsName = typeof item.id === 'string' && item.id.startsWith('bs-') ? bsLookup[item.id] : null;

      if (isObjectId) {
        query = { _id: new ObjectId(item.id) };
      } else if (bsName) {
        query = { name: bsName };
      } else {
        query = { id: String(item.id) };
      }

      const prod = await productsCollection.findOne(query);
      if (prod) {
        const currentStock = typeof prod.stock === 'number' ? prod.stock : parseInt(prod.stock || '0', 10);
        if (currentStock < item.qty) {
          return NextResponse.json(
            { success: false, error: `Insufficient stock for "${item.name}". Only ${currentStock} units are available.` },
            { status: 400 }
          );
        }
      } else {
        // Mock products fallback stock validation
        const mockStock = 12;
        if (mockStock < item.qty) {
          return NextResponse.json(
            { success: false, error: `Insufficient stock for "${item.name}". Only ${mockStock} units are available.` },
            { status: 400 }
          );
        }
      }
    }

    // 2. Decrement stock for items found in the database
    for (const item of items) {
      let query: any = {};
      const isObjectId = typeof item.id === 'string' && item.id.match(/^[0-9a-fA-F]{24}$/);
      
      const bsName = typeof item.id === 'string' && item.id.startsWith('bs-') ? bsLookup[item.id] : null;

      if (isObjectId) {
        query = { _id: new ObjectId(item.id) };
      } else if (bsName) {
        query = { name: bsName };
      } else {
        query = { id: String(item.id) };
      }

      const exists = await productsCollection.countDocuments(query);
      if (exists > 0) {
        await productsCollection.updateOne(query, { $inc: { stock: -item.qty } });
      }
    }

    const orderId = 'ORD-' + Date.now().toString().substring(6) + '-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder = {
      orderId, // Custom human-readable order ID
      items,
      subtotal,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      },
      couponCode: couponCode || null,
      discountApplied: discountApplied || 0,
      paymentMethod: body.paymentMethod || 'Direct bank transfer',
      status: 'Pending',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString()
    };

    await db.collection('orders').insertOne(newOrder);

    if (couponCode) {
      await db.collection('coupons').updateOne(
        { code: couponCode.toUpperCase() },
        { $inc: { usageCount: 1 } }
      );
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error('Error handling checkout:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
