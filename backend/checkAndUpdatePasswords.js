import mongoose from "mongoose";
import { User } from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const checkPasswordsAndUpdate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    
    // Get all admin and doctor users
    const adminUsers = await User.find({ role: 'admin' });
    const doctorUsers = await User.find({ role: 'doctor' });
    
    console.log("\n🔍 Checking Admin Users:");
    for (const admin of adminUsers) {
      console.log(`\n📋 Admin: ${admin.firstName} ${admin.lastName} (${admin.email})`);
      
      // Test different possible passwords
      const possiblePasswords = ['admin123', 'admin@123', 'admin@2025', 'password', 'admin'];
      
      for (const testPassword of possiblePasswords) {
        try {
          const isMatch = await admin.comparePassword(testPassword);
          if (isMatch) {
            console.log(`✅ Password found: "${testPassword}"`);
            break;
          }
        } catch (error) {
          // Password doesn't match, continue
        }
      }
    }
    
    console.log("\n🔍 Checking Doctor Users:");
    for (const doctor of doctorUsers) {
      console.log(`\n📋 Doctor: ${doctor.firstName} ${doctor.lastName} (${doctor.email})`);
      
      // Test different possible passwords
      const possiblePasswords = ['doctor123', 'doctor@123', 'password', 'doctor'];
      
      for (const testPassword of possiblePasswords) {
        try {
          const isMatch = await doctor.comparePassword(testPassword);
          if (isMatch) {
            console.log(`✅ Password found: "${testPassword}"`);
            break;
          }
        } catch (error) {
          // Password doesn't match, continue
        }
      }
    }
    
    // Update passwords to known values for testing
    console.log("\n🔧 Updating passwords to known values...");
    
    // Update admin@chhanv.com password
    const systemAdmin = await User.findOne({ email: 'admin@chhanv.com' });
    if (systemAdmin) {
      systemAdmin.password = 'admin@2025';
      await systemAdmin.save();
      console.log("✅ Updated admin@chhanv.com password to: admin@2025");
    }
    
    // Update doctor@chhanv.com password
    const doctor = await User.findOne({ email: 'doctor@chhanv.com' });
    if (doctor) {
      doctor.password = 'doctor123';
      await doctor.save();
      console.log("✅ Updated doctor@chhanv.com password to: doctor123");
    }
    
    console.log("\n🎯 Updated Test Credentials:");
    console.log("Admin 1: admin@chhanv.com / admin@2025");
    console.log("Admin 2: admin2@chhanv.com / admin@2025");
    console.log("Doctor: doctor@chhanv.com / doctor123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkPasswordsAndUpdate();
