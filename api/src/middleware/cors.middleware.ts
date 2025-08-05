import cors from "cors";
import { RequestHandler } from "express";

// CORS middleware setup for Express using settings from global config
export function createCorsMiddleware(): RequestHandler {
  const allowedOrigins = [process.env.UI_URL];
  return cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  });
}
