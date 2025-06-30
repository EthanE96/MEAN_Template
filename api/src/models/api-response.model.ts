import { IAppError } from "./errors.model";

//^ Interfaces
export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: IAppError;
}
