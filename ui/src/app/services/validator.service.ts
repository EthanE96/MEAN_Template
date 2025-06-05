import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
/**
 * Service providing validation utilities for user input.
 */
export class ValidatorService {
  /**
   * Validates whether the provided string is a valid email address.
   *
   * @param email - The email address to validate.
   * @returns `true` if the email is valid, otherwise `false`.
   */
  validateEmail(email: string): Boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  /**
   * Validates whether the provided password meets security requirements.
   * The password must be longer than 8 characters and contain at least one uppercase letter,
   * one lowercase letter, and one digit.
   *
   * @param password - The password string to validate.
   * @returns `true` if the password is valid, otherwise `false`.
   */
  validatePassword(password: string): Boolean {
    return (
      password.length > 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }

  /**
   * Validates that all provided fields are non-empty.
   * Returns false if any field is empty, null, or undefined.
   *
   * @param fields - The fields to validate.
   * @returns `true` if all fields are non-empty, otherwise `false`.
   */
  validateFields(...fields: (string | null | undefined)[]): Boolean {
    for (const field of fields) {
      if (
        field === null ||
        field === undefined ||
        field.toString().trim() === ''
      ) {
        return false;
      }
    }
    return true;
  }
}
