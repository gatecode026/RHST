import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, subject, message, type } = body;

    // Validation
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Prepare submission object
    const newSubmission = {
      fullName,
      email,
      phone: phone || '',
      subject: subject || '',
      message,
      type: type || 'contact',
      submittedAt: new Date().toISOString()
    };

    // Get database connection
    const db = await getDb();

    // Insert new submission
    const result = await db.collection('submissions').insertOne(newSubmission);

    return NextResponse.json({
      success: true,
      submission: {
        id: result.insertedId.toString(),
        ...newSubmission
      }
    });
  } catch (error: any) {
    console.error('Error handling contact submission:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
