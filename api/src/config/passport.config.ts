import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User, { IUser } from "../models/user.model";

export const passportConfig = (): void => {
  // Serialize and deserialize the user for session management
  passport.serializeUser((user: Partial<IUser>, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      // Use MongoDB's _id to find the user
      const user = await User.findById(id);

      if (!user) {
        console.error("No user found during deserialization.");
        return done(null, false);
      }

      // Remove sensitive information
      delete (user as Partial<IUser>).password;
      done(null, user);
    } catch (error) {
      console.error("Error during deserialization:", id, error);
      done(error, false);
    }
  });

  // Configure local strategy, Login Only
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        // Gets email and password from the request body within the session
        try {
          const user = await User.findOne({ email: email.toLowerCase() });

          if (!user) {
            return done(null, false, { message: "Invalid email or password." });
          }

          if (!user.isActive) {
            return done(null, false, { message: "Account is deactivated." });
          }

          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return done(null, false, { message: "Invalid email or password." });
          }

          // Update last login
          user.lastLogin = new Date();
          await user.save();

          delete (user as Partial<IUser>).password;
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  // Configure Google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.GOOGLE_CALLBACK_ENDPOINT || "",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await User.findOrCreateFromOAuthProfile(profile, "google");
          delete (user as Partial<IUser>).password; // Remove password from user object
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Configure GitHub strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        callbackURL: process.env.GITHUB_CALLBACK_ENDPOINT || "",
      },
      async (
        _accessToken: any,
        _refreshToken: any,
        profile: any,
        done: (arg0: unknown, arg1: IUser | undefined) => any
      ) => {
        try {
          const user = await User.findOrCreateFromOAuthProfile(profile, "github");
          delete (user as Partial<IUser>).password; // Remove password from user object
          return done(null, user);
        } catch (error) {
          return done(error, undefined);
        }
      }
    )
  );
};
