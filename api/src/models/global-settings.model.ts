import mongoose, { Document, Schema } from "mongoose";

//^ Interfaces
export interface IGlobalSettings extends Document {
  featureFlags: GlobalFeatureFlags;
  seeding: GlobalSeedingConfig;
  rateLimit: GlobalRateLimitConfig;
  session: GlobalSessionConfig;

  createdAt: Date;
  updatedAt: Date;
}

export interface GlobalFeatureFlags {
  enableBetaFeatures: boolean;
  enableLogging: boolean;
}

export interface GlobalSeedingConfig {
  enabled: boolean;
  lastSeededAt: Date | null;
}

export interface GlobalRateLimitConfig {
  windowMinutes: number;
  maxRequests: number;
}

export interface GlobalSessionConfig {
  sessionTimeoutMinutes: number;
  sessionCookieName: string;
  secureCookies: boolean;
}

//^ Schema
const GlobalSettingsSchema = new Schema<IGlobalSettings>(
  {
    featureFlags: {
      enableBetaFeatures: { type: Boolean, required: true },
      enableLogging: { type: Boolean, required: true },
    },
    seeding: {
      enabled: { type: Boolean, required: true },
      lastSeededAt: { type: Date, default: null },
    },
    rateLimit: {
      windowMinutes: { type: Number, required: true },
      maxRequests: { type: Number, required: true },
    },
    session: {
      sessionTimeoutMinutes: { type: Number, required: true },
      sessionCookieName: { type: String, required: true },
      secureCookies: { type: Boolean, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IGlobalSettings>("GlobalSettings", GlobalSettingsSchema);
