import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  // Basic profile information
  email: string;
  username: string;
  password: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  profilePhoto?: string;

  // Account status and role
  isActive: boolean;
  role: string;

  // OAuth related fields
  provider?: string;
  providerId?: string;
  googleId?: string;
  githubId?: string;
  facebookId?: string;
  twitterId?: string;
  authMethod: string;

  // Timestamps
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    // Basic profile information
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String,
      trim: true,
    },

    // Account status and role
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // OAuth related fields
    provider: {
      type: String,
      trim: true,
    },
    providerId: {
      type: String,
      trim: true,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    facebookId: {
      type: String,
      sparse: true,
      unique: true,
    },
    twitterId: {
      type: String,
      sparse: true,
      unique: true,
    },
    authMethod: {
      type: String,
      enum: ["local", "google", "facebook", "twitter"],
      default: "local",
    },

    // Additional timestamps
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster lookups
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ googleId: 1 }, { sparse: true });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find or create a user from OAuth profile
UserSchema.statics.findOrCreateFromOAuthProfile = async function (
  profile: any,
  provider: string
): Promise<IUser> {
  // First try to find by provider ID
  const providerId = profile.id;
  const providerIdField = `${provider}Id`;

  let user = await this.findOne({ [providerIdField]: providerId });
  if (user) {
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    return user;
  }

  // Try to find by email
  const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
  if (email) {
    user = await this.findOne({ email });
    if (user) {
      // Link this account to the existing user
      user[providerIdField] = providerId;
      user.provider = provider;
      user.providerId = providerId;
      user.lastLogin = new Date();
      await user.save();
      return user;
    }
  }

  // Create a new user
  const newUser = new this({
    email: email,
    username: `${provider}_${providerId.substring(0, 8)}`,
    password: require("crypto").randomBytes(32).toString("hex"),
    displayName: profile.displayName,
    firstName: profile.name?.givenName || "",
    lastName: profile.name?.familyName || "",
    middleName: profile.name?.middleName || "",
    profilePhoto: profile.photos?.length > 0 ? profile.photos[0].value : "",
    provider: provider,
    providerId: providerId,
    [providerIdField]: providerId,
    authMethod: provider,
    isActive: true,
    lastLogin: new Date(),
  });

  await newUser.save();
  return newUser;
};

// Add the static method to the interface
interface User extends mongoose.Model<IUser> {
  findOrCreateFromOAuthProfile(profile: any, provider: string): Promise<IUser>;
}

export default mongoose.model<IUser, User>("User", UserSchema);
