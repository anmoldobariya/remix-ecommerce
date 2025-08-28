import { z } from 'zod';
import { ObjectId } from 'mongodb';

// MongoDB ObjectId schema
const ObjectIdSchema = z.union([z.string(), z.instanceof(ObjectId)]).optional();

// User Schema
export const UserSchema = z.object({
  _id: ObjectIdSchema,
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'user']).default('user'),
  name: z.string().min(2),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export type User = z.infer<typeof UserSchema>;

// Product Category Schemas - Now flexible to accept dynamic values
export const GenderCategorySchema = z.string().min(1);
export const ProductTypeSchema = z.string().min(1);

export type GenderCategory = z.infer<typeof GenderCategorySchema>;
export type ProductType = z.infer<typeof ProductTypeSchema>;

// Product Schema
export const ProductSchema = z.object({
  _id: ObjectIdSchema,
  name: z.string().min(1),
  description: z.string(),
  images: z.array(z.string()).min(1),
  genderCategory: GenderCategorySchema,
  productType: ProductTypeSchema,
  brand: z.string().min(1),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sku: z.string().min(1),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export type Product = z.infer<typeof ProductSchema>;

// Banner Schema
export const BannerSchema = z.object({
  _id: ObjectIdSchema,
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().min(1),
  link: z.string().optional(),
  buttonText: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export type Banner = z.infer<typeof BannerSchema>;

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type LoginData = z.infer<typeof LoginSchema>;

// Register Schema
export const RegisterSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export type RegisterData = z.infer<typeof RegisterSchema>;
