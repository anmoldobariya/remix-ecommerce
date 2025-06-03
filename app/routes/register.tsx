import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Form, Link, useActionData, useNavigation } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { RegisterSchema } from '~/models';
import { createUser, createUserSession, getUserId } from '~/utils/auth.server';
import { getDb } from '~/utils/db.server';
import { LoadingForm } from '~/components/ui/loading';
import { useLoadingState } from '~/hooks/useLoadingState';
import { generateSEOMeta, SITE_CONFIG } from '~/utils/seo';

export const meta: MetaFunction = () => {
  return generateSEOMeta({
    title: `Register | ${SITE_CONFIG.name}`,
    description: "Create your account to get personalized eyewear quotes, track orders, and access exclusive offers.",
    noIndex: true // Auth pages typically shouldn't be indexed
  });
};

type ActionData = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const result = RegisterSchema.safeParse(data);
  if (!result.success) {
    return json<ActionData>({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, email, password } = result.data;

  // Check if user already exists
  const db = await getDb();
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    return json<ActionData>({ errors: { email: ['A user with this email already exists'] } }, { status: 400 });
  }

  // Check if this is the first user (make them admin)
  const userCount = await db.collection('users').countDocuments();
  const role = userCount === 0 ? 'admin' : 'user';

  const userId = await createUser({ name, email, password, role });
  return createUserSession(userId, '/');
}

export default function Register() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const { isLoading, isNavigating } = useLoadingState();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const isSubmitting = navigation.state === 'submitting';

  if (isLoading && !isNavigating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="h-9 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="h-9 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
            <div className="mt-2 flex justify-center">
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
          </div>
          <LoadingForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/" className="flex justify-center">
            <h1 className="text-3xl font-bold text-gray-900">Optical Shop</h1>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
              {actionData?.errors?.name && (
                <p className="text-sm text-red-600 mt-1">{actionData.errors.name[0]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
              />
              {actionData?.errors?.email && (
                <p className="text-sm text-red-600 mt-1">{actionData.errors.email[0]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1"
              />
              {actionData?.errors?.password && (
                <p className="text-sm text-red-600 mt-1">{actionData.errors.password[0]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="mt-1"
              />
              {actionData?.errors?.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{actionData.errors.confirmPassword[0]}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </Form>
      </div>
    </div>
  );
}
