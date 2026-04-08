import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not configured");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
