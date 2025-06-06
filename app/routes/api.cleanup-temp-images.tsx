import { json, type ActionFunctionArgs } from '@remix-run/node';
import { cleanupTempImages } from '~/utils/upload.server';
import { requireAdmin } from '~/utils/auth.server';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Require admin authentication
    await requireAdmin(request);

    const { tempId } = await request.json();

    if (!tempId) {
      return json({ error: 'Missing tempId' }, { status: 400 });
    }

    // Clean up temporary images
    await cleanupTempImages(tempId);

    return json({
      success: true,
      message: 'Temporary images cleaned up successfully'
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return json({
      error: 'Failed to cleanup temporary images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
