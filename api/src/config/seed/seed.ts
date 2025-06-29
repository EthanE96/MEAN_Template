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
    // Use the service/model directly to check for settings
    let globalSettings = await globalSettingsService.findOne({});

    // If global settings are not found, create new settings
    if (!globalSettings) {
      console.log("Global settings not found, creating new settings...");
      await globalSettingsService.create(globalSettingsData);
      console.log("Global settings created successfully.");

      // Now settings exist, you can safely use getGlobalSettings if needed
      globalSettings = await getGlobalSettings(true);
    }

    // If production environment, exit early
    if (globalSettings.environment.env === "production") {
      throw new Error("Seeding is not allowed in production environment.");
    }

    //  If seeding is enabled in global settings, proceed with seeding
    if (globalSettings && globalSettings.seeding.enabled) {
      console.log("Seeding data...");

      // Override the global settings
      await globalSettingsService.deleteAll();
      console.log("All global settings deleted.");

      await globalSettingsService.create(globalSettingsData);
      console.log("Global settings overwritten with saved data.");

      await getGlobalSettings(true);
      console.log("Global settings cache refreshed.");

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

      // Update the last seeded date in global settings
      globalSettings.seeding.lastSeededAt = new Date();
    }
  } catch (error) {
    throw new Error(`Error seeding notes: ${error}`);
  }
};
