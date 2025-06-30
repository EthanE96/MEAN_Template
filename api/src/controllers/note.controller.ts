import "express-async-errors";
import { Request, Response } from "express";
import { INote } from "../models/note.model";
import { IApiResponse } from "../models/api-response.model";
import { NoteService } from "../services/note.service";
import { BaseController } from "./base.controller";

export class NoteController extends BaseController<INote> {
  constructor(private noteService: NoteService) {
    super(noteService);
  }

  async summarizeNotes(req: Request, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    if (!userId) return;
    const notes = await this.noteService.findAllByUser(userId);
    const summary = await this.noteService.summarizeNotes(notes);

    res.json({
      success: true,
      data: summary,
      message: "Notes summarized successfully.",
    } as IApiResponse<string>);
  }
}
