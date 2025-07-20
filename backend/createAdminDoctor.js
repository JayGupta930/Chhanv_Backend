import mongoose from "mongoose";
import { User } from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createAdminAndDoctor = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    
    // Create Admin User
    const adminEmail = "admin2@chhanv.com";
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      const admin = await User.create({
        firstName: "छांव",
        lastName: "एडमिन",
        email: adminEmail,
        password: "admin@2025",
        phoneNumber: "9999999999",
        dateOfBirth: new Date("1990-01-01"),
        gender: "male",
        role: "admin"
      });
      console.log("✅ Admin created:", admin.email, "- Role:", admin.role);
    } else {
      console.log("✅ Admin already exists:", adminExists.email, "- Role:", adminExists.role);
      
      // Update role if it's not admin
      if (adminExists.role !== 'admin') {
        adminExists.role = 'admin';
        await adminExists.save();
        console.log("🔄 Updated admin role");
      }
    }
    
    // Create Doctor User
    const doctorEmail = "doctor@chhanv.com";
    const doctorExists = await User.findOne({ email: doctorEmail });
    
    if (!doctorExists) {
      const doctor = await User.create({
        firstName: "डॉ. राम",
        lastName: "शर्मा",
        email: doctorEmail,
        password: "doctor123",
        phoneNumber: "8888888888",
        dateOfBirth: new Date("1985-01-01"),
        gender: "male",
        role: "doctor"
      });
      console.log("✅ Doctor created:", doctor.email, "- Role:", doctor.role);
    } else {
      console.log("✅ Doctor already exists:", doctorExists.email, "- Role:", doctorExists.role);
      
      // Update role if it's not doctor
      if (doctorExists.role !== 'doctor') {
        doctorExists.role = 'doctor';
        await doctorExists.save();
        console.log("🔄 Updated doctor role");
      }
    }
    
    // Show final users
    console.log("\n📋 Final users list:");
    const allUsers = await User.find({}).select("firstName lastName email role");
    allUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log("\n🎯 Test these credentials in Postman:");
    console.log("Admin Login:");
    console.log(`Email: ${adminEmail}`);
    console.log("Password: admin@2025");
    console.log("\nDoctor Login:");
    console.log(`Email: ${doctorEmail}`);
    console.log("Password: doctor123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdminAndDoctor();
