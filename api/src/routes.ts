import { Router, Request, Response } from "express";
import UserController from "./controllers/user.controller";

const router = Router();
const userController = new UserController();

//* Public routes
router.get("/health", (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "OK" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// router.post("/register", userController.register);
// router.post("/login", userController.login);

//* Private routes
// /api/user
router.get("/user", userController.getAll);

export default router;
