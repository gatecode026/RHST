import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const logs = await db.collection('activity_logs')
      .find()
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    
    const formatted = logs.map(doc => ({
      id: doc._id.toString(),
      action: doc.action,
      details: doc.details || '',
      timestamp: doc.timestamp
    }));

    return NextResponse.json({ success: true, logs: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const db = await getDb();
    await db.collection('activity_logs').deleteMany({});
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

