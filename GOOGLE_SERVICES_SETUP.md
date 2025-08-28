# 🔍 Google Analytics & Search Console Setup Guide

This guide will walk you through setting up Google Analytics 4 (GA4) and Google Search Console verification for your Remix application.

## 📊 Google Analytics 4 Setup

### Step 1: Create a Google Analytics Account

1. **Visit Google Analytics**

   - Go to [analytics.google.com](https://analytics.google.com)
   - Sign in with your Google account

2. **Create an Account**

   - Click "Start measuring"
   - Enter an account name (e.g., "Your Business Name")
   - Configure data sharing settings as desired
   - Click "Next"

3. **Create a Property**

   - Enter a property name (e.g., "Your Website Name")
   - Select your reporting time zone
   - Select your currency
   - Click "Next"

4. **Business Information**
   - Select your industry category
   - Select your business size
   - Choose how you intend to use Google Analytics
   - Click "Create"

### Step 2: Set Up Data Stream

1. **Choose Platform**

   - Select "Web" as your platform

2. **Set Up Web Stream**

   - Enter your website URL (e.g., `https://yourdomain.com`)
   - Enter a stream name (e.g., "Main Website")
   - Click "Create stream"

3. **Get Your Measurement ID**
   - After creating the stream, you'll see your **Measurement ID**
   - It looks like: `G-XXXXXXXXXX`
   - Copy this ID - you'll need it for your `.env` file

### Step 3: Configure Your Application

1. **Update Environment Variables**

   ```bash
   # In your .env file, replace:
   GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"

   # With your actual Measurement ID:
   GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
   ```

2. **Verify Implementation**
   - Your app already has the analytics component set up in `app/components/analytics.tsx`
   - The component will automatically use your environment variable
   - Analytics will only load in production mode

### Step 4: Test Your Setup

1. **Deploy to Production**

   - Google Analytics only works in production mode
   - Deploy your application with the new environment variable

2. **Verify Tracking**
   - Visit your live website
   - Go to Google Analytics → Reports → Realtime
   - You should see your visit appear in real-time data

## 🔍 Google Search Console Setup

### Step 1: Access Search Console

1. **Visit Search Console**
   - Go to [search.google.com/search-console](https://search.google.com/search-console)
   - Sign in with your Google account

### Step 2: Add Your Property

1. **Add Property**
   - Click "Add property"
   - Choose "URL prefix" property type
   - Enter your website URL (e.g., `https://yourdomain.com`)
   - Click "Continue"

### Step 3: Verify Ownership

1. **Choose HTML Tag Method**

   - Select "HTML tag" from the verification methods
   - You'll see a meta tag like:
     ```html
     <meta name="google-site-verification" content="abc123def456ghi789..." />
     ```

2. **Copy the Verification Code**
   - Copy only the content value (the part between quotes after `content=`)
   - Example: `abc123def456ghi789...`

### Step 4: Configure Your Application

1. **Update Environment Variables**

   ```bash
   # In your .env file, replace:
   GOOGLE_SEARCH_CONSOLE_VERIFICATION="your-google-search-console-verification-code"

   # With your actual verification code:
   GOOGLE_SEARCH_CONSOLE_VERIFICATION="abc123def456ghi789..."
   ```

2. **Verify Implementation**
   - Your app already includes the verification meta tag in `app/components/analytics.tsx`
   - The component will automatically use your environment variable

### Step 5: Complete Verification

1. **Deploy Your Changes**

   - Deploy your application with the updated environment variable

2. **Verify in Search Console**
   - Go back to Google Search Console
   - Click "Verify" button
   - If successful, you'll see a confirmation message

## 🎯 Available Analytics Tracking

Your application includes comprehensive analytics tracking:

### Automatic Tracking

- **Page views** - Tracked automatically on route changes
- **Site verification** - Meta tag added automatically

### Custom Event Tracking

Use the `useAnalytics()` hook in your components:

```tsx
import { useAnalytics } from '~/components/analytics';

function ProductPage() {
  const analytics = useAnalytics();

  // Track product view
  analytics.trackProductView(product);

  // Track WhatsApp contact
  analytics.trackWhatsAppContact(productId);

  // Track phone contact
  analytics.trackPhoneContact(productId);

  // Track search
  analytics.trackSearch(searchTerm, resultCount);
}
```

### E-commerce Events

- `trackProductView(product)` - When user views a product
- `trackProductListView(products, listName)` - When user views product list
- `trackWhatsAppContact(productId)` - When user contacts via WhatsApp
- `trackPhoneContact(productId)` - When user contacts via phone
- `trackSearch(term, count)` - When user performs search

## ✅ Verification Checklist

### Google Analytics

- [ ] Created Google Analytics 4 property
- [ ] Obtained Measurement ID (G-XXXXXXXXXX)
- [ ] Updated `GOOGLE_ANALYTICS_ID` in `.env` file
- [ ] Deployed to production
- [ ] Verified real-time tracking works

### Google Search Console

- [ ] Added property in Search Console
- [ ] Obtained verification code
- [ ] Updated `GOOGLE_SEARCH_CONSOLE_VERIFICATION` in `.env` file
- [ ] Deployed to production
- [ ] Completed verification in Search Console

## 🔧 Troubleshooting

### Analytics Not Working

- Ensure you're testing in production mode (analytics disabled in development)
- Check browser console for errors
- Verify the Measurement ID format is correct (starts with 'G-')
- Confirm environment variables are loaded correctly

### Search Console Verification Failed

- Ensure the verification code is exact (no extra spaces or quotes)
- Check that the meta tag appears in the page source
- Wait a few minutes after deployment before verifying
- Try the "URL prefix" property type if domain verification fails

### Environment Variables Not Loading

- Restart your development server after changing `.env`
- Ensure `.env` file is in the project root
- Check that environment variables are properly formatted (no spaces around `=`)

## 📈 Next Steps

After setup is complete:

1. **Set up Goals** - Configure conversion goals in Google Analytics
2. **Create Audiences** - Set up audience segments for remarketing
3. **Submit Sitemap** - Add your sitemap to Search Console (`/sitemap.xml`)
4. **Monitor Performance** - Regularly check both platforms for insights

## 🔗 Useful Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Google Search Console Help](https://support.google.com/webmasters)
- [GA4 E-commerce Implementation Guide](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
