import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const user = await db
      .collection('users')
      .findOne({ email: email.toLowerCase().trim() });

    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address || null
        }
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'User not found.' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error fetching profile user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
