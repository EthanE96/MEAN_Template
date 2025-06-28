import { Request, Response } from "express";
import { INote } from "../models/note.model";
import { NoteService } from "../services/note.service";
import { BaseController } from "./base.controller";

export class NoteController extends BaseController<INote> {
  constructor(private noteService: NoteService) {
    super(new NoteService());
  }

  /**
   * @description Extracts userId from authenticated user session and validates it
   * @returns userId if valid, otherwise sends a 401 response
   */
  protected override getUserId(req: Request, res: Response): string | undefined {
    // Only trust the user from the session (set by Passport)
    if (req.user && typeof req.user === "object" && "id" in req.user) {
      return (req.user as any).id;
    }
    res.status(401).json({ message: "Unauthorized: user not authenticated" });
    return undefined;
  }

  async summarizeNotes(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;
      const notes = await this.noteService.findAllByUser(userId);
      const summary = await this.noteService.summarizeNotes(notes);
      res.json(summary);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
