import { userData } from "./users.seed";
import { noteData } from "./note.seed";
import GlobalSettings from "../../models/global-settings.model";
import UserModel from "../../models/user.model";
import { BaseService } from "../../services/base.service";
import { NoteService } from "../../services/note.service";

// Instantiate services
const globalSettingsService = new BaseService(GlobalSettings);
const userService = new BaseService(UserModel);
const noteService = new NoteService();

export const seedNotes = async () => {
  try {
    const globalSettings = await globalSettingsService.findOne({});

    // If no global settings, or seeding is enabled, proceed
    if (!globalSettings || globalSettings.seeding.enabled) {
      // Add users
      for (const user of userData) {
        // Check if user already exists
        const existingUser = await userService.findOne(user);
        if (!existingUser) {
          await userService.create(user);
        }
      }

      // Add notes
      for (const note of noteData) {
        // Check if note already exists
        const existingNote = await noteService.findAll();
        if (!existingNote) {
          await noteService.create(note);
        }
      }
    }
  } catch (error) {
    throw new Error(`Error seeding notes: ${error}`);
  }
};
