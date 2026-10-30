import { NextResponse } from 'next/server';
import { ensureSellersSeeded, assignSellersToProducts } from '@/lib/sellers';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const sellers = await ensureSellersSeeded();
    // Also trigger background product assignment if any exist unassigned
    assignSellersToProducts().catch(() => {});

    let filtered = sellers;
    if (category && category !== 'All') {
      filtered = sellers.filter(
        (s) => s.mainCategory.toLowerCase() === category.toLowerCase()
      );
    }

    return NextResponse.json({ success: true, sellers: filtered });
  } catch (error: any) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

