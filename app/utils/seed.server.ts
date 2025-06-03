import { getDb } from './db.server';
import bcrypt from 'bcryptjs';
import type { User, Product, Banner } from '~/models';

export async function seedDatabase() {
  const db = await getDb();

  // Clear existing data (optional, remove in production)
  await Promise.all([
    db.collection('users').deleteMany({}),
    db.collection('products').deleteMany({}),
    db.collection('banners').deleteMany({})
  ]);

  // Seed admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin: Omit<User, '_id'> = {
    name: 'Admin User',
    email: 'admin@opticalshop.com',
    password: adminPassword,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  await db.collection('users').insertOne(admin);

  // Seed regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user: Omit<User, '_id'> = {
    name: 'John Doe',
    email: 'user@example.com',
    password: userPassword,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  await db.collection('users').insertOne(user);

  // Seed banners
  const banners: Omit<Banner, '_id'>[] = [
    {
      title: 'Summer Sale',
      subtitle: 'Up to 50% off on sunglasses',
      description: 'Beat the heat with our premium collection of sunglasses',
      image:
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=500&fit=crop',
      link: '/products?type=sunglasses',
      buttonText: 'Shop Now',
      isActive: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Blue Light Protection',
      subtitle: 'Computer glasses for digital eye strain',
      description:
        'Protect your eyes from digital screens with our computer glasses',
      image:
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=500&fit=crop',
      link: '/products?type=computer-glasses',
      buttonText: 'Learn More',
      isActive: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'New Arrivals',
      subtitle: 'Latest eyewear trends',
      description:
        'Discover the newest styles in prescription and fashion eyewear',
      image:
        'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=1200&h=500&fit=crop',
      link: '/products',
      buttonText: 'Explore',
      isActive: true,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  await db.collection('banners').insertMany(banners);

  // Seed products
  const products: Omit<Product, '_id'>[] = [
    // Men's Sunglasses
    {
      name: 'Ray-Ban Aviator Classic',
      description:
        'Iconic aviator sunglasses with crystal clear lenses and durable metal frame. Perfect for any occasion.',
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1473967625766-404fd1d2c56a?w=500&h=500&fit=crop'
      ],
      genderCategory: 'men',
      productType: 'sunglasses',
      brand: 'Ray-Ban',
      features: [
        'UV Protection',
        'Crystal Clear Lenses',
        'Metal Frame',
        'Adjustable Nose Pads'
      ],
      isActive: true,
      isFeatured: true,
      sku: 'RB-AVI-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Oakley Holbrook',
      description:
        'Timeless and classic design with modern Oakley technology. Inspired by the screen heroes of the 1940s.',
      images: [
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&h=500&fit=crop'
      ],
      genderCategory: 'men',
      productType: 'sunglasses',
      brand: 'Oakley',
      features: [
        'HDO Optics',
        'Impact Protection',
        'Plutonite Lenses',
        'Lightweight O Matter Frame'
      ],
      isActive: true,
      isFeatured: true,
      sku: 'OAK-HOL-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Persol Classic Wayfare',
      description:
        'Italian craftsmanship meets timeless design. Handmade acetate frame with signature arrow details.',
      images: [
        'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&h=500&fit=crop'
      ],
      genderCategory: 'men',
      productType: 'sunglasses',
      brand: 'Persol',
      features: [
        'Italian Handmade',
        'Crystal Lenses',
        'Signature Arrow',
        'Acetate Frame'
      ],
      isActive: true,
      isFeatured: false,
      sku: 'PR-WAY-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Women's Sunglasses
    {
      name: 'Prada Cat Eye Sunglasses',
      description:
        'Elegant cat eye sunglasses with premium acetate frame and gradient lenses.',
      images: [
        'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&h=500&fit=crop'
      ],
      genderCategory: 'women',
      productType: 'sunglasses',
      brand: 'Prada',
      features: [
        'Cat Eye Design',
        'Gradient Lenses',
        'Acetate Frame',
        'Premium Quality'
      ],
      isActive: true,
      isFeatured: true,
      sku: 'PR-CAT-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Tom Ford Butterfly Sunglasses',
      description:
        'Sophisticated butterfly frame with signature Tom Ford detailing.',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop'
      ],
      genderCategory: 'women',
      productType: 'sunglasses',
      brand: 'Tom Ford',
      features: [
        'Butterfly Frame',
        'Signature T Logo',
        'Premium Acetate',
        'UV400 Protection'
      ],
      isActive: true,
      isFeatured: false,
      sku: 'TF-BUT-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Gucci Oversized Round',
      description:
        'Bold oversized round sunglasses with iconic GG logo and premium materials.',
      images: [
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&h=500&fit=crop'
      ],
      genderCategory: 'women',
      productType: 'sunglasses',
      brand: 'Gucci',
      features: [
        'Oversized Design',
        'Iconic GG Logo',
        'Premium Materials',
        'UV Protection'
      ],
      isActive: true,
      isFeatured: true,
      sku: 'GU-ROD-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Computer Glasses
    {
      name: 'Blue Light Blocking Glasses',
      description:
        'Advanced blue light filtering technology to reduce digital eye strain.',
      images: [
        'https://images.unsplash.com/photo-1594736797933-d0c6b7d81d9e?w=500&h=500&fit=crop'
      ],
      genderCategory: 'men',
      productType: 'computer-glasses',
      brand: 'TechLens',
      features: [
        'Blue Light Filter',
        'Anti-Glare Coating',
        'Lightweight Frame',
        'Flexible Hinges'
      ],
      isActive: true,
      isFeatured: true,
      sku: 'TL-BLU-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Gaming Computer Glasses',
      description:
        'Specially designed for gamers with enhanced contrast and reduced eye fatigue.',
      images: [
        'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&h=500&fit=crop'
      ],
      genderCategory: 'women',
      productType: 'computer-glasses',
      brand: 'GameView',
      features: [
        'Enhanced Contrast',
        'Reduced Eye Fatigue',
        'Gaming Optimized',
        'Comfortable Fit'
      ],
      isActive: true,
      isFeatured: false,
      sku: 'GV-GAM-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Professional Blue Light Glasses',
      description:
        'Premium computer glasses for professionals who spend long hours on screens.',
      images: [
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop'
      ],
      genderCategory: 'men',
      productType: 'computer-glasses',
      brand: 'ProVision',
      features: [
        'Professional Grade',
        'Anti-Reflective Coating',
        'Titanium Frame',
        'Extended Wear Comfort'
      ],
      isActive: true,
      isFeatured: true,
      sku: 'PV-PRO-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Children's Glasses
    {
      name: 'Kids Fun Frame Glasses',
      description:
        'Colorful and durable glasses designed specifically for children.',
      images: [
        'https://images.unsplash.com/photo-1606086634655-7b6999639e22?w=500&h=500&fit=crop'
      ],
      genderCategory: 'children',
      productType: 'prescription-glasses',
      brand: 'KidsVision',
      features: [
        'Flexible Frame',
        'Impact Resistant',
        'Colorful Design',
        'Adjustable Fit'
      ],
      isActive: true,
      isFeatured: true,
      sku: 'KV-FUN-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Children Safety Sunglasses',
      description: 'Safe and fun sunglasses with 100% UV protection for kids.',
      images: [
        'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=500&h=500&fit=crop'
      ],
      genderCategory: 'children',
      productType: 'sunglasses',
      brand: 'SafeKids',
      features: [
        '100% UV Protection',
        'Shatterproof Lenses',
        'Fun Colors',
        'Comfortable Strap'
      ],
      isActive: true,
      isFeatured: false,
      sku: 'SK-SUN-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Kids Sports Sunglasses',
      description: 'Durable sports sunglasses designed for active children.',
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop'
      ],
      genderCategory: 'children',
      productType: 'sunglasses',
      brand: 'ActiveKids',
      features: [
        'Sports Design',
        'Impact Resistant',
        'Secure Fit',
        'UV400 Protection'
      ],
      isActive: true,
      isFeatured: true,
      sku: 'AK-SPO-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Reading Glasses
    {
      name: 'Classic Reading Glasses',
      description:
        'Traditional reading glasses with comfortable fit and clear vision.',
      images: [
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop'
      ],
      genderCategory: 'men',
      productType: 'reading-glasses',
      brand: 'ReadWell',
      features: [
        'Clear Vision',
        'Comfortable Fit',
        'Durable Frame',
        'Various Strengths Available'
      ],
      isActive: true,
      isFeatured: false,
      sku: 'RW-CLA-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Designer Reading Glasses',
      description:
        'Stylish reading glasses that combine fashion with function.',
      images: [
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&h=500&fit=crop'
      ],
      genderCategory: 'women',
      productType: 'reading-glasses',
      brand: 'StyleRead',
      features: [
        'Designer Frame',
        'Anti-Scratch Coating',
        'Lightweight',
        'Elegant Design'
      ],
      isActive: true,
      isFeatured: false,
      sku: 'SR-DES-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Progressive Reading Glasses',
      description:
        'Advanced progressive lenses for seamless near and distance vision.',
      images: [
        'https://images.unsplash.com/photo-1594736797933-d0c6b7d81d9e?w=500&h=500&fit=crop'
      ],
      genderCategory: 'women',
      productType: 'reading-glasses',
      brand: 'VisionPro',
      features: [
        'Progressive Lenses',
        'Seamless Vision',
        'Premium Frame',
        'Anti-Reflective Coating'
      ],
      isActive: true,
      isFeatured: true,
      sku: 'VP-PRO-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Prescription Glasses
    {
      name: 'Modern Prescription Frames',
      description:
        'Contemporary prescription frames suitable for everyday wear.',
      images: [
        'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=500&h=500&fit=crop'
      ],
      genderCategory: 'men',
      productType: 'prescription-glasses',
      brand: 'ModernVision',
      features: [
        'Modern Design',
        'Lightweight',
        'Adjustable Nose Pads',
        'Premium Materials'
      ],
      isActive: true,
      isFeatured: false,
      sku: 'MV-MOD-001',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Vintage Prescription Glasses',
      description:
        'Classic vintage-inspired prescription glasses with timeless appeal.',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop'
      ],
      genderCategory: 'women',
      productType: 'prescription-glasses',
      brand: 'VintageVision',
      features: [
        'Vintage Design',
        'Quality Acetate',
        'Comfortable Fit',
        'Durable Construction'
      ],
      isActive: true,
      isFeatured: true,
      sku: 'VV-VIN-001',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection('products').insertMany(products);

  console.log('Database seeded successfully!');
  console.log('Admin login: admin@opticalshop.com / admin123');
  console.log('User login: user@example.com / user123');
}
