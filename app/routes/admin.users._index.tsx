import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData, useNavigation } from '@remix-run/react';
import { requireAdmin } from '~/utils/auth.server';
import { getDb } from '~/utils/db.server';
import { Button } from '~/components/ui/button';
import { PlusIcon, EditIcon, TrashIcon, UserIcon } from 'lucide-react';
import type { User } from '~/models';
import { ObjectId } from 'mongodb';
import { LoadingTable } from '~/components/ui/loading';
import { useLoadingState } from '~/hooks/useLoadingState';
import { useConfirmation } from '~/components/ui/confirmation-dialog';

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const userId = formData.get('userId') as string;
  const action = formData.get('_action') as string;

  if (action === 'delete' && userId) {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    await usersCollection.deleteOne({
      _id: new ObjectId(userId),
    });
  }

  return redirect('/admin/users');
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);

  const db = await getDb();
  const usersCollection = db.collection<User>('users');

  const users = await usersCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return json({
    users: users.map((user: User) => ({
      ...user,
      _id: user._id?.toString(),
      password: undefined, // Don't send passwords to client
    })),
  });
}

export default function UsersIndex() {
  const { users } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
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
        <LoadingTable rows={5} columns={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Link to="/admin/users/new">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No users found</div>
          <Link to="/admin/users/new">
            <Button>Create your first user</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`/admin/users/${user._id}`}>
                          <Button variant="outline" size="sm">
                            <EditIcon className="w-4 h-4" />
                          </Button>
                        </Link>
                        <form method="post" className="inline">
                          <input type="hidden" name="userId" value={user._id} />
                          <input type="hidden" name="_action" value="delete" />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            onClick={async (e) => {
                              e.preventDefault();
                              const confirmed = await confirm({
                                title: 'Delete User',
                                message: `Are you sure you want to delete the user "${user.name}"? This action cannot be undone.`,
                                confirmText: 'Delete User',
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
