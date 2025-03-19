import express, { Request } from "express";
import cors from "cors";
// import session from "express-session";
import morgan from "morgan";
// import passport from "passport";
// import MongoStore from "../node_modules/connect-mongo/build/main/index";
import { connectDB } from "./config/dbConfig";
import routes from "./routes";
// import { passportConfig } from "./config/passportConfig";
// import { seedModels } from "./seeder/seedModels";

const app = express();

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI as string;
connectDB(mongoURI);

// Trust proxy, before middleware
app.set("trust proxy", 1);

// Middleware to parse JSON
app.use(express.json());

// Allowed Origins
const allowedOrigins = [process.env.UI_URL];

// Allows UI to make requests api from dif domains
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

// // Session Management
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "your_secret_key",
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: mongoURI }),
//     cookie: {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours,
//     },
//   })
// );

// // Initialize Passport and use it with the session
// passportConfig();
// app.use(passport.initialize());
// app.use(passport.session());

// Morgan Logger
morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status - :response-time ms body:body"));

// // Seed data
// seedModels();

// Routes
app.use("/api", routes);

export default app;
