import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Added ES module import for crypto

//^ Interfaces
export interface IUser extends Document {
  // Basic profile information
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  username?: string;
  displayName?: string;
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
  getPublicProfile(): Partial<IUser>;
}

// ^ Schema
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
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
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
      enum: ["local", "google", "github"],
      default: "local",
    },

    // Additional timestamps
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

//^ Pre-save hook
// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

//^  Methods - For instance level methods (on the document)
// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Methods to get user info without sensitive data
UserSchema.methods.getPublicProfile = function (): Partial<IUser> {
  return {
    _id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    displayName: this.displayName,
    profilePhoto: this.profilePhoto,
    isActive: this.isActive,
    role: this.role,
    lastLogin: this.lastLogin,
  };
};

//^ Static methods - For model-level methods (don't need to access instance data directly)
// Method to find or create a user from OAuth profile
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
  const email =
    (profile.emails && profile.emails.length > 0 && profile.emails[0].value) ||
    `${provider}_${providerId}@no-email.com`; // fallback if email missing

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

  const firstName = profile.name?.givenName || profile.displayName?.split(" ")[0] || "";
  const lastName = profile.name?.familyName || profile.displayName?.split(" ")[1] || "";

  // Create a new user
  const newUser = new this({
    email: email,
    username: profile.username || `${provider}_${providerId.substring(0, 8)}`,
    password: crypto.randomBytes(32).toString("hex"), // Use imported crypto
    displayName: profile.displayName,
    firstName: profile.name?.givenName || firstName || "",
    lastName: profile.name?.familyName || lastName || "",
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

// Method to create a user from local signup
UserSchema.statics.createLocalFromSignup = async function (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<IUser> {
  const existingUser = await this.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new Error("This email already exists. Try logging in instead.");
  }

  if (!email || !password || !firstName || !lastName) {
    throw new Error("All fields are required.");
  }

  const newUser = new this({
    email: email.toLowerCase(),
    username: email.toLowerCase(),
    password: password, // Will be hashed by pre-save hook
    firstName,
    lastName,
  });

  await newUser.save();
  return newUser;
};

// Add the static methods to the interface
export interface IUserModel extends Model<IUser> {
  findOrCreateFromOAuthProfile(profile: any, provider: string): Promise<IUser>;
  createLocalFromSignup(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<IUser>;
}

export default mongoose.model<IUser, IUserModel>("User", UserSchema);
