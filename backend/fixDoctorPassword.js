import { config } from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/User.js";

config({
  path: "secret.env",
});

const fixDoctorPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");

    // Hash the correct password
    const correctPassword = 'doctor123';
    const hashedPassword = await bcrypt.hash(correctPassword, 10);
    console.log("✅ Password hashed successfully");

    // Update doctor user password
    const result = await User.updateOne(
      { email: 'doctor@chhanv.com', role: 'doctor' },
      { password: hashedPassword }
    );

    if (result.modifiedCount > 0) {
      console.log("✅ Doctor password updated successfully");
      
      // Test the updated password
      const doctorUser = await User.findOne({ email: 'doctor@chhanv.com', role: 'doctor' }).select("+password");
      const isPasswordMatched = await doctorUser.comparePassword('doctor123');
      console.log("Password verification test:", isPasswordMatched ? "✅ Success" : "❌ Failed");
    } else {
      console.log("❌ Doctor password update failed");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

fixDoctorPassword();
