import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { IUser } from "../models/user.model";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  logout = (req: Request, res: Response, next: NextFunction): void => {
    req.logout((error) => {
      if (error) {
        return next(error);
      }
      res.status(200).json({
        message: "Logout successful",
      });
    });
  };

  getCurrentUser = (req: Request, res: Response, _next: NextFunction): void => {
    const userInfo = this.authService.getCurrentUser(req.user as IUser);

    res.status(200).json({
      authenticated: true,
      user: userInfo,
    });
  };

  localRegister = (req: Request, res: Response, next: NextFunction): void => {
    // Add registration flag to request body
    req.body.isRegistration = true;

    passport.authenticate(
      "local",
      (error: Error | null, user: IUser | false, info: { message: string } | undefined) => {
        if (error) {
          return next(error);
        }

        if (!user) {
          return res.status(409).json({
            authenticated: false,
            message: info?.message || "Registration failed",
          });
        }

        req.login(user, (error) => {
          if (error) {
            return next(error);
          }

          return res.status(201).json({
            authenticated: true,
            message: "Registration successful",
            user: this.authService.getCurrentUser(user),
          });
        });
      }
    )(req, res, next);
  };

  localLogin = (req: Request, res: Response, next: NextFunction): void => {
    // Ensure registration flag is false for login
    req.body.isRegistration = false;

    passport.authenticate(
      "local",
      (error: Error | null, user: IUser | false, info: { message: string } | undefined) => {
        if (error) {
          return next(error);
        }
        if (!user) {
          return res.status(401).json({
            authenticated: false,
            message: info?.message || "Authentication failed",
          });
        }

        req.login(user, (error) => {
          if (error) {
            return next(error);
          }

          return res.status(200).json({
            authenticated: true,
            message: "Login successful",
            user: this.authService.getCurrentUser(user),
          });
        });
      }
    )(req, res, next);
  };
}
