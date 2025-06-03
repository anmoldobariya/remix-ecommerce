import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function uploadFile(
  file: File,
  folder: string = 'products'
): Promise<string> {
  // Create upload directory if it doesn't exist
  const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // Generate unique filename
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = join(uploadDir, fileName);

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Write file to disk
  await writeFile(filePath, buffer);

  // Return the public URL
  return `/uploads/${folder}/${fileName}`;
}

export async function uploadMultipleFiles(
  files: File[],
  folder: string = 'products'
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadFile(file, folder));
  return Promise.all(uploadPromises);
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed'
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
