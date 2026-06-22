import { getDb } from './mongodb';

export async function logActivity(action: string, details: string = '') {
  try {
    const db = await getDb();
    await db.collection('activity_logs').insertOne({
      action,
      details,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}
