import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('products');

    const facets = await collection.aggregate([
      {
        $facet: {
          categories: [
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          brands: [
            { $group: { _id: "$brand", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 40 }
          ],
          sellers: [
            { $group: { _id: "$sellerName", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 40 }
          ],
          priceRanges: [
            {
              $bucket: {
                groupBy: { $ifNull: ["$numericPrice", 0] },
                boundaries: [0, 15000, 25000, 50000, 75000, 100000, 125000],
                default: "above125",
                output: { count: { $sum: 1 } }
              }
            }
          ],
          total: [
            { $count: "count" }
          ]
        }
      }
    ]).toArray();

    const data = facets[0] || {};
    const totalCount = data.total && data.total[0] ? data.total[0].count : 0;

    const priceMap: Record<string, number> = {
      less15: 0,
      '15_25': 0,
      '25_50': 0,
      '50_75': 0,
      '75_100': 0,
      '100_125': 0
    };

    (data.priceRanges || []).forEach((b: any) => {
      if (b._id === 0) priceMap['less15'] = b.count;
      else if (b._id === 15000) priceMap['15_25'] = b.count;
      else if (b._id === 25000) priceMap['25_50'] = b.count;
      else if (b._id === 50000) priceMap['50_75'] = b.count;
      else if (b._id === 75000) priceMap['75_100'] = b.count;
      else if (b._id === 100000) priceMap['100_125'] = b.count;
    });

    return NextResponse.json({
      success: true,
      total: totalCount,
      categories: (data.categories || []).map((c: any) => ({ name: c._id || 'Uncategorized', count: c.count })),
      brands: (data.brands || []).map((b: any) => ({ name: b._id || 'Unknown', count: b.count })),
      sellers: (data.sellers || []).map((s: any) => ({ name: s._id || 'Unknown', count: s.count })),
      priceRanges: priceMap
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
