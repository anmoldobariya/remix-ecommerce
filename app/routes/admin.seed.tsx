import { json, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useNavigation } from '@remix-run/react';
import { requireAdmin } from '~/utils/auth.server';
import { seedDatabase } from '~/utils/seed.server';
import { Button } from '~/components/ui/button';

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);

  try {
    await seedDatabase();
    return json({ success: true, message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Seeding error:', error);
    return json({ success: false, error: 'Failed to seed database' }, { status: 500 });
  }
}

export async function loader({ request }: { request: Request }) {
  await requireAdmin(request);
  return json({});
}

export default function SeedDatabase() {
  const navigation = useNavigation();
  const isSeeding = navigation.state === 'submitting';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Database Seeding</h1>
        <p className="text-gray-600">
          This will populate the database with sample data including users, products, and banners.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Warning
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This action will remove all existing data and replace it with sample data.
                  This cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Sample data includes:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Admin user (admin@opticalshop.com / admin123)</li>
            <li>Regular user (user@example.com / user123)</li>
            <li>3 promotional banners</li>
            <li>10 sample products across all categories</li>
            <li>Various brands and product types</li>
          </ul>
        </div>

        <Form method="post" className="mt-6">
          <Button
            type="submit"
            disabled={isSeeding}
            className="w-full"
          >
            {isSeeding ? 'Seeding Database...' : 'Seed Database'}
          </Button>
        </Form>

        <div className="mt-4 text-sm text-gray-500">
          <p>After seeding, you can:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>View the homepage to see banners and products</li>
            <li>Browse the product catalog</li>
            <li>Manage products, banners, and users in the admin panel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
