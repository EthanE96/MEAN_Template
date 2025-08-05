import session from "express-session";
import MongoStore from "connect-mongo";
import { getConnectionString } from "../config/db.config";
import { RequestHandler } from "express";

// Session middleware setup for Express using MongoStore
export async function createSessionMiddleware(): Promise<RequestHandler> {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not defined in environment variables.");
  }
  const sessionTimeoutMinutes = Number(process.env.SESSION_TIMEOUT_MINUTES) || 60;
  const sessionMaxAge = sessionTimeoutMinutes * 60 * 1000;
  const sessionCookieName = process.env.SESSION_COOKIE_NAME?.trim() || "session";
  const isProduction = process.env.ENV === "production";
  const secureCookie = isProduction || process.env.SECURE_SESSION_COOKIE === "true";
  const sameSiteValue = secureCookie ? "none" : "lax";

  return session({
    secret: process.env.SESSION_SECRET!,
    store: MongoStore.create({
      mongoUrl: await getConnectionString(),
      touchAfter: 24 * 3600,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: secureCookie,
      sameSite: sameSiteValue as any,
      maxAge: sessionMaxAge,
    },
    name: sessionCookieName,
    unset: "destroy",
  });
}
