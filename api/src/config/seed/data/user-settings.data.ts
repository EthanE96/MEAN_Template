// Seed data for user settings in the application
import { IUserSettings } from "../../../models/user-settings.model";

export const userSettingsData: Partial<IUserSettings>[] = [
  {
    userId: "000000000000000000000001",
    featureFlags: {},
    rateLimit: {
      windowMinutes: 15,
      maxRequests: 100,
    },
    theme: "dark",
  },
  {
    userId: "000000000000000000000002",
    featureFlags: {},
    rateLimit: {
      windowMinutes: 15,
      maxRequests: 100,
    },
    theme: "light",
  },
];
