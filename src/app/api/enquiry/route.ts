import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productId,
      productName,
      productPrice,
      productImage,
      sellerId,
      sellerName,
      sellerLocation,
      buyerName,
      buyerEmail,
      buyerPhone,
      quantity,
      unit,
      requirement,
      source
    } = body;

    if (!buyerName || !buyerPhone) {
      return NextResponse.json(
        { success: false, error: 'Buyer name and mobile number are required.' },
        { status: 400 }
      );
    }

    // Clean Indian phone number
    const cleanPhone = buyerPhone.replace(/[^\d]/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    const enquiryId = 'ENQ-' + Date.now().toString().slice(-6) + '-' + Math.floor(100 + Math.random() * 900);

    const newEnquiry = {
      enquiryId,
      productId: productId || null,
      productName: productName || 'General Catalog Enquiry',
      productPrice: productPrice || 'On Request',
      productImage: productImage || '/images/default_category.png',
      sellerId: sellerId || null,
      sellerName: sellerName || 'Authorized Supplier',
      sellerLocation: sellerLocation || 'India',
      buyer: {
        name: buyerName.trim(),
        email: buyerEmail ? buyerEmail.trim().toLowerCase() : '',
        phone: cleanPhone
      },
      quantity: quantity ? `${quantity} ${unit || 'Units'}` : '1 Unit',
      requirement: requirement || `Requirement for ${productName || 'IT Products'}. Please share quotation.`,
      source: source || 'Product Card Enquiry',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const db = await getDb();
    await db.collection('enquiries').insertOne(newEnquiry);

    // Also mirror to submissions for admin compatibility
    await db.collection('submissions').insertOne({
      fullName: newEnquiry.buyer.name,
      email: newEnquiry.buyer.email,
      phone: newEnquiry.buyer.phone,
      subject: `Enquiry: ${newEnquiry.productName} (${newEnquiry.quantity}) for ${newEnquiry.sellerName}`,
      message: `Enquiry ID: ${enquiryId}\nProduct: ${newEnquiry.productName}\nTarget Seller: ${newEnquiry.sellerName}\nQuantity: ${newEnquiry.quantity}\nRequirement: ${newEnquiry.requirement}`,
      type: 'enquiry',
      submittedAt: new Date().toISOString(),
      status: 'Pending',
      notes: `Target Seller: ${newEnquiry.sellerName} | Location: ${newEnquiry.sellerLocation}`
    });

    await logActivity('New Buyer Enquiry', `${newEnquiry.buyer.name} inquired for ${newEnquiry.productName} with ${newEnquiry.sellerName}`);

    return NextResponse.json({
      success: true,
      enquiryId,
      message: `Your enquiry has been dispatched to ${newEnquiry.sellerName}. They will get in touch shortly.`
    });
  } catch (error: any) {
    console.error('Error saving enquiry:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    const db = await getDb();
    let query: any = {};
    if (email) {
      query['buyer.email'] = email.toLowerCase().trim();
    } else if (phone) {
      query['buyer.phone'] = phone.replace(/[^\d]/g, '');
    }

    const enquiries = await db
      .collection('enquiries')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, enquiries });
  } catch (error: any) {
    console.error('Error retrieving enquiries:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

