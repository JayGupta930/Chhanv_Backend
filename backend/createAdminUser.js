import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import { config } from "dotenv";

// Load environment variables
config({ path: "./secret.env" });

const createAdminUser = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB successfully!");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: "admin2@chhanv.com" });

    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists in database");
      console.log("Admin details:", {
        id: existingAdmin._id,
        email: existingAdmin.email,
        role: existingAdmin.role,
        firstName: existingAdmin.firstName,
        lastName: existingAdmin.lastName,
      });
    } else {
      // Create new admin user (password will be auto-hashed by the User model)
      const adminUser = new User({
        firstName: "छांव",
        lastName: "एडमिन",
        email: "admin2@chhanv.com",
        phoneNumber: "9999999998",
        password: "admin@2025", // Don't hash manually - User model will handle it
        role: "admin",
        dateOfBirth: new Date("1985-01-01"),
        gender: "male",
      });

      // Save to database
      const savedUser = await adminUser.save();
      console.log("✅ Admin user created successfully!");
      console.log("Admin details:", {
        id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
      });
    }

    // List all users to verify
    console.log("\n📋 All users in database:");
    const allUsers = await User.find(
      {},
      "firstName lastName email role phoneNumber"
    );
    allUsers.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.firstName} ${user.lastName} - ${
          user.email
        } - Role: ${user.role}`
      );
    });

    console.log("\n🎯 Admin Login Credentials:");
    console.log("Email: admin2@chhanv.com");
    console.log("Password: admin@2025");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔗 Database connection closed");
  }
};

createAdminUser();
