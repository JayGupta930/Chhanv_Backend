// Create Test Users Script
// Run this to create sample users with proper roles

import bcrypt from 'bcrypt';
import { User } from './models/User.js';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import connection from './config/db.js';

config({ path: './secret.env' });

// Create sample users
const createSampleUsers = async () => {
  try {
    // Connect to database
    await connection();
    console.log('✅ Connected to database');


    // Hash passwords
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedAdmin2Password = await bcrypt.hash('admin@2025', 10);
    const hashedDoctorPassword = await bcrypt.hash('doctor123', 10);
    const hashedUserPassword = await bcrypt.hash('user123', 10);

    // Create Admin User
    const adminUser = new User({
      firstName: 'छांव',
      lastName: 'एडमिन',
      email: 'admin@chhanv.com',
      phoneNumber: '9999999999',
      password: hashedAdminPassword,
      role: 'admin',
      dateOfBirth: new Date('1980-01-01'),
      gender: 'male'
    });


    // Create Second Admin User
    const adminUser2 = new User({
      firstName: 'छांव',
      lastName: 'एडमिन2',
      email: 'admin2@chhanv.com',
      phoneNumber: '9999999998',
      password: hashedAdmin2Password,
      role: 'admin',
      dateOfBirth: new Date('1985-01-01'),
      gender: 'male'
    });

    // Create Doctor User
    const doctorUser = new User({
      firstName: 'डॉ. राम',
      lastName: 'शर्मा',
      email: 'doctor@chhanv.com',
      phoneNumber: '8888888888',
      password: hashedDoctorPassword,
      role: 'doctor',
      dateOfBirth: new Date('1975-05-15'),
      gender: 'male'
    });

    // Create Regular User
    const regularUser = new User({
      firstName: 'राज',
      lastName: 'कुमार',
      email: 'user@chhanv.com',
      phoneNumber: '9876543210',
      password: hashedUserPassword,
      role: 'user',
      dateOfBirth: new Date('1990-10-20'),
      gender: 'male',
      bloodGroup: 'B+'
    });

    // Check if users already exist
    const existingAdmin = await User.findOne({ email: 'admin@chhanv.com' });

    const existingAdmin2 = await User.findOne({ email: 'admin2@chhanv.com' });
    const existingDoctor = await User.findOne({ email: 'doctor@chhanv.com' });
    const existingUser = await User.findOne({ phoneNumber: '9876543210' });

    // Save users if they don't exist

    if (!existingAdmin) {
      await adminUser.save();
      console.log('✅ Admin user created: admin@chhanv.com / admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    if (!existingAdmin2) {
      await adminUser2.save();
      console.log('✅ Admin2 user created: admin2@chhanv.com / admin@2025');
    } else {
      console.log('ℹ️  Admin2 user already exists');
    }

    if (!existingDoctor) {
      await doctorUser.save();
      console.log('✅ Doctor user created: doctor@chhanv.com / doctor123');
    } else {
      console.log('ℹ️  Doctor user already exists');
    }

    if (!existingUser) {
      await regularUser.save();
      console.log('✅ Regular user created: 9876543210 / user123');
    } else {
      console.log('ℹ️  Regular user already exists');
    }

    console.log('\n🎯 Test Users Ready:');
    console.log('👨‍💼 Admin: admin@chhanv.com / admin123');
    console.log('👩‍⚕️ Doctor: doctor@chhanv.com / doctor123');
    console.log('👤 User: 9876543210 / user123');
    
  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
const runScript = async () => {
  await createSampleUsers();
};

runScript();
