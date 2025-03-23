import { NoteController } from "../controllers/note.controller";
import { INote } from "../models/note.model";
import { NoteService } from "../services/note.service";
import BaseRouter from "./base.routes";

const router = new BaseRouter<INote>(new NoteController(new NoteService()), {
  getAll: true,
  getById: true,
  create: true,
  update: false,
  delete: false,
}).router;

router.get("/summary", new NoteController(new NoteService()).summarizeNotes);

export default router;
