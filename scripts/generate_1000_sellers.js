const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

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

const CITIES = [
  { city: 'Nehru Place, New Delhi', state: 'Delhi', code: '07' },
  { city: 'Okhla Industrial Area, New Delhi', state: 'Delhi', code: '07' },
  { city: 'Lamington Road, Mumbai', state: 'Maharashtra', code: '27' },
  { city: 'Andheri East, Mumbai', state: 'Maharashtra', code: '27' },
  { city: 'Bhosari MIDC, Pune', state: 'Maharashtra', code: '27' },
  { city: 'SP Road, Bengaluru', state: 'Karnataka', code: '29' },
  { city: 'Electronic City, Bengaluru', state: 'Karnataka', code: '29' },
  { city: 'Whitefield, Bengaluru', state: 'Karnataka', code: '29' },
  { city: 'Ritchie Street, Chennai', state: 'Tamil Nadu', code: '33' },
  { city: 'Guindy Industrial Estate, Chennai', state: 'Tamil Nadu', code: '33' },
  { city: 'Chenoy Trade Centre, Secunderabad', state: 'Telangana', code: '36' },
  { city: 'Madhapur / Hitec City, Hyderabad', state: 'Telangana', code: '36' },
  { city: 'Chandni Chowk, Kolkata', state: 'West Bengal', code: '19' },
  { city: 'Salt Lake Sector V, Kolkata', state: 'West Bengal', code: '19' },
  { city: 'Sitapura Industrial Area, Jaipur', state: 'Rajasthan', code: '08' },
  { city: 'Mansarovar Tech Hub, Jaipur', state: 'Rajasthan', code: '08' },
  { city: 'GIDC Changodar, Ahmedabad', state: 'Gujarat', code: '24' },
  { city: 'Ring Road Textile & Tech, Surat', state: 'Gujarat', code: '24' },
  { city: 'Makarpura GIDC, Vadodara', state: 'Gujarat', code: '24' },
  { city: 'Sector 63, Noida', state: 'Uttar Pradesh', code: '09' },
  { city: 'Udyog Vihar, Gurugram', state: 'Haryana', code: '06' },
  { city: 'IMT Manesar, Gurugram', state: 'Haryana', code: '06' },
  { city: 'DLF Industrial Area, Faridabad', state: 'Haryana', code: '06' },
  { city: 'Focal Point, Ludhiana', state: 'Punjab', code: '03' },
  { city: 'Sanwer Road Industrial Area, Indore', state: 'Madhya Pradesh', code: '23' },
  { city: 'Kalamassery, Kochi', state: 'Kerala', code: '32' }
];

const CATEGORIES_ALLOCATION = [
  { category: "Speaker's", target: 200, keywords: ['Audio', 'Acoustics', 'Sound', 'Sonic', 'Beats', 'Harmonics', 'Wave', 'AudioTech', 'Vibe', 'Stereo'] },
  { category: 'Television', target: 170, keywords: ['Vision', 'Display', 'ViewTech', 'OptiScreen', 'Spectra', 'ClearView', 'Lumin', 'Visuals', 'CinemaTech', 'Panels'] },
  { category: 'Laptops & Computers', target: 170, keywords: ['Infotech', 'Computing', 'Systems', 'Byte', 'Logic', 'Silicon', 'Micro', 'CyberTech', 'Processor', 'Compute'] },
  { category: 'Storage Devices', target: 110, keywords: ['Storage', 'Memory', 'DataCore', 'DriveTech', 'FlashMedia', 'ByteBank', 'DiskMatrix', 'TeraByte', 'DataVault', 'Flash'] },
  { category: 'Camera', target: 120, keywords: ['Optics', 'Imaging', 'Focus', 'LensCraft', 'CamTech', 'AeroView', 'PhotoDynamics', 'Visionary', 'Pixel', 'OpticLab'] },
  { category: 'Electronics', target: 140, keywords: ['Electronics', 'ElectroTech', 'Circuits', 'Semicon', 'PowerTech', 'TechCorp', 'Hardware', 'Volt', 'Component', 'Direct'] },
  { category: 'Keyboard & Mouse', target: 40, keywords: ['Peripherals', 'KeyMaster', 'InputTech', 'Pointer', 'ClickTech', 'Keytronic', 'ErgoPeripherals'] },
  { category: 'BAGS', target: 25, keywords: ['Luggage', 'GearPacks', 'TravelKraft', 'BagMasters', 'PackPro', 'NomadGear', 'UrbanPacks'] },
  { category: 'Clocks', target: 25, keywords: ['Chrono', 'TimeKraft', 'TickTech', 'Horology', 'TimeMatrix', 'WatchMakers', 'DialTech'] }
];

const PREFIXES = [
  'Apex', 'Zenith', 'Bharat', 'Shree', 'Vardhman', 'Paramount', 'Mahaveer', 'Riddhi Siddhi', 'Kailash',
  'Omkar', 'Navkar', 'Dynamic', 'Pinnacle', 'Radiant', 'Matrix', 'Sterling', 'Prime', 'United', 'National',
  'Global', 'Royal', 'Fortune', 'Kuber', 'Ganesh', 'Tirupati', 'Siddhi', 'Techno', 'Future', 'Nova',
  'Vanguard', 'Alpha', 'Delta', 'Pioneer', 'Horizon', 'Synergy', 'Precision', 'Crown', 'Falcon', 'Nexus',
  'Summit', 'Everest', 'Elite', 'Metro', 'Imperial', 'Swastik', 'Universal', 'Cosmos', 'Jupiter', 'Orion',
  'Galaxy', 'Velocity', 'Spectra', 'AcuTech', 'Optima', 'Titan', 'Zen', 'Aegis', 'Saffron', 'Indus',
  'Vedic', 'Surya', 'Chandra', 'Maruti', 'Bajrang', 'Balaji', 'Kavach', 'Arya', 'Vishnu', 'Shiva',
  'Dev', 'Agni', 'Vayu', 'Tejas', 'Shakti', 'Garuda', 'Hans', 'Kamal', 'Pawan', 'Sagar'
];

const SUFFIXES = [
  'Pvt Ltd', 'Enterprises', 'Technologies LLP', 'Solutions India', 'Corporation', 'Industries Ltd',
  'Electronics & Hardware Co.', 'Systems & Trading Co.', 'Distributors', 'India Pvt Ltd', 'Components Ltd'
];

const FIRST_NAMES = [
  'Rajesh', 'Amit', 'Sunil', 'Vikram', 'Praveen', 'Suresh', 'Manoj', 'Ramesh', 'Dinesh', 'Anand',
  'Sanjay', 'Arun', 'Pradeep', 'Ashok', 'Mahesh', 'Kishore', 'Naveen', 'Gaurav', 'Alok', 'Deepak',
  'Manish', 'Sandeep', 'Pankaj', 'Vijay', 'Kamal', 'Harish', 'Sachin', 'Nitin', 'Rohan', 'Abhishek',
  'Pooja', 'Neha', 'Sunita', 'Anjali', 'Kavita', 'Ritu', 'Swati', 'Preeti', 'Rekha', 'Meenakshi'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Singhania', 'Mehta', 'Rao', 'Kumar', 'Gupta', 'Agarwal', 'Jain', 'Verma',
  'Shah', 'Mishra', 'Reddy', 'Chauhan', 'Yadav', 'Malhotra', 'Bansal', 'Saxena', 'Bhatia', 'Joshi',
  'Choudhary', 'Rathore', 'Nair', 'Pillai', 'Iyer', 'Menon', 'Mukherjee', 'Banerjee', 'Ghosh', 'Sen'
];

function generateGST(stateCode, index) {
  const panLetters = 'ABCDE' + 'FGHIJ'[index % 5] + 'KLMNO'[(index * 3) % 5] + 'P';
  const panNum = String(1000 + (index * 7) % 8999);
  const panLast = 'ABCDEFGHJKLMNPQRSTUVWXYZ'[index % 24];
  const pan = `${panLetters}${panNum}${panLast}`;
  return `${stateCode}${pan}1Z${'0123456789ABCDEFGH'[index % 18]}`;
}

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || 'rhst_db');
  const sellersColl = db.collection('sellers');
  const productsColl = db.collection('products');

  console.log('Generating 1,000 verified IndiaMART suppliers...');
  const newSellers = [];
  let sellerIndex = 1;

  for (const alloc of CATEGORIES_ALLOCATION) {
    for (let i = 0; i < alloc.target; i++) {
      const cityObj = CITIES[(sellerIndex * 7 + i) % CITIES.length];
      const prefix = PREFIXES[(sellerIndex * 13 + i) % PREFIXES.length];
      const keyword = alloc.keywords[(sellerIndex * 3 + i) % alloc.keywords.length];
      const suffix = SUFFIXES[(sellerIndex * 5 + i) % SUFFIXES.length];
      const companyName = `${prefix} ${keyword} ${suffix}`;

      const fName = FIRST_NAMES[(sellerIndex * 11 + i) % FIRST_NAMES.length];
      const lName = LAST_NAMES[(sellerIndex * 17 + i) % LAST_NAMES.length];
      const contactPerson = `${fName} ${lName}`;

      const cleanSlug = companyName.toLowerCase().replace(/[^\w]/g, '').slice(0, 15);
      const emailDomain = cleanSlug + (sellerIndex % 2 === 0 ? '.in' : '.com');
      const email = `sales@${emailDomain}`;

      const phoneNum = `+91 98${String(10000000 + (sellerIndex * 73939) % 89999999).slice(0, 8)}`;
      const formattedPhone = `${phoneNum.slice(0, 6)} ${phoneNum.slice(6, 11)} ${phoneNum.slice(11)}`;

      const rating = Number((4.5 + ((sellerIndex * 17) % 5) * 0.1).toFixed(1));
      const reviewCount = 80 + ((sellerIndex * 37) % 720);
      const memberSince = String(2011 + (sellerIndex % 12));
      const responseTime = sellerIndex % 3 === 0 ? '< 1 Hour' : (sellerIndex % 3 === 1 ? '< 2 Hours' : '< 4 Hours');
      const responseRate = `${95 + (sellerIndex % 5)}%`;

      const trustScores = ['Verified TrustSEAL', 'Leading Supplier', 'Star Supplier', 'Verified Exporter'];
      const trustScore = trustScores[sellerIndex % trustScores.length];

      const businessTypes = [
        'Manufacturer & Wholesaler',
        'Authorized Distributor & Stockist',
        'OEM & Bulk Supplier',
        'Direct Importer & Exporter',
        'Wholesale Dealer & Trader'
      ];
      const natureOfBusiness = businessTypes[sellerIndex % businessTypes.length];

      const gst = generateGST(cityObj.code, sellerIndex);

      newSellers.push({
        _id: new ObjectId(),
        name: companyName,
        mainCategory: alloc.category,
        location: `${cityObj.city}, ${cityObj.state}`,
        rating,
        reviewCount,
        verified: true,
        memberSince,
        gstNumber: gst,
        responseTime,
        responseRate,
        natureOfBusiness,
        contactPerson,
        phone: formattedPhone,
        email,
        trustScore,
        status: 'Active',
        createdAt: new Date(Date.now() - (sellerIndex * 86400000))
      });

      sellerIndex++;
    }
  }

  console.log(`Generated ${newSellers.length} suppliers. Saving to database...`);
  // Replace sellers collection with the 1,000 sellers
  await sellersColl.deleteMany({});
  await sellersColl.insertMany(newSellers);
  console.log(`Successfully saved ${newSellers.length} sellers to database!`);

  // Now assign all 14,592 existing products to these 1,000 sellers
  console.log('Partitioning sellers by category for product assignment...');
  const sellersByCat = {};
  for (const s of newSellers) {
    const k = s.mainCategory.trim().toLowerCase();
    if (!sellersByCat[k]) sellersByCat[k] = [];
    sellersByCat[k].push(s);
  }

  console.log('Fetching all 14,592 products from database...');
  const products = await productsColl.find({}, {
    projection: { _id: 1, category: 1, name: 1 }
  }).toArray();

  console.log(`Assigning ${products.length} products to 1,000 sellers...`);
  const bulkOps = [];
  let updatedCount = 0;
  const sellerProductCounts = {};

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const catKey = (prod.category || 'Electronics').trim().toLowerCase();
    const candidateSellers = sellersByCat[catKey] || sellersByCat['electronics'] || newSellers;

    // Distribute evenly among candidates
    const assignedSeller = candidateSellers[i % candidateSellers.length];
    sellerProductCounts[assignedSeller.name] = (sellerProductCounts[assignedSeller.name] || 0) + 1;

    bulkOps.push({
      updateOne: {
        filter: { _id: prod._id },
        update: {
          $set: {
            sellerId: assignedSeller._id.toString(),
            sellerName: assignedSeller.name,
            sellerLocation: assignedSeller.location,
            sellerRating: assignedSeller.rating,
            sellerVerified: assignedSeller.verified,
            sellerMainCategory: assignedSeller.mainCategory,
            sellerGst: assignedSeller.gstNumber,
            sellerTrustScore: assignedSeller.trustScore,
            sellerPhone: assignedSeller.phone,
            sellerEmail: assignedSeller.email
          }
        }
      }
    });

    if (bulkOps.length >= 1000) {
      await productsColl.bulkWrite(bulkOps, { ordered: false });
      updatedCount += bulkOps.length;
      console.log(`Assigned sellers to ${updatedCount} / ${products.length} products...`);
      bulkOps.length = 0;
    }
  }

  if (bulkOps.length > 0) {
    await productsColl.bulkWrite(bulkOps, { ordered: false });
    updatedCount += bulkOps.length;
  }

  console.log(`SUCCESS! Assigned 1,000 sellers to ALL ${updatedCount} products!`);
  console.log(`Unique sellers with assigned products: ${Object.keys(sellerProductCounts).length}`);

  // Also build indexes on sellers collection
  await sellersColl.createIndex({ mainCategory: 1 });
  await sellersColl.createIndex({ location: 1 });
  await sellersColl.createIndex({ name: 1 });
  await sellersColl.createIndex({ rating: -1 });

  await client.close();
})();

