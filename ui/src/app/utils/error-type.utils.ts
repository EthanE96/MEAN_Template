import { HttpErrorResponse } from '@angular/common/http';

export default class ErrorType {
  static returnErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (error instanceof HttpErrorResponse) {
      // If IApiResponse is used
      if (error.error.message) {
        return error.error.message;
      }

      // If IApiResponse is not used
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'An unknown error occurred.';
  }
}
