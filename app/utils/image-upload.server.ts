import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Cloudinary configuration (for future use)
interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

// Local storage configuration
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Validate file
function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 5MB.' };
  }

  return { valid: true };
}

// Generate unique filename
function generateFileName(originalName: string): string {
  const extension = path.extname(originalName);
  const uniqueId = uuidv4();
  return `${Date.now()}-${uniqueId}${extension}`;
}

// Upload to local storage
export async function uploadToLocal(
  file: File
): Promise<{ url: string; filename: string }> {
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  await ensureUploadDir();

  const filename = generateFileName(file.name);
  const filepath = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  // Return public URL
  const url = `/uploads/${filename}`;

  return { url, filename };
}

// Upload multiple files to local storage
export async function uploadMultipleToLocal(
  files: File[]
): Promise<Array<{ url: string; filename: string }>> {
  const results = [];

  for (const file of files) {
    const result = await uploadToLocal(file);
    results.push(result);
  }

  return results;
}

// Cloudinary upload function (for future implementation)
export async function uploadToCloudinary(
  file: File,
  config: CloudinaryConfig
): Promise<{ url: string; publicId: string }> {
  // This is a placeholder for Cloudinary implementation
  // When ready to switch to Cloudinary, implement this function
  throw new Error(
    'Cloudinary upload not yet implemented. Using local storage.'
  );
}

// Main upload function that can switch between local and Cloudinary
export async function uploadImage(
  file: File,
  options: {
    useCloudinary?: boolean;
    cloudinaryConfig?: CloudinaryConfig;
  } = {}
): Promise<{ url: string; filename?: string; publicId?: string }> {
  if (options.useCloudinary && options.cloudinaryConfig) {
    const result = await uploadToCloudinary(file, options.cloudinaryConfig);
    return { url: result.url, publicId: result.publicId };
  } else {
    const result = await uploadToLocal(file);
    return { url: result.url, filename: result.filename };
  }
}

// Upload multiple images
export async function uploadMultipleImages(
  files: File[],
  options: {
    useCloudinary?: boolean;
    cloudinaryConfig?: CloudinaryConfig;
  } = {}
): Promise<Array<{ url: string; filename?: string; publicId?: string }>> {
  if (options.useCloudinary && options.cloudinaryConfig) {
    // Implement multiple Cloudinary uploads when ready
    throw new Error('Multiple Cloudinary uploads not yet implemented.');
  } else {
    const results = await uploadMultipleToLocal(files);
    return results.map((result) => ({
      url: result.url,
      filename: result.filename
    }));
  }
}

// Delete local file
export async function deleteLocalFile(filename: string): Promise<void> {
  try {
    const filepath = path.join(UPLOAD_DIR, filename);
    if (existsSync(filepath)) {
      await import('fs/promises').then((fs) => fs.unlink(filepath));
    }
  } catch (error) {
    console.error('Error deleting local file:', error);
  }
}

// Delete Cloudinary file (placeholder)
export async function deleteCloudinaryFile(
  publicId: string,
  config: CloudinaryConfig
): Promise<void> {
  // Implement when Cloudinary is ready
  throw new Error('Cloudinary delete not yet implemented.');
}

// Main delete function
export async function deleteImage(
  identifier: string,
  options: {
    useCloudinary?: boolean;
    cloudinaryConfig?: CloudinaryConfig;
  } = {}
): Promise<void> {
  if (options.useCloudinary && options.cloudinaryConfig) {
    await deleteCloudinaryFile(identifier, options.cloudinaryConfig);
  } else {
    await deleteLocalFile(identifier);
  }
}
