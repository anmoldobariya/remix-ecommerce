import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';
import { getDb } from '~/utils/db.server';
import type { Product } from '~/models';
import { Button } from '~/components/ui/button';
import { Select } from '~/components/ui/select';
import { FilterIcon, SearchIcon, MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { SimpleWhatsAppButton } from '~/components/ui/whatsapp-contact';
import { PromotionalBanner } from '~/components/ui/promotional-banner';
import { Footer } from '~/components/ui/footer';
import { useLoadingState } from '~/hooks/useLoadingState';
import { LoadingProductGrid, LoadingFilters, LoadingSpinner } from '~/components/ui/loading';
import { OptimizedImage } from '~/components/ui/optimized-image';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const gender = url.searchParams.get('gender') || '';
  const type = url.searchParams.get('type') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  const db = await getDb();
  const productsCollection = db.collection<Product>('products');

  // Build filter query
  const filter: any = { isActive: true };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (gender) {
    filter.genderCategory = gender;
  }

  if (type) {
    filter.productType = type;
  }

  const [products, totalCount] = await Promise.all([
    productsCollection
      .find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    productsCollection.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return json({
    products: products.map((product: Product) => ({
      ...product,
      _id: product._id?.toString(),
    })),
    pagination: {
      page,
      totalPages,
      totalCount,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    filters: {
      search,
      gender,
      type,
    },
  });
}

export default function ProductsIndex() {
  const { products, pagination, filters } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { isLoading } = useLoadingState();

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to first page when filtering
    setSearchParams(newParams);
    setMobileFiltersOpen(false); // Close mobile filters after selecting
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Promotional Banner */}
        <PromotionalBanner />

        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
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

        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title Loading */}
          <div className="text-center mb-8">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>

          {/* Filters Loading */}
          <LoadingFilters />

          {/* Products Grid Loading */}
          <LoadingProductGrid count={12} />

          {/* Pagination Loading */}
          <div className="flex justify-center mt-8">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  return (
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
              <Link to="/login">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Premium Eyewear Collection
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Discover quality eyewear at unbeatable prices - Contact us for personalized quotes and expert recommendations
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="w-full flex items-center justify-center touch-manipulation"
          >
            <FilterIcon className="w-4 h-4 mr-2" />
            Filters
            {(filters.search || filters.gender || filters.type) && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between lg:justify-start mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                  <FilterIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
                  />
                </div>
              </div>

              {/* Gender Filter */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <Select
                  value={filters.gender}
                  onChange={(e) => updateFilter('gender', e.target.value)}
                >
                  <option value="">All Genders</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="children">Children</option>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <Select
                  value={filters.type}
                  onChange={(e) => updateFilter('type', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="sunglasses">Sunglasses</option>
                  <option value="computer-glasses">Computer Glasses</option>
                  <option value="reading-glasses">Reading Glasses</option>
                  <option value="prescription-glasses">Prescription Glasses</option>
                </Select>
              </div>

              {/* Clear Filters */}
              {(filters.search || filters.gender || filters.type) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchParams({});
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full touch-manipulation"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
              <p className="text-gray-600 text-sm sm:text-base mb-2 sm:mb-0">
                Showing {products.length} of {pagination.totalCount} products
              </p>
              {/* Mobile filters close overlay */}
              {/* {mobileFiltersOpen && (
                <div
                  className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
                  onClick={() => setMobileFiltersOpen(false)}
                />
              )} */}
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4 text-base sm:text-lg">No products found</div>
                <p className="text-gray-400 text-sm sm:text-base">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                  {products.map((product: any) => (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden touch-manipulation active:scale-95"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&crop=center';
                          }}
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                            {product.brand}
                          </span>
                          {product.isFeatured && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">
                          {product.name}
                        </h3>
                        <div className="py-3 border-t border-gray-100">
                          <SimpleWhatsAppButton
                            productName={product.name}
                            productSku={product.sku}
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded w-fit">
                            {product.genderCategory}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded w-fit">
                            {product.productType.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    {pagination.hasPrev && (
                      <Link
                        to={`?${new URLSearchParams({
                          ...Object.fromEntries(searchParams),
                          page: String(pagination.page - 1),
                        })}`}
                      >
                        <Button variant="outline" className="w-full sm:w-auto touch-manipulation">Previous</Button>
                      </Link>
                    )}

                    <span className="text-gray-600 text-sm sm:text-base px-4 py-2">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    {pagination.hasNext && (
                      <Link
                        to={`?${new URLSearchParams({
                          ...Object.fromEntries(searchParams),
                          page: String(pagination.page + 1),
                        })}`}
                      >
                        <Button variant="outline" className="w-full sm:w-auto touch-manipulation">Next</Button>
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
