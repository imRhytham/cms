import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model';

dotenv.config();

const adminUser = {
   name: 'Admin User',
   email: 'admin@yopmail.com',
   password: 'Pass@123',
   role: 'admin',
};

const seedAdmin = async () => {
   try {
      await mongoose.connect(process.env.MONGODB_URI!);

      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminUser.email });
      if (existingAdmin) {
         console.log('Admin user already exists');
         return;
      }

      // Create admin user
      const admin = new User(adminUser);
      await admin.save();

      console.log('Admin user created successfully');
   } catch (error) {
      console.error('Error seeding admin user:', error);
   } finally {
      await mongoose.disconnect();
   }
};

// Run seeder
seedAdmin(); 