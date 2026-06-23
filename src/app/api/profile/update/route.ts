import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone, image } = body;

    if (!email || !name || !phone) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const updateFields: any = { name: name.trim(), phone: phone.trim() };
    if (image !== undefined) {
      updateFields.image = image;
    }

    const result = await db.collection('users').updateOne(
      { email: email.toLowerCase().trim() },
      { $set: updateFields }
    );

    if (result.matchedCount > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: 'User not found.' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
