// Validators function for email, password, and required fields
// A function will return true if the field is valid, otherwise false

export function isValidEmail(email: string | undefined): boolean {
  if (!email) {
    return false;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

export function isValidPassword(password: string): boolean {
  return (
    password.length > 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

export function isValidFields(
  ...fields: (string | null | undefined)[]
): boolean {
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
