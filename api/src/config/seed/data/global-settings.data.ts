// Seed data for global settings in the application
import { IGlobalSettings } from "../../../models/global-settings.model";

export const globalSettingsData: Partial<IGlobalSettings> = {
  featureFlags: {
    enableBetaFeatures: true,
    enableLogging: true,
  },
  seeding: {
    enabled: false,
    lastSeededAt: new Date(),
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
  environment: {
    env: "development",
    uiUrl: "http://localhost:4200/app",
    apiUrl: "http://localhost:3000/api",
    uiFailureUrl: "http://localhost:4200/login",
    uiSuccessUrl: "http://localhost:4200/app",
  },
};
