import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User, { IUser } from "../models/user.model";

export const passportConfig = (): void => {
  // Serialize and deserialize the user for session management
  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      // Use MongoDB's _id to find the user
      const user: IUser | null = await User.findById(id).lean();

      if (!user) {
        console.error("No user found during deserialization");
        return done(null, false);
      }

      // Remove sensitive information
      delete (user as Partial<IUser>).password;
      done(null, user);
    } catch (error) {
      console.error("Error during deserialization:", id, error);
      done(error);
    }
  });

  // Configure local strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const { firstName, lastName, isRegistration } = req.body;

          // If user is registering, a flag on controller will indicate it
          if (isRegistration) {
            // Registration flow
            const { user, isNew } = await User.findOrCreateFromLocal(
              email,
              password,
              firstName,
              lastName
            );

            if (!isNew) {
              return done(null, false, { message: "Email already exists." });
            }

            // User registration and login successful
            delete (user as Partial<IUser>).password; // Remove password from user object
            return done(null, user);
          } else {
            // Login flow
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

            // User login successful
            delete (user as Partial<IUser>).password; // Remove password from user object

            return done(null, user);
          }
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
