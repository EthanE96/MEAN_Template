import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const URL = process.env.API_URL || "http://localhost:3000";

app.listen(PORT, () => {
  console.log(`Server is running ${URL}/api`);
});
