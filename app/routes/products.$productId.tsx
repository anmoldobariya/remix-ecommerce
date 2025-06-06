import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getDb } from '~/utils/db.server';
import type { Product } from '~/models';
import { Button } from '~/components/ui/button';
import { ArrowLeftIcon, CheckIcon } from 'lucide-react';
import { ObjectId } from 'mongodb';
import { useState } from 'react';
import { WhatsAppContact, PhoneContact } from '~/components/ui/whatsapp-contact';
import { PromotionalBanner } from '~/components/ui/promotional-banner';
import { Footer } from '~/components/ui/footer';
import { useLoadingState } from '~/hooks/useLoadingState';
import { LoadingProductDetail } from '~/components/ui/loading';
import { OptimizedImage } from '~/components/ui/optimized-image';
import {
  generateSEOMeta,
  generateProductStructuredData,
  generateBreadcrumbStructuredData,
  generateProductDescription,
  generateProductKeywords,
  SITE_CONFIG
} from '~/utils/seo';
import { StructuredData } from '~/components/structured-data';

export async function loader({ params }: LoaderFunctionArgs) {
  const { productId } = params;

  if (!productId || !ObjectId.isValid(productId)) {
    throw new Response('Product not found', { status: 404 });
  }

  const db = await getDb();
  const productsCollection = db.collection<Product>('products');

  const product = await productsCollection.findOne({
    _id: new ObjectId(productId),
    isActive: true,
  });

  if (!product) {
    throw new Response('Product not found', { status: 404 });
  }

  // Get related products (same type or gender, excluding current product)
  const relatedProducts = await productsCollection
    .find({
      _id: { $ne: new ObjectId(productId) },
      isActive: true,
      $or: [
        { genderCategory: product.genderCategory },
        { productType: product.productType },
      ],
    })
    .limit(4)
    .toArray();

  return json({
    product: {
      ...product,
      _id: product._id?.toString(),
    },
    relatedProducts: relatedProducts.map((p: Product) => ({
      ...p,
      _id: p._id?.toString(),
    })),
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.product) {
    return generateSEOMeta({
      title: `Product Not Found | ${SITE_CONFIG.name}`,
      description: "The product you're looking for was not found. Browse our complete eyewear collection.",
      noIndex: true
    });
  }

  const { product } = data;
  const productTitle = `${product.name} | ${SITE_CONFIG.name}`;
  const productDescription = generateProductDescription(product);
  const productKeywords = generateProductKeywords(product);

  // Generate product image URL for Open Graph
  const productImage = product.images?.[0]
    ? `${SITE_CONFIG.url}${product.images[0]}`
    : `${SITE_CONFIG.url}${SITE_CONFIG.logo}`;

  return generateSEOMeta({
    title: productTitle,
    description: productDescription,
    keywords: productKeywords,
    canonical: `/products/${product._id}`,
    type: "product",
    image: productImage
  });
};

export default function ProductDetail() {
  const { product, relatedProducts } = useLoaderData<typeof loader>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { isLoading, isNavigating } = useLoadingState();

  const formatCategoryName = (name: string) => {
    return name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Generate structured data for this page
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: product.name, url: `/products/${product._id}` }
  ];

  const breadcrumbData = generateBreadcrumbStructuredData(breadcrumbs);
  const productData = generateProductStructuredData(product);

  // Combine structured data
  const combinedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [productData, breadcrumbData]
  };

  // Show loading state only for initial load, not navigation
  if (isLoading && !isNavigating) {
    return <LoadingProductDetail />;
  }

  return (
    <>
      <StructuredData data={combinedStructuredData} />
      <div className="min-h-screen bg-gray-50">
        {/* Promotional Banner */}
        <PromotionalBanner />

        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                Optical Shop
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link to="/products">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                    All Products
                  </Button>
                </Link>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4 sm:mb-6 lg:mb-8">
            <Link to="/products" className="hover:text-gray-700 flex items-center touch-manipulation py-2">
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Products
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
            {/* Product Images */}
            <div className="space-y-3 sm:space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-white shadow-sm">
                <OptimizedImage
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  priority={true}
                />
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 touch-manipulation ${selectedImageIndex === index
                        ? 'border-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <OptimizedImage
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                  <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">
                    {product.brand}
                  </span>
                  {product.isFeatured && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {formatCategoryName(product.genderCategory)}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {formatCategoryName(product.productType)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {product.description}
                </p>
              </div>

              {product.features.length > 0 && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-600 text-sm sm:text-base">
                        <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t pt-4 sm:pt-6">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="text-center mb-3">
                    <p className="text-sm text-blue-800 font-medium">
                      💰 No Fixed Prices - We Offer Personalized Quotes!
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Get competitive pricing tailored to your needs and budget
                    </p>
                  </div>
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm text-gray-500">
                      SKU: {product.sku}
                    </span>
                  </div>
                </div>

                <WhatsAppContact
                  productName={product.name}
                  productSku={product.sku}
                />

                <div className="mt-3">
                  <PhoneContact />
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                More Great Options for You
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {relatedProducts.map((relatedProduct: any) => (
                  <Link
                    key={relatedProduct._id}
                    to={`/products/${relatedProduct._id}`}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden touch-manipulation active:scale-95"
                  >
                    <div className="aspect-square overflow-hidden">
                      <OptimizedImage
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {relatedProduct.brand}
                      </span>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          {formatCategoryName(relatedProduct.genderCategory)}
                        </span>
                        <span className="text-xs text-green-600 font-medium">
                          💬 Get Quote
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
