import User, { IUser } from "../models/user.model";
import { BaseService } from "./base.service";

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }
}
