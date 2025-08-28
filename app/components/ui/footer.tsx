import { Link } from '@remix-run/react';
import { MessageCircleIcon, PhoneIcon, MailIcon, MapPinIcon } from 'lucide-react';
import { Button } from './button';
import { SITE_CONFIG } from '~/utils/seo';

interface CategoryOption {
  value: string;
  label: string;
}

interface FooterProps {
  productCategories?: CategoryOption[];
}

export function Footer({ productCategories }: FooterProps = {}) {
  // Default categories for fallback
  const defaultCategories = [
    { value: 'sunglasses', label: 'Sunglasses' },
    { value: 'computer', label: 'Computer Glasses' },
    { value: 'reading', label: 'Reading Glasses' },
  ];

  const categoriesToShow = productCategories?.slice(0, 3) || defaultCategories;
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold hover:text-blue-400 transition-colors">
              {SITE_CONFIG.name}
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              {SITE_CONFIG.description}
            </p>
            <div className="flex space-x-3">
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 p-2 rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircleIcon className="w-5 h-5" />
              </a>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
                aria-label="Phone"
              >
                <PhoneIcon className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                aria-label="Email"
              >
                <MailIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Browse Collection</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors text-sm">
                  All Products
                </Link>
              </li>
              {categoriesToShow.map((category) => (
                <li key={category.value}>
                  <Link
                    to={`/products?type=${category.value}`}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Personal Consultations</li>
              <li>• Custom Pricing</li>
              <li>• Expert Recommendations</li>
              <li>• Frame Adjustments</li>
              <li>• Same-Day Quotes</li>
              <li>• Family Packages</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get Your Quote</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  {SITE_CONFIG.address.full}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <a href={`tel:${SITE_CONFIG.phone}`} className="text-sm text-gray-300 hover:text-white transition-colors">
                  {SITE_CONFIG.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MailIcon className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-sm text-gray-300 hover:text-white transition-colors">
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircleIcon className="w-4 h-4 mr-2" />
                  Get Quote on WhatsApp
                </Button>
              </a>
              <a href={`tel:${SITE_CONFIG.phone}`}>
                <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-700 hover:bg-gray-500">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  Call for Quote
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              🎯 Personalized service • 💰 Custom pricing • 🚀 Expert advice
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
