import dotenv from "dotenv";
import app from "./app";

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;
const URL = process.env.API_URL || `http://localhost:${PORT}`;

/**
 * Starts the Express server.
 */
app.listen(PORT, () => {
  console.log(`Server is running at ${URL}/api`);
});
