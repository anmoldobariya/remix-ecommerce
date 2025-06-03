import { MessageCircleIcon, PhoneIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface WhatsAppContactProps {
  productName: string;
  productSku?: string;
  size?: 'sm' | 'lg';
  className?: string;
}

export function WhatsAppContact({
  productName,
  productSku,
  size = 'lg',
  className = ''
}: WhatsAppContactProps) {
  // WhatsApp business number (replace with actual number)
  const whatsappNumber = '+1-800-OPTICAL'; // Update this with your actual WhatsApp business number

  const generateMessage = () => {
    const message = `🌟 Hello! I'm interested in the *${productName}*${productSku ? ` (Model: ${productSku})` : ''}

Could you please provide:
💰 Your best pricing & exclusive offers
📦 Availability & delivery information  
🔍 Product details & expert recommendations
🎁 Current promotions & bundle deals

I'm looking to purchase soon and would appreciate your personal assistance! 😊

Thank you for your time! 🙏`;
    return encodeURIComponent(message);
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${generateMessage()}`;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-gray-900">💰 Get Instant Quote & Best Price!</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Connect with our optical specialists for personalized pricing, exclusive offers, and expert recommendations tailored just for you
        </p>
      </div>

      <Button
        asChild
        className={`w-full touch-manipulation bg-green-500 hover:bg-green-700 text-white font-semibold ${size === 'sm' ? 'text-sm py-2' : 'text-base py-3 sm:py-4'
          }`}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          <MessageCircleIcon className={`mr-2 ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
          <span className="font-medium">Get Quote on WhatsApp</span>
        </a>
      </Button>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          ⚡ Instant quotes • 🎯 Personal service • 💎 Premium quality • 🔥 Best deals
        </p>
      </div>
    </div>
  );
}

interface PhoneContactProps {
  size?: 'sm' | 'lg';
  className?: string;
}

export function PhoneContact({ size = 'lg', className = '' }: PhoneContactProps) {
  const phoneNumber = '+1-800-OPTICAL'; // Update with actual phone number

  return (
    <Button
      asChild
      variant="outline"
      className={`w-full touch-manipulation font-semibold border-gray-300 hover:border-gray-400 hover:bg-gray-50 ${size === 'sm' ? 'text-sm py-2' : 'text-base py-3'
        } ${className}`}
    >
      <a href={`tel:${phoneNumber}`} className="flex items-center justify-center">
        <PhoneIcon className={`mr-2 ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
        <span className="font-medium">Call for Personal Quote</span>
      </a>
    </Button>
  );
}

// Simple WhatsApp button for product cards
interface SimpleWhatsAppButtonProps {
  productName: string;
  productSku?: string;
  className?: string;
}

export function SimpleWhatsAppButton({
  productName,
  productSku,
  className = ''
}: SimpleWhatsAppButtonProps) {
  const whatsappNumber = '+1-800-OPTICAL'; // Update this with your actual WhatsApp business number

  const generateMessage = () => {
    const message = `👋 Hi! Quick question about the *${productName}*${productSku ? ` (${productSku})` : ''} 

💰 What's your best price for this item?
🎯 Any current offers or promotions?
📦 Is it available for immediate delivery?

Looking forward to your personal quote! 😊`;
    return encodeURIComponent(message);
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${generateMessage()}`;

  return (
    <Button
      asChild
      size="sm"
      className={`bg-green-500 hover:bg-green-700 text-white font-semibold text-xs px-3 py-1 ${className}`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()} // Prevent card click when clicking button
        className="flex items-center justify-center"
      >
        <MessageCircleIcon className="w-3 h-3 mr-1" />
        <span className="font-medium">Get Quote</span>
      </a>
    </Button>
  );
}
