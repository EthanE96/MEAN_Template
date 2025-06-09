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
  async getCurrentUser(user: Partial<IUser>): Promise<Partial<IUser>> {
    try {
      if (!user) {
        throw new Error("User not found");
      }

      const { firstName, lastName, displayName, email, profilePhoto, _id } = user;

      if (!_id || !firstName || !lastName || !email) {
        throw new Error("Incomplete user information");
      }

      return { firstName, lastName, displayName, email, profilePhoto, _id };
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
