// This function is used to extract a user-friendly error message from an error object.
import { HttpErrorResponse } from '@angular/common/http';

export default function (error: unknown): string {
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
