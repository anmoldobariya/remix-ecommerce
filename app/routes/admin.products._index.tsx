import { json, type LoaderFunctionArgs, type ActionFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, Link, Form, useSearchParams } from '@remix-run/react';
import { getDb } from '~/utils/db.server';
import { requireAdmin } from '~/utils/auth.server';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Select } from '~/components/ui/select';
import { CustomSelect } from '~/components/ui/custom-select';
import { FormSelect } from '~/components/ui/form-select';
import { ObjectId } from 'mongodb';
import { useLoadingState } from '~/hooks/useLoadingState';
import { LoadingTable, LoadingFilters, LoadingSpinner } from '~/components/ui/loading';
import { generateSEOMeta, SITE_CONFIG } from '~/utils/seo';
import { getActiveCategories } from '~/utils/categories.server';

export const meta: MetaFunction = () => {
  return generateSEOMeta({
    title: `Admin - Products Management | ${SITE_CONFIG.name}`,
    description: "Administrative interface for managing product catalog.",
    noIndex: true
  });
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);

  const db = await getDb();
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const category = url.searchParams.get('category') || '';
  const type = url.searchParams.get('type') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: any = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) filter.genderCategory = category;
  if (type) filter.productType = type;

  const [products, totalCount, categories] = await Promise.all([
    db.collection('products')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection('products').countDocuments(filter),
    getActiveCategories(),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return json({
    products: products.map((product: any) => ({ ...product, _id: product._id.toString() })),
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    filters: { search, category, type },
    categories,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);

  const db = await getDb();
  const formData = await request.formData();
  const action = formData.get('_action');
  const productId = formData.get('productId') as string;

  if (action === 'delete' && productId) {
    await db.collection('products').deleteOne({ _id: new ObjectId(productId) });
    return json({ success: true });
  }

  if (action === 'toggle-active' && productId) {
    const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
    if (product) {
      await db.collection('products').updateOne(
        { _id: new ObjectId(productId) },
        { $set: { isActive: !product.isActive, updatedAt: new Date() } }
      );
    }
    return json({ success: true });
  }

  if (action === 'toggle-featured' && productId) {
    const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
    if (product) {
      await db.collection('products').updateOne(
        { _id: new ObjectId(productId) },
        { $set: { isFeatured: !product.isFeatured, updatedAt: new Date() } }
      );
    }
    return json({ success: true });
  }

  return json({ success: false });
}

export default function AdminProducts() {
  const { products, pagination, filters, categories } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const { isLoading, isNavigating } = useLoadingState();

  // Show loading state only for initial load, not navigation
  if (isLoading && !isNavigating) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
        </div>

        <LoadingFilters />
        <LoadingTable rows={10} columns={6} />

        <div className="flex justify-center mt-6">
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">
            Manage your product catalog ({pagination.totalCount} total)
          </p>
        </div>
        <Link to="/admin/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <Form method="get" className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              name="search"
              placeholder="Search products..."
              defaultValue={filters.search}
            />
          </div>
          <FormSelect
            name="category"
            defaultValue={filters.category}
            options={[
              { value: "", label: "All Categories" },
              ...categories.genderCategories
            ]}
            placeholder="Select category"
          />
          <FormSelect
            name="type"
            defaultValue={filters.type}
            options={[
              { value: "", label: "All Types" },
              ...categories.productCategories
            ]}
            placeholder="Select type"
          />
          <Button type="submit" variant="outline">
            Filter
          </Button>
          <Link to="/admin/products">
            <Button type="button" variant="ghost">
              Clear
            </Button>
          </Link>
        </Form>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5}>
                    <LoadingTable />
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.images[0]}
                          alt={product.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.brand} - {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.genderCategory}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.productType.replace('-', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${product.price}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {product.isFeatured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link to={`/admin/products/${product._id}`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                      <Form method="post" className="inline">
                        <input type="hidden" name="productId" value={product._id} />
                        <Button
                          type="submit"
                          name="_action"
                          value="toggle-active"
                          size="sm"
                          variant="ghost"
                        >
                          {product.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </Form>
                      <Form method="post" className="inline">
                        <input type="hidden" name="productId" value={product._id} />
                        <Button
                          type="submit"
                          name="_action"
                          value="toggle-featured"
                          size="sm"
                          variant="ghost"
                        >
                          {product.isFeatured ? 'Unfeature' : 'Feature'}
                        </Button>
                      </Form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              {pagination.hasPrevPage && (
                <Link
                  to={`?${new URLSearchParams({
                    ...Object.fromEntries(searchParams),
                    page: (pagination.currentPage - 1).toString(),
                  })}`}
                >
                  <Button variant="outline">Previous</Button>
                </Link>
              )}
              {pagination.hasNextPage && (
                <Link
                  to={`?${new URLSearchParams({
                    ...Object.fromEntries(searchParams),
                    page: (pagination.currentPage + 1).toString(),
                  })}`}
                >
                  <Button variant="outline">Next</Button>
                </Link>
              )}
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * 20 + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * 20, pagination.totalCount)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.totalCount}</span>{' '}
                  results
                </p>
              </div>
              <div className="flex space-x-2">
                {pagination.hasPrevPage && (
                  <Link
                    to={`?${new URLSearchParams({
                      ...Object.fromEntries(searchParams),
                      page: (pagination.currentPage - 1).toString(),
                    })}`}
                  >
                    <Button variant="outline">Previous</Button>
                  </Link>
                )}
                {pagination.hasNextPage && (
                  <Link
                    to={`?${new URLSearchParams({
                      ...Object.fromEntries(searchParams),
                      page: (pagination.currentPage + 1).toString(),
                    })}`}
                  >
                    <Button variant="outline">Next</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
