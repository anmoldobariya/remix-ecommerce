import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { requireAdmin } from '~/utils/auth.server';
import { getDb } from '~/utils/db.server';
import { Button } from '~/components/ui/button';
import { PlusIcon, EditIcon, TrashIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import type { Banner } from '~/models';
import { ObjectId } from 'mongodb';
import { LoadingTable } from '~/components/ui/loading';
import { useLoadingState } from '~/hooks/useLoadingState';
import { useConfirmation } from '~/components/ui/confirmation-dialog';

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const bannerId = formData.get('bannerId') as string;
  const action = formData.get('_action') as string;

  if (action === 'delete' && bannerId) {
    const db = await getDb();
    const bannersCollection = db.collection<Banner>('banners');

    await bannersCollection.deleteOne({
      _id: new ObjectId(bannerId),
    });
  }

  return redirect('/admin/banners');
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);

  const db = await getDb();
  const bannersCollection = db.collection<Banner>('banners');

  const banners = await bannersCollection
    .find({})
    .sort({ order: 1, createdAt: -1 })
    .toArray();

  return json({
    banners: banners.map((banner: Banner) => ({
      ...banner,
      _id: banner._id?.toString(),
    })),
  });
}

export default function BannersIndex() {
  const { banners } = useLoaderData<typeof loader>();
  const { isLoading, isNavigating } = useLoadingState();
  const { confirm } = useConfirmation();

  if (isLoading && !isNavigating) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <LoadingTable rows={3} columns={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600">Manage promotional banners for your eyewear business</p>
        </div>
        <Link to="/admin/banners/new">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Banner
          </Button>
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No banners found</div>
          <Link to="/admin/banners/new">
            <Button>Create your first banner</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner: any) => (
                  <tr key={banner._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-24 flex-shrink-0">
                          <img
                            className="h-16 w-24 object-cover rounded-md"
                            src={banner.image}
                            alt={banner.title}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop&crop=center';
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {banner.title}
                      </div>
                      {banner.subtitle && (
                        <div className="text-sm text-gray-500">
                          {banner.subtitle}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {banner.isActive ? (
                          <>
                            <EyeIcon className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOffIcon className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {banner.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`/admin/banners/${banner._id}`}>
                          <Button variant="outline" size="sm">
                            <EditIcon className="w-4 h-4" />
                          </Button>
                        </Link>
                        <form method="post" className="inline">
                          <input type="hidden" name="bannerId" value={banner._id} />
                          <input type="hidden" name="_action" value="delete" />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            onClick={async (e) => {
                              e.preventDefault();
                              const confirmed = await confirm({
                                title: 'Delete Banner',
                                message: `Are you sure you want to delete the banner "${banner.title}"? This action cannot be undone.`,
                                confirmText: 'Delete Banner',
                                cancelText: 'Cancel',
                                variant: 'danger'
                              });

                              if (confirmed) {
                                const form = e.currentTarget.closest('form');
                                if (form) form.submit();
                              }
                            }}
                          >
                            <TrashIcon className="w-4 h-4 text-red-600" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
