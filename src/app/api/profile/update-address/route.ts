import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, address } = body;

    if (!email || !address) {
      return NextResponse.json(
        { success: false, error: 'Email and address are required.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.collection('users').updateOne(
      { email: email.toLowerCase().trim() },
      { $set: { address } }
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
    console.error('Update address error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
