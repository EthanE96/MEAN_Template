import { Router, Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { BaseController } from "../controllers/base.controller";
import { BaseService } from "../services/base.service";
import BaseRouter from "./base.routes";

const router = Router();
const baseService = new BaseService<IUser>(User);
const baseController = new BaseController<IUser>(baseService);

const baseRouter = new BaseRouter<IUser>(baseController, {
  getAll: false,
  getById: false,
  create: false,
  update: false,
  delete: false,
}).router;

// TODO: override the update user
// Custom overrides for Update to inject userId
router.put("/", async (req: Request, res: Response): Promise<void> => {
  // Only trust the user from the session (set by Passport)
  if (req.user && typeof req.user === "object" && "id" in req.user) {
    const userId = (req.user as any).id;
    try {
      const updated = await baseService.updateForUser(userId, req.body, userId);
      if (!updated) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({
        message: error?.message || "Unknown error",
        name: error?.name,
        errors: error?.errors,
      });
    }
    return;
  }
  res.status(401).json({ message: "Unauthorized: user not authenticated" });
});

// Base Routes
router.use("/", baseRouter);

export default router;
