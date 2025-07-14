import GlobalSettings from "../../models/global-settings.model";
import UserSettings from "../../models/user-settings.model";
import User from "../../models/user.model";
import Note from "../../models/note.model";
import { BaseService } from "../../services/base.service";
import { getGlobalSettings } from "../../utils/global-settings-cache.utils";

// Import seed data
import { globalSettingsData } from "./data/global-settings.data";
import { noteData } from "./data/note.data";
import { userSettingsData } from "./data/user-settings.data";
import { userData } from "./data/users.data";

// Instantiate services
const globalSettingsService = new BaseService(GlobalSettings);
const userService = new BaseService(User);
const userSettingsService = new BaseService(UserSettings);
const noteService = new BaseService(Note);

// Function to seed notes, users, and global settings
export const seed = async () => {
  try {
    if (process.env.SEED == "true") {
      console.log("Seeding Data...");
      console.log("");

      await seedGlobalSettings();
      await seedUsers();
      await seedUserSettings();
      await seedNotes();
      console.log("Seeding completed successfully.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Function to seed global settings
const seedGlobalSettings = async () => {
  try {
    // Use returnNullOnNotFound to avoid throwing if not found
    const existingSettings = await getGlobalSettings();

    if (existingSettings) {
      console.log("Global settings already exist, skipping seed.");
      return;
    }

    const settings = await globalSettingsService.create(globalSettingsData);
    console.log("Global settings seeded:", settings);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Function to seed users
const seedUsers = async () => {
  const existingUsers = await userService.findAll();

  for (const user of userData) {
    if (existingUsers.some((u) => u.email === user.email)) {
      console.log(`User with email ${user.email} already exists, skipping seed.`);
    } else {
      const createdUser = await userService.create(user);
      console.log(`User seeded: ${createdUser.email}`);
    }
  }
};

// Function to seed user settings
const seedUserSettings = async () => {
  const existingSettings = await userSettingsService.findAll();

  for (const setting of userSettingsData) {
    if (existingSettings.some((s) => s.userId === setting.userId)) {
      console.log(
        `User settings for user ID ${setting.userId} already exist, skipping seed.`
      );
    } else {
      const createdSetting = await userSettingsService.create(setting);
      console.log(`User settings seeded for user ID: ${createdSetting.userId}`);
    }
  }
};

// Function to seed notes
const seedNotes = async () => {
  const existingNotes = await noteService.findAll();

  for (const note of noteData) {
    if (existingNotes.some((n) => n.title === note.title)) {
      console.log(`Note with title "${note.title}" already exists, skipping seed.`);
    } else {
      const createdNote = await noteService.create(note);
      console.log(`Note seeded: ${createdNote.title}`);
    }
  }
};
