import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { logActivity } from '@/lib/activity';
import { assignSellersToProducts } from '@/lib/sellers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellers } = body;

    if (!Array.isArray(sellers) || sellers.length === 0) {
      return NextResponse.json({ success: false, error: 'No sellers provided for import.' }, { status: 400 });
    }

    const db = await getDb();
    const sellersColl = db.collection('sellers');

    const validDocs: any[] = [];
    const errors: string[] = [];

    for (let i = 0; i < sellers.length; i++) {
      const s = sellers[i];
      const name = (s.name || s['Company Name'] || s['Supplier Name'] || s['Seller Name'] || '').trim();
      const mainCategory = (s.mainCategory || s['Main Category'] || s['Category'] || '').trim();

      if (!name) {
        errors.push(`Row ${i + 1}: Missing seller/company name.`);
        continue;
      }
      if (!mainCategory) {
        errors.push(`Row ${i + 1}: Missing main category for "${name}".`);
        continue;
      }

      const location = (s.location || s['Location'] || s['City'] || 'India').trim();
      const phone = (s.phone || s['Phone'] || s['Mobile'] || '').trim();
      const email = (s.email || s['Email'] || '').trim().toLowerCase();
      const gstNumber = (s.gstNumber || s['GST Number'] || s['GST'] || '').trim().toUpperCase();
      const contactPerson = (s.contactPerson || s['Contact Person'] || '').trim();
      const natureOfBusiness = (s.natureOfBusiness || s['Nature of Business'] || 'Verified Supplier & Wholesaler').trim();
      const trustScore = (s.trustScore || s['Trust Score'] || 'Verified TrustSEAL').trim();
      const rating = Number(s.rating || s['Rating'] || 4.8) || 4.8;
      const responseTime = (s.responseTime || s['Response Time'] || '< 2 Hours').trim();
      const status = (s.status || s['Status'] || 'Active').trim();

      validDocs.push({
        name,
        mainCategory,
        location,
        phone,
        email,
        gstNumber,
        contactPerson,
        natureOfBusiness,
        trustScore,
        rating,
        reviewCount: 50,
        verified: true,
        memberSince: new Date().getFullYear().toString(),
        responseTime,
        responseRate: '98%',
        status: status || 'Active',
        createdAt: new Date().toISOString()
      });
    }

    if (validDocs.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid sellers found in CSV.',
        details: errors
      }, { status: 400 });
    }

    await sellersColl.insertMany(validDocs);
    await logActivity('Imported Sellers', `Bulk imported ${validDocs.length} suppliers/sellers via CSV.`);

    // Automatically assign these new sellers to any unassigned products or category matches
    try {
      await assignSellersToProducts();
    } catch (e) {
      console.warn('Post-import assignSellersToProducts warning:', e);
    }

    return NextResponse.json({
      success: true,
      count: validDocs.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${validDocs.length} suppliers/sellers.`
    });
  } catch (error: any) {
    console.error('Error importing sellers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

