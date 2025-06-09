export interface IUser extends Document {
  // Basic profile information
  _id: string;
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
}
