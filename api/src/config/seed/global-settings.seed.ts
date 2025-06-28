// Seed data for global settings in the application
import { IGlobalSettings } from "../../models/global-settings.model";

export const globalSettingsData: Partial<IGlobalSettings> = {
  featureFlags: {
    enableBetaFeatures: false,
    enableLogging: true,
  },
  seeding: {
    enabled: false,
    lastSeededAt: null,
  },
  rateLimit: {
    windowMinutes: 15,
    maxRequests: 100,
  },
  session: {
    sessionTimeoutMinutes: 60,
    sessionCookieName: "sid",
    secureCookies: false,
  },
};
