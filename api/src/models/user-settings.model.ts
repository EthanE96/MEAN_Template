import mongoose, { Document, Schema } from "mongoose";

//^ Interfaces
export interface IUserSettings extends Document {
  userId: string;
  featureFlags: IFeatureFlags;
  rateLimit: IRateLimit;
  theme: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Allow any string key with boolean value for feature flags
export interface IFeatureFlags {
  [key: string]: boolean;
}

export interface IRateLimit {
  windowMinutes: number;
  maxRequests: number;
}

//^ Schema
const UserSettingsSchema = new Schema<IUserSettings>(
  {
    userId: { type: String, ref: "User", required: true },
    featureFlags: {
      type: Map,
      of: Boolean,
      required: false,
      default: {},
    },
    rateLimit: {
      windowMinutes: { type: Number, required: true, default: 15 },
      maxRequests: { type: Number, required: true, default: 100 },
    },
    theme: { type: String, required: false, default: "dark" },
  },
  {
    timestamps: true,
    collection: "user_settings",
  }
);

export default mongoose.model<IUserSettings>("UserSettings", UserSettingsSchema);
