import { Router, Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import authRoutes from "./auth.routes";
import noteRoutes from "./note.routes";
import swaggerRoutes from "./swagger.routes";
import userRoutes from "./user.routes";
import { AppError } from "../models/errors.model";

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

// 404 handler for unknown routes
router.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, true, `Can't find ${req.originalUrl} on this server!`));
});

export default router;
