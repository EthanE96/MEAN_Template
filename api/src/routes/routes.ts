import { Router, Request, Response } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import authRoutes from "./auth.routes";
import noteRoutes from "./note.routes";
import swaggerRoutes from "./swagger.routes";
import userRoutes from "./user.routes";

const router = Router();

//^ Public Routes
// /api/health
router.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "Healthy",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

//^ Private Routes
// /api/auth (uses some public routes)
router.use("/auth", authRoutes);

// /api/notes
router.use("/notes", isAuthenticated, noteRoutes);

// /api/user
router.use("/user", isAuthenticated, userRoutes);

// /api/api-docs
router.use("/", isAuthenticated, swaggerRoutes);

export default router;
