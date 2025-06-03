import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@remix-run/node';
import { useLoaderData, useNavigation, Form } from '@remix-run/react';
import { requireAdmin } from '~/utils/auth.server';
import { getDb } from '~/utils/db.server';
import { BannerSchema, type Banner } from '~/models';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { ObjectId } from 'mongodb';
import { LoadingForm } from '~/components/ui/loading';
import { useLoadingState } from '~/hooks/useLoadingState';

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireAdmin(request);

  const { bannerId } = params;

  if (bannerId === 'new') {
    return json({
      banner: null,
      isEdit: false,
    });
  }

  const db = await getDb();
  const bannersCollection = db.collection<Banner>('banners');

  const banner = await bannersCollection.findOne({
    _id: new ObjectId(bannerId),
  });

  if (!banner) {
    throw new Response('Banner not found', { status: 404 });
  }

  return json({
    banner: {
      ...banner,
      _id: banner._id?.toString(),
      startDate: banner.startDate ? banner.startDate.toISOString().split('T')[0] : '',
      endDate: banner.endDate ? banner.endDate.toISOString().split('T')[0] : '',
    },
    isEdit: true,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const { bannerId } = params;

  if (formData.get('_action') === 'delete') {
    const db = await getDb();
    const bannersCollection = db.collection<Banner>('banners');

    await bannersCollection.deleteOne({
      _id: new ObjectId(bannerId),
    });

    return redirect('/admin/banners');
  }

  const rawData = {
    title: formData.get('title'),
    subtitle: formData.get('subtitle') || undefined,
    description: formData.get('description') || undefined,
    image: formData.get('image'),
    link: formData.get('link') || undefined,
    buttonText: formData.get('buttonText') || undefined,
    isActive: formData.get('isActive') === 'on',
    order: parseInt(formData.get('order') as string) || 0,
    startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string) : undefined,
    endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
  };

  try {
    const validatedData = BannerSchema.parse(rawData);
    const db = await getDb();
    const bannersCollection = db.collection<Banner>('banners');

    if (bannerId === 'new') {
      // Create new banner
      const newBanner = {
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await bannersCollection.insertOne(newBanner as Banner);
    } else {
      // Update existing banner
      await bannersCollection.updateOne(
        { _id: new ObjectId(bannerId) },
        {
          $set: {
            ...validatedData,
            updatedAt: new Date(),
          },
        }
      );
    }

    return redirect('/admin/banners');
  } catch (error) {
    return json(
      { error: 'Invalid banner data. Please check your inputs.' },
      { status: 400 }
    );
  }
}

export default function BannerForm() {
  const { banner, isEdit } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const { isLoading } = useLoadingState();
  const isSubmitting = navigation.state === 'submitting';

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <LoadingForm />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Banner' : 'Create New Banner'}
        </h1>
        <p className="text-gray-600">
          {isEdit ? 'Update banner information' : 'Add a new promotional banner'}
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <Form method="post" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={banner?.title || ''}
                placeholder="Enter banner title"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                type="text"
                defaultValue={banner?.subtitle || ''}
                placeholder="Enter banner subtitle (optional)"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={banner?.description || ''}
                placeholder="Enter banner description (optional)"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                name="image"
                type="url"
                required
                defaultValue={banner?.image || ''}
                placeholder="https://example.com/banner-image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="link">Link URL</Label>
              <Input
                id="link"
                name="link"
                type="url"
                defaultValue={banner?.link || ''}
                placeholder="https://example.com/destination"
              />
            </div>

            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                name="buttonText"
                type="text"
                defaultValue={banner?.buttonText || ''}
                placeholder="Shop Now"
              />
            </div>

            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                min="0"
                defaultValue={banner?.order || 0}
                placeholder="0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                defaultChecked={banner?.isActive ?? true}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={banner?.startDate || ''}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={banner?.endDate || ''}
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
                  onClick={(e) => {
                    if (!confirm('Are you sure you want to delete this banner?')) {
                      e.preventDefault();
                    }
                  }}
                >
                  Delete Banner
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
                    ? 'Update Banner'
                    : 'Create Banner'}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
