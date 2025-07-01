// Validators for Angular applications
// A function will return true if the field is valid, otherwise false
export default class ValidatorUtils {
  static isValidEmail(email: string | undefined): Boolean {
    if (!email) {
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  static isValidPassword(password: string): Boolean {
    return (
      password.length > 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }

  static isValidFields(...fields: (string | null | undefined)[]): Boolean {
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
