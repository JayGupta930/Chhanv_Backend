import mongoose from "mongoose";
import { User } from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    
    // Check all users
    const allUsers = await User.find({}).select("firstName lastName email role");
    console.log("\n📋 All users in database:");
    if (allUsers.length === 0) {
      console.log("❌ No users found in database!");
    } else {
      allUsers.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
      });
    }
    
    // Check admins specifically
    const admins = await User.find({ role: 'admin' });
    console.log(`\n👑 Admin users (${admins.length}):`);
    if (admins.length === 0) {
      console.log("❌ No admin users found!");
    } else {
      admins.forEach(admin => {
        console.log(`- ${admin.firstName} ${admin.lastName} (${admin.email})`);
      });
    }
    
    // Check doctors specifically
    const doctors = await User.find({ role: 'doctor' });
    console.log(`\n👨‍⚕️ Doctor users (${doctors.length}):`);
    if (doctors.length === 0) {
      console.log("❌ No doctor users found!");
    } else {
      doctors.forEach(doctor => {
        console.log(`- ${doctor.firstName} ${doctor.lastName} (${doctor.email})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkUsers();
