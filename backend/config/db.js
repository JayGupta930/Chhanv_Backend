import mongoose from "mongoose";

const connection = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MONGO_URL:", process.env.MONGO_URI);
    
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

export default connection;