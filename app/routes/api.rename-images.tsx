import { json, type ActionFunctionArgs } from '@remix-run/node';
import { renameProductImages } from '~/utils/upload.server';
import { requireAdmin } from '~/utils/auth.server';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Require admin authentication
    await requireAdmin(request);

    const { tempId, productId } = await request.json();

    if (!tempId || !productId) {
      return json({ error: 'Missing tempId or productId' }, { status: 400 });
    }

    // Rename the images from temporary ID to actual product ID
    const renamedUrls = await renameProductImages(tempId, productId);

    return json({
      success: true,
      urls: renamedUrls,
      message: `Successfully renamed ${renamedUrls.length} image(s)`
    });

  } catch (error) {
    console.error('Rename error:', error);
    return json({
      error: 'Failed to rename images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
