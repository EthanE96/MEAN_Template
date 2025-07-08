import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import { connectDB, getConnectionString } from "./config/db.config";
import { seed } from "./config/seed/seed";
import { passportConfig } from "./config/passport.config";
import routes from "./routes/routes";
import { getGlobalSettings } from "./utils/global-settings-cache.utils";
import { AppError } from "./models/errors.model";
import { IApiResponse } from "./models/api-response.model";

const app = express();

//test7

/**
 * Configures and initializes the Express application.
 * Loads global settings from the database and applies them to middleware.
 */
async function configureApp() {
  // Connect to MongoDB
  await connectDB();

  // Seed initial data if needed, creates users and notes
  await seed();

  // Fetch global settings from cache/DB
  const globalSettings = await getGlobalSettings();
  if (!globalSettings) {
    throw new Error("Global settings not found in database.");
  }

  /**
   * Middleware: Rate Limiting
   * Uses settings from the database for window and max requests.
   */
  const limiter = rateLimit({
    windowMs: (globalSettings.maxRateLimit.windowMinutes || 15) * 60 * 1000,
    max: globalSettings.maxRateLimit.maxRequests || 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Middleware: Body Parsing & Cookies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  /**
   * Middleware: CORS
   * Restricts origins based on global settings.
   */
  const allowedOrigins = [process.env.UI_URL];
  app.use(
    cors({
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
    })
  );

  /**
   * Middleware: Session Management
   * Uses settings from the database for session configuration.
   */
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not defined in environment variables.");
  }

  const mins = parseInt(process.env.SESSION_TIMEOUT_MINUTES || "", 10);
  const sessionMaxAge = (!isNaN(mins) ? mins : 1440) * 60 * 1000;
  const sessionCookieName = process.env.SESSION_COOKIE_NAME?.trim() || "session";

  // Use ENV to determine environment
  const isProduction = process.env.ENV === "production";
  const secureCookie = isProduction || process.env.SECURE_SESSION_COOKIE === "true";
  const sameSiteValue = secureCookie ? "none" : "lax";

  if (secureCookie) {
    // If running behind a proxy (e.g., Heroku, Nginx), trust the proxy for secure cookies
    app.set("trust proxy", 1);
  }

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      store: MongoStore.create({
        mongoUrl: await getConnectionString(true),
        touchAfter: 24 * 3600, // lazy session update - only update session every 24 hours
      }),

      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: secureCookie,
        sameSite: sameSiteValue,
        maxAge: sessionMaxAge,
      },
      name: sessionCookieName,
      unset: "destroy", // Destroy session on logout
    })
  );

  // Middleware: Passport Authentication
  app.use(passport.initialize());
  app.use(passport.session());
  passportConfig();

  /**
   * Middleware: Logging
   * Logs HTTP requests and request bodies.
   */
  if (process.env.NODE_ENV == "development") {
    morgan.token("body", (req: Request) => JSON.stringify(req.body));
    app.use(morgan(":method :url :status - :response-time ms req:body"));
  }

  // Register API routes
  app.use("/api", routes);

  // Error-handling middleware (must be last)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
    const errorRes: IApiResponse<null> = {
      success: false,
      message: error.message || "An unexpected error occurred.",
      data: null,
      error: {
        name: error.name || "InternalServerError",
        statusCode: error.statusCode || 500,
        isOperational: error.isOperational || false,
        message: error.message || "An unexpected error occurred.",
        stack: error.stack,
      },
    };

    // Log the error for server-side debugging
    if (error instanceof AppError && !error.isOperational) {
      console.error("Unexpected Error:", error);
    } else if (error instanceof AppError) {
      console.warn("Operational Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }

    res.status(errorRes.error?.statusCode ?? 500).json(errorRes);
  });
}

// Initialize the application
configureApp();

export default app;
