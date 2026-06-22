import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { logActivity } from '@/lib/activity';

const DEFAULT_CREDENTIALS = {
  username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin',
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required.' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('admin_credentials');

    // Upsert default credentials — always keep in sync with .env.local
    await collection.updateOne(
      { username: DEFAULT_CREDENTIALS.username },
      { $set: { password: DEFAULT_CREDENTIALS.password } },
      { upsert: true }
    );

    const credentials = await collection.findOne({ username });

    if (credentials && credentials.password === password) {
      await logActivity('Admin Login Success', `User: "${username}"`);
      return NextResponse.json({ success: true });
    } else {
      await logActivity('Admin Login Failed', `Username attempt: "${username}"`);
      return NextResponse.json({ success: false, error: 'Invalid username or password.' }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
