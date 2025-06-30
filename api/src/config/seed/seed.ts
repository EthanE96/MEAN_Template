import GlobalSettings from "../../models/global-settings.model";
import UserSettings from "../../models/user-settings.model";
import User from "../../models/user.model";
import Note from "../../models/note.model";
import { BaseService } from "../../services/base.service";
import { getGlobalSettings } from "../../utils/global-settings-cache";
import { globalSettingsData } from "./data/global-settings.data";
import { noteData } from "./data/note.data";
import { userData } from "./data/users.data";

// Instantiate services
const globalSettingsService = new BaseService(GlobalSettings);
const userService = new BaseService(User);
const userSettingsService = new BaseService(UserSettings);
const noteService = new BaseService(Note); // <-- add this line

// Function to seed notes, users, and global settings
export const seed = async () => {
  try {
    if (!process.env.SEED || process.env.SEED.toLowerCase() == "true") {
      // No seed in production
      if (process.env.ENV === "production") {
        console.log("Seeding is disabled in production environment.");
        return;
      }

      console.log("Seeding Data...");
      console.log("");

      await seedGlobalSettings();
      await seedUsers();
      await seedUserSettings();
      await seedNotes();
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Function to seed global settings
const seedGlobalSettings = async () => {
  try {
    let existingSettings;

    // Attempt to get existing global settings from cache or DB
    try {
      existingSettings = await getGlobalSettings();
    } catch (error: any) {
      if (
        typeof error.message === "string" &&
        error.message.includes("Global settings not found in DB")
      ) {
        existingSettings = null; // Suppress this error
      } else {
        throw error; // Rethrow other errors
      }
    }

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
  try {
    const existingUsers = await userService.findAll();

    userData.forEach((user) => {
      if (existingUsers.some((u) => u.email === user.email)) {
        console.log(`User with email ${user.email} already exists, skipping seed.`);
      } else {
        userService
          .create(user)
          .then((createdUser) => {
            console.log(`User seeded: ${createdUser.email}`);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Function to seed user settings
const seedUserSettings = async () => {
  try {
    const existingSettings = await userSettingsService.findAll();

    existingSettings.forEach((setting) => {
      if (existingSettings.some((s) => s.userId === setting.userId)) {
        console.log(
          `User settings for user ID ${setting.userId} already exist, skipping seed.`
        );
      } else {
        userSettingsService
          .create(setting)
          .then((createdSetting) => {
            console.log(`User settings seeded for user ID: ${createdSetting.userId}`);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Function to seed notes
const seedNotes = async () => {
  try {
    const existingNotes = await noteService.findAll();

    noteData.forEach((note) => {
      if (existingNotes.some((n) => n.title === note.title)) {
        console.log(`Note with title "${note.title}" already exists, skipping seed.`);
      } else {
        noteService
          .create(note)
          .then((createdNote) => {
            console.log(`Note seeded: ${createdNote.title}`);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
