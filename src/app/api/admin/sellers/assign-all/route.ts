import { NextResponse } from 'next/server';
import { assignSellersToProducts } from '@/lib/sellers';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Empty body is acceptable
    }

    const forceReassign = body.forceReassign !== false; // defaults to true
    const result = await assignSellersToProducts({ forceReassign });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Failed to assign sellers' }, { status: 500 });
    }

    await logActivity(
      'Assigned Sellers to Products',
      `Assigned verified suppliers to ${result.updatedCount} products (Total products: ${result.totalProducts}).`
    );

    return NextResponse.json({
      success: true,
      totalProducts: result.totalProducts,
      updatedCount: result.updatedCount,
      message: `Successfully mapped verified suppliers to ${result.updatedCount} products across the catalog!`
    });
  } catch (error: any) {
    console.error('Error assigning sellers to products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

