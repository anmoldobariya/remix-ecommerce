// SEO utilities for generating meta tags, structured data, and SEO-optimized content
import type { MetaDescriptor } from '@remix-run/node';

// Brand and business information - CUSTOMIZE THIS SECTION FOR YOUR TEMPLATE
export const SITE_CONFIG = {
  name: 'Divine Optical', // Change this to your business name
  domain: 'opticalshop.com', // Change this to your domain
  url: 'https://opticalshop.com', // Change this to your full URL
  description:
    'Premium eyewear collection with personalized service. Get instant quotes and expert consultations for all your vision needs.', // Change this to your business description
  tagline: 'Premium Eyewear with Personal Service', // Change this to your tagline
  phone: '+919054972726', // Change this to your phone number
  email: 'divineoptical23@gmail.com', // Change this to your email
  whatsapp: '+919054972726', // Change this to your WhatsApp number
  address: {
    street: '123 Vision Street',
    city: 'Optical Plaza',
    state: 'NY',
    zip: '12345',
    country: 'United States',
    full: 'G-34, Happy Hallmark Shoppers, near Celebrity Greens, Vesu, Surat, Gujarat-395007' // Full address string
  },
  social: {
    facebook: 'https://facebook.com/opticalshop', // Change to your Facebook URL
    instagram: 'https://www.instagram.com/divine_optical/', // Change to your Instagram URL
    // twitter: 'https://twitter.com/opticalshop' // Change to your Twitter URL
  },
  logo: '/logo-light.png',
  favicon: '/favicon.ico',
  // About page customization - Update these stats and content for your business
  about: {
    stats: [
      { number: '1000+', label: 'Happy Customers' }, // Customize these numbers to match your business
      { number: '25+', label: 'Premium Brands' }, // Examples for new businesses:
      { number: '100%', label: 'Quality Guarantee' }, // "Same-Day", "Expert Staff", "Custom Quotes"
      { number: '100%', label: 'Customer Satisfaction' } // "100% Satisfaction", "Latest Tech", "Personal Care"
      // Examples for established businesses: "X Years Experience", "X,000+ Customers", "98% Satisfaction"
    ],
    story: {
      // Customize this story content for your business background and values
      // The {BUSINESS_NAME} placeholder will be replaced with your actual business name
      mission:
        'At {BUSINESS_NAME}, we started with a simple mission: to provide high-quality eyewear and exceptional customer service to our community. We believe that finding the perfect pair of glasses should be a personalized experience, not a one-size-fits-all approach.',
      commitment:
        'Our commitment goes beyond just selling eyewear. We focus on building lasting relationships with our customers by offering personalized consultations, competitive pricing, and expert guidance to help you find eyewear that perfectly matches your lifestyle and budget.',
      values:
        'Today, our team of experienced opticians and style consultants continues to uphold the values that define our service: expertise, integrity, and genuine care for every customer who chooses us for their vision needs.'
    }
  }
};

// SEO Keywords by category
export const SEO_KEYWORDS = {
  primary: [
    'optical shop',
    'eyewear',
    'sunglasses',
    'prescription glasses',
    'computer glasses',
    'reading glasses'
  ],
  secondary: [
    'frames',
    'lenses',
    'eye care',
    'vision correction',
    'designer glasses',
    'affordable eyewear'
  ],
  local: [
    'optical shop near me',
    'eyewear store',
    'glasses shop',
    'sunglasses store'
  ],
  features: [
    'personalized quotes',
    'expert consultation',
    'best prices',
    'custom fitting',
    'professional service'
  ]
};

// Generate comprehensive meta tags
interface SEOMetaOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  structuredData?: object;
}

export function generateSEOMeta(
  options: SEOMetaOptions = {}
): MetaDescriptor[] {
  const {
    title = SITE_CONFIG.name,
    description = SITE_CONFIG.description,
    keywords = [...SEO_KEYWORDS.primary, ...SEO_KEYWORDS.secondary],
    canonical,
    image = `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    type = 'website',
    noIndex = false
  } = options;

  const fullTitle = title.includes(SITE_CONFIG.name)
    ? title
    : `${title} | ${SITE_CONFIG.name}`;
  const canonicalUrl = canonical || SITE_CONFIG.url;

  const meta: MetaDescriptor[] = [
    // Basic meta tags
    { title: fullTitle },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords.join(', ') },
    { name: 'author', content: SITE_CONFIG.name },

    // Viewport and charset (handled in root layout)

    // Robots
    {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow'
    },

    // Canonical URL
    { tagName: 'link', rel: 'canonical', href: canonicalUrl },

    // Open Graph
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: image },
    { property: 'og:image:alt', content: `${SITE_CONFIG.name} - ${title}` },
    { property: 'og:site_name', content: SITE_CONFIG.name },
    { property: 'og:locale', content: 'en_US' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: `${SITE_CONFIG.name} - ${title}` },

    // Additional SEO tags
    { name: 'theme-color', content: '#2563eb' },
    { name: 'apple-mobile-web-app-title', content: SITE_CONFIG.name },
    { name: 'application-name', content: SITE_CONFIG.name },
    { name: 'msapplication-TileColor', content: '#2563eb' }
  ];

  // Note: Structured data should be handled separately in components
  // as Remix meta functions don't support script tags

  return meta;
}

// Generate structured data for different page types
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    description: SITE_CONFIG.description,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.zip,
      addressCountry: SITE_CONFIG.address.country
    },
    sameAs: [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
      // SITE_CONFIG.social.twitter
    ]
  };
}

export function generateLocalBusinessStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_CONFIG.url}#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    description: SITE_CONFIG.description,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.zip,
      addressCountry: SITE_CONFIG.address.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.7128', // Replace with actual coordinates
      longitude: '-74.0060'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:30',
        closes: '21:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '09:30',
        closes: '19:00'
      }
    ],
    sameAs: [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
      // SITE_CONFIG.social.twitter
    ]
  };
}

export function generateProductStructuredData(product: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image:
      product.images?.map((img: string) => `${SITE_CONFIG.url}${img}`) || [],
    brand: {
      '@type': 'Brand',
      name: product.brand || SITE_CONFIG.name
    },
    category: product.category || 'Eyewear',
    sku: product._id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127'
    }
  };
}

export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`
    }))
  };
}

export function generateWebSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/products?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

// SEO-friendly URL generation
export function generateSEOUrl(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Generate meta keywords for products
export function generateProductKeywords(product: any): string[] {
  const keywords = [...SEO_KEYWORDS.primary];

  if (product.category) {
    keywords.push(product.category.toLowerCase());
  }

  if (product.gender) {
    keywords.push(`${product.gender} eyewear`, `${product.gender} glasses`);
  }

  if (product.type) {
    keywords.push(product.type.toLowerCase());
  }

  if (product.brand) {
    keywords.push(product.brand.toLowerCase());
  }

  keywords.push(...SEO_KEYWORDS.features);

  return keywords;
}

// Generate SEO-optimized descriptions
export function generateProductDescription(product: any): string {
  const base = `Shop ${product.name} at ${SITE_CONFIG.name}.`;
  const features =
    product.features?.slice(0, 2).join(', ') || 'premium features';
  const category = product.category || 'eyewear';
  const cta =
    'Get personalized quotes and expert consultation. Contact us for instant pricing!';

  return `${base} ${features} in our ${category} collection. ${cta}`;
}

// Generate FAQ structured data
export function generateFAQStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I get a personalized quote for eyewear?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Simply contact us via WhatsApp at ${SITE_CONFIG.whatsapp} or call us directly. Our experts will provide instant personalized quotes based on your specific needs and preferences.`
        }
      },
      {
        '@type': 'Question',
        name: 'Do you offer prescription glasses?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer a complete range of prescription eyewear including single vision, bifocal, and progressive lenses. Our certified opticians will help you find the perfect prescription solution.'
        }
      },
      {
        '@type': 'Question',
        name: 'What types of eyewear do you carry?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We carry a comprehensive collection including sunglasses, prescription glasses, computer glasses, reading glasses, and safety eyewear for men, women, and children.'
        }
      },
      {
        '@type': 'Question',
        name: 'How quickly can I get my glasses?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most orders are completed within 7-10 business days. Rush orders and same-day service are available for certain products. Contact us for specific timeframes.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you provide eye exams?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer comprehensive eye examinations by licensed optometrists. Schedule your appointment for a complete vision assessment and personalized eyewear recommendations.'
        }
      },
      {
        '@type': 'Question',
        name: 'What brands do you carry?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We carry premium eyewear from leading brands including Ray-Ban, Oakley, Gucci, Prada, Tom Ford, and many more. Contact us to check availability of specific brands.'
        }
      }
    ]
  };
}

// SEO-optimized image utilities
export function generateImageAlt(
  product: any,
  context: string = 'product'
): string {
  const brand = product.brand ? `${product.brand} ` : '';
  const category = product.category || 'eyewear';
  const gender = product.gender ? ` for ${product.gender}` : '';

  switch (context) {
    case 'thumbnail':
      return `${brand}${product.name} - ${category}${gender} thumbnail`;
    case 'gallery':
      return `${brand}${product.name} - ${category}${gender} gallery image`;
    case 'hero':
      return `${brand}${product.name} - Premium ${category}${gender} at ${SITE_CONFIG.name}`;
    default:
      return `${brand}${product.name} - ${category}${gender}`;
  }
}

export function generateImageTitle(product: any): string {
  const brand = product.brand ? `${product.brand} ` : '';
  return `${brand}${product.name} | ${SITE_CONFIG.name}`;
}

// Generate Open Graph image for products
export function generateProductOGImage(product: any): string {
  // If product has images, use the first one
  if (product.images && product.images.length > 0) {
    return `${SITE_CONFIG.url}${product.images[0]}`;
  }

  // Fallback to site logo
  return `${SITE_CONFIG.url}${SITE_CONFIG.logo}`;
}

// Page performance optimization suggestions
export const SEO_PERFORMANCE = {
  criticalCSS: [
    'above-the-fold styles',
    'navigation styles',
    'hero section styles'
  ],
  preloadImages: ['/logo-light.png', '/logo-dark.png'],
  lazyLoadImages: true,
  webpImages: true,
  imageOptimization: {
    thumbnail: { width: 300, height: 300 },
    gallery: { width: 800, height: 600 },
    hero: { width: 1200, height: 800 }
  }
};

// Core Web Vitals optimization
export const CORE_WEB_VITALS = {
  LCP: {
    target: 2.5, // seconds
    optimizations: [
      'Optimize hero images',
      'Preload critical resources',
      'Use CDN for static assets'
    ]
  },
  FID: {
    target: 100, // milliseconds
    optimizations: [
      'Minimize JavaScript execution time',
      'Use web workers for heavy tasks',
      'Defer non-critical scripts'
    ]
  },
  CLS: {
    target: 0.1, // score
    optimizations: [
      'Set image dimensions',
      'Reserve space for dynamic content',
      'Use CSS aspect-ratio'
    ]
  }
};
