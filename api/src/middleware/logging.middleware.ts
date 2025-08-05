import { NextFunction, Request, RequestHandler, Response } from "express";
import { IApiResponse } from "../models/api-response.model";

// Middleware: Logging (development only)
export async function createLoggingMiddleware(): Promise<RequestHandler | null> {
  if (process.env.ENV !== "development") return null;
  try {
    const morganModule = await import("morgan");
    const morgan = morganModule.default || morganModule;
    morgan.token("body", (req: Request) => JSON.stringify(req.body));
    return morgan(":method :url :status - :response-time ms req:body");
  } catch (error) {
    console.warn("Morgan is not installed. Skipping HTTP request logging.", error);
    return null;
  }
}

// Middleware: Error Handling
export function errorLoggingMiddleware(
  error: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const errorRes: IApiResponse<null> = {
    success: false,
    message: error.message || "An unexpected error occurred.",
    data: null,
    error: {
      name: error.name || "InternalServerError",
      statusCode: error.statusCode || 500,
      isOperational: error.isOperational || false,
      message: error.message || "An unexpected error occurred.",
      stack: error.stack,
    },
  };

  // Log the error for server-side debugging
  console.error("Error occurred:", errorRes);
  res.status(errorRes.error?.statusCode ?? 500).json(errorRes);
}
