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
  update: false,
  delete: false,
}).router;

// Base Routes
router.use("/", baseRouter);

// Override the update method to handle user profile updates with req.user (session)
router.put("/", async (req, res, next) => {
  try {
    const userId = await userExists((req.user as IUser)._id);

    const updatedUser = await User.findByIdAndUpdate(userId, req.body);
    if (!updatedUser) {
      throw new NotFoundError("Updated user not found.");
    }

    res.status(200).json({
      success: true,
      data: updatedUser.getPublicProfile(),
      message: "User profile updated successfully.",
    } as IApiResponse<IUser>);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError)
      return next(error);

    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      next(new ConflictError("Document with this data already exists"));
    }

    next(new InternalServerError(`Failed to create document`, error));
  }
});

// // Override the delete method to handle user profile deletion with req.user (session)
// router.delete("/", async (_req, res) => {
//   res.status(501).json({
//     success: false,
//     message: "Delete operation is not implemented.",
//     data: null,
//   } as IApiResponse<null>);
// });

//^ Helper functions
// Checks if the user exists by ID
async function userExists(userId: string): Promise<string> {
  if (!userId) {
    throw new ValidationError("User ID was not provided.");
  }
  return userId;
}

export default router;
