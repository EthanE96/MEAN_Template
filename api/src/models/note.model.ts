import mongoose, { Document, Schema } from "mongoose";

//^ Interfaces
export interface INote extends Document {
  userId: string;
  title: string;
  content: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

//^ Schema
const NoteSchema = new Schema<INote>(
  {
    userId: { type: String, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "notes",
  }
);

export default mongoose.model<INote>("Note", NoteSchema);
