export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: IAppError;
}

export interface IAppError extends Error {
  statusCode: number;
  isOperational: boolean;
}
