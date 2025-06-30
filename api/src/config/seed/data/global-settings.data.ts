// Seed data for global settings in the application
import { IGlobalSettings } from "../../../models/global-settings.model";

export const globalSettingsData: Partial<IGlobalSettings> = {
  name: "development",
  featureFlags: {},
  maxRateLimit: {
    windowMinutes: 15,
    maxRequests: 100,
  },
};
