import express from "express";
import * as appInsights from "applicationinsights";
import cookieParser from "cookie-parser";
import { createSessionMiddleware } from "./middleware/session.middleware";
import {
  blockMissingIpMiddleware,
  rateLimitMiddleware,
} from "./middleware/rate-limit.middleware";
import { createCorsMiddleware } from "./middleware/cors.middleware";
import passport from "passport";
import {
  createLoggingMiddleware,
  errorLoggingMiddleware,
} from "./middleware/logging.middleware";
import { connectDB } from "./config/db.config";
import { seed } from "./config/seed/seed";
import { getGlobalSettings } from "./utils/global-settings-cache.utils";
import { passportConfig } from "./config/passport.config";
import routes from "./routes/routes";

export async function configureApp() {
  // Application Insights (Only Production/Stage Azure)
  if (process.env.ENV === "production") {
    appInsights.setup().start();
  }

  // Initialize Express application
  const app = express();

  // Config: Connect to MongoDB
  await connectDB();

  // Config: Seed initial data if needed, creates users and notes
  await seed();

  // Config: Fetch global settings from local cache/DB
  const globalSettings = await getGlobalSettings();
  if (!globalSettings) {
    throw new Error("Global settings not found in database.");
  }

  // Middleware: Block requests with missing IP, to ensure rate limiting works correctly
  app.use(blockMissingIpMiddleware);

  // Middleware: Rate Limiting
  app.use(rateLimitMiddleware(globalSettings));

  // Middleware: Body Parsing & Cookies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Middleware: CORS
  app.use(createCorsMiddleware());

  // Middleware: Session Management
  const isProduction = process.env.ENV === "production";
  const secureCookie = isProduction || process.env.SECURE_SESSION_COOKIE === "true";
  // If running behind a proxy (e.g., Heroku, Nginx), trust the proxy for secure cookies
  if (secureCookie) {
    app.set("trust proxy", 1);
  }
  app.use(await createSessionMiddleware());

  // Middleware: Passport Authentication
  app.use(passport.initialize());
  app.use(passport.session());
  passportConfig();

  // Middleware: Logging (development only)
  const loggingMiddleware = await createLoggingMiddleware();
  if (loggingMiddleware) {
    app.use(loggingMiddleware);
  }

  // Register API routes
  app.use("/api", routes);

  // Middleware: Error Handling
  app.use(errorLoggingMiddleware);
  return app;
}

const appPromise = configureApp();
export default appPromise;
