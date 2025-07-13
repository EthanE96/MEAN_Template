import mongoose from "mongoose";
import dotenv from "dotenv";
import { ManagedIdentityCredential } from "@azure/identity";
dotenv.config();

interface ConnectionConfig {
  mongoURI?: string;
  cosmosAccountName?: string;
  cosmosDatabase?: string;
  azureClientId?: string;
}

let isConnected = false;

// This function connects to the MongoDB database using Mongoose
export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    // Use provided URI or get from environment
    const connectionString = await getConnectionString();

    // Mongoose connection options optimized for Cosmos DB
    const mongooseOptions = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      bufferCommands: false, // Disable mongoose buffering
    };

    await mongoose.connect(connectionString, mongooseOptions);
    isConnected = true;
    console.log("MongoDB connection established successfully");

    // Event handlers
    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      console.warn("MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
      isConnected = true;
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`Received ${signal}. Closing MongoDB connection...`);
      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed gracefully");
        process.exit(0);
      } catch (error) {
        console.error("Error closing MongoDB connection:", error);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    console.error(`MongoDB connection failed:`, error);
    isConnected = false;
    throw error;
  }
};

//^ Helper Functions
// Function to get Azure access token
async function getCosmosAccessToken(clientId: string): Promise<string> {
  try {
    const credential = new ManagedIdentityCredential({ clientId });
    const tokenResponse = await credential.getToken("https://cosmos.azure.com/.default");
    return tokenResponse.token;
  } catch (error) {
    console.error("Failed to get Azure access token:", error);
    throw error;
  }
}

// Function to build Cosmos DB connection string
function buildCosmosConnectionString(
  accountName: string,
  database: string,
  token: string
): string {
  return `mongodb://${accountName}:${encodeURIComponent(
    token
  )}@${accountName}.mongo.cosmos.azure.com:10255/${database}?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${accountName}@`;
}

/**
 * Gets the MongoDB connection string based on environment variables and context.
 * @param suppressLog If true, suppresses connection log output.
 */
export async function getConnectionString(suppressLog = false): Promise<string> {
  const config: ConnectionConfig = {
    mongoURI: process.env.MONGODB_URI,
    cosmosAccountName: process.env.COSMOS_ACCOUNT_NAME,
    cosmosDatabase: process.env.COSMOS_DATABASE,
    azureClientId: process.env.AZURE_CLIENT_ID,
  };

  // If running in Azure with managed identity
  if (config.azureClientId && config.cosmosAccountName && config.cosmosDatabase) {
    if (!suppressLog) {
      console.log("Connecting to Azure Cosmos DB with Managed Identity...");
    }
    const token = await getCosmosAccessToken(config.azureClientId);
    return buildCosmosConnectionString(
      config.cosmosAccountName,
      config.cosmosDatabase,
      token
    );
  }

  // If local development or fallback
  if (config.mongoURI) {
    if (!suppressLog) {
      console.log("Connecting to local MongoDB...");
    }
    return config.mongoURI;
  }

  throw new Error(
    "No valid connection configuration found. Please set either MONGODB_URI or Cosmos DB environment variables."
  );
}

/**
 * Checks if the database is currently connected.
 * @returns {boolean} True if connected, false otherwise.
 */
export const isDBConnected = (): boolean => {
  return isConnected && mongoose.connection.readyState === 1;
};

/**
 * Disconnects from the MongoDB database if connected.
 * @returns {Promise<void>}
 */
export const disconnectDB = async (): Promise<void> => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    console.log("MongoDB connection closed");
  }
};
