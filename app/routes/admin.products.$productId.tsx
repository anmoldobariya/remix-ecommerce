import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { useLoaderData, useActionData, Form, useNavigation, Link } from '@remix-run/react';
import { useState } from 'react';
import { getDb } from '~/utils/db.server';
import { requireAdmin } from '~/utils/auth.server';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { ImageUpload } from '~/components/ui/image-upload';
import { FormSelect } from '~/components/ui/form-select';
import { ProductSchema, Product } from '~/models';
import { ObjectId } from 'mongodb';
import { useLoadingState } from '~/hooks/useLoadingState';
import { LoadingForm } from '~/components/ui/loading';
import { getActiveCategories } from '~/utils/categories.server';

type LoaderData = {
  product: (Product & { _id: string }) | null;
  categories: {
    genderCategories: Array<{ value: string; label: string }>;
    productCategories: Array<{ value: string; label: string }>;
  };
};

export async function loader({ request, params }: LoaderFunctionArgs): Promise<Response> {
  await requireAdmin(request);

  const { productId } = params;

  const [productData, categories] = await Promise.all([
    productId && productId !== 'new'
      ? (async () => {
        const db = await getDb();
        const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
        if (!product) {
          throw new Response('Product not found', { status: 404 });
        }
        return { ...product, _id: product._id.toString() };
      })()
      : null,
    getActiveCategories(),
  ]);

  return json({ product: productData, categories });
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Parse array fields
  const images = formData.getAll('images').filter(img => img && img.toString().trim());
  const features = formData.getAll('features').filter(feature => feature && feature.toString().trim());

  const productData = {
    ...data,
    price: parseFloat(data.price as string),
    originalPrice: data.originalPrice ? parseFloat(data.originalPrice as string) : undefined,
    isActive: data.isActive === 'true',
    isFeatured: data.isFeatured === 'true',
    images: images.map(img => img.toString()),
    features: features.map(feature => feature.toString()),
  };

  const result = ProductSchema.safeParse(productData);
  if (!result.success) {
    return json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { productId } = params;

  const db = await getDb();
  if (productId && productId !== 'new') {
    // Update existing product
    await db.collection('products').updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: {
          ...result.data,
          updatedAt: new Date()
        }
      }
    );
  } else {
    // Create new product
    const { _id, ...productDataWithoutId } = result.data;
    await db.collection('products').insertOne({
      ...productDataWithoutId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return redirect('/admin/products');
}

export default function ProductForm() {
  const { product, categories } = useLoaderData<LoaderData>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const { isLoading, isNavigating } = useLoadingState();

  const [images, setImages] = useState<string[]>(
    product?.images?.length ? product.images : []
  );
  const [featureFields, setFeatureFields] = useState(
    product?.features?.length ? product.features : ['']
  );

  const isSubmitting = navigation.state === 'submitting';
  const isEditing = Boolean(product);

  const addFeatureField = () => setFeatureFields([...featureFields, '']);
  const removeFeatureField = (index: number) => {
    if (featureFields.length > 1) {
      setFeatureFields(featureFields.filter((_: string, i: number) => i !== index));
    }
  };

  // Show loading state only for initial load, not navigation
  if (isLoading && !isNavigating) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-20 animate-pulse" />
        </div>

        <LoadingForm />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Update product information' : 'Create a new product'}
          </p>
        </div>
        <Link to="/admin/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Form method="post" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={product?.name}
                  className="mt-1"
                />
                {actionData?.errors?.name && (
                  <p className="text-sm text-destructive mt-1">{actionData.errors.name[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  name="brand"
                  required
                  defaultValue={product?.brand}
                  className="mt-1"
                />
                {actionData?.errors?.brand && (
                  <p className="text-sm text-destructive mt-1">{actionData.errors.brand[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  name="sku"
                  required
                  defaultValue={product?.sku}
                  className="mt-1"
                />
                {actionData?.errors?.sku && (
                  <p className="text-sm text-destructive mt-1">{actionData.errors.sku[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={product?.description}
                  rows={4}
                  className="mt-1"
                />
                {actionData?.errors?.description && (
                  <p className="text-sm text-destructive mt-1">{actionData.errors.description[0]}</p>
                )}
              </div>
            </div>

            {/* Categories and Pricing */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="genderCategory">Gender Category *</Label>
                <FormSelect
                  name="genderCategory"
                  defaultValue={product?.genderCategory}
                  options={[
                    { value: "", label: "Select Gender Category" },
                    ...categories.genderCategories
                  ]}
                  placeholder="Select Gender Category"
                />
                {actionData?.errors?.genderCategory && (
                  <p className="text-sm text-destructive mt-1">{actionData.errors.genderCategory[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="productType">Product Type *</Label>
                <FormSelect
                  name="productType"
                  defaultValue={product?.productType}
                  options={[
                    { value: "", label: "Select Product Type" },
                    ...categories.productCategories
                  ]}
                  placeholder="Select Product Type"
                />
                {actionData?.errors?.productType && (
                  <p className="text-sm text-destructive mt-1">{actionData.errors.productType[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <Label>Product Images *</Label>
            <p className="text-sm text-gray-500 mb-2">Upload images for the product</p>
            <ImageUpload
              images={images}
              onChange={setImages}
              maxImages={10}
              disabled={isSubmitting}
            />
            {/* Hidden inputs for form submission */}
            {images.map((imageUrl, index) => (
              <input
                key={index}
                type="hidden"
                name="images"
                value={imageUrl}
              />
            ))}
            {actionData?.errors?.images && (
              <p className="text-sm text-destructive mt-1">{actionData.errors.images[0]}</p>
            )}
          </div>

          {/* Features */}
          <div>
            <Label>Product Features</Label>
            <p className="text-sm text-gray-500 mb-2">Add key features of the product</p>
            {featureFields.map((feature: string, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  name="features"
                  placeholder="Feature description"
                  defaultValue={feature}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeFeatureField(index)}
                  disabled={featureFields.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addFeatureField}>
              Add Feature
            </Button>
          </div>

          {/* Status Options */}
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                value="true"
                defaultChecked={product?.isActive !== false}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                value="true"
                defaultChecked={product?.isFeatured}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? (isEditing ? 'Updating...' : 'Creating...')
                : (isEditing ? 'Update Product' : 'Create Product')
              }
            </Button>
            <Link to="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
