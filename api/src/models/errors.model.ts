/**
 * Example of an IAppError object:
 *
 * @example
 * const error: IAppError = {
 *   name: "ValidationError",
 *   statusCode: 400,
 *   isOperational: true,
 *   message: "Invalid input data.",
 *   stack: "Error: Invalid input data.\n    at ...",
 * };
 */
//^ Interface
export interface IAppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

//^ Class
export class AppError extends Error implements IAppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    statusCode: number,
    isOperational: boolean = true, // Operational errors are expected and handled by the application
    message: string = "",
    stack?: string
  ) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);

    if (process.env.ENV === "development") {
      if (stack) {
        this.stack = stack;
      }
    } else {
      this.stack = undefined;
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed.", stack?: string) {
    super(400, true, message, stack);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found.", stack?: string) {
    super(404, true, message, stack);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized.", stack?: string) {
    super(401, true, message, stack);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden.", stack?: string) {
    super(403, true, message, stack);
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists.", stack?: string) {
    super(409, true, message, stack);
    this.name = "ConflictError";
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string = "Database operation failed.",
    originalError?: unknown,
    stack?: string
  ) {
    super(500, true, message, stack);
    this.name = "DatabaseError";
    if (originalError) {
      console.error("Original DB Error:", originalError);
    }
  }
}

export class InternalServerError extends AppError {
  constructor(
    message: string = "Internal Server Error.",
    originalError?: unknown,
    stack?: string
  ) {
    super(500, false, message, stack);
    this.name = "InternalServerError";
    if (originalError) {
      console.error("Original Internal Error:", originalError);
    }
  }
}
