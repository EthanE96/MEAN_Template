// Seed data for notes in the application
import { INote } from "../../../models/note.model";

export const noteData: Partial<INote>[] = [
  {
    userId: "000000000000000000000001",
    title: "First Note",
    content: "This is my first note.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: "000000000000000000000001",
    title: "Second Note",
    content: "This is my second note.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: "000000000000000000000002",
    title: "First Note",
    content: "This is my first note.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: "000000000000000000000002",
    title: "Second Note",
    content: "This is my second note.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
