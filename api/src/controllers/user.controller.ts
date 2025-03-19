import { User, UserDocument } from "../models/user.model";
import { BaseController } from "./base.controller";

class UserController extends BaseController<UserDocument> {
  constructor() {
    super(User);
  }
}

export default UserController;
