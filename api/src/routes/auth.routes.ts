import { Router } from "express";
import passport from "passport";
import { isAuthenticated } from "../middleware/auth.middleware";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

// Helper to get URLs from settings or fallback
function getAuthUrls() {
  return {
    failureRedirect: process.env.UI_FAILURE_URL || "http://localhost:4200/login",
    successRedirect: process.env.UI_SUCCESS_URL || "http://localhost:4200/app",
  };
}

// ^ Local Auth routes
// Signup
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

//^ Google Auth routes
// Google OAuth2.0 authentication (login/register)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth2.0 callback
router.get("/callback/google", async (req, res, next) => {
  const { failureRedirect, successRedirect } = getAuthUrls();
  passport.authenticate("google", {
    failureRedirect,
    failureMessage: true,
    successRedirect,
  })(req, res, next);
});

//^ GitHub Auth routes
// GitHub OAuth2.0 authentication (login/register)
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub OAuth2.0 callback
router.get("/callback/github", async (req, res, next) => {
  const { failureRedirect, successRedirect } = getAuthUrls();
  passport.authenticate("github", {
    failureRedirect,
    failureMessage: true,
    successRedirect,
  })(req, res, next);
});

//^ Common routes
// Logout
router.post("/logout", isAuthenticated, authController.logout);

// Authenticated user info
router.get("/me", isAuthenticated, authController.getCurrentUser);

export default router;
