import "express-async-errors";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import User, { IUser } from "../models/user.model";
import { IApiResponse } from "../models/api-response.model";

export class AuthController {
  signup = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body;
    const user = await User.createLocalFromSignup(email, password, firstName, lastName);

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      return res.status(200).json({
        success: true,
        authenticated: true,
        message: "Signup and login successful.",
      } as IApiResponse<null>);
    });
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (error: any, user: IUser, info: any) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          authenticated: false,
          message: info?.message || "Invalid email or password.",
        } as IApiResponse<null>);
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }

        return res.status(200).json({
          success: true,
          authenticated: true,
          message: "Login successful.",
        } as IApiResponse<null>);
      });
    })(req, res, next);
  };

  logout = (req: Request, res: Response) => {
    req.logout(() => {
      res.status(200).json({
        success: true,
        message: "Logout successful.",
      } as IApiResponse<null>);
    });
  };

  getCurrentUser = (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        authenticated: false,
        message: "No user authenticated.",
      } as IApiResponse<null>);
      return;
    }

    const sanitizedUser = (req.user as IUser).getPublicProfile();

    res.status(200).json({
      success: true,
      authenticated: true,
      data: sanitizedUser,
      message: "User retrieved successfully.",
    } as IApiResponse<IUser>);
  };
}
