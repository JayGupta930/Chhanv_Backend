import mongoose from "mongoose";
import { User } from "./models/User.js";
import { config } from "dotenv";

// Load environment variables
config({ path: "./secret.env" });

const fixAdminPassword = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB successfully!");

    // Find the admin user
    const adminUser = await User.findOne({ email: "admin2@chhanv.com" });

    if (!adminUser) {
      console.log("❌ Admin user not found");
      return;
    }

    console.log("🔍 Found admin user:", adminUser.email);

    // Update password (this will trigger the pre-save middleware to hash it properly)
    adminUser.password = "admin@2025";
    await adminUser.save();

    console.log("✅ Admin password fixed successfully!");

    // Test the password
    const testPassword = await adminUser.comparePassword("admin@2025");
    console.log(
      "🧪 Password test result:",
      testPassword ? "✅ PASS" : "❌ FAIL"
    );

    console.log("\n🎯 Updated Admin Login Credentials:");
    console.log("Email: admin2@chhanv.com");
    console.log("Password: admin@2025");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔗 Database connection closed");
  }
};

fixAdminPassword();
