import GlobalSettings from "../../models/global-settings.model";
import UserModel from "../../models/user.model";
import { BaseService } from "../../services/base.service";
import { NoteService } from "../../services/note.service";
import { globalSettingsData } from "./global-settings.seed";
import { noteData } from "./note.seed";
import { userData } from "./users.seed";

// Instantiate services
const globalSettingsService = new BaseService(GlobalSettings);
const userService = new BaseService(UserModel);
const noteService = new NoteService();

// Function to seed notes, users, and global settings
export const seedNotes = async () => {
  try {
    const globalSettings = await globalSettingsService.findOne({});

    // If no global settings, or seeding is enabled, proceed
    if (!globalSettings || globalSettings.seeding.enabled) {
      console.log("Seeding notes...");

      // Add global settings
      if (!globalSettings) {
        await globalSettingsService.create(globalSettingsData);
        console.log("Global settings created successfully.");
      }

      // Add users
      for (const user of userData) {
        // Check if user already exists by email
        const existingUser = await userService.findOne({ email: user.email });
        if (!existingUser) {
          await userService.create(user);
          console.log(`User ${user.email} created successfully.`);
        }
      }

      // Add notes
      const existingNotes = await noteService.findOne({});
      if (!existingNotes) {
        await noteService.createMany(noteData);
        console.log("Notes created successfully.");
      }
    }
  } catch (error) {
    throw new Error(`Error seeding notes: ${error}`);
  }
};
