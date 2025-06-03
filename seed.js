// Simple seeding script that can be run with Node.js
import { seedDatabase } from './app/utils/seed.server.js';

async function runSeed() {
  try {
    console.log('🌱 Starting database seeding...');
    await seedDatabase();
    console.log('✅ Database seeded successfully!');
    console.log('📊 The database now contains:');
    console.log('   • 17 products across all categories');
    console.log('   • 2 users (admin and regular user)');
    console.log('   • 3 promotional banners');
    console.log('');
    console.log('🔐 Login credentials:');
    console.log('   Admin: admin@opticalshop.com / admin123');
    console.log('   User:  user@example.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeed().catch(console.error);
