import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose.set("strictQuery", true);

const getMongoUri = () =>
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  process.env.DB_URI ||
  "";

const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error("MongoDB connection string is not configured. Set MONGO_URI in backend/.env.");
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: "smartcampus",
      serverSelectionTimeoutMS: 15000,
    });

    await mongoose.connection.db.admin().ping();
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

export default connectDB;
