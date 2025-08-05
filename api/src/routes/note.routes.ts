import { Router } from "express";
import { NoteController } from "../controllers/note.controller";
import { INote } from "../models/note.model";
import { NoteService } from "../services/note.service";
import BaseRouter from "./base.routes";

const router = Router();

const noteController = new NoteController(new NoteService());
const baseRouter = new BaseRouter<INote>(noteController, {
  getAll: true,
  getById: true,
  create: true,
  update: true,
  delete: true,
  deleteAll: false,
}).router;

// Custom Routes
router.get("/summary", (req, res) => {
  return noteController.summarizeNotes(req, res);
});

// Base Routes
router.use("/", baseRouter);

export default router;
