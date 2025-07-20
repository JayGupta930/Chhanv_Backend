import { config } from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/User.js";

config({
  path: "secret.env",
});

const testPasswordVerification = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");

    // Test doctor password verification
    console.log("\n🔐 Testing Doctor Password Verification:");
    const doctorUser = await User.findOne({ email: 'doctor@chhanv.com', role: 'doctor' }).select("+password");
    
    if (doctorUser) {
      console.log("Doctor user found:", doctorUser.email);
      console.log("Doctor role:", doctorUser.role);
      
      // Test password comparison
      const isPasswordMatched = await doctorUser.comparePassword('doctor123');
      console.log("Password match result:", isPasswordMatched ? "✅ Match" : "❌ No Match");
      
      if (!isPasswordMatched) {
        console.log("Stored password hash:", doctorUser.password);
      }
    } else {
      console.log("❌ Doctor user not found");
    }

    // Test admin password verification
    console.log("\n🔐 Testing Admin Password Verification:");
    const adminUser = await User.findOne({ email: 'admin@chhanv.com', role: 'admin' }).select("+password");
    
    if (adminUser) {
      console.log("Admin user found:", adminUser.email);
      console.log("Admin role:", adminUser.role);
      
      // Test password comparison
      const isPasswordMatched = await adminUser.comparePassword('admin123');
      console.log("Password match result:", isPasswordMatched ? "✅ Match" : "❌ No Match");
      
      if (!isPasswordMatched) {
        console.log("Stored password hash:", adminUser.password);
      }
    } else {
      console.log("❌ Admin user not found");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

testPasswordVerification();
