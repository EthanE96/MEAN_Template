import { NoteController } from "../controllers/note.controller";
import { INote } from "../models/note.model";
import BaseRouter from "./base.routes";

const router = new BaseRouter<INote>(new NoteController(), {
  getAll: true,
  getById: true,
  create: true,
  update: false,
  delete: false,
}).router;

export default router;
