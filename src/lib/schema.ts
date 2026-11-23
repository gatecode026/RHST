import { SITE_URL } from '@/lib/seo';

/**
 * Returns absolute URL given a relative or already absolute URL.
 */
export function getAbsoluteUrl(urlOrPath: string = ''): string {
  if (!urlOrPath) return SITE_URL;
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  const base = SITE_URL.replace(/\/+$/, '');
  const cleanPath = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`;
  return `${base}${cleanPath}`;
}

/**
 * 1. Organization Schema (Structured Data)
 * Applied on Homepage ('/') and About page ('/about')
 */
export function getOrganizationSchema() {
  const base = SITE_URL.replace(/\/+$/, '');

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VALNQIX',
    legalName: 'RHST E-Commerce Pvt. Ltd.',
    alternateName: ['RHST ECOMMERCE PRIVATE LIMITED', 'VALNQIX IT Solutions'],
    url: base,
    logo: `${base}/images/logo.png`,
    image: `${base}/images/logo.png`,
    email: 'info@valnqix.in',
    telephone: '+91-98290-12345',
    taxID: '08AAPCR9622R1Z9',
    identifier: 'U47912RJ2026PTC115018',
    description:
      'VALNQIX is an Indian B2B IT hardware marketplace and enterprise technology solutions platform owned and operated by RHST E-Commerce Pvt. Ltd. Connecting businesses with verified manufacturers, wholesalers, and certified service engineers.',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'G-52, Sector 63',
        addressLocality: 'Noida',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201301',
        addressCountry: 'IN',
        name: 'Noida Corporate Office'
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Khasra 5437/1641 Kali Ka, Khana Sanganer Chapola, Sanganer Bazar, Sanganer',
        addressLocality: 'Jaipur',
        addressRegion: 'Rajasthan',
        postalCode: '302029',
        addressCountry: 'IN',
        name: 'Registered Corporate Office'
      }
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-98290-12345',
        contactType: 'customer service',
        email: 'info@valnqix.in',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ],
          opens: '09:00',
          closes: '19:00'
        }
      }
    ],
    sameAs: [
      'https://www.valnqix.com',
      'https://twitter.com/valnqix',
      'https://facebook.com/valnqix',
      'https://linkedin.com/company/valnqix'
    ]
  };
}

/**
 * 2. Product Schema (Structured Data)
 * Applied on all product pages ('/products/[id]')
 */
export function getProductSchema(product: any, id: string) {
  const base = SITE_URL.replace(/\/+$/, '');
  const productUrl = `${base}/products/${product.slug || id}`;
  const imageUrl = getAbsoluteUrl(product.image || '/images/logo.png');

  const priceNum = typeof product.price === 'number'
    ? product.price
    : parseInt(String(product.price).replace(/[^\d]/g, ''), 10) || 0;

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [imageUrl],
    description: product.description || `Buy genuine ${product.name} with full manufacturer warranty and GST tax invoice from VALNQIX.`,
    sku: product.sku || `SKU-VAL-${id}`,
    mpn: product.sku || `MPN-VAL-${id}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'VALNQIX'
    },
    category: product.category || 'Hardware',
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: priceNum,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: (product.stock !== undefined ? product.stock > 0 : true)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.sellerName || 'RHST E-Commerce Pvt. Ltd. (VALNQIX Partner)',
        legalName: 'RHST E-Commerce Pvt. Ltd.'
      }
    }
  };

  // Attach reviews if present
  if (product.reviews && Array.isArray(product.reviews) && product.reviews.length > 0) {
    const validReviews = product.reviews.filter((r: any) => r && r.rating);
    if (validReviews.length > 0) {
      const totalRating = validReviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 5), 0);
      const avgRating = (totalRating / validReviews.length).toFixed(1);

      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: validReviews.length,
        bestRating: '5',
        worstRating: '1'
      };

      schema.review = validReviews.slice(0, 5).map((r: any) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: r.author || 'Verified Buyer'
        },
        datePublished: r.date || '2026-06-22',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating || 5,
          bestRating: '5',
          worstRating: '1'
        },
        reviewBody: r.text || 'High quality IT product delivered on time.'
      }));
    }
  }

  return schema;
}

/**
 * 3. BreadcrumbList Schema (Structured Data)
 * Applied on all inner category, product, and service pages.
 */
export function getBreadcrumbSchema(items: { name: string; url?: string }[]) {
  const base = SITE_URL.replace(/\/+$/, '');

  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: base
    },
    ...items.map((item, index) => {
      const element: any = {
        '@type': 'ListItem',
        position: index + 2,
        name: item.name
      };
      if (item.url) {
        element.item = getAbsoluteUrl(item.url);
      }
      return element;
    })
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };
}
