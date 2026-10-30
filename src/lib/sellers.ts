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

  // FOOTWEAR / SHOES
  {
    name: 'FootFlex Leather & Athletic Footwear',
    mainCategory: 'Shoes',
    location: 'Agra, Uttar Pradesh',
    rating: 4.9,
    reviewCount: 390,
    verified: true,
    memberSince: '2013',
    gstNumber: '09AABCF9944M1Z8',
    responseTime: '< 2 Hours',
    responseRate: '97%',
    natureOfBusiness: 'Shoe Manufacturer & Exporter',
    contactPerson: 'Mohd. Aslam',
    phone: '+91 98370 12345',
    email: 'export@footflexshoes.com',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },
  {
    name: 'SportSprint Distribution Hub',
    mainCategory: 'NIKE',
    location: 'Jalandhar, Punjab',
    rating: 4.8,
    reviewCount: 175,
    verified: true,
    memberSince: '2016',
    gstNumber: '03AABCS4455R1Z2',
    responseTime: '< 2 Hours',
    responseRate: '96%',
    natureOfBusiness: 'Wholesale Sports Footwear Stockist',
    contactPerson: 'Harpreet Singh',
    phone: '+91 98140 77889',
    email: 'sportsprint@distrohub.in',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },
  {
    name: 'Apex Footwear Distributors',
    mainCategory: 'PUMA',
    location: 'New Delhi, Delhi',
    rating: 4.8,
    reviewCount: 140,
    verified: true,
    memberSince: '2017',
    gstNumber: '07AABCA3311E1Z0',
    responseTime: '< 2 Hours',
    responseRate: '95%',
    natureOfBusiness: 'Authorized Footwear Distributor',
    contactPerson: 'Anand Bakshi',
    phone: '+91 98100 88991',
    email: 'sales@apexfootwear.in',
    trustScore: 'Verified Star Seller',
    status: 'Active'
  },

  // BAGS & BACKPACKS
  {
    name: 'TravelGear Luggage & Backpacks Co.',
    mainCategory: 'BAGS',
    location: 'Kanpur, Uttar Pradesh',
    rating: 4.8,
    reviewCount: 165,
    verified: true,
    memberSince: '2015',
    gstNumber: '09AABCT1188D1Z7',
    responseTime: '< 2 Hours',
    responseRate: '96%',
    natureOfBusiness: 'Bags Manufacturer & Bulk Wholesaler',
    contactPerson: 'Alok Gupta',
    phone: '+91 98390 55667',
    email: 'info@travelgearbackpacks.in',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },
  {
    name: 'UrbanStyle Bags & Leather Goods',
    mainCategory: 'SIDEBAGS',
    location: 'Kolkata, West Bengal',
    rating: 4.7,
    reviewCount: 120,
    verified: true,
    memberSince: '2018',
    gstNumber: '19AABCU4499P1ZK',
    responseTime: '< 3 Hours',
    responseRate: '93%',
    natureOfBusiness: 'Luggage & Accessories Wholesaler',
    contactPerson: 'Debashis Roy',
    phone: '+91 98311 22334',
    email: 'sales@urbanstylebags.com',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },

  // PLUSHIES & SOFT TOYS
  {
    name: 'CuddleCraft Toy Manufacturing Pvt Ltd',
    mainCategory: 'SOFT TOYS',
    location: 'Greater Noida, Uttar Pradesh',
    rating: 4.9,
    reviewCount: 180,
    verified: true,
    memberSince: '2017',
    gstNumber: '09AABCC7733L1Z6',
    responseTime: '< 2 Hours',
    responseRate: '98%',
    natureOfBusiness: 'Plush Toy Manufacturer & Bulk Supplier',
    contactPerson: 'Rohit Mittal',
    phone: '+91 98118 99001',
    email: 'orders@cuddlecrafttoys.in',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },

  // KITCHEN & HOME APPLIANCES
  {
    name: 'HomeChef Appliances & Cookware India',
    mainCategory: 'Home Appliances',
    location: 'Ahmedabad, Gujarat',
    rating: 4.9,
    reviewCount: 420,
    verified: true,
    memberSince: '2012',
    gstNumber: '24AABCH3322K1Z9',
    responseTime: '< 1 Hour',
    responseRate: '99%',
    natureOfBusiness: 'OEM Kitchen Appliance Manufacturer',
    contactPerson: 'Chirag Shah',
    phone: '+91 98240 11998',
    email: 'sales@homechefappliances.in',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },
  {
    name: 'Surya Shakti Electricals & Home Tech',
    mainCategory: 'Induction',
    location: 'Rajkot, Gujarat',
    rating: 4.8,
    reviewCount: 190,
    verified: true,
    memberSince: '2016',
    gstNumber: '24AABCS5544J1Z3',
    responseTime: '< 2 Hours',
    responseRate: '96%',
    natureOfBusiness: 'Induction & Heating Element Maker',
    contactPerson: 'Jignesh Vora',
    phone: '+91 98250 88776',
    email: 'info@suryashaktielectricals.com',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },
  {
    name: 'CrispTech Kitchen Gadgets',
    mainCategory: 'Air Fryer',
    location: 'Bengaluru, Karnataka',
    rating: 4.8,
    reviewCount: 145,
    verified: true,
    memberSince: '2019',
    gstNumber: '29AABCC9900F1Z4',
    responseTime: '< 2 Hours',
    responseRate: '95%',
    natureOfBusiness: 'Direct Importer & Distributor',
    contactPerson: 'Arjun Nambiar',
    phone: '+91 98450 66779',
    email: 'b2b@crisptechkitchen.in',
    trustScore: 'Verified Star Seller',
    status: 'Active'
  },
  {
    name: 'KitchenPro Culinary Machines',
    mainCategory: 'Mixer',
    location: 'Indore, Madhya Pradesh',
    rating: 4.7,
    reviewCount: 160,
    verified: true,
    memberSince: '2015',
    gstNumber: '23AABCK8877G1Z1',
    responseTime: '< 2 Hours',
    responseRate: '94%',
    natureOfBusiness: 'Mixer & Grinder OEM Manufacturer',
    contactPerson: 'Sanjay Patidar',
    phone: '+91 98260 44332',
    email: 'sales@kitchenproindia.com',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },
  {
    name: 'FrostBreeze Cooling & Air Systems',
    mainCategory: 'AC',
    location: 'Gurugram, Haryana',
    rating: 4.9,
    reviewCount: 310,
    verified: true,
    memberSince: '2014',
    gstNumber: '06AABCF4411Q1Z8',
    responseTime: '< 1 Hour',
    responseRate: '98%',
    natureOfBusiness: 'HVAC Wholesaler & Project Supplier',
    contactPerson: 'Tarun Khanna',
    phone: '+91 98101 22445',
    email: 'corporate@frostbreezecooling.in',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },
  {
    name: 'CleanWave Washing & Appliances Co.',
    mainCategory: 'Washing Machine',
    location: 'Pune, Maharashtra',
    rating: 4.8,
    reviewCount: 175,
    verified: true,
    memberSince: '2016',
    gstNumber: '27AABCW9933H1Z2',
    responseTime: '< 2 Hours',
    responseRate: '96%',
    natureOfBusiness: 'Major Domestic Appliance Stockist',
    contactPerson: 'Nitin Deshmukh',
    phone: '+91 98220 55443',
    email: 'contact@cleanwaveappliances.in',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },
  {
    name: 'CoolFrost Refrigeration Ltd',
    mainCategory: 'Refrigerator',
    location: 'Faridabad, Haryana',
    rating: 4.8,
    reviewCount: 200,
    verified: true,
    memberSince: '2015',
    gstNumber: '06AABCC2299K1Z5',
    responseTime: '< 2 Hours',
    responseRate: '97%',
    natureOfBusiness: 'Commercial & Domestic Cold Storage Distro',
    contactPerson: 'Rajnish Dua',
    phone: '+91 98115 33221',
    email: 'info@coolfrostrefrigeration.com',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },
  {
    name: 'ThermaHot Water Solutions',
    mainCategory: 'Geysers',
    location: 'Coimbatore, Tamil Nadu',
    rating: 4.7,
    reviewCount: 135,
    verified: true,
    memberSince: '2017',
    gstNumber: '33AABCT6622N1Z7',
    responseTime: '< 2 Hours',
    responseRate: '95%',
    natureOfBusiness: 'Water Heater & Solar Geyser Manufacturer',
    contactPerson: 'K. Senthil Kumar',
    phone: '+91 98430 77665',
    email: 'orders@thermahotgeysers.in',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },
  {
    name: 'ElectroBreeze Fans & Home Comfort',
    mainCategory: 'Fans',
    location: 'Hyderabad, Telangana',
    rating: 4.8,
    reviewCount: 155,
    verified: true,
    memberSince: '2016',
    gstNumber: '36AABCE1199P1ZK',
    responseTime: '< 2 Hours',
    responseRate: '95%',
    natureOfBusiness: 'Ceiling & Exhaust Fans Manufacturer',
    contactPerson: 'P. Krishna Murthy',
    phone: '+91 98480 33221',
    email: 'sales@electrobreezefans.in',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },
  {
    name: 'AeroClean Vacuum Systems',
    mainCategory: 'Vaccum',
    location: 'Coimbatore, Tamil Nadu',
    rating: 4.7,
    reviewCount: 92,
    verified: true,
    memberSince: '2018',
    gstNumber: '33AABCA4433D1Z9',
    responseTime: '< 3 Hours',
    responseRate: '93%',
    natureOfBusiness: 'Commercial & Home Vacuum Importer',
    contactPerson: 'S. Vijay Anand',
    phone: '+91 98421 88990',
    email: 'info@aerocleanvacuums.in',
    trustScore: 'Verified Star Seller',
    status: 'Active'
  },
  {
    name: 'ChronoCraft Clock & Timing Systems',
    mainCategory: 'Clocks',
    location: 'Morbi, Gujarat',
    rating: 4.8,
    reviewCount: 110,
    verified: true,
    memberSince: '2016',
    gstNumber: '24AABCC8811E1Z3',
    responseTime: '< 2 Hours',
    responseRate: '96%',
    natureOfBusiness: 'Wall Clock & Quartz Maker',
    contactPerson: 'Bhavesh Patel',
    phone: '+91 98255 11224',
    email: 'sales@chronocraftclocks.com',
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
  },
  {
    name: 'CrispBite Toaster & Breakfast Tech',
    mainCategory: 'Toaster',
    location: 'Ahmedabad, Gujarat',
    rating: 4.7,
    reviewCount: 85,
    verified: true,
    memberSince: '2018',
    gstNumber: '24AABCC1122M1ZK',
    responseTime: '< 2 Hours',
    responseRate: '94%',
    natureOfBusiness: 'Kitchen Electricals Wholesaler',
    contactPerson: 'Hasmukh Prajapati',
    phone: '+91 98244 55667',
    email: 'sales@crispbitetoasters.in',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },
  {
    name: 'FreshSip Juicer & Food Processing Co.',
    mainCategory: 'Juicer',
    location: 'Rajkot, Gujarat',
    rating: 4.8,
    reviewCount: 105,
    verified: true,
    memberSince: '2017',
    gstNumber: '24AABCF3388K1Z6',
    responseTime: '< 2 Hours',
    responseRate: '95%',
    natureOfBusiness: 'Cold Press & Centrifugal Juicer Maker',
    contactPerson: 'Kishore Dave',
    phone: '+91 98252 66778',
    email: 'orders@freshsipjuicers.in',
    trustScore: 'Leading Supplier',
    status: 'Active'
  },
  {
    name: 'MicroWave Magic Tech India',
    mainCategory: 'Microwave',
    location: 'Faridabad, Haryana',
    rating: 4.8,
    reviewCount: 140,
    verified: true,
    memberSince: '2016',
    gstNumber: '06AABCM7744N1ZP',
    responseTime: '< 2 Hours',
    responseRate: '96%',
    natureOfBusiness: 'Oven & Microwave Oven Distro',
    contactPerson: 'Manish Vashisht',
    phone: '+91 98114 77889',
    email: 'sales@microwavemagic.in',
    trustScore: 'Verified TrustSEAL',
    status: 'Active'
  },
  {
    name: 'AquaShine DishWasher Corp',
    mainCategory: 'DishWasher',
    location: 'Pune, Maharashtra',
    rating: 4.7,
    reviewCount: 78,
    verified: true,
    memberSince: '2019',
    gstNumber: '27AABCA2244P1Z8',
    responseTime: '< 3 Hours',
    responseRate: '92%',
    natureOfBusiness: 'Commercial & Domestic Dishwasher Supplier',
    contactPerson: 'Sachin Jadhav',
    phone: '+91 98223 11223',
    email: 'info@aquashinedishwashers.com',
    trustScore: 'Leading Supplier',
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

export async function assignSellersToProducts() {
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

    // Fetch all products
    const allProducts = await productsColl.find().toArray();

    for (let i = 0; i < allProducts.length; i++) {
      const prod = allProducts[i];
      const cat = (prod.category || '').trim().toLowerCase();
      const parent = parentLookup[cat] || '';

      // Find matching sellers:
      // 1. Exact match on product category
      let matchingSellers = sellersByCategory[cat] || [];

      // 2. If no exact match, check parent group (e.g. "CLOTHES" for "Women's", "Electronics" for "Laptops & Computers")
      if (matchingSellers.length === 0 && parent) {
        matchingSellers = sellersByCategory[parent] || [];
      }

      // 3. If still no match, partial word match
      if (matchingSellers.length === 0) {
        for (const [sCat, sList] of Object.entries(sellersByCategory)) {
          if (cat.includes(sCat) || sCat.includes(cat) || (parent && (parent.includes(sCat) || sCat.includes(parent)))) {
            matchingSellers = sList;
            break;
          }
        }
      }

      // 4. Default fallback: Pick from diverse pool rotated by index so different products get different sellers
      if (matchingSellers.length === 0) {
        matchingSellers = [sellers[i % sellers.length]];
      }

      // Select seller distributed across matching candidates
      const assignedSeller = matchingSellers[i % matchingSellers.length];

      // Always update if current seller is missing or was defaulted to Apex Tech Systems for a non-tech category like Women's or Shoes
      const currentSeller = prod.sellerName || '';
      const isMismatch = (
        !currentSeller ||
        (currentSeller === 'Apex Tech Systems Pvt Ltd' && cat !== 'laptops & computers' && cat !== 'electronics' && cat !== 'hardware')
      );

      if (isMismatch || !prod.sellerId) {
        await productsColl.updateOne(
          { _id: prod._id },
          {
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
        );
      }
    }
  } catch (err) {
    console.warn('Error in assignSellersToProducts:', err);
  }
}
