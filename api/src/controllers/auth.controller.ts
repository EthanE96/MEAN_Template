import { Request, Response, NextFunction } from "express";
import passport from "passport";
import User, { IUser } from "../models/user.model";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Email or username already exists",
      });
      return;
    }

    const newUser = new User({
      email,
      username,
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
        success: true,
        message: "Registration successful",
        user: userResponse,
      });
    });
  } catch (error) {
    next(error);
  }
};

export const login = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate(
    "local",
    (err: Error | null, user: IUser | false, info: { message: string } | undefined) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || "Authentication failed",
        });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        const userResponse = user.toObject();
        delete userResponse.password;
        return res.status(200).json({
          success: true,
          message: "Login successful",
          user: userResponse,
        });
      });
    }
  )(req, res, next);
};

export const logout = (req: Request, res: Response, next: NextFunction): void => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  });
};

export const getCurrentUser = (req: Request, res: Response, _next: NextFunction): void => {
  const userResponse = (req.user as IUser).toObject();
  delete userResponse.password;

  res.status(200).json({
    success: true,
    user: userResponse,
  });
};
