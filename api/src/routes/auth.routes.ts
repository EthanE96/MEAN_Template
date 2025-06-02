import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

//^ Common Auth routes
// Logout
router.post("/logout", isAuthenticated, authController.logout);

// Get current user
router.get("/me", isAuthenticated, authController.getCurrentUser);

// ^ Local Auth routes
// Register a new user
router.post("/register", authController.localRegister);

// Login
router.post("/login", authController.localLogin);

//^ Google Auth routes
// Google OAuth2.0 authentication (login/register)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth2.0 callback
router.get(
  "/callback/google",
  passport.authenticate("google", {
    // If authentication fails, redirect to login page with failure message
    failureRedirect: "http://localhost:4200/login",
    failureMessage: true,
    // If authentication succeeds, redirect to the UI application
    successRedirect: process.env.UI_AUTH_REDIRECT_URL || "http://localhost:4200/app",
  })
);

export default router;
