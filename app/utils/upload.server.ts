import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadFile(file: File, name: string): Promise<string> {
  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique public_id
    const folder = 'divine-optical';
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const publicId = `${folder}/${name}`;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            public_id: publicId,
            folder: folder,
            format: fileExtension === 'jpg' ? 'jpeg' : fileExtension
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // Return the secure URL from Cloudinary
    return (result as any).secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}

export async function uploadMultipleFiles(
  files: File[],
  productId: string
): Promise<string[]> {
  const uploadPromises = files.map((file, index) =>
    uploadFile(file, `product-${productId}-${index + 1}`)
  );
  return Promise.all(uploadPromises);
}

export async function deleteFile(imageUrl: string): Promise<boolean> {
  try {
    // Extract public_id from Cloudinary URL
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (!publicId) {
      console.error('Could not extract public_id from URL:', imageUrl);
      return false;
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Extract public_id from Cloudinary URL
    // Example URL: https://res.cloudinary.com/dfyce0zle/image/upload/v1234567890/products/uuid.jpg
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex((part) => part === 'upload');

    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
      return null;
    }

    // Get the part after version (v1234567890)
    const pathWithExtension = urlParts.slice(uploadIndex + 2).join('/');

    // Remove file extension
    const publicId = pathWithExtension.replace(/\.[^/.]+$/, '');

    return publicId;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file size (max 10MB for Cloudinary)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  // Check file type
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, WebP, and GIF images are allowed'
    };
  }

  return { valid: true };
}

export function validateMultipleImageFiles(files: File[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const validation = validateImageFile(files[i]);
    if (!validation.valid) {
      errors.push(`File ${i + 1}: ${validation.error}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export async function renameProductImages(
  tempId: string,
  productId: string
): Promise<string[]> {
  try {
    // Get all images with the temporary ID pattern
    const searchResult = await cloudinary.search
      .expression(`folder:divine-optical AND public_id:*product-${tempId}-*`)
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute();

    const renamedUrls: string[] = [];

    for (const resource of searchResult.resources) {
      const oldPublicId = resource.public_id;
      // Replace temp ID with actual product ID in the public_id
      const newPublicId = oldPublicId.replace(
        `product-${tempId}-`,
        `product-${productId}-`
      );

      // Rename the file in Cloudinary
      const result = await cloudinary.uploader.rename(oldPublicId, newPublicId);
      renamedUrls.push(result.secure_url);
    }

    return renamedUrls;
  } catch (error) {
    console.error('Error renaming product images:', error);
    throw new Error('Failed to rename product images');
  }
}

export async function renameAndUpdateProductImages(
  tempId: string,
  productId: string,
  imageUrls: string[]
): Promise<string[]> {
  try {
    // Extract temp-based URLs from the provided imageUrls
    const tempUrls = imageUrls.filter((url) =>
      url.includes(`product-${tempId}-`)
    );

    if (tempUrls.length === 0) {
      // No temporary images to rename, return original URLs
      return imageUrls;
    }

    const renamedUrls: string[] = [];

    for (const url of tempUrls) {
      const oldPublicId = extractPublicIdFromUrl(url);
      if (!oldPublicId) continue;

      // Replace temp ID with actual product ID in the public_id
      const newPublicId = oldPublicId.replace(
        `product-${tempId}-`,
        `product-${productId}-`
      );

      try {
        // Rename the file in Cloudinary
        const result = await cloudinary.uploader.rename(
          oldPublicId,
          newPublicId
        );
        renamedUrls.push(result.secure_url);
      } catch (error) {
        console.error(`Failed to rename ${oldPublicId}:`, error);
        // Keep the original URL if rename fails
        renamedUrls.push(url);
      }
    }

    // Replace temp URLs with renamed URLs in the original array
    const updatedUrls = imageUrls.map((url) => {
      const tempIndex = tempUrls.indexOf(url);
      return tempIndex !== -1 ? renamedUrls[tempIndex] : url;
    });

    return updatedUrls;
  } catch (error) {
    console.error('Error renaming and updating product images:', error);
    // Return original URLs if the process fails
    return imageUrls;
  }
}

export async function cleanupTempImages(tempId: string): Promise<void> {
  try {
    // Get all images with the temporary ID pattern
    const searchResult = await cloudinary.search
      .expression(`folder:divine-optical AND public_id:*product-${tempId}-*`)
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute();

    // Delete all temporary images
    const deletePromises = searchResult.resources.map((resource: any) =>
      cloudinary.uploader.destroy(resource.public_id)
    );

    await Promise.all(deletePromises);
    console.log(
      `Cleaned up ${searchResult.resources.length} temporary images for tempId: ${tempId}`
    );
  } catch (error) {
    console.error('Error cleaning up temporary images:', error);
    // Don't throw error as this is cleanup - log and continue
  }
}
