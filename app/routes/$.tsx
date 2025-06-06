import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { getActiveCategories } from "~/utils/categories.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { genderCategories, productCategories } = await getActiveCategories();

  return json({
    genderCategories,
    productCategories,
  });
}

export default function NotFound() {
  const { genderCategories, productCategories } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Large 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl">👓</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-2">
            Looks like this page got lost in the frames!
          </p>
          <p className="text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              🏠 Back to Home
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/products">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                👓 Browse Products
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                👤 Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/products" className="text-blue-600 hover:text-blue-800 transition-colors">
              All Products
            </Link>
            {genderCategories.slice(0, 2).map((category) => (
              <Link
                key={category.value}
                to={`/products?gender=${category.value}`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {category.label} Eyewear
              </Link>
            ))}
            {productCategories.slice(0, 2).map((category) => (
              <Link
                key={category.value}
                to={`/products?type=${category.value}`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
