import { MapPinIcon, ClockIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { SITE_CONFIG } from '~/utils/seo';

export function ContactInfo() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Personalized Assistance</h3>

      <div className="space-y-4">
        {/* Address */}
        <div className="flex items-start space-x-3">
          <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Visit Our Showroom</p>
            <p className="text-gray-600 text-sm">
              {SITE_CONFIG.address.full}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start space-x-3">
          <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Call for Instant Quote</p>
            <p className="text-gray-600 text-sm">
              <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-blue-600 transition-colors">
                {SITE_CONFIG.phone}
              </a>
            </p>
            <p className="text-gray-500 text-xs">Free consultation & personalized pricing</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start space-x-3">
          <MailIcon className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Email Inquiries</p>
            <p className="text-gray-600 text-sm">
              <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-blue-600 transition-colors">
                {SITE_CONFIG.email}
              </a>
            </p>
            <p className="text-gray-500 text-xs">Detailed quotes within 2 hours</p>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-start space-x-3">
          <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Consultation Hours</p>
            <div className="text-gray-600 text-sm space-y-1">
              <p>Monday - Saturday: 9:30 AM - 9:00 PM</p>
              <p>Sunday: 9:30 AM - 7:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">
          🎯 <strong>Personal Service:</strong> Our optical specialists provide one-on-one consultations to find the perfect eyewear and best pricing for your needs.
        </p>
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✅ Free Consultations
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            📦 Same Day Quotes
          </span>
        </div>
      </div>
    </div>
  );
}
