import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { getDb } from '~/utils/db.server';
import { requireAdmin } from '~/utils/auth.server';
import { Button } from '~/components/ui/button';
import {
  PackageIcon,
  TagIcon,
  ImageIcon,
  UsersIcon,
  PlusIcon,
  EyeIcon,
  TrendingUpIcon,
  StarIcon
} from 'lucide-react';
import { useLoadingState } from '~/hooks/useLoadingState';
import { LoadingStats, LoadingSpinner } from '~/components/ui/loading';
import { generateSEOMeta, SITE_CONFIG } from '~/utils/seo';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);

  const db = await getDb();
  // Get statistics
  const [
    productsCount,
    bannersCount,
    usersCount,
    activeProductsCount,
    categoriesCount,
    featuredProductsCount,
    inactiveProductsCount
  ] = await Promise.all([
    db.collection('products').countDocuments(),
    db.collection('banners').countDocuments(),
    db.collection('users').countDocuments(),
    db.collection('products').countDocuments({ isActive: true }),
    db.collection('categories').countDocuments(),
    db.collection('products').countDocuments({ isFeatured: true }),
    db.collection('products').countDocuments({ isActive: false })
  ]);

  return json({
    stats: {
      productsCount,
      bannersCount,
      usersCount,
      activeProductsCount,
      categoriesCount,
      featuredProductsCount,
      inactiveProductsCount
    }
  });
}

export const meta: MetaFunction = () => {
  return generateSEOMeta({
    title: `Admin Dashboard | ${SITE_CONFIG.name}`,
    description: "Administrative dashboard for managing products, users, and content.",
    noIndex: true // Admin pages should not be indexed by search engines
  });
};

export default function AdminDashboard() {
  const { stats } = useLoaderData<typeof loader>();
  const { isLoading, isNavigating } = useLoadingState();

  // Show loading state only for initial load, not navigation
  if (isLoading && !isNavigating) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>

        <LoadingStats />

        <div className="mt-8 space-y-6">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-full mb-4" />
                <div className="h-8 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <TrendingUpIcon className="w-8 h-8 mr-3 text-blue-600" />
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Manage your eyewear business content and product showcase</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <PackageIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total Products</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.productsCount}</p>
                  <p className="text-sm text-gray-500">{stats.activeProductsCount} active</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/products">
                  <Button variant="outline" size="sm" className="w-full">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Manage Products
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100">
                  <TagIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                  <p className="text-3xl font-bold text-indigo-600">{stats.categoriesCount}</p>
                  <p className="text-sm text-gray-500">Product categories</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/categories">
                  <Button variant="outline" size="sm" className="w-full">
                    <TagIcon className="w-4 h-4 mr-2" />
                    Manage Categories
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <ImageIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Banners</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.bannersCount}</p>
                  <p className="text-sm text-gray-500">Promotional banners</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/banners">
                  <Button variant="outline" size="sm" className="w-full">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Manage Banners
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <UsersIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                  <p className="text-3xl font-bold text-purple-600">{stats.usersCount}</p>
                  <p className="text-sm text-gray-500">Registered users</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/users">
                  <Button variant="outline" size="sm" className="w-full">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUpIcon className="w-5 h-5 mr-2" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/admin/products/new">
                <Button className="w-full h-12 flex items-center justify-center">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
              </Link>
              <Link to="/admin/banners/new">
                <Button variant="outline" className="w-full h-12 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Create Banner
                </Button>
              </Link>
              <Link to="/admin/products?filter=featured">
                <Button variant="outline" className="w-full h-12 flex items-center justify-center">
                  <StarIcon className="w-4 h-4 mr-2" />
                  Featured Products
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" className="w-full h-12 flex items-center justify-center">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </Link>
            </div>
          </div>

          {/* Promotional Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Promotional Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {((stats.activeProductsCount / stats.productsCount) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Products Active</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  {stats.featuredProductsCount}
                </div>
                <div className="text-sm text-gray-600">Featured Products</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {stats.bannersCount}
                </div>
                <div className="text-sm text-gray-600">Marketing Banners</div>
              </div>
            </div>
          </div>

          {/* Product Category Summary */}
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Product Category Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Active Products</span>
                  <span className="text-blue-600 font-semibold">{stats.activeProductsCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(stats.activeProductsCount / stats.productsCount) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Featured Products</span>
                  <span className="text-amber-600 font-semibold">{stats.featuredProductsCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-amber-600 h-2.5 rounded-full"
                    style={{ width: `${(stats.featuredProductsCount / stats.productsCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
