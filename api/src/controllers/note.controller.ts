import { Request, Response } from "express";
import { INote } from "../models/note.model";
import { NoteService } from "../services/note.service";
import { BaseController } from "./base.controller";

export class NoteController extends BaseController<INote> {
  constructor(private noteService: NoteService) {
    super(new NoteService());
  }

  async summarizeNotes(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId || (req.query.userId as string);
      if (!userId) {
        res.status(400).json({ message: "Missing userId" });
        return;
      }
      const notes = await this.noteService.findAllByUser(userId);
      const summary = await this.noteService.summarizeNotes(notes);
      res.json(summary);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
