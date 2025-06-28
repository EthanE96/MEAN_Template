// Seed data for users in the application
import { IUser } from "../../../models/user.model";

export const userData: Partial<IUser>[] = [
  {
    _id: "000000000000000000000001",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    password: "AdminPass123!",
    username: "admin",
    displayName: "Admin User",
    middleName: "",
    profilePhoto: "",
    isActive: true,
    role: "admin",
    provider: "local",
    authMethod: "local",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "000000000000000000000002",
    email: "user@example.com",
    firstName: "Regular",
    lastName: "User",
    password: "UserPass123!",
    username: "user",
    displayName: "Regular User",
    middleName: "",
    profilePhoto: "",
    isActive: true,
    role: "user",
    provider: "local",
    authMethod: "local",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
