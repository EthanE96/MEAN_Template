import { Router } from "express";
import passport from "passport";
import { isAuthenticated } from "../middleware/auth.middleware";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

// ^ Local Auth routes
// Signup
router.post("/signup", authController.signup);

// Login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "http://localhost:4200/login",
    failureMessage: true,
    successRedirect: process.env.UI_AUTH_REDIRECT_URL || "http://localhost:4200/app",
  })
);

//^ Google Auth routes
// Google OAuth2.0 authentication (login/register)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth2.0 callback
router.get(
  "/callback/google",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:4200/login",
    failureMessage: true,
    successRedirect: process.env.UI_AUTH_REDIRECT_URL || "http://localhost:4200/app",
  })
);

//^ GitHub Auth routes
// GitHub OAuth2.0 authentication (login/register)
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub OAuth2.0 callback
router.get(
  "/callback/github",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:4200/login",
    failureMessage: true,
    successRedirect: process.env.UI_AUTH_REDIRECT_URL || "http://localhost:4200/app",
  })
);

//^ Common routes
// Logout
router.post("/logout", isAuthenticated, authController.logout);

// Authenticated user info
router.get("/me", isAuthenticated, authController.getCurrentUser);

export default router;
