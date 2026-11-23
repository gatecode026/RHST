import { getDb } from './mongodb';
import { ObjectId } from 'mongodb';

export interface Seller {
  id?: string;
  _id?: ObjectId | string;
  name: string;
  mainCategory: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  memberSince: string;
  gstNumber: string;
  responseTime: string;
  responseRate: string;
  natureOfBusiness: string;
  contactPerson: string;
  phone: string;
  email: string;
  trustScore: string;
  status?: string;
}

export const DIVERSE_SELLERS: Omit<Seller, 'id' | '_id'>[] = [
  // CLOTHES & WOMEN'S APPAREL
  {
    name: 'KalaNiketan Apparels & Textiles Pvt Ltd',
    mainCategory: "Women's",
    location: 'Surat, Gujarat',
    rating: 4.9,
    reviewCount: 310,
    verified: true,
    memberSince: '2014',
    gstNumber: '24AAPCK1029F1Z2',
    responseTime: '< 1 Hour',
    responseRate: '99%',
    natureOfBusiness: 'Manufacturer & Direct Exporter',
    contactPerson: 'Pravinbhai Patel',
    phone: '+91 98251 44556',
    email: 'sales@kalaniketanapparels.in',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },
  {
    name: 'VogueCraft Garments & Ethnic Wear',
    mainCategory: "Women's",
    location: 'Jaipur, Rajasthan',
    rating: 4.8,
    reviewCount: 184,
    verified: true,
    memberSince: '2016',
    gstNumber: '08AABCV9912M1ZK',
    responseTime: '< 2 Hours',
    responseRate: '97%',
    natureOfBusiness: 'Wholesaler & Manufacturer',
    contactPerson: 'Meenakshi Rathore',
    phone: '+91 98292 77889',
    email: 'info@voguecraftgarments.com',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },
  {
    name: 'TrendSetters Clothing Corp',
    mainCategory: 'CLOTHES',
    location: 'Tirupur, Tamil Nadu',
    rating: 4.8,
    reviewCount: 220,
    verified: true,
    memberSince: '2015',
    gstNumber: '33AABCT8841L1Z9',
    responseTime: '< 2 Hours',
    responseRate: '96%',
    natureOfBusiness: 'Garment Manufacturer & Wholesaler',
    contactPerson: 'S. Ramanathan',
    phone: '+91 98422 11223',
    email: 'orders@trendsettersclothing.in',
    trustScore: 'Verified Star Seller',
    status: 'Active'
  },

  // LAPTOPS, COMPUTERS & ELECTRONICS
  {
    name: 'Zenith Computing & Infotech Systems',
    mainCategory: 'Laptops & Computers',
    location: 'Bengaluru, Karnataka',
    rating: 4.9,
    reviewCount: 275,
    verified: true,
    memberSince: '2015',
    gstNumber: '29AAACZ4912L1Z8',
    responseTime: '< 1 Hour',
    responseRate: '98%',
    natureOfBusiness: 'Authorized Corporate Distributor',
    contactPerson: 'Vikas Mehra',
    phone: '+91 98110 54321',
    email: 'info@zenithcomputing.com',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },
  {
    name: 'Apex Tech Systems Pvt Ltd',
    mainCategory: 'Laptops & Computers',
    location: 'New Delhi, Delhi',
    rating: 4.9,
    reviewCount: 340,
    verified: true,
    memberSince: '2013',
    gstNumber: '07AAPCA9281G1Z3',
    responseTime: '< 2 Hours',
    responseRate: '98%',
    natureOfBusiness: 'System Integrator & Bulk Importer',
    contactPerson: 'Ramesh Sharma',
    phone: '+91 98290 12345',
    email: 'sales@apextechsystems.in',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },
  {
    name: 'Silicon Valley Hardware Distro',
    mainCategory: 'Electronics',
    location: 'Hyderabad, Telangana',
    rating: 4.8,
    reviewCount: 160,
    verified: true,
    memberSince: '2017',
    gstNumber: '36AABCS7712Q1ZU',
    responseTime: '< 2 Hours',
    responseRate: '95%',
    natureOfBusiness: 'Master Distributor',
    contactPerson: 'Rajesh Reddy',
    phone: '+91 98490 66778',
    email: 'b2b@siliconvalleydistro.in',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },

  // KEYBOARD, MOUSE & ACCESSORIES
  {
    name: 'Quantum Peripherals & I/O Tech',
    mainCategory: 'Keyboard & Mouse',
    location: 'Mumbai, Maharashtra',
    rating: 4.7,
    reviewCount: 195,
    verified: true,
    memberSince: '2018',
    gstNumber: '27AABCQ5521H1ZM',
    responseTime: '< 2 Hours',
    responseRate: '96%',
    natureOfBusiness: 'OEM Manufacturer & Importer',
    contactPerson: 'Sunil Gokhale',
    phone: '+91 98205 88990',
    email: 'sales@quantumperipherals.co.in',
    trustScore: 'Verified Star Seller',
    status: 'Active'
  },
  {
    name: 'Paramount Digital Accessories Co.',
    mainCategory: 'Computer Accessories',
    location: 'Mumbai, Maharashtra',
    rating: 4.9,
    reviewCount: 215,
    verified: true,
    memberSince: '2014',
    gstNumber: '27AABCP1928J1Z0',
    responseTime: '< 2 Hours',
    responseRate: '97%',
    natureOfBusiness: 'Wholesale Supplier',
    contactPerson: 'Anil Kulkarni',
    phone: '+91 98200 45678',
    email: 'support@paramountdigital.in',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },

  // STORAGE & MEMORY
  {
    name: 'DataCore Storage & Flash Drives Ltd',
    mainCategory: 'Storage Devices',
    location: 'Hyderabad, Telangana',
    rating: 4.8,
    reviewCount: 142,
    verified: true,
    memberSince: '2016',
    gstNumber: '36AABCD1144N1ZP',
    responseTime: '< 2 Hours',
    responseRate: '95%',
    natureOfBusiness: 'Authorized Storage Wholesaler',
    contactPerson: 'K. Venkat Rao',
    phone: '+91 98855 33445',
    email: 'distro@datacorestorage.in',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },

  // PRINTERS & SCANNERS
  {
    name: 'PrintMatrix Imaging & Office Systems',
    mainCategory: 'Printers & Scanners',
    location: 'Chennai, Tamil Nadu',
    rating: 4.8,
    reviewCount: 130,
    verified: true,
    memberSince: '2015',
    gstNumber: '33AABCP3399J1Z4',
    responseTime: '< 2 Hours',
    responseRate: '96%',
    natureOfBusiness: 'Dealer & Corporate Solutions',
    contactPerson: 'M. Balasubramanian',
    phone: '+91 98400 99887',
    email: 'inquiry@printmatrix.co.in',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },

  // TELEVISION & CAMERA
  {
    name: 'VisionTech Displays & Smart Screens',
    mainCategory: 'Television',
    location: 'Noida, Uttar Pradesh',
    rating: 4.8,
    reviewCount: 210,
    verified: true,
    memberSince: '2017',
    gstNumber: '09AABCV4411K1Z5',
    responseTime: '< 1 Hour',
    responseRate: '98%',
    natureOfBusiness: 'Commercial Display OEM & Wholesaler',
    contactPerson: 'Gaurav Singhal',
    phone: '+91 98180 22334',
    email: 'sales@visiontechdisplays.in',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },
  {
    name: 'OptiLens & Camera Systems',
    mainCategory: 'Camera',
    location: 'Kolkata, West Bengal',
    rating: 4.7,
    reviewCount: 88,
    verified: true,
    memberSince: '2018',
    gstNumber: '19AABCO8822B1Z1',
    responseTime: '< 3 Hours',
    responseRate: '94%',
    natureOfBusiness: 'Optical & Surveillance Importer',
    contactPerson: 'Subrata Banerjee',
    phone: '+91 98300 44556',
    email: 'info@optilenscameras.in',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },
  {
    name: 'SonicPulse Audio & Acoustic Labs',
    mainCategory: "Speaker's",
    location: 'Bengaluru, Karnataka',
    rating: 4.8,
    reviewCount: 180,
    verified: true,
    memberSince: '2017',
    gstNumber: '29AABCS6655L1Z1',
    responseTime: '< 2 Hours',
    responseRate: '96%',
    natureOfBusiness: 'Sound System & Bluetooth Speaker OEM',
    contactPerson: 'Deepak Nair',
    phone: '+91 98451 99887',
    email: 'b2b@sonicpulseacoustic.in',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  }
];

export async function ensureSellersSeeded() {
  const db = await getDb();
  const sellersColl = db.collection('sellers');

  // Upsert all diverse sellers by name
  for (const seller of DIVERSE_SELLERS) {
    await sellersColl.updateOne(
      { name: seller.name },
      {
        $set: {
          ...seller,
          updatedAt: new Date().toISOString()
        },
        $setOnInsert: {
          createdAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );
  }

  const allSellers = await sellersColl.find().toArray();
  return allSellers.map((s) => ({
    id: s._id.toString(),
    name: s.name,
    mainCategory: s.mainCategory,
    location: s.location,
    rating: s.rating,
    reviewCount: s.reviewCount,
    verified: s.verified !== undefined ? s.verified : true,
    memberSince: s.memberSince || '2016',
    gstNumber: s.gstNumber || '08AAPCA9281G1Z3',
    responseTime: s.responseTime || '< 2 Hours',
    responseRate: s.responseRate || '96%',
    natureOfBusiness: s.natureOfBusiness || 'Verified Supplier',
    contactPerson: s.contactPerson || 'Authorized Manager',
    phone: s.phone || '+91 98290 12345',
    email: s.email || 'supplier@b2bmarketplace.in',
    trustScore: s.trustScore || 'Verified TrustSEAL',
    status: s.status || 'Active'
  }));
}

export async function assignSellersToProducts(options?: { forceReassign?: boolean }) {
  const force = options?.forceReassign ?? false;
  try {
    const db = await getDb();
    const sellers = await ensureSellersSeeded();
    const productsColl = db.collection('products');
    const categoriesColl = db.collection('categories');

    // Build category hierarchy lookup (category name -> parentGroup)
    const categoriesList = await categoriesColl.find().toArray();
    const parentLookup: Record<string, string> = {};
    for (const c of categoriesList) {
      if (c.parentGroup && c.parentGroup !== 'None') {
        parentLookup[c.name.toLowerCase()] = c.parentGroup.toLowerCase();
      }
    }

    // Group sellers by their mainCategory (lowercased)
    const sellersByCategory: Record<string, typeof sellers> = {};
    for (const s of sellers) {
      const key = (s.mainCategory || '').trim().toLowerCase();
      if (!sellersByCategory[key]) {
        sellersByCategory[key] = [];
      }
      sellersByCategory[key].push(s);
    }

    // Keyword to mainCategory mapping (IT Hardware only)
    const KEYWORD_MAPPINGS: Array<[RegExp, string]> = [
      [/storage|drive|disk|memory|sd card|micro\s*sd|flash|usb|ssd|hdd/i, 'storage devices'],
      [/laptop|computer|notebook|pc|desktop|macbook/i, 'laptops & computers'],
      [/keyboard|mouse|pointing|touchpad|trackball/i, 'keyboard & mouse'],
      [/printer|scanner|copier|ink|toner|cartridge/i, 'printers & scanners'],
      [/television|tv|monitor|display|projector/i, 'television'],
      [/camera|camcorder|dslr|lens|gopro/i, 'camera'],
      [/speaker|headphone|earphone|headset|audio|soundbar|bluetooth speaker/i, "speaker's"],
      [/electronics|gadget|networking|server|switch|router/i, 'electronics']
    ];

    // Query all products with lightweight projection
    const allProducts = await productsColl.find(
      {},
      { projection: { _id: 1, category: 1, sellerName: 1, sellerId: 1, name: 1 } }
    ).toArray();

    const bulkOps: any[] = [];
    let updatedCount = 0;

    for (let i = 0; i < allProducts.length; i++) {
      const prod = allProducts[i];
      const cat = (prod.category || '').trim().toLowerCase();
      const parent = parentLookup[cat] || '';
      const prodName = (prod.name || '').toLowerCase();

      // Find matching sellers:
      // 1. Exact match on product category
      let matchingSellers = sellersByCategory[cat] || [];

      // 2. Keyword match against product category and name
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

      // 3. Match parent group
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

      // 5. Default fallback: Pick from diverse pool rotated by index
      if (matchingSellers.length === 0) {
        matchingSellers = [sellers[i % sellers.length]];
      }

      const assignedSeller = matchingSellers[i % matchingSellers.length];

      // Check if update is needed
      const currentSeller = prod.sellerName || '';
      const isMismatch = (
        !currentSeller ||
        (currentSeller === 'Apex Tech Systems Pvt Ltd' && cat !== 'laptops & computers' && cat !== 'electronics' && cat !== 'hardware')
      );

      if (force || isMismatch || !prod.sellerId) {
        bulkOps.push({
          updateOne: {
            filter: { _id: prod._id },
            update: {
              $set: {
                sellerId: assignedSeller.id,
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
          bulkOps.length = 0;
        }
      }
    }

    if (bulkOps.length > 0) {
      await productsColl.bulkWrite(bulkOps, { ordered: false });
      updatedCount += bulkOps.length;
    }

    return {
      success: true,
      totalProducts: allProducts.length,
      updatedCount
    };
  } catch (err: any) {
    console.warn('Error in assignSellersToProducts:', err);
    return { success: false, error: err.message };
  }
}
