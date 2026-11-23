/**
 * Utility to identify deleted/discontinued non-IT categories and product slugs.
 * Used across Middleware, Dynamic Route handlers, and Sitemap generation
 * to ensure 410 Gone / 301 Redirect responses and complete exclusion from search index.
 */

export const NON_IT_CATEGORIES = new Set([
  'bag',
  'bags',
  'sidebag',
  'sidebags',
  'clock',
  'clocks',
  'shoe',
  'shoes',
  'footwear',
  'clothes',
  'clothing',
  "women's",
  'womens',
  "women's wear",
  'womens wear',
  "men's wear",
  'mens wear',
  'soft toys',
  'soft toy',
  'toys',
  'toy',
  'home appliances',
  'appliances',
  'kitchen appliances',
  'air fryer',
  'air fryers',
  'mixer',
  'mixers',
  'washing machine',
  'washing machines',
  'toaster',
  'toasters',
  'juicer',
  'juicers',
  'dishwasher',
  'dishwashers',
  'induction',
  'geyser',
  'geysers',
  'fan',
  'fans',
  'ac',
  'air conditioner',
  'vaccum',
  'vacuum',
  'refrigerator',
  'refrigerators',
  'cookware',
  'handbag',
  'handbags',
  'luggage',
  'purse',
  'purses',
  'apparel',
  'apparels',
  'ethnic wear',
  'plush',
  'plushies'
]);

const NON_IT_CATEGORY_REGEX = /^(bags?|sidebags?|clocks?|shoes?|footwear|clothes|clothing|women'?s(\s+wear)?|men'?s(\s+wear)?|soft\s+toys?|toys?|home\s+appliances?|kitchen\s+appliances?|appliances?|air\s+fryers?|mixers?|washing\s+machines?|toasters?|juicers?|dishwashers?|inductions?|geysers?|fans?|ac|air\s+conditioners?|vacc?uums?|refrigerators?|cookware|handbags?|luggage|purses?|apparels?|ethnic\s+wear)$/i;

// Keywords that indicate legitimate enterprise IT hardware & accessories
const IT_HARDWARE_INDICATORS = [
  'laptop', 'notebook', 'desktop', 'server', 'workstation', 'firewall', 'router', 'switch',
  'monitor', 'keyboard', 'mouse', 'printer', 'scanner', 'processor', 'motherboard',
  'ram', 'ssd', 'hdd', 'hard-drive', 'graphics-card', 'cisco', 'fortinet', 'mikrotik',
  'tp-link', 'ubiquiti', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'macbook',
  'ipad', 'intel', 'amd', 'nvidia', 'logitech', 'canon', 'epson', 'brother', 'toner',
  'cartridge', 'ups', 'apc', 'server-rack', 'patch-panel', 'ethernet', 'hdmi', 'cat6',
  'usb-hub', 'docking-station'
];

const NON_IT_SLUG_KEYWORDS = [
  // Specific URLs identified in Google Search Index
  'women-beige-textured-short-sleeves-casual-shirt',
  'women-white-print-casual-round-neck-top',
  'baroncelli-italian-leather-purse',
  
  // Apparel & Clothing
  'shirt', 't-shirt', 'tshirt', 'dress', 'saree', 'kurti', 'jeans', 'pant', 'trouser',
  'hoodie', 'jacket', 'blouse', 'clothing', 'apparel', 'garment', 'ethnic-wear',
  'casual-shirt', 'casual-top', 'round-neck', 'short-sleeves', 'kurta', 'leggings',
  
  // Footwear
  'sneaker', 'footwear', 'sandal', 'slipper', 'heel', 'boots',
  
  // Bags & Purses
  'purse', 'handbag', 'sidebag', 'backpack', 'luggage', 'suitcase', 'wallet', 'tote',
  'crossbody-bag', 'shoulder-crossbody', 'leather-purse',
  
  // Toys & Plushies
  'plush', 'plushie', 'teddy', 'doll', 'soft-toy',
  
  // Home & Kitchen Appliances
  'blender', 'juicer', 'cooker', 'toaster', 'microwave', 'refrigerator', 'fridge',
  'chimney', 'cookware', 'dishwasher', 'air-fryer', 'washing-machine', 'water-heater',
  'mixer-grinder', 'electric-kettle', 'gas-stove',
  
  // Clocks & Non-IT Watches
  'alarm-clock', 'wall-clock', 'cuckoo', 'watch-band', 'sonic-boom-alarm-clock',
  'analog-clock', 'table-clock',
  
  // Non-IT Brands
  'van-huesen', 'van-heusen', 'souled-store', 'baroncelli', 'nike', 'puma', 'hamilton-beach',
  'ninja', 'kitchenaid', 'cuisinart', 'dualit', 'nostalgia', 'kuvings', 'sujata',
  'faber', 'winco', 'camplux', 'hafele', 'dorboker', 'hones', 'luxaire', 'electrolux',
  'arctic-fox', 'narwal', 'ecovacs', 'dreame', 'vornado', 'kuhl', 'astberg', 'smartways',
  'gm-oxy', 'rossmann', 'havai', 'forimo', 'shyfoy', 'lowepro', 'manfrotto'
];

// Regex matching structural boundaries for non-IT terms in slug
const NON_IT_SLUG_REGEX = /(^|[-_])(women|womens|shirt|shirts|dress|dresses|saree|sarees|kurti|kurtis|t-?shirt|jeans|hoodie|hoodies|blouse|blouses|clothing|apparel|garment|shoes?|sneakers?|boots?|sandals?|footwear|slippers?|purses?|handbags?|sidebags?|luggage|suitcases?|wallets?|totes?|plushies?|teddys?|dolls?|blenders?|juicers?|toasters?|cookware|dishwashers?|air-?fryer|induction|alarm-?clock|wall-?clock|cuckoo|watch-?band|baroncelli|van-?huesen|van-?heusen|souled-?store|nike|puma|hamilton-?beach|kitchenaid|cuisinart|kuvings|sujata|faber|dorboker|hones|luxaire|arctic-?fox)([-_]|$)/i;

/**
 * Returns true if a given category name is an obsolete / deleted non-IT category.
 */
export function isNonItCategory(category: string | null | undefined): boolean {
  if (!category || typeof category !== 'string') return false;
  const clean = category.trim().toLowerCase();
  if (NON_IT_CATEGORIES.has(clean)) return true;
  return NON_IT_CATEGORY_REGEX.test(clean);
}

/**
 * Returns true if a product slug or URL path refers to a deleted non-IT item.
 */
export function isNonItSlug(slugOrPath: string | null | undefined): boolean {
  if (!slugOrPath || typeof slugOrPath !== 'string') return false;
  const clean = slugOrPath.trim().toLowerCase();

  // If clearly matched with an IT hardware term and does NOT contain explicit non-IT brands/terms, treat as valid IT
  const hasItIndicator = IT_HARDWARE_INDICATORS.some(ind => clean.includes(ind));
  const hasDefiniteNonItTerm = 
    clean.includes('shirt') || clean.includes('dress') || clean.includes('saree') || 
    clean.includes('kurti') || clean.includes('purse') || clean.includes('baroncelli') || 
    clean.includes('van-heusen') || clean.includes('van-huesen') || clean.includes('plush') || 
    clean.includes('clock') || clean.includes('fryer') || clean.includes('dishwasher') ||
    clean.includes('juicer') || clean.includes('cooker') || clean.includes('shoes') ||
    clean.includes('sneaker') || clean.includes('sidebag');

  if (hasItIndicator && !hasDefiniteNonItTerm) {
    return false;
  }

  // 1. Direct keyword substring check
  for (const kw of NON_IT_SLUG_KEYWORDS) {
    if (clean.includes(kw)) return true;
  }

  // 2. Structural boundary regex check
  return NON_IT_SLUG_REGEX.test(clean);
}

/**
 * Generates an SEO-optimized 410 Gone HTML page.
 * Signals permanent removal to search engine bots while providing human visitors
 * with a clean branded interface and automatic redirect to the live IT catalog.
 */
export function get410GoneHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>410 Gone | Product Discontinued - VALNQIX</title>
  <meta name="robots" content="noindex, nofollow, gone" />
  <meta http-equiv="refresh" content="3; url=/products" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
    body { background-color: #f8fafc; color: #1e293b; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
    .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 3rem 2.5rem; max-width: 560px; width: 100%; text-align: center; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
    .badge { display: inline-block; background-color: #fee2e2; color: #dc2626; font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem; }
    .logo { font-size: 26px; font-weight: 800; color: #0284c7; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 1rem; color: #0f172a; }
    p { font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 2rem; }
    .btn { display: inline-flex; align-items: center; gap: 8px; background-color: #16a34a; color: #ffffff; font-weight: 600; font-size: 15px; text-decoration: none; padding: 12px 28px; border-radius: 8px; transition: background-color 0.2s ease; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25); }
    .btn:hover { background-color: #15803d; }
    .redirect-hint { margin-top: 1.5rem; font-size: 13px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">VALNQIX</div>
    <div class="badge">HTTP 410 &bull; Gone</div>
    <h1>Product Permanently Discontinued</h1>
    <p>This non-IT item has been permanently removed from the catalog as VALNQIX specializes exclusively in corporate IT hardware, enterprise networking, laptops, servers, and business technology solutions.</p>
    <a href="/products" class="btn">Explore IT Products Catalog &rarr;</a>
    <div class="redirect-hint">Redirecting to products catalog in 3 seconds...</div>
  </div>
</body>
</html>`;
}
