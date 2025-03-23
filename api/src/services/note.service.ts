import Note, { INote } from "../models/note.model";
import { BaseService } from "./base.service";
import { LLMService } from "./llm.service";

export class NoteService extends BaseService<INote> {
  constructor() {
    super(Note);
  }

  /**
   * Summarize a list of notes.
   *
   * @param notes The list of notes to summarize
   * @returns A response from the AI model summarizing the notes
   * @throws Error if there are no notes to summarize or if there is an error calling the AI model
   */
  async summarizeNotes(notes: INote[]) {
    const llmService = new LLMService("llama-3.3-70b-versatile", 0.7, 1024);

    try {
      if (notes.length <= 0) {
        throw new Error("No notes found");
      }

      const response = await llmService.sendMessageToModel(
        "You are a helpful assistant that summarizes notes.",
        notes.map((note) => note.content).join("\n")
      );

      return response;
    } catch (error) {
      throw new Error(`Error summarizing notes: ${error}`);
    }
  }
}
