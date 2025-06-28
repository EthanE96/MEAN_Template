import { Router } from "express";
import passport from "passport";
import { isAuthenticated } from "../middleware/auth.middleware";
import { AuthController } from "../controllers/auth.controller";
import { getGlobalSettings } from "../utils/global-settings-cache";

const router = Router();
const authController = new AuthController();

// Global settings loader (loads once at startup)
let globalSettings: Awaited<ReturnType<typeof getGlobalSettings>> | null = null;
(async () => {
  try {
    globalSettings = await getGlobalSettings();
  } catch (error) {
    console.error("Failed to load global settings for auth routes:", error);
  }
})();

// Helper to get URLs from settings or fallback
function getAuthUrls() {
  return {
    failureRedirect:
      globalSettings?.environment.uiFailureUrl || "http://localhost:4200/login",
    successRedirect:
      globalSettings?.environment.uiSuccessUrl || "http://localhost:4200/app",
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
router.get("/callback/google", (req, res, next) => {
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
router.get("/callback/github", (req, res, next) => {
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
