// Google Analytics and Search Console integration
import { useLocation } from "@remix-run/react";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

// Configuration
const GA_MEASUREMENT_ID = process.env.NODE_ENV === 'production'
  ? 'G-XXXXXXXXXX' // Replace with your actual Google Analytics ID
  : 'G-XXXXXXXXXX'; // Development GA ID (optional)

const GOOGLE_SEARCH_CONSOLE_VERIFICATION = 'your-search-console-verification-code';

// Google Analytics component
export function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  // Only render in production
  if (process.env.NODE_ENV !== 'production' || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      {/* Google Search Console Verification */}
      <meta
        name="google-site-verification"
        content={GOOGLE_SEARCH_CONSOLE_VERIFICATION}
      />
    </>
  );
}

// Enhanced tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// E-commerce tracking for product interactions
export const trackProductView = (product: any) => {
  trackEvent('view_item', {
    currency: 'USD',
    value: product.price,
    items: [{
      item_id: product._id,
      item_name: product.name,
      category: product.category || 'eyewear',
      price: product.price,
      brand: product.brand || 'Optical Shop'
    }]
  });
};

export const trackProductListView = (products: any[], listName: string) => {
  trackEvent('view_item_list', {
    item_list_name: listName,
    items: products.map(product => ({
      item_id: product._id,
      item_name: product.name,
      category: product.category || 'eyewear',
      price: product.price,
      brand: product.brand || 'Optical Shop'
    }))
  });
};

export const trackWhatsAppContact = (productId?: string) => {
  trackEvent('contact_whatsapp', {
    method: 'whatsapp',
    product_id: productId,
    contact_type: 'inquiry'
  });
};

export const trackPhoneContact = (productId?: string) => {
  trackEvent('contact_phone', {
    method: 'phone',
    product_id: productId,
    contact_type: 'inquiry'
  });
};

export const trackSearch = (searchTerm: string, resultCount: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    result_count: resultCount
  });
};

// Custom hook for analytics
export function useAnalytics() {
  return {
    trackEvent,
    trackProductView,
    trackProductListView,
    trackWhatsAppContact,
    trackPhoneContact,
    trackSearch
  };
}
