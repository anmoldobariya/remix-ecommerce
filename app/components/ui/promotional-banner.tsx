import { MessageCircleIcon, PhoneIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

interface PromotionalBannerProps {
  className?: string;
}

export function PromotionalBanner({ className = '' }: PromotionalBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 relative ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-300 text-lg">🎯</span>
            <span className="font-semibold text-sm sm:text-base">
              Get Personalized Quotes Instantly!
            </span>
          </div>
          <div className="hidden sm:block text-sm opacity-90">
            No fixed prices - We provide custom quotes for every customer
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <a
            href="https://wa.me/+1-800-OPTICAL"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors text-sm"
          >
            <MessageCircleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <a
            href="tel:+1-800-OPTICAL"
            className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors text-sm"
          >
            <PhoneIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Call</span>
          </a>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close banner"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
