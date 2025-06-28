import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// This function connects to the MongoDB database using Mongoose
export const connectDB = async (mongoURI: string | undefined) => {
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connection established successfully");
  } catch (error) {
    console.error(`MongoDB connection failed: ${error}`);
  }
};
