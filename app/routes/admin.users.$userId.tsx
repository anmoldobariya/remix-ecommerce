import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@remix-run/node';
import { useLoaderData, useNavigation, Form } from '@remix-run/react';
import { requireAdmin } from '~/utils/auth.server';
import { getDb } from '~/utils/db.server';
import { UserSchema, type User } from '~/models';
import { Button } from '~/components/ui/button';
import { FormSelect } from '~/components/ui/form-select';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { LoadingForm } from '~/components/ui/loading';
import { useLoadingState } from '~/hooks/useLoadingState';
import { useConfirmation } from '~/components/ui/confirmation-dialog';

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireAdmin(request);

  const { userId } = params;

  if (userId === 'new') {
    return json({
      user: null,
      isEdit: false,
    });
  }

  const db = await getDb();
  const usersCollection = db.collection<User>('users');

  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!user) {
    throw new Response('User not found', { status: 404 });
  }

  return json({
    user: {
      ...user,
      _id: user._id?.toString(),
      password: undefined, // Don't send password to client
    },
    isEdit: true,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const { userId } = params;

  if (formData.get('_action') === 'delete') {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    await usersCollection.deleteOne({
      _id: new ObjectId(userId),
    });

    return redirect('/admin/users');
  }

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Validate password match if provided
  if (password && password !== confirmPassword) {
    return json(
      { error: "Passwords don't match" },
      { status: 400 }
    );
  }

  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    password: password || 'temp-password', // Temporary for validation
  };

  try {
    const validatedData = UserSchema.parse(rawData);
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    if (userId === 'new') {
      // Check if email already exists
      const existingUser = await usersCollection.findOne({
        email: validatedData.email,
      });

      if (existingUser) {
        return json(
          { error: 'A user with this email already exists' },
          { status: 400 }
        );
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const newUser = {
        ...validatedData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await usersCollection.insertOne(newUser as User);
    } else {
      // Update existing user
      const updateData: any = {
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
        updatedAt: new Date(),
      };

      // Only update password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
      );
    }

    return redirect('/admin/users');
  } catch (error) {
    return json(
      { error: 'Invalid user data. Please check your inputs.' },
      { status: 400 }
    );
  }
}

export default function UserForm() {
  const { user, isEdit } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const { isLoading, isNavigating } = useLoadingState();
  const { confirm } = useConfirmation();
  const isSubmitting = navigation.state === 'submitting';

  if (isLoading && !isNavigating) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <LoadingForm />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit User' : 'Create New User'}
        </h1>
        <p className="text-gray-600">
          {isEdit ? 'Update user information and permissions' : 'Add a new user account'}
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <Form method="post" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={user?.name || ''}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={user?.email || ''}
                placeholder="user@example.com"
              />
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <FormSelect
                name="role"
                defaultValue={user?.role || 'user'}
                options={[
                  { value: "user", label: "User" },
                  { value: "admin", label: "Admin" }
                ]}
                placeholder="Select role"
              />
            </div>

            <div>
              <Label htmlFor="password">
                {isEdit ? 'New Password (leave blank to keep current)' : 'Password *'}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required={!isEdit}
                placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter password'}
                minLength={6}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="confirmPassword">
                {isEdit ? 'Confirm New Password' : 'Confirm Password *'}
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required={!isEdit}
                placeholder="Confirm password"
                minLength={6}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <div>
              {isEdit && (
                <Button
                  type="submit"
                  name="_action"
                  value="delete"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={async (e) => {
                    e.preventDefault();
                    const confirmed = await confirm({
                      title: 'Delete User',
                      message: `Are you sure you want to delete the user "${user?.name}"? This action cannot be undone.`,
                      confirmText: 'Delete User',
                      cancelText: 'Cancel',
                      variant: 'danger'
                    });

                    if (confirmed) {
                      const form = e.currentTarget.closest('form');
                      if (form) {
                        const deleteInput = document.createElement('input');
                        deleteInput.type = 'hidden';
                        deleteInput.name = '_action';
                        deleteInput.value = 'delete';
                        form.appendChild(deleteInput);
                        form.submit();
                      }
                    }
                  }}
                >
                  Delete User
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEdit
                    ? 'Updating...'
                    : 'Creating...'
                  : isEdit
                    ? 'Update User'
                    : 'Create User'}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
