import { json, type ActionFunctionArgs } from '@remix-run/node';
import { uploadMultipleFiles, validateMultipleImageFiles } from '~/utils/upload.server';
import { randomUUID } from 'crypto';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const files: File[] = [];

    // Get productId from form data, if not provided generate a temporary one
    const productId = formData.get('productId') as string;
    const finalProductId = productId || `temp-${randomUUID()}`;

    // Extract files from FormData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file') && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return json({ error: 'No files provided' }, { status: 400 });
    }

    // Validate files
    const validation = validateMultipleImageFiles(files);
    if (!validation.valid) {
      return json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    // Upload files
    const urls = await uploadMultipleFiles(files, finalProductId);

    return json({
      success: true,
      urls,
      productId: finalProductId,
      isTemporary: !productId,
      message: `Successfully uploaded ${files.length} file(s)`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return json({
      error: 'Failed to upload files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
