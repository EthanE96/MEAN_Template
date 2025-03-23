import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import passport from "passport";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

// Registration
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Logout
router.post("/logout", authController.logout);

// Get current user
router.get("/me", isAuthenticated, authController.getCurrentUser);

// Google Auth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Fix the callback route path to match the one you configured in Google OAuth
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
    successRedirect: process.env.UI_REDIRECT_URL || "http://localhost:4200",
  })
);

export default router;
