import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import passport from "passport";

export class AuthController {
  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      const user = await User.createLocalFromSignup(email, password, firstName, lastName);

      req.login(user, (error) => {
        if (error) return next(error);

        res.status(201).json({
          message: "User created and signed in successfully",
          user: user.getPublicProfile(),
          authenticated: true,
        });
      });
    } catch (error) {
      return next(error);
    }
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (error: any, user: IUser, info: any) => {
      if (error) return next(error);

      // Check is user is returned
      if (!user) {
        return res.status(401).json({
          authenticated: false,
          message: info?.message || "Invalid email or password",
        });
      }

      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);

        return res.status(200).json({
          authenticated: true,
          message: "Login successful",
        });
      });
    })(req, res, next);
  };

  logout = (req: Request, res: Response, next: NextFunction) => {
    try {
      req.logout(() => {
        res.status(200).json({
          message: "Logout successful",
        });
      });
    } catch (error) {
      return next(error);
    }
  };

  getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({
          authenticated: false,
          message: "No user authenticated",
        });
        return;
      }

      const sanitizedUser = (req.user as IUser).getPublicProfile();

      res.status(200).json({
        authenticated: true,
        user: sanitizedUser,
        message: "User retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  };
}
