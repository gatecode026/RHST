import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { logActivity } from '@/lib/activity';

const DEFAULT_SETTINGS = {
  shopName: 'VALNQIX - IT Solutions & Services',
  contactEmail: 'info@valnqix.in',
  contactPhone: '',
  contactAddress: 'G 52, UP, NOIDA, Uttar Pradesh, India 201301',
  taxRate: '18',
  shopHours: '9:00 AM - 7:00 PM, Mon-Sat'
};

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('settings');
    
    let settings = await collection.findOne({});
    if (!settings) {
      // Seed default settings
      const result = await collection.insertOne(DEFAULT_SETTINGS);
      settings = { _id: result.insertedId, ...DEFAULT_SETTINGS };
    }

    return NextResponse.json({
      success: true,
      settings: {
        id: settings._id.toString(),
        shopName: settings.shopName,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        contactAddress: settings.contactAddress,
        taxRate: settings.taxRate,
        shopHours: settings.shopHours
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shopName, contactEmail, contactPhone, contactAddress, taxRate, shopHours } = body;

    const db = await getDb();
    const collection = db.collection('settings');

    let settings = await collection.findOne({});
    const updateData = {
      shopName: shopName || DEFAULT_SETTINGS.shopName,
      contactEmail: contactEmail || DEFAULT_SETTINGS.contactEmail,
      contactPhone: contactPhone ?? DEFAULT_SETTINGS.contactPhone,
      contactAddress: contactAddress || DEFAULT_SETTINGS.contactAddress,
      taxRate: taxRate || DEFAULT_SETTINGS.taxRate,
      shopHours: shopHours || DEFAULT_SETTINGS.shopHours,
      updatedAt: new Date().toISOString()
    };

    if (settings) {
      await collection.updateOne({ _id: settings._id }, { $set: updateData });
    } else {
      await collection.insertOne(updateData);
    }

    await logActivity('Updated Shop Settings', `Shop Name: "${updateData.shopName}"`);

    return NextResponse.json({ success: true, settings: updateData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
