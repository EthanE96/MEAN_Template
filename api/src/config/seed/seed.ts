import GlobalSettings from "../../models/global-settings.model";
import UserModel from "../../models/user.model";
import { BaseService } from "../../services/base.service";
import { NoteService } from "../../services/note.service";
import { globalSettingsData } from "./data/global-settings.data";
import { noteData } from "./data/note.data";
import { userData } from "./data/users.data";
import { getGlobalSettings } from "../../utils/global-settings-cache";

// Instantiate services
const globalSettingsService = new BaseService(GlobalSettings);
const userService = new BaseService(UserModel);
const noteService = new NoteService();

// Function to seed notes, users, and global settings
export const seedNotes = async () => {
  try {
    // Try to get global settings from cache (or DB if not cached)
    let globalSettings = await getGlobalSettings();

    // If no global settings, create one
    if (!globalSettings) {
      console.log("Global settings not found, creating new settings...");
      await globalSettingsService.create(globalSettingsData);
      console.log("Global settings created successfully.");
      // Refresh cache after creation
      globalSettings = await getGlobalSettings(true);
    }

    //  If seeding is enabled in global settings, proceed with seeding
    if (globalSettings && globalSettings.seeding.enabled) {
      console.log("Seeding if data doesn't exist...");

      // Add users
      for (const user of userData) {
        // Check if user already exists by email
        const existingUser = await userService.findOne({ email: user.email });
        if (!existingUser) {
          console.log(`Creating user: ${user.email}`);
          await userService.create(user);
          console.log(`User ${user.email} created successfully.`);
          console.log("");
        }
      }

      // Add notes
      for (const note of noteData) {
        const existingNote = await noteService.findOne({ title: note.title });
        if (!existingNote) {
          console.log(`Creating note: ${note.title}`);
          await noteService.create(note);
          console.log("Notes created successfully.");
          console.log("");
        }
      }
    }
  } catch (error) {
    throw new Error(`Error seeding notes: ${error}`);
  }
};
