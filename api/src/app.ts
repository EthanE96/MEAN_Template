import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.config";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import passport from "passport";
import { passportConfig } from "./config/passport.config";
import session from "express-session";
import routes from "./routes/routes";
import { seedNotes } from "./config/seed/seed";

const app = express();

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
connectDB(mongoURI);

// Rate Limiter Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allowed Origins
const allowedOrigins = [process.env.UI_URL];

// Allows UI to make requests api from different domains
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

// Session Management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoURI }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport and use it with the session
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

// Morgan Logger
morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status - :response-time ms req:body"));

// Seed data
seedNotes();

// Register Routes
app.use("/api", routes);

// Error-handling middleware
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  // If next(error) is called in your controller, this middleware will catch it
  // and send a response.
  console.log(error.stack); // Log the error for debugging

  res.status(500).json({
    message: error.message,
    error: error.stack,
  });
});

export default app;
