import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const user = await db
      .collection('users')
      .findOne({ email: email.toLowerCase().trim() });

    if (user && user.password === password) {
      return NextResponse.json({
        success: true,
        user: { name: user.name, email: user.email, phone: user.phone, address: user.address }
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
