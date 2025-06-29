import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = false;

// This function connects to the MongoDB database using Mongoose
export const connectDB = async (mongoURI: string | undefined) => {
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (isConnected) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("MongoDB connection established successfully");

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      console.warn("MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error(`MongoDB connection failed: ${error}`);
    throw error;
  }
};
