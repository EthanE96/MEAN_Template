import { NotFoundError } from "../models/errors.model";
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

    // Check if notes are empty
    if (notes.length <= 0) {
      throw new NotFoundError("Zero notes found for summarization.");
    }

    // Prepare the notes for summarization
    const notesContent = notes
      .map((note) => note.content)
      .filter(Boolean)
      .join("\n\n");

    if (!notesContent) {
      throw new NotFoundError("No valid note content found.");
    }

    const systemPrompt =
      "You are a helpful assistant that summarizes notes. Return your response in markdown only. Create a concise summary of the following notes:";

    return await llmService.sendMessageToModel(systemPrompt, notesContent);
  }
}
