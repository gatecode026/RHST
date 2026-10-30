import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { logActivity } from '@/lib/activity';

export async function GET() {
  try {
    const db = await getDb();
    const products = await db.collection('products').find().toArray();
    
    const formatted = products.map(doc => ({
      id: doc._id.toString(),
      slug: doc.slug || doc.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
      name: doc.name,
      price: doc.price,
      image: doc.image,
      link: doc.link,
      category: doc.category,
      brand: doc.brand || 'Dell',
      sku: doc.sku || ('SKU-' + doc._id.toString().substring(18).toUpperCase()),
      stock: doc.stock !== undefined ? doc.stock : 10,
      status: doc.status || 'PUBLISHED',
      description: doc.description || '',
      mrp: doc.mrp !== undefined ? doc.mrp : parseInt((doc.price || '').replace(/[^\d]/g, ''), 10),
      discount: doc.discount !== undefined ? doc.discount : 0,
      featured: doc.featured !== undefined ? doc.featured : false,
      onOffer: doc.onOffer !== undefined ? doc.onOffer : false,
      warranty: doc.warranty !== undefined ? doc.warranty : 0,
      lowStockThreshold: doc.lowStockThreshold !== undefined ? doc.lowStockThreshold : 10,
      sellerId: doc.sellerId || '',
      sellerName: doc.sellerName || '',
      sellerLocation: doc.sellerLocation || '',
      sellerGst: doc.sellerGst || '',
      sellerTrustScore: doc.sellerTrustScore || ''
    }));

    return NextResponse.json({ success: true, products: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      mrp,
      discount,
      image,
      category,
      brand,
      sku,
      stock,
      status,
      description,
      featured,
      onOffer,
      warranty,
      lowStockThreshold,
      sellerId,
      sellerName,
      sellerLocation,
      sellerGst
    } = body;

    if (!name || mrp === undefined || !category) {
      return NextResponse.json({ success: false, error: 'Product name, MRP, and category are required.' }, { status: 400 });
    }

    const calculatedMrp = Number(mrp);
    const calculatedDiscount = discount !== undefined ? Number(discount) : 0;

    if (calculatedMrp < 0) {
      return NextResponse.json({ success: false, error: 'MRP cannot be negative.' }, { status: 400 });
    }

    if (calculatedDiscount < 0 || calculatedDiscount > 100) {
      return NextResponse.json({ success: false, error: 'Discount percentage must be between 0 and 100%.' }, { status: 400 });
    }

    const sellPriceVal = calculatedMrp - (calculatedMrp * calculatedDiscount / 100);
    const formattedPrice = '₹' + Math.round(sellPriceVal).toLocaleString();

    const generatedSku = sku ? sku.toUpperCase().trim() : ('SKU-' + Math.random().toString(36).substring(3, 8).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900));

    const db = await getDb();

    let assignedSellerId = sellerId || '';
    let assignedSellerName = sellerName || '';
    let assignedSellerLocation = sellerLocation || '';
    let assignedSellerGst = sellerGst || '';

    if (!assignedSellerName) {
      const matchedSeller = await db.collection('sellers').findOne({
        $or: [
          { mainCategory: { $regex: new RegExp('^' + category + '$', 'i') } },
          { mainCategory: { $regex: new RegExp(category, 'i') } }
        ]
      });
      if (matchedSeller) {
        assignedSellerId = matchedSeller._id.toString();
        assignedSellerName = matchedSeller.name;
        assignedSellerLocation = matchedSeller.location || 'India';
        assignedSellerGst = matchedSeller.gstNumber || '';
      }
    }

    const calculatedSlug = slug ? slug.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
    const newProduct = {
      name,
      mrp: calculatedMrp,
      discount: calculatedDiscount,
      price: formattedPrice,
      image: image || '/images/default_product.png',
      link: '#' + calculatedSlug,
      slug: calculatedSlug,
      category,
      brand: brand || 'Dell',
      sku: generatedSku,
      stock: stock !== undefined ? parseInt(stock, 10) : 10,
      status: status || 'PUBLISHED',
      description: description || '',
      featured: featured === true,
      onOffer: onOffer === true,
      warranty: warranty !== undefined ? parseInt(warranty, 10) : 0,
      lowStockThreshold: lowStockThreshold !== undefined ? parseInt(lowStockThreshold, 10) : 10,
      sellerId: assignedSellerId,
      sellerName: assignedSellerName,
      sellerLocation: assignedSellerLocation,
      sellerGst: assignedSellerGst
    };

    const result = await db.collection('products').insertOne(newProduct);

    await logActivity('Created Product', `Name: "${name}" (SKU: ${newProduct.sku})`);

    return NextResponse.json({
      success: true,
      product: {
        id: result.insertedId.toString(),
        ...newProduct
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      slug,
      mrp,
      discount,
      image,
      category,
      brand,
      sku,
      stock,
      status,
      description,
      featured,
      onOffer,
      warranty,
      lowStockThreshold,
      sellerId,
      sellerName,
      sellerLocation,
      sellerGst
    } = body;

    if (!id || !name || mrp === undefined || !category) {
      return NextResponse.json({ success: false, error: 'Product ID, name, MRP, and category are required.' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
    }

    const calculatedMrp = Number(mrp);
    const calculatedDiscount = discount !== undefined ? Number(discount) : 0;

    if (calculatedMrp < 0) {
      return NextResponse.json({ success: false, error: 'MRP cannot be negative.' }, { status: 400 });
    }

    if (calculatedDiscount < 0 || calculatedDiscount > 100) {
      return NextResponse.json({ success: false, error: 'Discount percentage must be between 0 and 100%.' }, { status: 400 });
    }

    const sellPriceVal = calculatedMrp - (calculatedMrp * calculatedDiscount / 100);
    const formattedPrice = '₹' + Math.round(sellPriceVal).toLocaleString();

    const calculatedSlug = slug ? slug.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
    const updateData: any = {
      name,
      mrp: calculatedMrp,
      discount: calculatedDiscount,
      price: formattedPrice,
      image: image || '/images/default_product.png',
      link: '#' + calculatedSlug,
      slug: calculatedSlug,
      category,
      brand: brand || 'Dell',
      sku: sku ? sku.toUpperCase().trim() : ('SKU-' + id.substring(18).toUpperCase()),
      stock: stock !== undefined ? parseInt(stock, 10) : 10,
      status: status || 'PUBLISHED',
      description: description || '',
      featured: featured === true,
      onOffer: onOffer === true,
      warranty: warranty !== undefined ? parseInt(warranty, 10) : 0,
      lowStockThreshold: lowStockThreshold !== undefined ? parseInt(lowStockThreshold, 10) : 10
    };

    if (sellerId !== undefined) updateData.sellerId = sellerId;
    if (sellerName !== undefined) updateData.sellerName = sellerName;
    if (sellerLocation !== undefined) updateData.sellerLocation = sellerLocation;
    if (sellerGst !== undefined) updateData.sellerGst = sellerGst;

    const db = await getDb();
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
    }

    await logActivity('Updated Product', `Name: "${name}" (SKU: ${updateData.sku})`);

    return NextResponse.json({
      success: true,
      product: {
        id,
        ...updateData
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required.' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('products');

    const product = await collection.findOne({ _id: new ObjectId(id) });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    await logActivity('Deleted Product', `Name: "${product.name}" (SKU: ${product.sku || 'N/A'})`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
