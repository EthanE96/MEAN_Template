import { Router } from "express";
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
  update: true,
  delete: false,
}).router;

// Base Routes
router.use("/", baseRouter);

// Override the update method to handle user profile updates
router.put("/", async (req, res) => {
  try {
    const userId = baseController.getUserId(req, res);
    let user = await User.findByIdAndUpdate(userId, req.body);

    if (!user) {
      res.status(404).json("User not found");
      return;
    }

    res.status(200).json(user.getPublicProfile());
  } catch (error) {
    baseController.handleError(res, error, 400);
  }
});

export default router;
