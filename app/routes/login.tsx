import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Form, Link, useActionData, useNavigation } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { LoginSchema } from '~/models';
import { createUserSession, getUserId, verifyLogin } from '~/utils/auth.server';
import { LoadingForm } from '~/components/ui/loading';
import { useLoadingState } from '~/hooks/useLoadingState';
import { generateSEOMeta, SITE_CONFIG } from '~/utils/seo';

export const meta: MetaFunction = () => {
  return generateSEOMeta({
    title: `Login | ${SITE_CONFIG.name}`,
    description: "Sign in to your account to access personalized quotes, order history, and exclusive eyewear offers.",
    noIndex: true // Auth pages typically shouldn't be indexed
  });
};

type ActionData = {
  errors?: {
    email?: string[];
    password?: string[];
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

  const result = LoginSchema.safeParse(data);
  if (!result.success) {
    return json<ActionData>({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { email, password } = result.data;
  const user = await verifyLogin(email, password);

  if (!user) {
    return json<ActionData>({ errors: { email: ['Invalid email or password'] } }, { status: 400 });
  }

  const redirectTo = formData.get('redirectTo') as string || '/';
  return createUserSession(user._id, redirectTo);
}

export default function Login() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const { isLoading, isNavigating } = useLoadingState();
  const [formData, setFormData] = useState({ email: '', password: '' });

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
              <div className="h-9 bg-gray-200 rounded w-48 animate-pulse"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">{SITE_CONFIG.name}</h1>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          <div className="space-y-4">
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
                <p className="text-sm text-destructive mt-1">{actionData.errors.email[0]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1"
              />
              {actionData?.errors?.password && (
                <p className="text-sm text-destructive mt-1">{actionData.errors.password[0]}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </Form>
      </div>
    </div>
  );
}
