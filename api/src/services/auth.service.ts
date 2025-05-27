import User, { IUser } from "../models/user.model";
import { BaseService } from "./base.service";

export class AuthService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  /**
   * Get the current user with limited information.
   * This is useful for returning user data without exposing sensitive information.
   *
   * @param user The user object from the request
   * @returns A partial user object containing only non-sensitive fields
   */
  getCurrentUser(user: Partial<IUser>): Partial<IUser> {
    if (!user) {
      throw new Error("User not found");
    }

    const { firstName, lastName, username, displayName } = user;
    if (!firstName || !lastName || !username || !displayName) {
      throw new Error("Incomplete user information");
    }

    return { firstName, lastName, username, displayName };
  }
}
