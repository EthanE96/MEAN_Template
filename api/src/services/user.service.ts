import { BaseService } from "./base.service";
import { User, IUser } from "../models/user.model";

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }
}
