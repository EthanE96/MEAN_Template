import { Router } from "express";
import User, { IUser } from "../models/user.model";
import { BaseController } from "../controllers/base.controller";
import { BaseService } from "../services/base.service";
import BaseRouter from "./base.routes";
import { IApiResponse } from "../models/api-response.model";

import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../models/errors.model";

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
router.put("/", async (req, res, next) => {
  try {
    if (!req || Object.keys(req).length === 0) {
      throw new ValidationError("User update data cannot be empty");
    }

    const userId = (req.user as IUser).id;
    if (!userId) {
      throw new NotFoundError("User not found for the authenticated user.");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body);
    if (!updatedUser) {
      throw new NotFoundError("Updated user not found.");
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User profile updated successfully.",
    } as IApiResponse<IUser>);
  } catch (error) {
    if (error instanceof ValidationError) next(error);

    if (error instanceof Error && error.name === "ValidationError") {
      next(new ValidationError(`Validation failed: ${error.message}`));
    }

    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      next(new ConflictError("Document with this data already exists"));
    }

    next(new InternalServerError(`Failed to create document`, error));
  }
});

export default router;
