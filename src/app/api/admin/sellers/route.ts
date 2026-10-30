import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { logActivity } from '@/lib/activity';
import { ensureSellersSeeded } from '@/lib/sellers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Ensure initial sellers are seeded if collection is empty
    await ensureSellersSeeded();

    const db = await getDb();
    let query: any = {};

    if (category && category !== 'All') {
      query.mainCategory = { $regex: new RegExp('^' + category + '$', 'i') };
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { location: regex },
        { mainCategory: regex },
        { contactPerson: regex },
        { gstNumber: regex }
      ];
    }

    const sellers = await db
      .collection('sellers')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = sellers.map((s) => ({
      id: s._id.toString(),
      name: s.name,
      mainCategory: s.mainCategory || 'General',
      location: s.location || 'India',
      rating: s.rating || 4.8,
      reviewCount: s.reviewCount || 100,
      verified: s.verified !== undefined ? s.verified : true,
      memberSince: s.memberSince || '2016',
      gstNumber: s.gstNumber || '',
      responseTime: s.responseTime || '< 2 Hours',
      responseRate: s.responseRate || '96%',
      natureOfBusiness: s.natureOfBusiness || 'Verified Supplier',
      contactPerson: s.contactPerson || '',
      phone: s.phone || '',
      email: s.email || '',
      trustScore: s.trustScore || 'Verified TrustSEAL',
      status: s.status || 'Active'
    }));

    return NextResponse.json({ success: true, sellers: formatted });
  } catch (error: any) {
    console.error('Error fetching admin sellers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      mainCategory,
      location,
      phone,
      email,
      gstNumber,
      contactPerson,
      natureOfBusiness,
      trustScore,
      rating,
      responseTime
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Seller name is required.' }, { status: 400 });
    }

    if (!mainCategory || !mainCategory.trim()) {
      return NextResponse.json({ success: false, error: 'Main category is required.' }, { status: 400 });
    }

    const db = await getDb();
    const sellersColl = db.collection('sellers');

    const newSeller = {
      name: name.trim(),
      mainCategory: mainCategory.trim(),
      location: location ? location.trim() : 'India',
      phone: phone ? phone.trim() : '',
      email: email ? email.trim().toLowerCase() : '',
      gstNumber: gstNumber ? gstNumber.trim().toUpperCase() : '',
      contactPerson: contactPerson ? contactPerson.trim() : '',
      natureOfBusiness: natureOfBusiness || 'Wholesale Supplier & Manufacturer',
      trustScore: trustScore || 'Verified TrustSEAL',
      rating: rating ? Number(rating) : 4.8,
      reviewCount: 50,
      verified: true,
      memberSince: new Date().getFullYear().toString(),
      responseTime: responseTime || '< 2 Hours',
      responseRate: '98%',
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    const result = await sellersColl.insertOne(newSeller);
    await logActivity('Created Seller', `Added new supplier: ${newSeller.name} in category ${newSeller.mainCategory}`);

    return NextResponse.json({
      success: true,
      seller: {
        id: result.insertedId.toString(),
        ...newSeller
      }
    });
  } catch (error: any) {
    console.error('Error creating seller:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      mainCategory,
      location,
      phone,
      email,
      gstNumber,
      contactPerson,
      natureOfBusiness,
      trustScore,
      status
    } = body;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Valid Seller ID is required.' }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Seller name is required.' }, { status: 400 });
    }

    const db = await getDb();
    const sellersColl = db.collection('sellers');
    const productsColl = db.collection('products');

    const updateData: any = {
      name: name.trim(),
      mainCategory: (mainCategory || 'General').trim(),
      location: (location || 'India').trim(),
      phone: phone ? phone.trim() : '',
      email: email ? email.trim().toLowerCase() : '',
      gstNumber: gstNumber ? gstNumber.trim().toUpperCase() : '',
      contactPerson: contactPerson ? contactPerson.trim() : '',
      natureOfBusiness: natureOfBusiness || 'Verified Supplier',
      trustScore: trustScore || 'Verified TrustSEAL',
      status: status || 'Active',
      updatedAt: new Date().toISOString()
    };

    const result = await sellersColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Seller not found.' }, { status: 404 });
    }

    // Propagate updated seller name, location and category to all assigned products
    await productsColl.updateMany(
      { sellerId: id },
      {
        $set: {
          sellerName: updateData.name,
          sellerLocation: updateData.location,
          sellerMainCategory: updateData.mainCategory,
          sellerGst: updateData.gstNumber,
          sellerTrustScore: updateData.trustScore,
          sellerPhone: updateData.phone,
          sellerEmail: updateData.email
        }
      }
    );

    await logActivity('Updated Seller', `Updated supplier details for ${updateData.name}`);

    return NextResponse.json({
      success: true,
      seller: { id, ...updateData }
    });
  } catch (error: any) {
    console.error('Error updating seller:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Valid Seller ID is required.' }, { status: 400 });
    }

    const db = await getDb();
    const seller = await db.collection('sellers').findOne({ _id: new ObjectId(id) });
    const sellerName = seller?.name || 'Seller';

    await db.collection('sellers').deleteOne({ _id: new ObjectId(id) });

    // Clean up products pointing to deleted seller
    await db.collection('products').updateMany(
      { sellerId: id },
      { $unset: { sellerId: '', sellerName: '', sellerLocation: '', sellerGst: '' } }
    );

    await logActivity('Deleted Seller', `Deleted seller: ${sellerName} (ID: ${id})`);

    return NextResponse.json({ success: true, message: `Seller ${sellerName} deleted successfully.` });
  } catch (error: any) {
    console.error('Error deleting seller:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

