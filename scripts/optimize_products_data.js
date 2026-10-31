const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const envPath = path.join(__dirname, '..', '.env');
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

const CATEGORY_RULES = [
  // 1. Television
  {
    regex: /\b(television|smart\s*tv|oled|qled|hdtv|4k\s*tv|led\s*tv|curved\s*tv)\b|(\b(tv)\b(?!(\s*mount|\s*bracket|\s*wall|\s*remote|\s*tuner|\s*cable|\s*antenna|\s*lead)))/i,
    category: 'Television'
  },
  // 2. Laptops & Computers
  {
    regex: /\b(laptop|notebook|macbook|chromebook|thinkpad|zenbook|ideapad|pavilion|inspiron|desktop\s*pc|gaming\s*pc|all-in-one\s*pc|workstation|tower\s*pc)\b/i,
    category: 'Laptops & Computers'
  },
  // 3. Storage Devices
  {
    regex: /\b(hard\s*drive|external\s*hard\s*drive|portable\s*hard\s*drive|solid\s*state\s*drive|internal\s*ssd|portable\s*ssd|external\s*ssd|\bssd\b|\bhdd\b|flash\s*drive|thumb\s*drive|pen\s*drive|usb\s*drive|usb\s*flash|memory\s*card|micro\s*sd|sd\s*card|sdhc|sdxc|cfast|compact\s*flash|san\s*disk|nas\s*storage)\b/i,
    category: 'Storage Devices'
  },
  // 4. Printers & Scanners
  {
    regex: /\b(printer|laser\s*printer|inkjet|all-in-one\s*printer|photo\s*printer|document\s*scanner|flatbed\s*scanner|toner\s*cartridge|ink\s*cartridge)\b/i,
    category: 'Printers & Scanners'
  },
  // 5. Keyboard & Mouse
  {
    regex: /\b(keyboard|mechanical\s*keyboard|gaming\s*keyboard|wireless\s*keyboard|optical\s*mouse|wireless\s*mouse|gaming\s*mouse|trackball|touchpad)\b/i,
    category: 'Keyboard & Mouse'
  },
  // 6. Camera
  {
    regex: /\b(camera|dslr|mirrorless|camcorder|action\s*cam|gopro|camera\s*lens|telephoto|zoom\s*lens|tripod|monopod|camera\s*bag)\b/i,
    category: 'Camera'
  },
  // 7. Speakers & Audio
  {
    regex: /\b(speaker|soundbar|subwoofer|headphone|earphone|headset|earbud|airpod|bluetooth\s*speaker|wireless\s*speaker|portable\s*speaker|in-wall\s*speaker|amplifier|audio\s*receiver)\b/i,
    category: "Speaker's"
  },
  // 8. Specific Home Appliances
  { regex: /\b(air\s*fryer)\b/i, category: 'Air Fryer' },
  { regex: /\b(mixer|grinder|blender|food\s*processor)\b/i, category: 'Mixer' },
  { regex: /\b(vacuum|vaccum|robot\s*vacuum)\b/i, category: 'Vaccum' },
  { regex: /\b(ceiling\s*fan|table\s*fan|exhaust\s*fan)\b/i, category: 'Fans' },
  { regex: /\b(air\s*conditioner|split\s*ac|inverter\s*ac|\bair\s*cooler\b)\b/i, category: 'AC' },
  { regex: /\b(refrigerator|fridge|freezer)\b/i, category: 'Refrigerator' },
  { regex: /\b(dishwasher)\b/i, category: 'DishWasher' },
  { regex: /\b(washing\s*machine|washer|dryer)\b/i, category: 'Washing Machine' },
  { regex: /\b(microwave|convection\s*oven|otg|toaster\s*oven)\b/i, category: 'Microwave' },
  { regex: /\b(geyser|water\s*heater)\b/i, category: 'Geysers' },
  { regex: /\b(wall\s*clock|digital\s*clock|alarm\s*clock)\b/i, category: 'Clocks' },
  { regex: /\b(induction\s*cooktop|induction\s*stove)\b/i, category: 'Induction' },
  { regex: /\b(pop-up\s*toaster|sandwich\s*toaster|toaster)\b/i, category: 'Toaster' },
  { regex: /\b(juicer|cold\s*press\s*juicer)\b/i, category: 'Juicer' },
  // 9. Footwear & Apparel
  { regex: /\b(shoe|sneaker|running\s*shoe|boot|sandal)\b/i, category: 'Shoes' },
  { regex: /\b(saree|kurti|dress|lehenga|blouse)\b/i, category: "Women's" },
  { regex: /\b(backpack|travel\s*bag|laptop\s*bag|luggage|suitcase)\b/i, category: 'BAGS' }
];

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || 'rhst_db');
  const productsColl = db.collection('products');
  const sellersColl = db.collection('sellers');

  console.log('Fetching sellers for category assignment...');
  const sellers = await sellersColl.find().toArray();
  const sellersByCat = {};
  for (const s of sellers) {
    const k = (s.mainCategory || '').trim().toLowerCase();
    if (!sellersByCat[k]) sellersByCat[k] = [];
    sellersByCat[k].push(s);
  }

  console.log('Fetching products to optimize...');
  const allProds = await productsColl.find({}, {
    projection: { _id: 1, name: 1, category: 1, mrp: 1, discount: 1, price: 1, sellerName: 1 }
  }).toArray();

  console.log(`Found ${allProds.length} products to optimize...`);
  const bulkOps = [];
  let updatedCount = 0;
  const categoryCounts = {};

  for (let i = 0; i < allProds.length; i++) {
    const p = allProds[i];
    const name = p.name || '';
    let newCategory = p.category;

    // If current category is generic 'Electronics' or empty, check rules
    if (!newCategory || newCategory === 'Electronics' || newCategory === 'Hardware') {
      for (const rule of CATEGORY_RULES) {
        if (rule.regex.test(name)) {
          newCategory = rule.category;
          break;
        }
      }
    }

    if (!newCategory) newCategory = 'Electronics';
    categoryCounts[newCategory] = (categoryCounts[newCategory] || 0) + 1;

    // Calculate numeric price
    let numPrice = 0;
    if (typeof p.mrp === 'number' && p.mrp > 0) {
      const disc = typeof p.discount === 'number' ? p.discount : 0;
      numPrice = Math.round(p.mrp * (1 - disc / 100));
    } else if (typeof p.price === 'string') {
      numPrice = parseInt(p.price.replace(/[^\d]/g, ''), 10) || 0;
    }

    // Find matching seller
    const catKey = newCategory.toLowerCase();
    let matchingSellers = sellersByCat[catKey] || sellersByCat['electronics'] || sellers;
    const seller = matchingSellers[i % matchingSellers.length];

    bulkOps.push({
      updateOne: {
        filter: { _id: p._id },
        update: {
          $set: {
            category: newCategory,
            numericPrice: numPrice,
            sellerId: seller._id ? seller._id.toString() : (seller.id || 'seller-default'),
            sellerName: seller.name,
            sellerLocation: seller.location,
            sellerRating: seller.rating || 4.8,
            sellerVerified: seller.verified !== false,
            sellerMainCategory: seller.mainCategory || newCategory,
            sellerGst: seller.gstNumber || '',
            sellerTrustScore: seller.trustScore || 'Verified TrustSEAL',
            sellerPhone: seller.phone || '+91 98251 44556',
            sellerEmail: seller.email || 'sales@valnqix.com'
          }
        }
      }
    });

    if (bulkOps.length >= 1000) {
      await productsColl.bulkWrite(bulkOps, { ordered: false });
      updatedCount += bulkOps.length;
      console.log(`Processed ${updatedCount} / ${allProds.length}...`);
      bulkOps.length = 0;
    }
  }

  if (bulkOps.length > 0) {
    await productsColl.bulkWrite(bulkOps, { ordered: false });
    updatedCount += bulkOps.length;
  }

  console.log(`Successfully optimized and updated ${updatedCount} products!`);
  console.log('Category distribution:');
  console.log(JSON.stringify(categoryCounts, null, 2));

  console.log('Creating database indexes...');
  await productsColl.createIndex({ category: 1 });
  await productsColl.createIndex({ brand: 1 });
  await productsColl.createIndex({ sellerName: 1 });
  await productsColl.createIndex({ numericPrice: 1 });
  await productsColl.createIndex({ status: 1 });
  await productsColl.createIndex({ createdAt: -1 });
  await productsColl.createIndex({ featured: 1 });
  await productsColl.createIndex({ onOffer: 1 });
  await productsColl.createIndex({ name: 'text', description: 'text' });
  console.log('All indexes created successfully!');

  await client.close();
})();

