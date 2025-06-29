import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import { connectDB } from "./config/db.config";
import { passportConfig } from "./config/passport.config";
import routes from "./routes/routes";
import { seedNotes } from "./config/seed/seed";
import { getGlobalSettings } from "./utils/global-settings-cache";

const app = express();

/**
 * Configures and initializes the Express application.
 * Loads global settings from the database and applies them to middleware.
 */
async function configureApp() {
  // Connect to MongoDB
  const mongoURI = process.env.MONGODB_URI;
  await connectDB(mongoURI);

  // Seed initial data if needed, creates users and notes
  await seedNotes();

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
    windowMs: (globalSettings.rateLimit.windowMinutes || 15) * 60 * 1000,
    max: globalSettings.rateLimit.maxRequests || 100,
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
  const allowedOrigins = [globalSettings.environment.uiUrl];
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
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "!7vV$QW^vmU&ne4!#cPu1%",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: mongoURI }),
      cookie: {
        httpOnly: true,
        secure: globalSettings.session.secureCookies,
        sameSite: globalSettings.session.secureCookies ? "none" : "lax",
        maxAge: (globalSettings.session.sessionTimeoutMinutes || 1440) * 60 * 1000,
      },
      name: globalSettings.session.sessionCookieName,
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
  morgan.token("body", (req: Request) => JSON.stringify(req.body));
  app.use(morgan(":method :url :status - :response-time ms req:body"));

  // Register API routes
  app.use("/api", routes);

  /**
   * Error-handling middleware
   * Catches errors and sends a JSON response.
   */
  app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
    console.log(error.stack);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
      errors: error.errors || error.stack,
    });
  });
}

// Initialize the application
configureApp();

export default app;
