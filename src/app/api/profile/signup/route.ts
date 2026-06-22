import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const existingUser = await db
      .collection('users')
      .findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password, // Plain-text matching for project consistency
      address: null,
      createdAt: new Date().toISOString()
    };

    await db.collection('users').insertOne(newUser);
    return NextResponse.json({
      success: true,
      user: { name: newUser.name, email: newUser.email, phone: newUser.phone, address: null }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
