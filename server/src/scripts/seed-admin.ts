import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { AuthService } from '../apps/auth/services/auth.service.js';

dotenv.config();

async function seedAdmin(): Promise<void> {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/fire-safety-admin';

  await mongoose.connect(uri);
  console.log('[SEED] Connected to MongoDB');

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@safemete.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
  const name = process.env.SEED_ADMIN_NAME || 'Super Admin';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('[SEED] Super admin already exists. Skipping.');
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await AuthService.hashPassword(password);

  await User.create({
    email,
    passwordHash,
    name,
    role: 'super_admin',
  });

  console.log('[SEED] Super admin created:');
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Role:     super_admin`);

  await mongoose.disconnect();
  console.log('[SEED] Done.');
}

seedAdmin().catch((err) => {
  console.error('[SEED] Failed:', err);
  process.exit(1);
});
