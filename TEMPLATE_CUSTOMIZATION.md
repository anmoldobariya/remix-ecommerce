# 🎨 Template Customization Guide

This Remix application is designed as a **template for eyewear businesses**. You can easily customize it for your own optical shop or eyewear brand by making simple changes to one configuration file.

## 🚀 Quick Setup

### 1. Customize Business Information

All business information is centralized in `app/utils/seo.ts`. Simply edit the `SITE_CONFIG` object:

```typescript
// app/utils/seo.ts
export const SITE_CONFIG = {
  name: 'YOUR BUSINESS NAME', // Change this to your business name
  domain: 'yourdomain.com', // Change this to your domain
  url: 'https://yourdomain.com', // Change this to your full URL
  description: 'Your business description here...', // Change this to your business description
  tagline: 'Your Business Tagline', // Change this to your tagline
  phone: '+1-555-0123', // Change this to your phone number
  email: 'hello@yourdomain.com', // Change this to your email
  whatsapp: '+1-555-0123', // Change this to your WhatsApp number
  address: {
    street: '123 Your Street',
    city: 'Your City',
    state: 'ST',
    zip: '12345',
    country: 'United States',
    full: '123 Your Street, Your City, ST 12345' // Full address string
  },
  social: {
    facebook: 'https://facebook.com/yourbusiness', // Change to your Facebook URL
    instagram: 'https://instagram.com/yourbusiness', // Change to your Instagram URL
    twitter: 'https://twitter.com/yourbusiness' // Change to your Twitter URL
  },
  logo: '/logo-light.png', // Path to your logo
  favicon: '/favicon.ico' // Path to your favicon
};
```

### 2. Replace Images

Replace these files in the `public/` folder:

- `logo-light.png` - Your main logo (light version)
- `logo-dark.png` - Your logo for dark backgrounds (optional)
- `favicon.ico` - Your website favicon

### 3. Configure Environment Variables

The following environment variables need to be configured in your `.env` file:

```bash
# Required
DATABASE_URL="your-database-connection-string"
SESSION_SECRET="your-secure-session-secret"
JWT_SECRET="your-secure-jwt-secret"

# Optional - Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_SEARCH_CONSOLE_VERIFICATION=your-verification-code

# Optional - File Uploads (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# File Upload Limits
MAX_FILE_SIZE="5242880" # 5MB in bytes
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/webp"
```

**Important:** Business information (name, phone, email, address, social media) is configured in `app/utils/seo.ts`, not environment variables. This centralizes all business data for easy template customization.

## 📍 What Gets Updated Automatically

When you change the `SITE_CONFIG`, these elements update automatically throughout the site:

### ✅ Website Content

- **Company Name** - Appears in headers, footers, titles
- **Contact Information** - Phone numbers, email, address
- **Social Media Links** - Facebook, Instagram, Twitter
- **WhatsApp Integration** - Contact buttons and links
- **SEO Meta Tags** - Titles, descriptions, structured data

### ✅ Pages That Update

- **Homepage** (`/`) - Hero section, headers, contact info
- **About Page** (`/about`) - Company story and contact details
- **Product Pages** - Contact forms and business info
- **Admin Panel** - Admin header with business name
- **Footer** - Complete contact information and social links
- **Email Templates** - Business information in contact forms

### ✅ Components That Update

- **Navigation Headers** - Business name in all headers
- **Contact Forms** - Phone, email, WhatsApp integration
- **Footer** - Address, contact info, social media
- **Promotional Banners** - Contact buttons and phone numbers
- **WhatsApp Widgets** - All WhatsApp contact buttons
- **SEO Tags** - Meta titles, descriptions, structured data

## 🎨 Advanced Customization

### Colors and Styling

The template uses Tailwind CSS. To change the color scheme:

1. Update `tailwind.config.ts` for theme colors
2. Modify CSS classes in components for custom styling

### Content Updates

- **Product Categories** - Update via admin panel
- **Banner Content** - Manage through admin interface
- **About Page Content** - Customize stats and story in `SITE_CONFIG.about`
- **Service Descriptions** - Update in component files

### About Page Customization

The About page content is fully customizable through the `SITE_CONFIG.about` section:

```typescript
// In app/utils/seo.ts
about: {
  stats: [
    { number: "1000+", label: "Happy Customers" }, // Update these numbers
    { number: "50+", label: "Premium Brands" },     // to match your business
    { number: "100%", label: "Quality Guarantee" }, // Can be years of experience,
    { number: "24/7", label: "Quote Service" }      // satisfaction rate, etc.
  ],
  story: {
    mission: "Your business mission statement...",
    commitment: "Your commitment to customers...",
    values: "Your core values and approach..."
  }
}
```

**Customization Tips:**

- Update stats to reflect your actual business metrics
- For new businesses: use "100% Quality Guarantee", "Same-Day Quotes", "Expert Service"
- For established businesses: use "X Years Experience", "X+ Happy Customers"
- Story content automatically uses your business name from `SITE_CONFIG.name`

### Features

- **Analytics** - Configure Google Analytics ID in environment
- **SEO** - All SEO settings auto-update with SITE_CONFIG
- **Database** - Uses MongoDB (configure via DATABASE_URL)

## 🚦 Testing Your Changes

1. **Start Development Server**:

   ```bash
   npm run dev
   ```

2. **Visit**: `http://localhost:5173`

3. **Check These Pages**:

   - Homepage - Verify business name and contact info
   - About page - Check company story and details
   - Footer - Confirm all contact information
   - Admin panel - Test business name in header

4. **Test Contact Features**:
   - WhatsApp buttons link to correct number
   - Phone links work properly
   - Email links open correctly

## 📱 Mobile Responsiveness

The template is fully responsive and will work on:

- Desktop computers
- Tablets
- Mobile phones

All contact information and business details automatically adapt to different screen sizes.

## 🔧 Technical Notes

### File Structure

```
app/
├── utils/
│   └── seo.ts              # ⭐ MAIN CONFIG FILE - Edit this!
├── components/ui/
│   ├── footer.tsx          # Uses SITE_CONFIG
│   ├── whatsapp-contact.tsx # Uses SITE_CONFIG
│   └── contact-info.tsx    # Uses SITE_CONFIG
├── routes/
│   ├── _index.tsx          # Uses SITE_CONFIG
│   ├── about.tsx           # Uses SITE_CONFIG
│   └── ...other routes
└── root.tsx                # Uses SITE_CONFIG
```

### Key Benefits

- **Single Source of Truth** - All business info in one file
- **No Database Changes Needed** - Pure configuration
- **SEO Optimized** - Automatic meta tags and structured data
- **Mobile Ready** - Responsive design included
- **Professional** - Clean, modern design

## 🎯 Quick Checklist

- [ ] Update business name in `SITE_CONFIG`
- [ ] Change phone number and email
- [ ] Update address information
- [ ] Add social media URLs
- [ ] Replace logo files in `public/`
- [ ] Update WhatsApp number
- [ ] Test all contact buttons
- [ ] Verify mobile responsiveness
- [ ] Check admin panel functionality
- [ ] Review SEO meta tags

## 🆘 Need Help?

If you encounter any issues:

1. Check the browser console for errors
2. Verify all URLs in SITE_CONFIG are properly formatted
3. Ensure phone numbers include country code (e.g., "+1-555-0123")
4. Make sure logo files exist in the `public/` folder

---

**🎉 That's it!** Your eyewear business template is now customized and ready to use. The template handles all the complex integration automatically - you just need to update the business details in one place.
