import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";
import { IApiResponse } from "../models/api-response.model";

/**
 * Middleware to check if the user is authenticated.
 * If authenticated, it calls the next middleware.
 * If not authenticated, it responds with a 401 status code and an error message.
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    success: false,
    authenticated: false,
    message: "Authentication required",
  } as IApiResponse<null>);
};

/**
 * Middleware to check if the user is an admin.
 * If the user is authenticated and has the role of 'admin', it calls the next middleware.
 * If not, it responds with a 403 status code and an error message.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated() && (req.user as IUser).role === "admin") {
    return next();
  }
  res.status(403).json({
    success: false,
    authenticated: true,
    message: "Admin access required",
  } as IApiResponse<null>);
};
