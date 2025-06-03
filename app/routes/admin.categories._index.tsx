import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@remix-run/node';
import { useLoaderData, Form, Link, useNavigation } from '@remix-run/react';
import { requireAdmin } from '~/utils/auth.server';
import { getDb } from '~/utils/db.server';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Select } from '~/components/ui/select';
import { Label } from '~/components/ui/label';
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
import { LoadingTable, LoadingForm } from '~/components/ui/loading';
import { useLoadingState } from '~/hooks/useLoadingState';

type Category = {
  _id: string;
  name: string;
  type: 'gender' | 'product';
  displayName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);

  const db = await getDb();
  const categoriesCollection = db.collection('categories');

  const categories = await categoriesCollection
    .find({})
    .sort({ type: 1, name: 1 })
    .toArray();

  return json({
    categories: categories.map((cat: any) => ({
      ...cat,
      _id: cat._id.toString(),
    })),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const action = formData.get('_action') as string;
  const db = await getDb();
  const categoriesCollection = db.collection('categories');

  if (action === 'delete') {
    const categoryId = formData.get('categoryId') as string;
    await categoriesCollection.deleteOne({
      _id: new (await import('mongodb')).ObjectId(categoryId),
    });
    return redirect('/admin/categories');
  }

  if (action === 'toggle') {
    const categoryId = formData.get('categoryId') as string;
    const category = await categoriesCollection.findOne({
      _id: new (await import('mongodb')).ObjectId(categoryId),
    });

    if (category) {
      await categoriesCollection.updateOne(
        { _id: new (await import('mongodb')).ObjectId(categoryId) },
        {
          $set: {
            isActive: !category.isActive,
            updatedAt: new Date()
          }
        }
      );
    }
    return redirect('/admin/categories');
  }

  if (action === 'create') {
    const name = formData.get('name') as string;
    const type = formData.get('type') as 'gender' | 'product';
    const displayName = formData.get('displayName') as string;

    if (!name || !type || !displayName) {
      return json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if category already exists
    const existing = await categoriesCollection.findOne({ name, type });
    if (existing) {
      return json({ error: 'Category already exists' }, { status: 400 });
    }

    await categoriesCollection.insertOne({
      name,
      type,
      displayName,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return redirect('/admin/categories');
  }

  return json({ error: 'Invalid action' }, { status: 400 });
}

export default function CategoriesIndex() {
  const { categories } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const { isLoading } = useLoadingState();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
          </div>
        </div>
        <LoadingForm />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LoadingTable rows={3} columns={3} />
          <LoadingTable rows={5} columns={3} />
        </div>
      </div>
    );
  }

  const genderCategories = categories.filter((cat: Category) => cat.type === 'gender');
  const productCategories = categories.filter((cat: Category) => cat.type === 'product');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600">Manage gender types and product categories</p>
        </div>
      </div>

      {/* Add New Category Form */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h2>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="_action" value="create" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type">Category Type *</Label>
              <Select
                id="type"
                name="type"
                required
              >
                <option value="">Select Type</option>
                <option value="gender">Gender Category</option>
                <option value="product">Product Type</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Internal Name *</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g., sunglasses, men"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                name="displayName"
                required
                placeholder="e.g., Sunglasses, Men's"
                className="mt-1"
              />
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </Form>
      </div>

      {/* Gender Categories */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Gender Categories</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Display Name
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
              {genderCategories.map((category: Category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.displayName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${category.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Form method="post" className="inline">
                        <input type="hidden" name="categoryId" value={category._id} />
                        <Button
                          type="submit"
                          name="_action"
                          value="toggle"
                          size="sm"
                          variant="outline"
                        >
                          {category.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </Form>
                      <Form method="post" className="inline">
                        <input type="hidden" name="categoryId" value={category._id} />
                        <Button
                          type="submit"
                          name="_action"
                          value="delete"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            if (!confirm('Are you sure you want to delete this category?')) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <TrashIcon className="w-4 h-4 text-red-600" />
                        </Button>
                      </Form>
                    </div>
                  </td>
                </tr>
              ))}
              {genderCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No gender categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Categories */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Product Types</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Display Name
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
              {productCategories.map((category: Category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.displayName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${category.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Form method="post" className="inline">
                        <input type="hidden" name="categoryId" value={category._id} />
                        <Button
                          type="submit"
                          name="_action"
                          value="toggle"
                          size="sm"
                          variant="outline"
                        >
                          {category.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </Form>
                      <Form method="post" className="inline">
                        <input type="hidden" name="categoryId" value={category._id} />
                        <Button
                          type="submit"
                          name="_action"
                          value="delete"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            if (!confirm('Are you sure you want to delete this category?')) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <TrashIcon className="w-4 h-4 text-red-600" />
                        </Button>
                      </Form>
                    </div>
                  </td>
                </tr>
              ))}
              {productCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No product categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
