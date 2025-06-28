import mongoose, { Document, Schema } from "mongoose";

//^ Interfaces
export interface ISettings extends Document {
  userId: string;
  featureFlags: FeatureFlags;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface FeatureFlags {
  enableBetaFeatures: boolean;
}

//^ Schema
const SettingsSchema = new Schema<ISettings>(
  {
    userId: { type: String, ref: "User", required: true },
    featureFlags: {
      enableBetaFeatures: { type: Boolean, required: false, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>("Settings", SettingsSchema);
