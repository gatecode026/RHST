import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const categories = await db.collection('categories').find().toArray();

    const isGarbageCategory = (name: string) => {
      if (!name || typeof name !== 'string') return true;
      const str = name.trim();
      if (str.length === 0 || str.length > 40) return true;
      if (/^https?:\/\//i.test(str)) return true;
      if (/www\./i.test(str)) return true;
      if (/\.(com|org|net|html|php|jpg|png|jpeg)\b/i.test(str)) return true;
      if (/%25|%20|\/c\/product|\.p\?/i.test(str)) return true;
      if (/^\d{4}-\d{2}-\d{2}/.test(str)) return true;
      if (/^(true|false|undefined|null|none|n\/a)$/i.test(str)) return true;
      if (/^[A-Z0-9]{10}$/.test(str)) return true;
      return false;
    };

    const cleanCategories = categories.filter(c => !isGarbageCategory(c.name));
    
    const formatted = cleanCategories.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      image: doc.image,
      link: doc.link,
      slug: doc.slug || doc.name.toLowerCase().replace(/\s+/g, '-'),
      parentGroup: doc.parentGroup || 'None',
      description: doc.description || '',
      status: doc.status || 'Visible'
    }));

    return NextResponse.json({ success: true, categories: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, parentGroup, description, image } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required.' }, { status: 400 });
    }

    const calculatedSlug = slug ? slug.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    const newCategory = {
      name,
      slug: calculatedSlug,
      parentGroup: parentGroup || 'None',
      description: description || '',
      image: image || '/images/default_category.png',
      link: '#' + calculatedSlug,
      status: 'Visible'
    };

    const db = await getDb();
    const result = await db.collection('categories').insertOne(newCategory);

    return NextResponse.json({
      success: true,
      category: {
        id: result.insertedId.toString(),
        ...newCategory
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, parentGroup, description, image, status } = body;

    if (!id || !name) {
      return NextResponse.json({ success: false, error: 'Category ID and name are required.' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
    }

    const calculatedSlug = slug ? slug.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    const updateData = {
      name,
      slug: calculatedSlug,
      parentGroup: parentGroup || 'None',
      description: description || '',
      image: image || '/images/default_category.png',
      link: '#' + calculatedSlug,
      status: status || 'Visible'
    };

    const db = await getDb();
    const result = await db.collection('categories').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Category not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      category: {
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
      return NextResponse.json({ success: false, error: 'Category ID is required.' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection('categories').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Category not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
