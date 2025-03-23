import { INote } from "../models/note.model";
import { NoteService } from "../services/note.service";
import { BaseController } from "./base.controller";

export class NoteController extends BaseController<INote> {
  constructor() {
    super(new NoteService());
  }
}
