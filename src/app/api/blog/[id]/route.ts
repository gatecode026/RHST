import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const collection = db.collection('blogs');

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
    } else {
      query = { id: id };
    }

    const blog = await collection.findOne(query);
    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog post not found' }, { status: 404 });
    }

    const formatted = {
      id: blog._id.toString(),
      tag: blog.tag || 'Laptops & Computers',
      title: blog.title,
      excerpt: blog.excerpt || '',
      image: blog.image || 'https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png',
      status: blog.status || 'Published',
      featured: blog.featured || false,
      category: blog.category || 'Laptops & Computers',
      tags: blog.tags || '',
      sortOrder: blog.sortOrder || 0,
      authorPhoto: blog.authorPhoto || '',
      authorName: blog.authorName || 'Admin Team',
      authorDesignation: blog.authorDesignation || 'Blog Panel Writer',
      authorBio: blog.authorBio || '',
      createdAt: blog.createdAt,
      blocks: blog.blocks || []
    };

    return NextResponse.json({ success: true, blog: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
