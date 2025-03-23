import Note, { INote } from "../models/note.model";
import { BaseService } from "./base.service";

export class NoteService extends BaseService<INote> {
  constructor() {
    super(Note);
  }
}
