import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User from "../models/user.model";

export const passportConfig = (): void => {
  // Serialize and deserialize the user for session management
  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Configure local strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email.toLowerCase() });

          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          if (!user.isActive) {
            return done(null, false, { message: "Account is deactivated" });
          }

          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return done(null, false, { message: "Invalid email or password" });
          }

          // Update last login
          user.lastLogin = new Date();
          await user.save();

          return done(null, user);
        } catch (error) {
          return done(error);
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
        callbackURL: "/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await User.findOrCreateFromOAuthProfile(profile, "google");
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
