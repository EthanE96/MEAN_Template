import { IUser } from "../models/user.model";
import { UserService } from "../services/user.service";
import { BaseController } from "./base.controller";

class UserController extends BaseController<IUser> {
  constructor() {
    super(new UserService());
  }
}

export default UserController;
