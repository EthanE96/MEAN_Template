import appInsights from "applicationinsights";
import rateLimit from "express-rate-limit";
import { Request, RequestHandler } from "express";
import { IGlobalSettings } from "../models/global-settings.model";

// Middleware to block requests with missing IP address
export const blockMissingIpMiddleware: RequestHandler = (req, res, next) => {
  if (!req.ip) {
    // Custom App Insights metric for missing IP
    if (appInsights.defaultClient) {
      appInsights.defaultClient.trackMetric({
        name: "MissingRequestIP",
        value: 1,
        properties: {
          path: req.originalUrl,
          description: "Number of requests rejected due to missing IP address",
        },
      });
    }

    res.status(400).json({
      success: false,
      message: "Missing IP address. Request rejected.",
    });
    return;
  }
  next();
};

// Rate limiting middleware setup for Express using settings from global config
export function rateLimitMiddleware(globalSettings?: IGlobalSettings): RequestHandler {
  return rateLimit({
    windowMs: (globalSettings?.maxRateLimit.windowMinutes || 1) * 60 * 1000,
    // limit each IP to a certain number of requests per window
    limit: globalSettings?.maxRateLimit.maxRequests || 20,
    standardHeaders: true,
    message: "Too many requests, please try again later.",
    statusCode: 429,
    keyGenerator: (req: Request): string => {
      const ip = req.ip ?? "";
      if (!ip) {
        console.error("No request IP, rate limit is missing `req.ip` on the request.");
      }
      return ip.replace(/:\d+[^:]*$/, "");
    },
  });
}
