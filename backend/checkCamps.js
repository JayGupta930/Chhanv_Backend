import mongoose from "mongoose";
import { Camp } from "./models/camp.js";
import { config } from "dotenv";

// Load environment variables
config({ path: "./secret.env" });

const checkCamps = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");

    // Check camps in database
    const camps = await Camp.find();

    console.log(`\n📊 Found ${camps.length} camps in database:`);

    if (camps.length === 0) {
      console.log("ℹ️  No camps found. Database is empty.");

      // Create a sample camp for testing
      const sampleCamp = new Camp({
        location: "Test Location",
        date: new Date("2025-08-15"),
        startTime: "09:00",
        endTime: "17:00",
        address: "123 Test Street, Test City",
        conductedBy: [], // Empty for now
        limit: 50,
        createdBy: "Admin",
        description: "Sample camp for testing",
      });

      await sampleCamp.save();
      console.log("✅ Sample camp created for testing");
    } else {
      camps.forEach((camp, index) => {
        console.log(
          `${index + 1}. ${camp.location} - ${camp.date.toDateString()} (${
            camp.startTime
          } - ${camp.endTime})`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔗 Database connection closed");
  }
};

checkCamps();
