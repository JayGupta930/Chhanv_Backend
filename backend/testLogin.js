import { config } from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/User.js";

config({
  path: "secret.env",
});

const testLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");

    // Test admin user lookup
    console.log("\n🔍 Testing Admin User Lookup:");
    const adminUser = await User.findOne({ email: 'admin@chhanv.com', role: 'admin' }).select("+password");
    console.log("Admin user found:", adminUser ? "✅ Yes" : "❌ No");
    if (adminUser) {
      console.log("Admin user role:", adminUser.role);
      console.log("Admin user email:", adminUser.email);
    }

    // Test doctor user lookup
    console.log("\n🔍 Testing Doctor User Lookup:");
    const doctorUser = await User.findOne({ email: 'doctor@chhanv.com', role: 'doctor' }).select("+password");
    console.log("Doctor user found:", doctorUser ? "✅ Yes" : "❌ No");
    if (doctorUser) {
      console.log("Doctor user role:", doctorUser.role);
      console.log("Doctor user email:", doctorUser.email);
    }

    // List all users
    console.log("\n📋 All Users in Database:");
    const allUsers = await User.find({}, 'firstName lastName email role');
    allUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
    });

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

testLogin();
