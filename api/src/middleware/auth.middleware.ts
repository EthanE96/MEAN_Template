import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    success: false,
    message: "Authentication required",
  });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated() && (req.user as IUser).role === "admin") {
    return next();
  }
  res.status(403).json({
    success: false,
    message: "Admin access required",
  });
};
