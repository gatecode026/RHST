const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

// Parse .env manually
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > -1) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim();
        if (!process.env[k]) process.env[k] = v;
      }
    }
  });
}

const KEYWORD_MAPPINGS = [
  [/storage|drive|disk|memory|sd card|micro\s*sd|flash|usb|ssd|hdd/i, 'storage devices'],
  [/laptop|computer|notebook|pc|desktop|macbook/i, 'laptops & computers'],
  [/keyboard|mouse|pointing|touchpad|trackball/i, 'keyboard & mouse'],
  [/printer|scanner|copier|ink|toner|cartridge/i, 'printers & scanners'],
  [/television|tv|monitor|display|projector/i, 'television'],
  [/camera|camcorder|dslr|lens|gopro/i, 'camera'],
  [/speaker|headphone|earphone|headset|audio|soundbar|bluetooth speaker/i, "speaker's"],
  [/shoe|sneaker|footwear|sandal|boot/i, 'shoes'],
  [/women|saree|kurti|dress|blouse|ethnic/i, "women's"],
  [/cloth|apparel|garment|shirt|pant|wear|t-shirt|jeans/i, 'clothes'],
  [/bag|backpack|luggage|suitcase/i, 'bags'],
  [/fan|ceiling fan|table fan/i, 'fans'],
  [/air conditioner|cooler|\bac\b/i, 'ac'],
  [/mixer|grinder|blender/i, 'mixer'],
  [/vacuum|vaccum|cleaner/i, 'vaccum'],
  [/refrigerator|fridge/i, 'refrigerator'],
  [/washing machine|washer|dryer/i, 'washing machine'],
  [/geyser|water heater/i, 'geysers'],
  [/clock|watch|timepiece/i, 'clocks'],
  [/microwave|oven/i, 'microwave'],
  [/toaster/i, 'toaster'],
  [/juicer/i, 'juicer'],
  [/dishwasher/i, 'dishwasher'],
  [/induction/i, 'induction'],
  [/appliance/i, 'home appliances'],
  [/nike/i, 'nike'],
  [/puma/i, 'puma'],
  [/toy|plush/i, 'soft toys'],
  [/electronics|gadget/i, 'electronics']
];

async function run() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'rhst_db';
  console.log('Connecting to MongoDB Atlas at:', uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'NONE');

  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to MongoDB successfully!');
  const db = client.db(dbName);

  const sellersColl = db.collection('sellers');
  const productsColl = db.collection('products');
  const categoriesColl = db.collection('categories');

  const sellers = await sellersColl.find().toArray();
  console.log(`Found ${sellers.length} sellers in database.`);

  const sellersByCategory = {};
  for (const s of sellers) {
    const key = (s.mainCategory || '').trim().toLowerCase();
    if (!sellersByCategory[key]) sellersByCategory[key] = [];
    sellersByCategory[key].push(s);
  }

  const categoriesList = await categoriesColl.find().toArray();
  const parentLookup = {};
  for (const c of categoriesList) {
    if (c.parentGroup && c.parentGroup !== 'None') {
      parentLookup[c.name.toLowerCase()] = c.parentGroup.toLowerCase();
    }
  }

  const totalProducts = await productsColl.countDocuments();
  console.log(`Scanning ${totalProducts} products to assign verified sellers...`);

  // Stream/cursor products to be memory efficient
  const cursor = productsColl.find(
    {},
    { projection: { _id: 1, name: 1, category: 1, sellerName: 1, sellerId: 1 } }
  );

  let bulkOps = [];
  let updatedCount = 0;
  let processed = 0;

  while (await cursor.hasNext()) {
    const prod = await cursor.next();
    processed++;

    const cat = (prod.category || '').trim().toLowerCase();
    const parent = parentLookup[cat] || '';
    const prodName = (prod.name || '').toLowerCase();

    // 1. Exact match on product category
    let matchingSellers = sellersByCategory[cat] || [];

    // 2. Keyword match
    if (matchingSellers.length === 0) {
      for (const [pattern, targetCat] of KEYWORD_MAPPINGS) {
        if (pattern.test(cat) || pattern.test(prodName)) {
          if (sellersByCategory[targetCat] && sellersByCategory[targetCat].length > 0) {
            matchingSellers = sellersByCategory[targetCat];
            break;
          }
        }
      }
    }

    // 3. Parent group match
    if (matchingSellers.length === 0 && parent) {
      matchingSellers = sellersByCategory[parent] || [];
    }

    // 4. Partial category match
    if (matchingSellers.length === 0) {
      for (const [sCat, sList] of Object.entries(sellersByCategory)) {
        if (cat.includes(sCat) || sCat.includes(cat) || (parent && (parent.includes(sCat) || sCat.includes(parent)))) {
          matchingSellers = sList;
          break;
        }
      }
    }

    // 5. Default fallback: Rotate diverse sellers
    if (matchingSellers.length === 0) {
      matchingSellers = [sellers[processed % sellers.length]];
    }

    const assignedSeller = matchingSellers[processed % matchingSellers.length];

    bulkOps.push({
      updateOne: {
        filter: { _id: prod._id },
        update: {
          $set: {
            sellerId: assignedSeller._id.toString(),
            sellerName: assignedSeller.name,
            sellerLocation: assignedSeller.location,
            sellerRating: assignedSeller.rating,
            sellerVerified: assignedSeller.verified !== undefined ? assignedSeller.verified : true,
            sellerMainCategory: assignedSeller.mainCategory,
            sellerGst: assignedSeller.gstNumber,
            sellerTrustScore: assignedSeller.trustScore || 'Verified TrustSEAL',
            sellerPhone: assignedSeller.phone || '+91 98290 12345',
            sellerEmail: assignedSeller.email || 'supplier@b2bmarketplace.in'
          }
        }
      }
    });

    if (bulkOps.length >= 1000) {
      await productsColl.bulkWrite(bulkOps, { ordered: false });
      updatedCount += bulkOps.length;
      console.log(`Progress: Assigned sellers to ${updatedCount} / ${totalProducts} products...`);
      bulkOps = [];
    }
  }

  if (bulkOps.length > 0) {
    await productsColl.bulkWrite(bulkOps, { ordered: false });
    updatedCount += bulkOps.length;
  }

  console.log(`SUCCESS! Assigned verified IndiaMART suppliers to ALL ${updatedCount} products.`);
  await client.close();
}

run().catch(console.error);

