import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { logActivity } from '@/lib/activity';

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('brands');
    const brands = await collection.find().toArray();
    const formatted = brands.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug || doc.name.toLowerCase().replace(/\s+/g, '-'),
      description: doc.description || '',
      image: doc.image || '/images/default_brand.png',
      status: doc.status || 'Visible'
    }));
    return NextResponse.json({ success: true, brands: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, image } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Brand name is required.' }, { status: 400 });
    }

    const calculatedSlug = slug ? slug.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    const newBrand = {
      name,
      slug: calculatedSlug,
      description: description || '',
      image: image || '/images/default_brand.png',
      status: 'Visible'
    };

    const db = await getDb();
    const result = await db.collection('brands').insertOne(newBrand);
    await logActivity('Created Brand', `Name: "${name}"`);

    return NextResponse.json({
      success: true,
      brand: {
        id: result.insertedId.toString(),
        ...newBrand
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, description, image, status } = body;

    if (!id || !name) {
      return NextResponse.json({ success: false, error: 'Brand ID and name are required.' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
    }

    const calculatedSlug = slug ? slug.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    const updateData = {
      name,
      slug: calculatedSlug,
      description: description || '',
      image: image || '/images/default_brand.png',
      status: status || 'Visible'
    };

    const db = await getDb();
    const result = await db.collection('brands').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Brand not found.' }, { status: 404 });
    }

    await logActivity('Updated Brand', `Name: "${name}"`);

    return NextResponse.json({
      success: true,
      brand: {
        id,
        ...updateData
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
      return NextResponse.json({ success: false, error: 'Brand ID is required.' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('brands');
    const brand = await collection.findOne({ _id: new ObjectId(id) });
    if (!brand) {
      return NextResponse.json({ success: false, error: 'Brand not found.' }, { status: 404 });
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    await logActivity('Deleted Brand', `Name: "${brand.name}"`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
