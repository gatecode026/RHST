import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

const DEFAULT_RATES_TO_INR: Record<string, number> = {
  USD: 85.0,
  EUR: 92.5,
  GBP: 108.0,
  CAD: 62.0,
  AUD: 55.0,
  SGD: 64.0,
  AED: 23.1,
  CNY: 11.8,
  JPY: 0.56,
  INR: 1.0,
  RS: 1.0,
  '₹': 1.0
};

// Case-insensitive, space-insensitive, punctuation-insensitive field getter
function getField(row: Record<string, any>, ...candidateKeys: string[]): string {
  if (!row || typeof row !== 'object') return '';
  // 1. Direct match
  for (const k of candidateKeys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
      return String(row[k]).trim();
    }
  }
  // 2. Normalized match (strip non-alphanumeric, lower case)
  const normalizedRow: Record<string, string> = {};
  for (const [rk, rv] of Object.entries(row)) {
    const cleanKey = rk.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (rv !== undefined && rv !== null && cleanKey) {
      normalizedRow[cleanKey] = String(rv).trim();
    }
  }
  for (const k of candidateKeys) {
    const cleanKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedRow[cleanKey] !== undefined && normalizedRow[cleanKey] !== '') {
      return normalizedRow[cleanKey];
    }
  }
  return '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { products, usdExchangeRate = 85.0 } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ success: false, error: 'No products provided for import.' }, { status: 400 });
    }

    const db = await getDb();
    const productsColl = db.collection('products');
    const sellersColl = db.collection('sellers');
    const categoriesColl = db.collection('categories');

    // Fetch existing sellers to auto-assign by category
    const existingSellers = await sellersColl.find().toArray();
    const sellerMap: Record<string, any> = {};
    existingSellers.forEach(s => {
      const cat = (s.mainCategory || '').trim().toLowerCase();
      if (!sellerMap[cat]) sellerMap[cat] = s;
    });

    // Fetch existing categories to check or expand
    const existingCategories = await categoriesColl.find().toArray();
    const categoryNameSet = new Set(existingCategories.map(c => (c.name || '').trim().toLowerCase()));

    const customUsdRate = Number(usdExchangeRate) || 85.0;

    const validDocs: any[] = [];
    const errors: string[] = [];

    for (let i = 0; i < products.length; i++) {
      const p = products[i];

      // 1. Name mapping
      const name = getField(p, 'name', 'productName', 'Product Name', 'title', 'Title', 'product_name');

      if (!name) {
        errors.push(`Row ${i + 1}: Missing product name.`);
        continue;
      }

      // 2. Brand mapping
      const brand = getField(p, 'brand', 'Brand', 'manufacturer', 'Manufacturer') || 'General';

      // 3. Category mapping (handles Kaggle/Datafiniti `categories` and `primaryCategories`)
      let category = getField(p, 'category', 'Category');
      const rawCategoryTree = getField(p, 'primaryCategories', 'categories', 'primaryCategory', 'categoryTree');

      if (!category && rawCategoryTree) {
        const lowerCat = rawCategoryTree.toLowerCase();
        if (/storage|drive|disk|memory|sd card|micro\s*sd|flash|usb|ssd|hdd/i.test(lowerCat)) {
          category = 'Storage Devices';
        } else if (/laptop|computer|notebook|pc|desktop|macbook/i.test(lowerCat)) {
          category = 'Laptops & Computers';
        } else if (/keyboard|mouse|pointing|touchpad/i.test(lowerCat)) {
          category = 'Keyboard & Mouse';
        } else if (/printer|scanner|copier|ink|toner|cartridge/i.test(lowerCat)) {
          category = 'Printers & Scanners';
        } else if (/television|tv|monitor|display|projector/i.test(lowerCat)) {
          category = 'Television';
        } else if (/women|saree|kurti|dress|blouse|ethnic/i.test(lowerCat)) {
          category = "Women's";
        } else if (/shoe|sneaker|footwear|sandal|boot/i.test(lowerCat)) {
          category = 'Shoes';
        } else if (/cloth|apparel|garment|shirt|pant|wear/i.test(lowerCat)) {
          category = 'CLOTHES';
        } else if (/gaming|console|joystick|gamepad/i.test(lowerCat)) {
          category = 'Gaming Products';
        } else if (/hardware/i.test(lowerCat)) {
          category = 'Hardware';
        } else {
          // Take primary segment from comma-separated list
          const firstSeg = rawCategoryTree.split(',')[0].trim();
          category = firstSeg || 'Electronics';
        }
      }

      if (!category) {
        category = 'Electronics';
      }

      // Ensure category exists in categories collection
      const catKey = category.toLowerCase();
      if (!categoryNameSet.has(catKey)) {
        categoryNameSet.add(catKey);
        const slug = category.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
        await categoriesColl.insertOne({
          name: category,
          slug,
          parentGroup: 'Electronics',
          status: 'Visible',
          image: '/images/default_category.png',
          createdAt: new Date().toISOString()
        });
      }

      // 4. Currency Detection & Indian Rupee (INR) Price Conversion
      const currencyRaw = getField(p, 'prices.currency', 'currency', 'Currency') || 'USD';

      let currencyKey = 'USD';
      const currUpper = currencyRaw.toUpperCase();
      if (currUpper.includes('INR') || currUpper.includes('₹') || currUpper.includes('RS')) {
        currencyKey = 'INR';
      } else if (currUpper.includes('EUR') || currUpper.includes('€')) {
        currencyKey = 'EUR';
      } else if (currUpper.includes('GBP') || currUpper.includes('£')) {
        currencyKey = 'GBP';
      } else if (currUpper.includes('CAD')) {
        currencyKey = 'CAD';
      } else if (currUpper.includes('AUD')) {
        currencyKey = 'AUD';
      } else if (currUpper.includes('SGD')) {
        currencyKey = 'SGD';
      } else if (currUpper.includes('AED')) {
        currencyKey = 'AED';
      } else if (currUpper.includes('CNY') || currUpper.includes('RMB')) {
        currencyKey = 'CNY';
      } else if (currUpper.includes('JPY') || currUpper.includes('¥')) {
        currencyKey = 'JPY';
      } else if (currUpper.includes('USD') || currUpper.includes('$')) {
        currencyKey = 'USD';
      }

      const rate = currencyKey === 'USD'
        ? customUsdRate
        : (DEFAULT_RATES_TO_INR[currencyKey] || customUsdRate);

      // Extract raw price amounts
      const rawMin = getField(p, 'prices.amountMin', 'amountMin', 'price', 'Price', 'Selling Price', 'prices.amount');
      const rawMax = getField(p, 'prices.amountMax', 'amountMax', 'mrp', 'MRP');

      const numMin = Number(String(rawMin).replace(/[^\d.]/g, '')) || 0;
      const numMax = Number(String(rawMax).replace(/[^\d.]/g, '')) || 0;

      let finalPrice = 0;
      let finalMrp = 0;

      if (currencyKey === 'INR') {
        finalPrice = numMin || numMax;
        finalMrp = numMax > numMin ? numMax : (numMin ? Math.round(numMin * 1.25) : 0);
      } else {
        // Convert foreign currency amount to Indian Rupee (INR)
        finalPrice = Math.round(numMin * rate);
        if (numMax > numMin) {
          finalMrp = Math.round(numMax * rate);
        } else {
          // Provide 20-25% wholesale discount off MRP
          finalMrp = Math.round(finalPrice * 1.25);
        }
      }

      // If price is zero but MRP exists
      if (finalPrice === 0 && finalMrp > 0) {
        finalPrice = Math.round(finalMrp * 0.85);
      }

      const discountRaw = getField(p, 'discount', 'Discount', 'Discount (%)');
      const discountVal = (finalMrp > finalPrice && finalMrp > 0)
        ? Math.round(((finalMrp - finalPrice) / finalMrp) * 100)
        : (Number(String(discountRaw || '0').replace(/[^\d.]/g, '')) || 0);

      const formattedPrice = '₹' + finalPrice.toLocaleString('en-IN');

      // 5. Image URL extraction: save only the exact URL from CSV (no ImageKit URLs)
      const rawImageVal = getField(
        p,
        'imageURLs',
        'imageurls',
        'imageUrls',
        'imageURL',
        'image_urls',
        'image',
        'Image',
        'Image URL',
        'Image Link',
        'image_url',
        'images',
        'img',
        'photo',
        'picture',
        'sourceURLs',
        'prices.sourceURLs'
      );

      let image = '';
      let allImages: string[] = [];

      if (rawImageVal) {
        // Extract complete HTTP/HTTPS URLs without splitting on query params
        const urlMatches = rawImageVal.match(/https?:\/\/[^\s,"'<>[\]{}|]+/gi);
        if (urlMatches && urlMatches.length > 0) {
          image = urlMatches[0].trim();
          allImages = urlMatches.map(u => u.trim());
        } else if (rawImageVal.startsWith('http://') || rawImageVal.startsWith('https://') || rawImageVal.startsWith('/')) {
          image = rawImageVal.trim();
          allImages = [image];
        }
      }

      if (!image) {
        image = '/images/default_product.png';
        allImages = [image];
      }

      // 6. SKU mapping
      const sku = getField(p, 'asins', 'asin', 'sku', 'SKU', 'upc', 'ean', 'manufacturerNumber', 'keys') ||
        ('SKU-' + Math.random().toString(36).substring(3, 8).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900));

      // 7. Stock and Availability
      const availRaw = getField(p, 'prices.availability', 'availability', 'stock', 'Stock').toLowerCase();

      let stockVal = 25;
      let status = 'PUBLISHED';
      if (availRaw.includes('no') || availRaw.includes('out') || availRaw.includes('false') || availRaw === '0') {
        stockVal = 0;
        status = 'DRAFT';
      } else {
        const parsed = parseInt(String(p.stock || p['Stock'] || ''), 10);
        if (!isNaN(parsed) && parsed >= 0) {
          stockVal = parsed;
        }
      }

      // 8. Description mapping
      let description = getField(p, 'description', 'Description', 'details');
      if (!description) {
        const cond = getField(p, 'prices.condition', 'condition') || 'New';
        const weight = getField(p, 'weight', 'Weight');
        const weightText = weight ? ` Weight: ${weight}.` : '';
        description = `${name} by ${brand}. Condition: ${cond}.${weightText} Direct B2B supplier wholesale quotation available in bulk quantities with GST invoice.`;
      }

      const slug = (getField(p, 'slug', 'Slug') || name)
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      // 9. Seller Assignment (IndiaMART B2B supplier)
      let sellerName = getField(p, 'sellerName', 'Seller Name', 'Supplier');
      let sellerLocation = getField(p, 'sellerLocation', 'Seller Location', 'Location');
      let sellerGst = getField(p, 'sellerGst', 'Seller GST', 'GST Number');
      let sellerId = getField(p, 'sellerId', 'Seller ID');

      // If row has retail merchant (e.g. Walmart, Best Buy) or no seller, assign verified IndiaMART supplier
      const merchantFromCsv = getField(p, 'prices.merchant', 'merchant');
      if (merchantFromCsv && !sellerName) {
        sellerName = merchantFromCsv;
      }

      const isRetailStore = ['walmart', 'best buy', 'amazon', 'target', 'b&h', 'newegg', 'bestbuy.com', 'walmart.com'].includes(sellerName.toLowerCase());
      if ((!sellerName || isRetailStore) && existingSellers.length > 0) {
        // Find best matching seller for this category
        const matched = existingSellers.find(s =>
          (s.mainCategory && s.mainCategory.toLowerCase() === catKey) ||
          (s.mainCategory && catKey.includes(s.mainCategory.toLowerCase()))
        ) || sellerMap[catKey] || existingSellers[i % existingSellers.length];

        if (matched) {
          sellerId = matched._id.toString();
          sellerName = matched.name;
          sellerLocation = matched.location || 'India';
          sellerGst = matched.gstNumber || '';
        }
      }

      validDocs.push({
        name,
        slug,
        link: '#' + slug,
        price: formattedPrice,
        mrp: finalMrp,
        discount: discountVal,
        category,
        brand,
        sku,
        stock: stockVal,
        status,
        description,
        image,
        images: allImages,
        featured: p.featured === true || String(p.featured).toLowerCase() === 'true',
        onOffer: p.onOffer === true || String(p.onOffer).toLowerCase() === 'true',
        warranty: parseInt(String(p.warranty || '12'), 10) || 12,
        lowStockThreshold: 5,
        sellerId,
        sellerName,
        sellerLocation,
        sellerGst,
        currencyConverted: currencyKey !== 'INR',
        originalCurrency: currencyKey,
        createdAt: new Date().toISOString()
      });
    }

    if (validDocs.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid products found in CSV.',
        details: errors
      }, { status: 400 });
    }

    await productsColl.insertMany(validDocs);
    await logActivity('Imported Products', `Bulk imported ${validDocs.length} products with INR conversion (USD Exchange Rate: ₹${customUsdRate}).`);

    return NextResponse.json({
      success: true,
      count: validDocs.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${validDocs.length} products in Indian Rupee (₹).`
    });
  } catch (error: any) {
    console.error('Error importing products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
