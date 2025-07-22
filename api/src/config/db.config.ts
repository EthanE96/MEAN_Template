import mongoose from "mongoose";
import dotenv from "dotenv";
import { ManagedIdentityCredential } from "@azure/identity";
import { CosmosDBManagementClient } from "@azure/arm-cosmosdb";
dotenv.config();

interface ConnectionConfig {
  mongoURI?: string;
  cosmosAccountName?: string;
  cosmosDatabase?: string;
  azureClientId?: string;
  azureSubscriptionId?: string;
  azureResourceGroup?: string;
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
    const connectionString = await setConnectionString();

    // Mongoose connection options optimized for Cosmos DB
    const mongooseOptions = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      bufferCommands: false, // Disable mongoose buffering
      authSource: "admin", // Use admin database for authentication
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
/**
 * Gets the MongoDB connection string based on environment variables and context.
 * @returns {Promise<string>} The connection string.
 */
async function setConnectionString(): Promise<string> {
  const config: ConnectionConfig = {
    // String or Local MongoDB URI
    mongoURI: process.env.MONGODB_URI,
    // Cosmos DB specific configurations
    cosmosAccountName: process.env.COSMOS_ACCOUNT_NAME,
    cosmosDatabase: process.env.COSMOS_DATABASE,
    // Azure specific configurations
    azureClientId: process.env.AZURE_CLIENT_ID,
    azureSubscriptionId: process.env.AZURE_SUBSCRIPTION_ID,
    azureResourceGroup: process.env.AZURE_RESOURCE_GROUP,
  };

  // If running in Azure with managed identity
  if (
    config.azureClientId &&
    config.azureSubscriptionId &&
    config.azureResourceGroup &&
    config.cosmosAccountName &&
    config.cosmosDatabase
  ) {
    // Use Managed Identity for Azure Cosmos DB
    console.log("Connecting to Azure Cosmos DB with Managed Identity...");

    const key = await getCosmosAccountKey(
      config.azureClientId,
      config.azureSubscriptionId,
      config.azureResourceGroup,
      config.cosmosAccountName
    );

    return `mongodb://${config.cosmosAccountName}:${key}@${config.cosmosAccountName}.mongo.cosmos.azure.com:10255/${config.cosmosDatabase}?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${config.cosmosAccountName}@`;
  } else if (config.mongoURI) {
    // Connection String Connection
    console.log("Connecting to local MongoDB...");
    return config.mongoURI;
  } else {
    // If no valid connection string is provided, throw an error
    throw new Error(
      "No valid connection configuration found. Please set either MONGODB_URI or Cosmos DB environment variables."
    );
  }
}

// Get Cosmos DB Account Key using Managed Identity
async function getCosmosAccountKey(
  azureClientId: string,
  azureSubscriptionId: string,
  azureResourceGroup: string,
  cosmosAccountName: string
) {
  try {
    // Allow User Assigned Managed Identity
    const credential = new ManagedIdentityCredential({ clientId: azureClientId });
    const client = new CosmosDBManagementClient(credential, azureSubscriptionId);

    // This call requires the "Cosmos DB Account Reader Role" assigned to the MI
    const keys = await client.databaseAccounts.listConnectionStrings(
      azureResourceGroup,
      cosmosAccountName
    );

    if (!keys.connectionStrings || keys.connectionStrings.length === 0) {
      throw new Error("No connection strings found for Cosmos DB account.");
    }

    const connectionStringObj = keys.connectionStrings[0]; // Or choose one by name if needed
    if (!connectionStringObj.connectionString) {
      throw new Error(
        "First connection string is missing the connectionString property."
      );
    }
    const url = new URL(connectionStringObj.connectionString);
    const password = url.password; // This extracts the key part from the URL

    if (!password) {
      throw new Error(
        "Could not extract password (key) from Cosmos DB connection string."
      );
    }
    return password; // Return Cosmos DB account key
  } catch (error) {
    console.error("Error retrieving Cosmos DB account key:", error);
    throw error;
  }
}

//^ Utility Functions
/**
 * Checks if the database is currently connected.
 * @returns {boolean} True if connected, false otherwise.
 */
export const isDBConnected = (): boolean => {
  return isConnected && mongoose.connection.readyState === 1;
  // Optionally return the current connection string if needed
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

/**
 * Gets the current MongoDB connection string.
 * @returns {Promise<string>} The current connection string.
 * @throws {Error} If the database is not connected.
 */
export const getConnectionString = async (): Promise<string> => {
  if (!isConnected) {
    throw new Error("Database is not connected. Please connect first.");
  }
  // Returns the current connection string if available
  const client = mongoose.connection.getClient();
  // @ts-expect-error to be the connection string
  const url = client?.s?.url;

  if (!url) {
    throw new Error("Connection string is not available.");
  }

  return url;
};
