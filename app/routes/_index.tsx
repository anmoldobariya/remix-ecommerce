import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getDb } from "~/utils/db.server";
import { getUser } from "~/utils/auth.server";
import { Button } from "~/components/ui/button";
import { ChevronRightIcon, ArrowRightIcon, MenuIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { SimpleWhatsAppButton } from "~/components/ui/whatsapp-contact";
import { OptimizedImage } from "~/components/ui/optimized-image";
import { PromotionalBanner } from "~/components/ui/promotional-banner";
import { Footer } from "~/components/ui/footer";
import { useLoadingState } from "~/hooks/useLoadingState";
import { LoadingBanner, LoadingProductGrid, LoadingSpinner } from "~/components/ui/loading";
import {
  generateSEOMeta,
  generateLocalBusinessStructuredData,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  SITE_CONFIG,
  SEO_KEYWORDS
} from "~/utils/seo";

export const meta: MetaFunction = () => {
  const localBusinessData = generateLocalBusinessStructuredData();
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: "/" }
  ]);
  const faqData = generateFAQStructuredData();

  // Combine structured data
  const combinedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [localBusinessData, breadcrumbData, faqData]
  };

  return generateSEOMeta({
    title: `${SITE_CONFIG.name} - Premium Eyewear Collection | Best Prices with Personal Service`,
    description: "Discover our premium collection of sunglasses, computer glasses, and prescription eyewear. Get personalized quotes, expert consultations, and unbeatable prices. Contact us for instant pricing!",
    keywords: [...SEO_KEYWORDS.primary, ...SEO_KEYWORDS.secondary, ...SEO_KEYWORDS.local, ...SEO_KEYWORDS.features],
    canonical: "/",
    type: "website",
    structuredData: combinedStructuredData
  });
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  const db = await getDb();

  // Get active banners
  const banners = await db.collection('banners')
    .find({
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: null },
            { startDate: { $lte: new Date() } }
          ]
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: new Date() } }
          ]
        }
      ]
    })
    .sort({ order: 1 })
    .limit(5)
    .toArray();

  // Get featured products
  const featuredProducts = await db.collection('products')
    .find({ isActive: true, isFeatured: true })
    .limit(8)
    .toArray();

  // Get products by category
  const menProducts = await db.collection('products')
    .find({ isActive: true, genderCategory: 'men' })
    .limit(4)
    .toArray();

  const womenProducts = await db.collection('products')
    .find({ isActive: true, genderCategory: 'women' })
    .limit(4)
    .toArray();

  const childrenProducts = await db.collection('products')
    .find({ isActive: true, genderCategory: 'children' })
    .limit(4)
    .toArray();

  return json({
    user,
    banners: banners.map((banner: any) => ({ ...banner, _id: banner._id.toString() })),
    featuredProducts: featuredProducts.map((product: any) => ({ ...product, _id: product._id.toString() })),
    menProducts: menProducts.map((product: any) => ({ ...product, _id: product._id.toString() })),
    womenProducts: womenProducts.map((product: any) => ({ ...product, _id: product._id.toString() })),
    childrenProducts: childrenProducts.map((product: any) => ({ ...product, _id: product._id.toString() })),
  });
}

export default function Index() {
  const { user, banners, featuredProducts, menProducts, womenProducts, childrenProducts } = useLoaderData<typeof loader>();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoading, isNavigating, destinationPath } = useLoadingState();

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // Show loading state only for initial load, not navigation
  if (isLoading && !isNavigating) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading Header */}
        <div className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
              <div className="flex space-x-4">
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading Banner */}
        <LoadingBanner />

        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Featured Products Loading */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
            <LoadingProductGrid count={8} />
          </div>

          {/* Category Sections Loading */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-6 bg-gray-200 rounded w-40 mb-6 animate-pulse" />
              <LoadingProductGrid count={4} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const ProductCard = ({ product }: { product: any }) => (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 touch-manipulation active:scale-95"
    >
      <div className="aspect-square overflow-hidden bg-gray-50">
        <OptimizedImage
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />
      </div>
      <div className="p-3 sm:p-4 lg:p-5">
        <div className="flex items-start justify-between mb-1 sm:mb-2">
          <span className="text-xs text-blue-600 uppercase tracking-wide font-semibold">
            {product.brand}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm sm:text-base truncate">
          {product.name}
        </h3>
        <div className="pt-2 border-t border-gray-100">
          <SimpleWhatsAppButton
            productName={product.name}
            productSku={product.sku}
            className="w-full"
          />
        </div>
        {product.features && product.features.length > 0 && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 line-clamp-1">
            {product.features[0]}
          </p>
        )}
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen">
      {/* Promotional Banner */}
      <PromotionalBanner />

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">Optical Shop</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link to="/products" className="text-gray-700 hover:text-gray-900 transition-colors">Products</Link>
              <Link to="/products?gender=men" className="text-gray-700 hover:text-gray-900 transition-colors">Men</Link>
              <Link to="/products?gender=women" className="text-gray-700 hover:text-gray-900 transition-colors">Women</Link>
              <Link to="/products?gender=children" className="text-gray-700 hover:text-gray-900 transition-colors">Children</Link>
              <Link to="/about" className="text-gray-700 hover:text-gray-900 transition-colors">About</Link>
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Hello, {(user as any).name}</span>
                  {(user as any).role === 'admin' && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">Admin Panel</Button>
                    </Link>
                  )}
                  <Link to="/logout">
                    <Button variant="ghost" size="sm">Logout</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  {(user as any).role === 'admin' && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="text-xs px-2">Admin</Button>
                    </Link>
                  )}
                  <Link to="/logout">
                    <Button variant="ghost" size="sm" className="text-xs px-2">Logout</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-xs px-2">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs px-2">Sign Up</Button>
                  </Link>
                </div>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-3">
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-gray-900 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link
                  to="/products?gender=men"
                  className="text-gray-700 hover:text-gray-900 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Men's Eyewear
                </Link>
                <Link
                  to="/products?gender=women"
                  className="text-gray-700 hover:text-gray-900 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Women's Eyewear
                </Link>
                <Link
                  to="/products?gender=children"
                  className="text-gray-700 hover:text-gray-900 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Children's Eyewear
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-gray-900 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                {user && (
                  <div className="border-t border-gray-200 pt-3">
                    <span className="text-sm text-gray-600 py-2 px-4 block">Hello, {(user as any).name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Banners */}
      {banners.length > 0 && (
        <section className="relative overflow-hidden">
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[600px]">
            {banners.map((banner: any, index: number) => (
              <div
                key={banner._id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentBannerIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105'
                  }`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl px-4 sm:px-6">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 animate-fade-in leading-tight">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-sm sm:text-lg md:text-xl lg:text-3xl mb-4 sm:mb-6 md:mb-8 animate-fade-in-delay">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.description && (
                      <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 opacity-90 max-w-2xl mx-auto animate-fade-in-delay-2 leading-relaxed">
                        {banner.description}
                      </p>
                    )}
                    {banner.link && banner.buttonText && (
                      <Link to={banner.link}>
                        <Button size="lg" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-gray-900 hover:bg-gray-100 animate-fade-in-delay-3 touch-manipulation">
                          {banner.buttonText}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {banners.length > 1 && (
            <>
              {/* Navigation Dots */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 touch-manipulation ${index === currentBannerIndex
                      ? 'bg-white scale-110'
                      : 'bg-white/50 hover:bg-white/75'
                      }`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentBannerIndex((prev) => prev === 0 ? banners.length - 1 : prev - 1)}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 touch-manipulation"
              >
                <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" />
              </button>
              <button
                onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % banners.length)}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 touch-manipulation"
              >
                <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Featured Collection</h2>
                <p className="text-base sm:text-lg text-gray-600">Handpicked premium eyewear at exclusive prices - Contact us for your personalized quote</p>
              </div>
              <Link to="/products" className="hidden sm:block">
                <Button variant="outline" size="lg" className="touch-manipulation">
                  View All Products <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8 sm:mt-12 sm:hidden">
              <Link to="/products">
                <Button size="lg" className="w-full touch-manipulation">
                  View All Products <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Category Sections */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Shop by Category</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect eyewear for every member of your family
            </p>
          </div>

          {/* Men's Products */}
          {menProducts.length > 0 && (
            <div className="mb-12 sm:mb-16">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Men's Eyewear</h3>
                  <p className="text-sm sm:text-base text-gray-600">Sophisticated and durable designs for the modern man</p>
                </div>
                <Link to="/products?gender=men" className="hidden md:block">
                  <Button variant="outline" size="lg" className="touch-manipulation">
                    View All Men's <ChevronRightIcon className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {menProducts.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center mt-6 sm:mt-8 md:hidden">
                <Link to="/products?gender=men">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto touch-manipulation">
                    View All Men's <ChevronRightIcon className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Women's Products */}
          {womenProducts.length > 0 && (
            <div className="mb-12 sm:mb-16">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Women's Eyewear</h3>
                  <p className="text-sm sm:text-base text-gray-600">Elegant and fashionable frames for every style</p>
                </div>
                <Link to="/products?gender=women" className="hidden md:block">
                  <Button variant="outline" size="lg" className="touch-manipulation">
                    View All Women's <ChevronRightIcon className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {womenProducts.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center mt-6 sm:mt-8 md:hidden">
                <Link to="/products?gender=women">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto touch-manipulation">
                    View All Women's <ChevronRightIcon className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Children's Products */}
          {childrenProducts.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Children's Eyewear</h3>
                  <p className="text-sm sm:text-base text-gray-600">Safe, comfortable, and fun glasses for kids</p>
                </div>
                <Link to="/products?gender=children" className="hidden md:block">
                  <Button variant="outline" size="lg" className="touch-manipulation">
                    View All Kids' <ChevronRightIcon className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {childrenProducts.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center mt-6 sm:mt-8 md:hidden">
                <Link to="/products?gender=children">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto touch-manipulation">
                    View All Kids' <ChevronRightIcon className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Welcome Section for when no content */}
      {banners.length === 0 && featuredProducts.length === 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Welcome to Optical Shop</h2>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Discover premium eyewear for every lifestyle. From stylish sunglasses to computer glasses,
              we have the perfect pair for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto touch-manipulation">
                  Browse Products
                </Button>
              </Link>
              {!user && (
                <Link to="/register">
                  <Button variant="outline" size="lg" className="px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto touch-manipulation">
                    Create Account
                  </Button>
                </Link>
              )}
              {(user as any)?.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="outline" size="lg" className="px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto touch-manipulation">
                    Admin Panel
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}


