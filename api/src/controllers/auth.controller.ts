import { Request, Response, NextFunction } from "express";
import passport from "passport";
import User, { IUser } from "../models/user.model";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  logout = (req: Request, res: Response, next: NextFunction): void => {
    req.logout((err) => {
      if (err) {
        return next(err);
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

  localRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, firstName, lastName } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(409).json({
          authenticated: false,
          message: "Email or username already exists",
        });
        return;
      }

      const newUser = new User({
        email,
        password, // Will be hashed by pre-save hook
        firstName,
        lastName,
      });

      await newUser.save();

      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        // Remove password from response
        const userResponse = { ...newUser.toObject(), password: undefined };

        return res.status(201).json({
          authenticated: true,
          message: "Registration successful",
          user: this.authService.getCurrentUser(userResponse),
        });
      });
    } catch (error) {
      next(error);
    }
  };

  localLogin = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(
      "local",
      (err: Error | null, user: IUser | false, info: { message: string } | undefined) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({
            authenticated: false,
            message: info?.message || "Authentication failed",
          });
        }

        req.login(user, (err) => {
          if (err) {
            return next(err);
          }

          // Remove password from user object before sending response
          const userResponse = user.toObject();
          delete userResponse.password;

          return res.status(200).json({
            authenticated: true,
            message: "Login successful",
            user: this.authService.getCurrentUser(userResponse),
          });
        });
      }
    )(req, res, next);
  };
}
