import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    
    const admin = await Admin.create({
      username: 'admin',
      password: 'Admin123' // Will be auto-hashed
    });

    console.log('✅ Admin created successfully:', admin);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();