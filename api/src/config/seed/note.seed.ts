import Note, { INote } from "../../models/note.model";
import { NoteService } from "../../services/note.service";

const noteData: INote[] = [
  new Note({
    title: "First Note",
    content: "This is my first note.",
  }),
  new Note({
    title: "Second Note",
    content: "This is my second note.",
  }),
  new Note({
    title: "Third Note",
    content: "This is my third note.",
  }),
];

export const seedNotes = async () => {
  const noteService = new NoteService();
  const existingNotes = await noteService.findAll();

  if (existingNotes.length === 0) {
    console.log("Seeding notes");
    await noteService.createMany(noteData);
  }
};
